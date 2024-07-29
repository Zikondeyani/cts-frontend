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
          <form class="" @submit="onSubmit" :validation-schema="UpdateWarehouseSchema">


            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-6 sm:col-span-3">
                    <label for="warehouse-Name" class="block text-sm font-medium text-gray-700">Warehouse
                      Name</label>
                    <input type="text" Name="warehouse-Name" id="warehouse-Name" v-model="Name"
                      autocomplete="given-Name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ NameError }}
                    </p>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="contact-person" class="block text-sm font-medium text-gray-700">Max Storage</label>
                    <input type="number" Name="max-storage" id="max-storage" v-model="MaxStorage"
                      autocomplete="max-storage"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ MaxStorageError }}
                    </p>
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



    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6" v-if="user.roleId == 'ADMIN1' || user.roleId == 'ADMIN6'">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Delete warehouse
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Delete warehouse and all associated data
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button type="button"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="deleteAcc()">
              Delete warehouse
            </button>
          </div>
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
import { UpdateWarehouseSchema } from "../../../services/schema/warehouse.schema";
import { useRoleStore } from "../../../stores/role.store";
import { usewarehousestore } from "../../../stores/warehouse.store";

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
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Warehouse Management", href: "/admin/warehouse-management", current: false },
  { name: "Edit", href: "#", current: true },
];
const roleStore = useRoleStore();
const WarehouseStore = usewarehousestore();

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const roles = reactive([]);
const { model } = toRefs(props);
///FORM
const { meta } = useForm({
  validationSchema: UpdateWarehouseSchema,
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
const { value: Name, errorMessage: NameError } =
  useField("Name");
const { value: MaxStorage, errorMessage: MaxStorageError } = useField("MaxStorage");



//WATCH
// watch(model, (currentValue, oldValue) => {

// });

const toggle = ref(false);
//MOUNTED
onMounted(() => {
  //Assign
  Name.value = model.value.Name;
  MaxStorage.value = model.value.MaxStorage;

});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {

  let newValues = {
    id: model.value.id,
    Name: Name.value,
    MaxStorage: MaxStorage.value

  };

  emit("update", newValues);
});



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
          Swal.fire("Deleted!", "Deleted warehouse succesfully.", "success");
          isLoading.value = false;
          $router.push({ path: "/" + "warehouse" + "/warehouses" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove warehouse  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
};


</script>
