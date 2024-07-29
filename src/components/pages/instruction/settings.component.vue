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





                  <div class="col-span-12 sm:col-span-12">
                    <label for="user-role" class="block text-sm font-bold text-gray-700">
                      Select Warehouse</label>
                    <select id="role" name="warehouseId" v-model="warehouseId" autocomplete="role-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="warehouse in warehouses" :key="warehouseId" :value="warehouseId" class="uppercase">
                        {{ warehouse.Name }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ warehouseError }}
                    </p>
                  </div>

                  <div class="col-span-12 sm:col-span-12">
                    <label for="user-role" class="block text-sm font-medium text-gray-700">
                      Select Transporter</label>
                    <select id="role" name="warehouseId" v-model="transporterId" autocomplete="role-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="transporter in transporters" :key="transporterId" :value="transporterId"
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
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="district in districts" :key="districtId" :value="districtId" class="uppercase">
                        {{ district.Name }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ districtError }}
                    </p>
                  </div> -->

                  <div class="col-span-12 sm:col-span-12">
                    <label for="DriverName" class="block text-sm font-bold text-gray-700">Driver Name</label>
                    <input type="text" Name="DriverName" id="DriverName" v-model="DriverName" autocomplete="DriverName"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ DriverNameError }}
                    </p>
                  </div>


                  <div class="col-span-12 sm:col-span-12">
                    <label for="Purpose" class="block text-sm font-bold text-gray-700">Purpose</label>
                    <input type="text" Name="Purpose" id="Purpose" v-model="Purpose" autocomplete="Purpose"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ PurposeError }}
                    </p>
                  </div>

                  <div class="col-span-12 sm:col-span-12">
                    <label for="VehicleRegNo" class="block text-sm font-bold text-gray-700">Vehicle Reg #</label>
                    <input type="text" Name="VehicleRegNo" id="VehicleRegNo" v-model="VehicleRegNo"
                      autocomplete="VehicleRegNo"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ VehicleRegNoError }}
                    </p>
                  </div>


                  <div class="col-span-12 sm:col-span-12">
                      <label for="remarks" class="block text-sm font-bold text-gray-700">
                        Instruction
                      </label>

                      <!-- Textarea for Remarks -->
                      <textarea id="remarks" v-model="Remarks" rows="4" placeholder="Add your instruction here..."
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"></textarea>

                      <!-- Error message -->
                      <p class="text-red-500 text-xs italic pt-1">{{ remarksError }}</p>
                    </div>


                </div>

              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Update
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
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Instruction Management", href: "/field/instruction-management", current: false },
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
const { value: warehouseId, errorMessage: warehouseError } =
  useField("warehouseId");

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

const toggle = ref(false);
//MOUNTED
onMounted(() => {
  getWarehouses()

  getTransporters()

  getDistricts()
  //Assign

  Remarks.value = model.value.Remarks
  DriverName.value = model.value.DriverName
  Purpose.value = model.value.Purpose
  warehouseId.value= model.value.warehouseId,
  districtId.value = model.value.districtId,
  VehicleRegNo.value = model.value.VehicleRegNo
  warehouseName.value = model.value.warehouse?.Name
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {

  let newValues = {
    id: model.value.id,
    warehouseId: warehouseId.value,
    
    districtId: districtId.value,
    transporterId: transporterId.value,
    DriverName: DriverName.value
  };

  emit("update", newValues);
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
  WarehouseStore
    .get()
    .then((result) => {
      warehouses.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get warehouses error (" + error + ")",
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
