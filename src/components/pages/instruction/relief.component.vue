<template>
  <main class="space-y-6">
    <div class="bg-white shadow-lg px-6 py-8 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Header Section -->
        <div class="md:col-span-1">
          <h3 class="text-lg font-semibold text-gray-900">Relief Items</h3>
          <p class="mt-2 text-sm text-gray-500">Add relief materials for the instruction below.</p>
        </div>
        
        <!-- Form Section -->
        <div class="md:col-span-2">
          <form @submit="onSubmit">
            <div class="space-y-6">
              <!-- Warehouse Information -->
              <div class="bg-gray-50 p-4 rounded-md">
                <p class="text-gray-700">Draw Down From: {{ model.warehouses?.map(warehouse => warehouse?.name).join(', ') }}</p>
                <span class="text-sm text-red-600" v-if="availableBalance">{{ availableBalance }}</span>
              </div>
              
              <!-- Requested Commodities -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Summary of Requested Commodities</h3>
                <table class="min-w-full mt-4 border border-gray-200 rounded-md">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Commodity</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Requested Quantity</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Storage Type</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    <tr v-for="item in model.requisition?.requestedCommodities" :key="item.id" class="border-t">
                      <td class="px-4 py-2">{{ item.commodity?.Name }}</td>
                      <td class="px-4 py-2">{{ item.Quantity }} {{ item.commodity?.Unit === "Kg" ? "MT" : "Units" }}</td>
                      <td class="px-4 py-2">{{ item.NoBags }} {{ item.commodity?.Container_type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Assigned Commodities -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Commodities Assigned</h3>
                <table class="min-w-full mt-4 border border-gray-200 rounded-md">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Commodity</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Assigned Quantity</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Storage Type</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    <tr v-for="item in instructedCommodityItems" :key="item.id" class="border-t">
                      <td class="px-4 py-2">{{ item.commodity?.Name }}</td>
                      <td class="px-4 py-2">{{ item.Quantity }} {{ item.commodity?.Unit === "Kg" ? "MT" : "Units" }}</td>
                      <td class="px-4 py-2">{{ item.NoBags }} {{ item.commodity?.Container_type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Dynamic Relief Item Input -->
              <div v-for="(item, index) in reliefItems" :key="index" class="flex space-x-4 items-center">
                <!-- Commodity Selection -->
                <div class="flex-1">
                  <label class="block text-sm font-bold text-gray-700">Commodity</label>
                  <select v-model="item.commodityId" class="mt-1 block w-full border-gray-400 rounded-md shadow-sm">
                    <option value="" disabled>Select a commodity</option>
                    <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">
                      {{ commodity.Name }}
                    </option>
                  </select>
                </div>
                
                <!-- Warehouse Selection -->
                <div class="flex-1">
                  <label class="block text-sm font-bold text-gray-700">Warehouse</label>
                  <select v-model="item.warehouseId" class="mt-1 block w-full border-gray-400 rounded-md shadow-sm">
                    <option value="" disabled>Select a warehouse</option>
                    <option v-for="warehouse in model.warehouses" :key="warehouse.id" :value="warehouse.id">
                      {{ warehouse.name }}
                    </option>
                  </select>
                </div>

                <!-- Quantity Input -->
                <div class="flex-1">
                  <label class="block text-sm font-bold text-gray-700">Quantity (bags)</label>
                  <input type="number" v-model.number="item.Quantity" class="mt-1 block w-full border-gray-400 rounded-md shadow-sm" />
                </div>

                <!-- Remove Item Button -->
                <button @click="removeItem(item.id, index)" type="button" class="text-red-600 mt-6">
                  <MinusCircleIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Add Item Button -->
              <button type="button" @click="addNewItem" class="mt-4 inline-flex items-center px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-green-700">
                + Add Relief Item
              </button>
              
              <!-- Submit Button -->
              <div class="mt-6 text-right">
                <button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <CheckIcon class="w-5 h-5 mr-2" aria-hidden="true" />Submit Update
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
import { PlusCircleIcon, MinusCircleIcon, XIcon, CheckIcon, CheckCircleIcon } from "@heroicons/vue/solid";

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
  { name: "Home", href: "/receipient/dashboard", current: false },
  { name: "Instruction Management", href: "/receipient/instruction-management", current: false },
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
  { commodityId: "", Quantity: 0, error: "", id: "", warehouseIdId: ""}
]);


watch(reliefItems, (newItems) => {
  newItems.forEach((item, index) => validateCommodity(index));
}, { deep: true });



const getCommodityName = (commodityId) => {
  const commodity = commodities.find(c => c.id === commodityId);
  return commodity ? commodity.Container_type : '';
};

const getCommodityPackSize = (commodityId) => {
  const commodity = commodities.find(c => c.id === commodityId);
  return commodity ? commodity.PackSize : '';
};

// Method to Add New Relief Item
// Method to Add New Relief Item
const addNewItem = () => {
  // Check if there are items in the array
  if (reliefItems.length === 0) {
    // Directly add the first item if the array is empty
    reliefItems.push({ commodityId: "", warehouseId: "", Quantity: 0, error: "" });
    return;
  }

  // Check for duplicates
  const lastItem = reliefItems[reliefItems.length - 1];
  const hasDuplicate = reliefItems.some(item => 
    item !== lastItem && 
    item.commodityId === lastItem.commodityId && 
    item.warehouseId === lastItem.warehouseId
  );

  if (hasDuplicate) {
 
    Swal.fire({
        text: 'Item with this commodity and warehouse already exists!',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

   
    return;
  }

  // Check if the last item has all required fields filled
  if (lastItem.commodityId && lastItem.warehouseId && lastItem.Quantity > 0) {
    reliefItems.push({ commodityId: "", warehouseId: "", Quantity: 0, error: "" });
  } else {

 
    Swal.fire({
        text: 'Quantities can not be zero!, please check.',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

   
  }

  if (lastItem.commodityId && lastItem.warehouseId) {
    const availableInventory = commodityinventories.find(
      inv => inv.commodityId === lastItem.commodityId && inv.warehouseId === lastItem.warehouseId
    );

    if (!availableInventory || availableInventory.Quantity <= 0) {
  
      Swal.fire({
        text: `No stock available for the selected commodity in the chosen warehouse.`,
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

    }
  }
};


// Method to validate the inventory for each item

const validateCommodity = (index) => {
  const item = reliefItems[index];
  const selectedCommodity = item.commodityId;
  const selectedWarehouseId = item.warehouseId;

  if (selectedCommodity && selectedWarehouseId) {
    const matchingInventory = commodityinventories.find(
      (inventory) => inventory.commodityId === selectedCommodity && inventory.warehouseId === selectedWarehouseId
    );

    if (matchingInventory) {
      availableBalance.value = `${matchingInventory.Quantity} MT Available at warehouse selected`;
      item.error = matchingInventory.Quantity > 0 ? "" : "No stock available";
    } else {
      availableBalance.value = "Not Available";
      item.error = "No stock available";
    }
  } else {
    availableBalance.value = "Select Commodity and Warehouse";
    item.error = "";
  }
};
// Method to Remove a Relief Item
const removeItem = async (id, index) => {
  const item = reliefItems[index];  // Access the item by index, not id

  if (!item?.id) {
    // If item.id is undefined, just remove the item from the reliefItems array
    reliefItems.splice(index, 1);
    return;
  }

  // Ask for user confirmation if the item has an API record (i.e., has an ID)
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
      // Remove the item via API request if it has an id
      await instructedCommodityStore.remove(item.id);  // Ensure correct API call
      await getReliefItems(); // Refresh the relief items list

      // Notify the user of successful deletion
      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: `Failed to delete the item (${error.message})`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }
};






const toggle = ref(false);
//MOUNTED
onMounted(async () => {

  getCommodities()
  //Assign
  getCommodityInventories();
  await getReliefItems()

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
  let hasError = false;
  let duplicateError = false;
  let noStockError = false;
  let zeroQuantityError = false; // New flag for zero quantity

  // Collect all commodity and warehouse combinations
  const uniqueCombinations = new Set();

  // Validate inventory and check for errors
  reliefItems.forEach((item, index) => {
    validateCommodity(index);

    // Check for zero quantity
    if (item.Quantity <= 0) {
      zeroQuantityError = true;
      item.error = 'Quantity must be greater than zero';
    }

    // Check for duplicate commodity from the same warehouse
    const combinationKey = `${item.commodityId}-${item.warehouseId}`;
    if (uniqueCombinations.has(combinationKey)) {
      duplicateError = true;
      item.error = 'Duplicate entry for this commodity and warehouse combination';
    } else {
      uniqueCombinations.add(combinationKey);
    }

    // Check for stock availability
    if (item.error) {
      hasError = true;
    } else if (!commodityinventories.find(inv => inv.commodityId === item.commodityId && inv.warehouseId === item.warehouseId && inv.Quantity > 0)) {
      noStockError = true;
      item.error = 'No stock available';
    }
  });

  // Show appropriate alert if validation fails
  if (zeroQuantityError) {
    Swal.fire({
      text: `All commodities must have a quantity greater than zero.`,
      icon: 'error',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (duplicateError) {
    Swal.fire({
      text: `You have added the same commodity from the same warehouse more than once.`,
      icon: 'error',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (noStockError) {
    Swal.fire({
      text: `Some of the commodities do not have stock available.`,
      icon: 'error',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (hasError) {
    Swal.fire({
      text: `Please resolve all errors before submitting.`,
      icon: 'error',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  // Update instruction
  updateInstruction();
  const instructionId = parseInt($route.params.id);
  const newValues = reliefItems.map(item => ({
    ...item,
    instructionId,
    NoBags: item.Quantity,
    Quantity: computedTonnagePerRemark(getCommodityPackSize(item.commodityId), item.Quantity)
  }));

  // Emit update event
  emit("update", newValues);
  await getReliefItems();  
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
      warehouseId: item.warehouseId,
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
