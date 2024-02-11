<template>
  <main class="space-y-2" v-if="model.locationTypeId != 'NATIONAL' && user.roleId !== 'ADMIN2'">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Locations</h3>
          <p class="mt-1 text-sm text-gray-500">
            Note : Delete all locations added to change the location Type in
            Document Details
          </p>
        </div>
        <div class="md:mt-0 md:col-span-2">
          <div class="px-4 py-3">
            <table class="min-w-full">
              <thead class="border-b">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Options
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(documentLocation, index) in documentLocations"
                  :key="documentLocation.id"
                  class="border-b"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ documentLocation.locationType.name }} :
                    <span
                      v-if="documentLocation.locationTypeId == 'REGIONAL'"
                      >{{ documentLocation.ADM1_EN }}</span
                    >
                    <span v-if="model.locationTypeId == 'DISTRICT'">{{
                      documentLocation.ADM2_EN
                    }}</span>
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      @click="remove(documentLocation.id)"
                      class="text-gray-500 hover:text-gray-500 text-xs p-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-4 text-right sm:px-6 pt-2">
            <button
              v-show="!open"
              @click="open = true"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Add
            </button>
          </div>
          <div v-show="open">
            <form
              @submit="onSubmit"
              :validation-schema="LocationSchema"
              class="bg-gray-50"
            >
              <div class="overflow-hidden sm:rounded-md">
                <div class="px-4 py-5 sm:p-6">
                  <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6 sm:col-span-6">
                      <div class="grid grid-cols-6 gap-2">
                        <div class="col-span-5 sm:col-span-5">
                          <label
                            for="documentType"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Location</label
                          >
                        </div>
                        <div class="col-span-1 sm:col-span-1 text-right">
                          <button
                            type="button"
                            class="text-sm text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                            @click="open = false"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      <div class="grid grid-cols-6 gap-2">
                        <div class="col-span-6 sm:col-span-6">
                          <select
                            id="locations"
                            name="locations"
                            v-model="locationId"
                            autocomplete="locations-name"
                            class="form-multiselect mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          >
                            <option
                              v-for="location in locations"
                              :key="location.id"
                              :value="location.id"
                              class="uppercase"
                            >
                              <span v-if="model.locationTypeId == 'REGIONAL'">{{
                                location.properties.ADM1_EN
                              }}</span>
                              <span v-if="model.locationTypeId == 'DISTRICT'">{{
                                location.properties.ADM2_EN
                              }}</span>
                            </option>
                          </select>
                          <p class="text-red-500 text-xs italic pt-1">
                            {{ locationIdError }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
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
import { LocationSchema } from "../../../services/schema/document.schema";
import { useDocumentLocationStore } from "../../../stores/document-location.store";
import { useAdminBoundaryStore } from "../../../stores/admin-boundary.store";
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
const emit = defineEmits(["refresh"]);
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(true);
const documentLocationStore = useDocumentLocationStore();
const adminBoundaryStore = useAdminBoundaryStore();
const { model } = toRefs(props);
//VALUES
const documentLocations = reactive([]);
const locations = reactive([]);


const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
//FORM
const { meta } = useForm({
  validationSchema: LocationSchema,
});
///FIELDS
const { value: locationId, errorMessage: locationIdError } =
  useField("locationId");
//MOUNTED
onMounted(() => {
  getDocumentLocations();

  open.value = false;
  locations.length = 0;

  //Methods
  if (model.value.locationTypeId == "REGIONAL") {
    getRegions();
  } else if (model.value.locationTypeId == "DISTRICT") {
    getDistricts();
  }
});
//WATCH
// watch(model.value, (newValue, oldValue) => {
//   locations.length = 0;
//   if (model.value.locationTypeId == "REGIONAL") {
//     getRegions();
//   } else if (model.value.locationTypeId == "DISTRICT") {
//     getDistricts();
//   }
// });
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  var location = locations.filter((item) => {
    return item.id === values.locationId;
  })[0];

  let newValues = {
    ADM0_EN: location.properties.ADM0_EN,
    ADM0_PCODE: location.properties.ADM0_PCODE,
    ADM1_EN: location.properties.ADM1_EN,
    ADM1_PCODE: location.properties.ADM1_PCODE,
    ADM2_EN:
      typeof location.properties.ADM2_EN != "undefined"
        ? location.properties.ADM2_EN
        : "",
    ADM2_PCODE:
      typeof location.properties.ADM2_PCODE != "undefined"
        ? location.properties.ADM2_PCODE
        : "",
    ADM3_EN: "",
    ADM3_PCODE: "",
    status: true,
    documentId: model.value.id,
    locationTypeId: model.value.locationTypeId,
  };

  create(newValues);
  open.value = false;
  actions.resetForm();
});

const getDistricts = async () => {
  isLoading.value = true;
  adminBoundaryStore
    .getAllAdmin2()
    .then((result) => {
      locations.length = 0;
      locations.push(...result);
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

const getRegions = async () => {
  isLoading.value = true;
  adminBoundaryStore
    .getAllAdmin1()
    .then((result) => {
      locations.length = 0;
      locations.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get regions error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDocumentLocations = async () => {
  isLoading.value = true;
  model.value.id;
  documentLocationStore
    .get()
    .then((result) => {
      // documentLocations.length = 0;


   

      documentLocations.push(
        ...result.filter((item) => item.documentId == model.value.id)
      );

    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get locations error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const create = async (data) => {
  isLoading.value = true;
  documentLocationStore
    .create(data)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added location to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to add location  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentLocations();
      emit("refresh", {});
    });
};

const remove = async (id) => {
  isLoading.value = true;
  documentLocationStore
    .remove(id)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added location to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove location  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentLocations();
      emit("refresh", {});
    });
};
</script>
