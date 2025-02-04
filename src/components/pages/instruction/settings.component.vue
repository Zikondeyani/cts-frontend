<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Profile
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form class="" @submit="onSubmit" :validation-schema="UpdateUserSchema">


            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">





                  <div class="col-span-12 sm:col-span-12 mb-2">
                    <div class="bg-gray-50 p-4 rounded-md">
            
                    <p class="text-gray-700">Draw Down From: {{ selectedWarehouses?.map(warehouse => warehouse?.Name).join(', ') }}</p>
              </div>
             
                    <label for="user-role"  class="block text-sm font-medium text-gray-700">
                      Select Warehouse</label>
                    <multiselect v-model="selectedWarehouseIds" tag-placeholder="Add this as new warehouse"
                      placeholder="Search or reselect a warehouses to draw from" label="Name" track-by="id" :options="warehouses"
                      :multiple="true" :taggable="true" @tag="addWarehouse"></multiselect>

                    
                  </div>
                  <hr>
                  <div class="col-span-12 sm:col-span-12">
                    <label for="user-role" class="block text-sm font-medium text-gray-700">
                      Select Transporter</label>


                    <select id="role" name="warehouseId" v-model="transporterId" autocomplete="role-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md">
                      <option v-for="transporter in transporters" :key="transporter.id" :value="transporter.id"
                        class="uppercase">
                        {{ transporter.Name }}
                      </option>
                    </select>

                    <p class="text-red-500 text-xs italic pt-1">
                      {{ transporterError }}
                    </p>
                  </div>


                  <!--  <div class="col-span-12 sm:col-span-12">
                    <label for="user-role" class="block text-sm font-bold text-gray-700">
                      Select Districts</label>
                    <select id="role" name="districtId" v-model="districtId" autocomplete="role-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md">
                      <option v-for="district in districts" :key="districtId" :value="districtId" class="uppercase">
                        {{ district.Name }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ districtError }}
                    </p>
                  </div> -->

                  <!--      <div class="col-span-12 sm:col-span-12">
                    <label for="DriverName" class="block text-sm font-bold text-gray-700">Driver Name</label>
                    <input type="text" Name="DriverName" id="DriverName" v-model="DriverName" autocomplete="DriverName"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ DriverNameError }}
                    </p>
                  </div>
 -->

                  <div class="col-span-12 sm:col-span-12">
                    <label for="Purpose" class="block text-sm font-bold text-gray-700">Purpose</label>
                    <input type="text" Name="Purpose" id="Purpose" v-model="Purpose" autocomplete="Purpose"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ PurposeError }}
                    </p>
                  </div>

                  <!--    <div class="col-span-12 sm:col-span-12">
                    <label for="VehicleRegNo" class="block text-sm font-bold text-gray-700">Vehicle Reg #</label>
                    <input type="text" Name="VehicleRegNo" id="VehicleRegNo" v-model="VehicleRegNo"
                      autocomplete="VehicleRegNo"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ VehicleRegNoError }}
                    </p>
                  </div>
 -->

                  <div class="col-span-12 sm:col-span-12">
                    <label for="remarks" class="block text-sm font-bold text-gray-700">
                      Instruction
                    </label>

                    <!-- Textarea for Remarks -->
                    <textarea id="remarks" v-model="Remarks" rows="4" placeholder="Add your instruction here..."
                      class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"></textarea>

                    <!-- Error message -->
                    <p class="text-red-500 text-xs italic pt-1">{{ remarksError }}</p>
                  </div>


                </div>

              </div>
             
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
import { UpdateUserSchema } from "../../../services/schema/commoditytype.schema";
import { useRoleStore } from "../../../stores/role.store";
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { usedistrictstore } from "../../../stores/districts.store";
import Multiselect from 'vue-multiselect'
import { PlusCircleIcon, MinusCircleIcon, XIcon, CheckIcon, CheckCircleIcon } from "@heroicons/vue/solid";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
const props = defineProps({
  model: Object,
});
//VARIABLES
const emit = defineEmits(["update"]);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/receipient/dashboard", current: false },
  { name: "Instruction Management", href: "/receipient/instruction-management", current: false },
  { name: "Edit", href: "#", current: true },
];
const WarehouseStore = usewarehousestore();

const districtStore = usedistrictstore();

const TransporterStore = usetransporterstore();

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const warehouses = reactive([]);

const transporters = reactive([]);
const districts = reactive([])
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
const { value: warehouseIds, errorMessage: warehouseError } =
  useField("warehouseIds");

const { value: transporterId, errorMessage: transporterError } =
  useField("transporterId");

const { value: districtId, errorMessage: districtError } =
  useField("districtId");
const { value: DriverName, errorMessage: DriverNameError } =
  useField("DriverName");
const { value: Purpose, errorMessage: PurposeError } =
  useField("Purpose");

const { value: VehicleRegNo, errorMessage: VehicleRegNoError } =
  useField("VehicleRegNo");

const { value: Remarks, errorMessage: RemarksError } =
  useField("Remarks");

const commodityName = ref("")
const warehouseName = ref("")

//WATCH
// watch(model, (currentValue, oldValue) => {

// });

const selectedWarehouses = ref([]); // Store selected warehouse objects
const selectedWarehouseIds = ref([]); // Store selected warehouse IDs as numbers



// Watch for changes in selectedWarehouseIds to update selectedWarehouses
// Watch the selectedWarehouseIds to see changes

watch(selectedWarehouseIds, (newSelection) => {
  selectedWarehouses.value = warehouses.filter(warehouse =>
    newSelection.includes(warehouse.id));
});

watch([transporterId, selectedWarehouseIds], () => {
  console.log('Transporter ID:', transporterId.value);
  console.log('Selected Warehouse IDs:', selectedWarehouseIds.value);
});


const addWarehouse = (newTag) => {
  const tag = {
    name: newTag,
    code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
  }
  this.options.push(tag)
  this.value.push(tag)
}

const toggle = ref(false);
//MOUNTED
onMounted(() => {
  if (model.value) {
    Remarks.value = model.value.Remarks || '';
    Purpose.value = model.value.Purpose || '';
    transporterId.value = model.value.transporterId || null;

    // Initialize warehouses by matching IDs with existing warehouse objects
    if (model.value.warehouseIds && warehouses.length > 0) {
      selectedWarehouseIds.value = model.value.warehouseIds;
      selectedWarehouses.value = warehouses.filter(warehouse =>
        model.value.warehouseIds.includes(warehouse.id));
    }
  }

  getWarehouses(); // Populate warehouses
  getTransporters(); // Populate transporters
});

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  // Extract the IDs from selected warehouse objects
  const warehouseIdNumbers = selectedWarehouseIds.value.map(warehouse => warehouse.id);

  let newValues = {
    id: model.value.id,
    warehouseIds: warehouseIdNumbers, // Store only the IDs
    transporterId: transporterId.value,
    Purpose: Purpose.value,
    Remarks: Remarks.value,
  };

 emit("update", newValues); // Emit the updated data
});
const getTransporters = async () => {
  isLoading.value = true;
  TransporterStore
    .get()
    .then((result) => {
      transporters.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get transporters error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDistricts = async () => {
  isLoading.value = true;
  districtStore
    .get()
    .then((result) => {
      districts.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get districts error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getWarehouses = async () => {
  isLoading.value = true;
  WarehouseStore.get()
    .then(result => {
      warehouses.push(...result.filter(item => item.organisationId == 2));

      // Once warehouses are loaded, set the selected warehouses
      if (model.value?.warehouseIds) {
        selectedWarehouses.value = warehouses.filter(warehouse =>
          model.value.warehouseIds.includes(warehouse.id));
      }
    })
    .catch(error => {
      Swal.fire({
        title: "Failed",
        text: `Failed to get warehouses error (${error})`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const deleteAcc = async () => {
  let id = model.value.id;
  isLoading.value = true;
  WarehouseStore
    .remove(id)
    .then((result) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Deleted commodity inventory succesfully.", "success");
          isLoading.value = false;
          let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
          $router.push({ path: "/" + role + "/instruction-management" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove commodity inventory  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
};


</script>
