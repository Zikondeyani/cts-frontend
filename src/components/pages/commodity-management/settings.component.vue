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
                  <div class="col-span-6 sm:col-span-3">
                    <label for="organisation-Name" class="block text-sm font-medium text-gray-700">Organisation
                      Name</label>
                    <input type="text" Name="organisation-Name" id="organisation-Name" v-model="Name"
                      autocomplete="given-Name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ NameError }}
                    </p>
                  </div>

                </div>


                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-3 sm:col-span-3">

                    <label for="unit" class="block text-sm font-medium text-gray-700">
                      Select Unit</label>
                    <select id="district" name="unit" v-model="Unit" autocomplete="unit-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="item in ['Kg', 'Litres']" :key="item" :value="item" class="uppercase">
                        {{ item }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ UnitError }}
                    </p>
                  </div>

                  <div class="col-span-3 sm:col-span-3">

                    <label for="unit" class="block text-sm font-medium text-gray-700">
                      Select Commodity Type</label>
                    <select id="commodityTypeId" name="commodityTypeId" v-model="commodityTypeId"
                      autocomplete="commodityTypeId"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="item in commodity" :key="item.id" :value="item.id" class="uppercase">
                        {{ item.Name }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ CommodityTypeIdError }}
                    </p>
                  </div>
                  <div class="col-span-6 sm:col-span-4">
                    <label for="PackSize" class="block text-sm font-medium text-gray-700">Pack Size</label>
                    <input type="number" v-model="PackSize" name="pack-size" id="pack-size" autocomplete="off"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ PackSizeError }}
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



    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6" v-if="user.roleId == 'ADMIN1'">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Delete commodity
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Delete commodity and all associated data
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button type="button"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="deleteAcc()">
              Delete Commodity
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
import { UpdateUserSchema } from "../../../services/schema/commodity-mngt.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useorganisationstore } from "../../../stores/organisations.store";

import { usecommoditiestore } from "../../../stores/commodity.store";
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
  { name: "Organisations", href: "/admin/organisations", current: false },
  { name: "Edit", href: "/admin/users/edit", current: true },
];
const roleStore = useRoleStore();
const OrganisationStore = useorganisationstore();

const commodityStore = usecommoditiestore();
const commodity = reactive([])

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const roles = reactive([]);
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
const { value: Name, errorMessage: NameError } =
  useField("Name");
const { value: Unit, errorMessage: UnitError } = useField("Unit");
const { value: commodityTypeId, errorMessage: CommodityTypeIdError } = useField("commodityTypeId");
const { value: PackSize, errorMessage: PackSizeError } = useField("PackSize");



//WATCH
// watch(model, (currentValue, oldValue) => {

// });

const toggle = ref(false);
//MOUNTED
onMounted(() => {
  //Assign
  Name.value = model.value.Name;
  commodityTypeId.value = model.value.commodityTypeId;
  Unit.value = model.value.Unit;

  PackSize.value = model.value.PackSize;

  getCommodityTypes()
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {

  let newValues = {
    id: model.value.id,
    Name: Name.value,
    commodityTypeId: commodityTypeId.value,
    Unit: Unit.value,
    PackSize: PackSize.value,

  };

  emit("update", newValues);
});


const getCommodityTypes = async (id) => {
  commodityStore
    .get(id)
    .then((result) => {
      commodity.push(...result.reverse());
    })
};


const deleteAcc = async () => {
  let id = model.value.id;
  isLoading.value = true;
  commodityStore
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
          Swal.fire("Deleted!", "Deleted commodity succesfully.", "success");
          isLoading.value = false;
          let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
          $router.push({ path: "/" + role + "/commodity-management" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove commodity (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
};


</script>
