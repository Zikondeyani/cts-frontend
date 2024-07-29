<template>
  <main class="space-y-4">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Relief Items
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Add relief materials for the instruction.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit="onSubmit">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="space-y-4">
                  <span class="text-gray-700 mb-3">Draw Down From: {{ model?.warehouse?.Name }}</span>
        
                  <div class="mt-6">
                    <span class="text-gray-700 mb-5" v-if="model.IsRejected">Comments (If Rejected): {{ model?.RejectionComment }}</span>

                    <h3 class="text-lg font-bold leading-6 text-gray-900 capitalize mt-5">Summary of Requested Commodities
                    </h3>
                    <table class="min-w-full divide-y divide-gray-200 mt-2">
                      <thead class="bg-gray-100">
                        <tr>
                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Commodity
                          </th>
                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Requested Quantity
                          </th>

                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Requested Quantity By Storage Type
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="item in model.requisition?.requestedCommodities" :key="item.id">

                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.commodity?.Name }}
                            <span v-if="item.commodity" class="text-green-800 text-xs font-light">
                              ( {{ calculateTotalQuantity(item.commodity, model?.warehouse?.id) }}
                              {{ item.commodity?.Unit === "Kg" ? "MT" : "Units" }} Available)
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.Quantity }} {{ item.commodity?.Unit == "Kg" ? " MT" : item.commodity?.Unit }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.NoBags }} {{ item.commodity?.Container_type }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr>
                  </div>

                  <div class="mt-6">
                    <h3 class="text-lg font-bold leading-6 text-gray-900 capitalize">Commodities Assigned
                    </h3>

                    <table class="min-w-full divide-y divide-gray-200 mt-2">
                      <thead class="bg-gray-100">
                        <tr>
                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Commodity
                          </th>
                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Assigned Quantity
                          </th>
                          <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Assigned Quantity By Storage Type
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="item in instructedCommodityItems" :key="item.id">
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.commodity?.Name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.Quantity }} {{ item.commodity?.Unit == "Kg" ? " MT" : item.commodity?.Unit }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.NoBags }} {{ item.commodity?.Container_type }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr>
                  </div>
                  <!-- Loop to Add Multiple Relief Items -->
                  <div v-for="(item, index) in reliefItems" :key="index" class="flex space-x-4 items-center">
                    <div class="flex-1">
                      <label class="block text-sm font-bold text-gray-700">Commodity</label>
                      <select v-model="item.commodityId" @change="validateCommodity(index)"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                        <option value="" disabled>Select a commodity</option>
                        <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">
                          {{ commodity.Name }}
                        </option>
                      </select>
                      <!-- Display Error Message if the Commodity is Duplicated -->
                      <!--    <span class="text-md text-red-500 font-italic text-xs" v-if="item.commodityId">
                        {{ availableBalance == 0 ? "" : availableBalance }}</span>
                   -->
                    </div>

                    <div class="flex-1">
                      <label class="block text-sm font-bold text-gray-700">Quantity <span class="text-sm text-gray-600"
                          v-if="item.commodityId">({{ getCommodityName(item.commodityId) }})</span>
                      </label>
                      <input type="number" v-model.number="item.Quantity"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        placeholder="Quantity" />
                    </div>

                    <!-- Remove Item Button -->

                    <button @click="removeItem(item.id)" type="button"
                      class="ml-2 mt-6 inline-flex items-center p-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <MinusCircleIcon class="h-5 w-5" />
                    </button>
                  </div>

                  <!-- Button to Add New Item -->
                  <button type="button" @click="addNewItem"
                    class="mt-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                    + Add Relief Item
                  </button>
                </div>


              </div>

              <!-- Submit Button -->
              <div class="px-4 py-3 text-right sm:px-6">
                <button type="submit"
                  class="inline-flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
//SCHEMA AND STORES
import { PlusCircleIcon, MinusCircleIcon, XIcon, CheckCircleIcon } from "@heroicons/vue/solid";

import { UpdateUserSchema } from "../../../services/schema/commoditytype.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useInstructedCommoditiesStore } from "../../../stores/instructedCommodities.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import { useinstructionstore } from "../../../stores/instructions.store";
import eventBus from '../../../services/events/eventbus';


import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
const props = defineProps({
  model: Object,
});

const availableBalance = ref(0)
//VARIABLES
const emit = defineEmits(["update"]);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Instruction Management", href: "/field/instruction-management", current: false },
  { name: "Edit", href: "#", current: true },
];
const WarehouseStore = usewarehousestore();

const instructedCommodityStore = useInstructedCommoditiesStore();

const commodityStore = usecommoditiestore()
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const commodityinventoriestore = usecommodityinventoriestore();
const commodityinventories = reactive([])
const warehouses = reactive([]);
const instructions = reactive([]);
const instructionsStore = useinstructionstore();

const calculateTotalQuantity = (commodity, id) => {
  if (commodity && commodity.commodityInventories) {
    return commodity.commodityInventories.filter(item => item.warehouseId == id).reduce((total, inventory) => {
      return total + (inventory.Quantity || 0);
    }, 0);
  }
  return 0;
}

const commodities = reactive([])
const { model } = toRefs(props);
///FORM
const { meta } = useForm({
  validationSchema: UpdateUserSchema,
  // initialValues: {
  //   id: model.value.id,
  //   firstName: model.value.firstName,
  //   lastname:  model.value.lastname,
  //   phone:  model.value.phone,
  //   email:  model.value.email,
  //   status:  model.value.status,
  //   roleId:  model.value.roleId,
  // },
});
///FIELDS


const reliefItems = reactive([
  { commodityId: "", Quantity: 0, error: "", id: "" }
]);


const getCommodityName = (commodityId) => {
  const commodity = commodities.find(c => c.id === commodityId);
  return commodity ? commodity.Container_type : '';
};

const getCommodityPackSize = (commodityId) => {
  const commodity = commodities.find(c => c.id === commodityId);
  return commodity ? commodity.PackSize : '';
};

// Method to Add New Relief Item
const addNewItem = () => {
  reliefItems.push({ commodityId: "", Quantity: 0, error: "" });
};

// Method to Remove a Relief Item
const removeItem = async (index) => {
  // Ask for user confirmation
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      // Attempt to remove the item
      await instructedCommodityStore.remove(index);
      await getReliefItems(); // Refresh the relief items list

      // Notify the user of successful deletion
      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
        icon: "success",
      });
    } catch (error) {
      // Handle any errors that occur during the removal process
      Swal.fire({
        title: "Failed",
        text: `Failed to delete the item (${error.message})`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }
};



// Check if a Commodity is Duplicated
const validateCommodity = (index) => {
  const selectedCommodity = reliefItems[index].commodityId;
  const warehouseId = model.value.warehouse.id
  const warehouseName = model.value.warehouse.Name

  if (selectedCommodity && warehouseId) {
    // Find the corresponding inventory record based on the selection
    const matchingInventory = commodityinventories.find(
      (inventory) => inventory.commodityId === selectedCommodity && inventory.warehouseId === warehouseId
    );

    // Update the available balance if a matching inventory record is found
    availableBalance.value = matchingInventory ? `${matchingInventory.Quantity} MT Available at ` + warehouseName : 'Not Available';
  } else {
    availableBalance.value = 'Select Commodity';
  }


  const isDuplicate = reliefItems.some((item, idx) => item.commodityId === selectedCommodity && idx !== index);
  reliefItems[index].error = isDuplicate ? "Commodity already added. Please select another." : "";
};

const toggle = ref(false);
//MOUNTED
onMounted(() => {

  getCommodities()
  //Assign
  getCommodityInventories();
  getReliefItems()

});


const updateInstruction = async (newValues) => {
  const id = parseInt($route.params.id);
  // Create a new object with the spread operator and add isRejected
  const updatedValues = {
    id: id,
    IsRejected: false // or false, depending on your requirement
  };

  try {
     await instructionsStore.update(updatedValues);
     eventBus.emit('requisitionArchived', updatedValues.id);

  } catch (error) {
    console.error("Error updating instruction:", error);
  }
};


const getCommodityInventories = async () => {
  commodityinventoriestore
    .get()
    .then(result => {

      commodityinventories.length = 0; //empty array
      commodityinventories.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const isDecimal = (num) => {
  return num % 1 !== 0;
}

const computedTonnagePerRemark = ((packsize, bags) => {
  let TonnageConversion = packsize / 1000;

  // Apply toFixed(2) only if the number is a decimal
  if (isDecimal(TonnageConversion)) {
    TonnageConversion = parseFloat(TonnageConversion.toFixed(2));
  }

  let Tonnage = bags * TonnageConversion;

  // Apply toFixed(2) to the final result
  return isDecimal(Tonnage) ? parseFloat(Tonnage.toFixed(2)) : Tonnage;
});




//FUNCTIONS
const onSubmit = useSubmitForm(async (values, actions) => {
  // Get the instructionId from the route parameters
  updateInstruction()
  const instructionId = parseInt($route.params.id);

  // Check if the existing `reliefItems` loaded during `onMounted` is populated
  let itemsToSubmit = reliefItems.length > 0 ? reliefItems : [{ commodityId: "", Quantity: 0, NoBags, error: "" }];


  // Ensure each item has the correct instructionId
  const newValues = itemsToSubmit.map(item => ({
    ...item, // Spread existing properties
    instructionId, // Add the instructionId to each object
    NoBags: item.Quantity,
    Quantity: computedTonnagePerRemark(getCommodityPackSize(item.commodityId), item.Quantity)
  }));

  // Remove any `error` fields before submission
  const cleanedValues = newValues.map(({ error, ...cleanedItem }) => cleanedItem);

  emit("update", cleanedValues);
  await getReliefItems(); // Refresh the relief items list


});


const instructedCommodityItems = ref([])

const getReliefItems = async () => {
  isLoading.value = true;
  const instructionId = $route.params.id;

  try {
    // Fetch all instructed commodities
    const result = await instructedCommodityStore.get();

    // Filter the result by instructionId
    const filteredItems = result.filter(item => item.instructionId == instructionId);
    instructedCommodityItems.value = filteredItems;

    // Push filtered items into the reactive `reliefItems` array
    reliefItems.splice(0, reliefItems.length, ...filteredItems.map(item => ({
      commodityId: item.commodityId,
      Quantity: item.NoBags,
      instructionId: instructionId,
      id: item.id
    })));

  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: `Failed to get relief items (${error.message})`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};
const getCommodities = async () => {
  isLoading.value = true;
  commodityStore
    .get()
    .then((result) => {
      commodities.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get commodities error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};





</script>
