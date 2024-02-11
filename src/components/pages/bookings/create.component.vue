<template>
  <div>
    <button
      type="button"
      class="inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      new document
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed z-10 inset-0 overflow-y-auto"
        @close="open = false"
        static
      >
        <div
          class="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style="font-size: 0"
        >
          <TransitionChild
            class=" "
            v-if="open"
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block"
            />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span
            class="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div
              class="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl"
            >
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white"
              >
                <h5
                  class="text-md font-medium leading-normal text-gray-800"
                  id="formModalLabel"
                >
                  Create Document
                </h5>
                <button
                  type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"
                ></button>
              </div>
              <form
                @submit="onSubmit"
                :validation-schema="CreateDocumentSchema"
              >
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-6">
                      <label
                        for="name"
                        class="block text-sm font-medium text-gray-700"
                        >Name</label
                      >
                      <input
                        type="text"
                        name="name"
                        id="name"
                        v-model="name"
                        autocomplete="document-name"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ nameError }}
                      </p>
                    </div>
                    <div class="col-span-6 sm:col-span-6">
                      <label
                        for="description"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div class="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          v-model="description"
                          rows="3"
                          class="shadow-sm focus:ring-gray-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder=""
                        />
                      </div>
                      <p class="mt-2 text-sm text-gray-500">
                        Brief description of the document.
                      </p>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ descriptionError }}
                      </p>
                    </div>
                    <div
                      class="col-span-6 sm:col-span-6 grid grid-cols-3 gap-6"
                    >
                      <div class="col-span-3 sm:col-span-6">
                        <label
                          for="reference"
                          class="block text-sm font-medium text-gray-700"
                        >
                          Reference
                        </label>
                        <div class="mt-1 flex rounded-md shadow-sm">
                          <span
                            class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                          >
                            www
                          </span>
                          <input
                            type="text"
                            name="reference"
                            id="reference"
                            v-model="reference"
                            class="focus:ring-gray-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="https://example.com"
                          />
                          <p class="text-red-500 text-xs italic pt-1">
                            {{ referenceError }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-span-6 sm:col-span-6"
                      v-if="user.roleId == 'ADMIN2'"
                    >
                      <label
                        for="description"
                        class="block text-sm font-large text-gray-700"
                      >
                        <span
                          >District : <b>{{ user.admin2Id }}</b></span
                        >
                      </label>
                    </div>

                    <!--          <div
                      class="col-span-12 sm:col-span-6 grid grid-cols-3 gap-6"
                      v-if="user.roleId == 'ADMIN1'"
                    >
                      <div class="col-span-6 sm:col-span-3">
                        <label
                          for="location_type"
                          class="block text-sm font-medium text-gray-700"
                        >
                          Document Location Type</label
                        >
                        <select
                          id="locationTypeId"
                          name="locationTypeId"
                          v-model="locationTypeId"
                          autocomplete="locationTypeId"
                          class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option
                            v-for="type in locationTypes"
                            :key="type.name"
                            :value="type.name"
                            class="uppercase"
                          >
                            {{ type.name }}
                          </option>
                        </select>
                        <p class="text-red-500 text-xs italic pt-1">
                          {{ locationTypeError }}
                        </p>
                      </div>
                    <div
                        class="col-span-6 sm:col-span-3"
                        v-if="locationTypeId == 'District'"
                      >
                        <label
                          for="location"
                          class="block text-sm font-medium text-gray-700"
                        >
                          Location</label
                        >
                        <select
                          id="location"
                          name="location"
                          v-model="location"
                          autocomplete="location"
                          class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option
                            v-for="item in districts"
                            :key="item.properties.ADM2_EN"
                            :value="item.properties.ADM2_EN"
                            class="uppercase"
                          >
                            {{ item.properties.ADM2_EN }}
                          </option>
                        </select>
                        <p class="text-red-500 text-xs italic pt-1">
                          {{ locationError }}
                        </p>
                      </div
                    </div>
 -->

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="documentType"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Document Type</label
                      >
                      <select
                        id="documentType"
                        name="documentType"
                        v-model="documentTypeId"
                        autocomplete="documentType"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option
                          v-for="documentType in documentTypes"
                          :key="documentType.id"
                          :value="documentType.id"
                          class="uppercase"
                        >
                          {{ documentType.name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ documentTypeIdError }}
                      </p>
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="documentType"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Document Sub Type</label
                      >
                      <select
                        :disabled="filteredDocumentSubTypes.length == 0"
                        id="documentSubType"
                        name="documentSubType"
                        v-model="documentSubTypeId"
                        autocomplete="documentType"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option
                          v-for="documentSubType in filteredDocumentSubTypes"
                          :key="documentSubType.id"
                          :value="documentSubType.id"
                          class="uppercase"
                        >
                          {{ documentSubType.name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ documentSubTypeIdError }}
                      </p>
                    </div>


                    <div class="col-span-8 sm:col-span-4">
                    
                     <div class="flex my-3 ml-0">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    v-model="featured"
                    type="checkbox"
                    style="color:#14b8a6"
                    class="
                      h-4
                      w-4
                      focus:ring-gray-500
                      border-gray-300
                      rounded
                    "
                  />
                  <label
                    for="isFeatured"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Featured Document
                  </label>
                </div>

                      <label
                        for="publication-date"
                        class="block text-sm font-medium text-gray-700"
                        >Publication date</label
                      >

                      <input
                        type="date"
                        name="publication-date"
                        id="publication-date"
                        v-model="publicationDate"
                        autocomplete="publication-date"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateDocumentSchema } from "../../../services/schema/document.schema";
import { useDocumentTypeStore } from "../../../stores/document-type.store";
import { useDocumentSubTypeStore } from "../../../stores/document-subtype.store";
import { useClusterStore } from "../../../stores/cluster.store";
import { usePartnerStore } from "../../../stores/partner.store";
import { useLocationTypeStore } from "../../../stores/location-type.store";
import { useThemeStore } from "../../../stores/theme.store";
import { useDisasterStore } from "../../../stores/disaster.store";

import { useAdminBoundaryStore } from "../../../stores/admin-boundary.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(false);

const isFeatured = ref(false);
const showModal = ref(false);
const documentTypeStore = useDocumentTypeStore();
const documentSubTypeStore = useDocumentSubTypeStore();
const clusterStore = useClusterStore();
const partnerStore = usePartnerStore();
const locationTypeStore = useLocationTypeStore();
const themeStore = useThemeStore();
const disasterStore = useDisasterStore();

const boundaryStore = useAdminBoundaryStore();

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

//VALUES
const documentTypes = reactive([]);
const documentSubTypes = reactive([]);
const filteredDocumentSubTypes = reactive([]);
const clusters = reactive([]);
const partners = reactive([]);
const locationTypes = reactive([]);
const themes = reactive([]);
const disasters = reactive([]);
const districts = reactive([]);
//FORM
const { meta } = useForm({
  validationSchema: CreateDocumentSchema,
  initialValues: {
    name: "",
    description: "",
    reference: "",
    publicationDate: moment().format(moment.HTML5_FMT.DATE),
    status: false,
    featured: false,
    documentTypeId: "",
    location: "",
    documentSubTypeId: "",
  },
});
///FIELDS
const { value: name, errorMessage: nameError } = useField("name");
const { value: description, errorMessage: descriptionError } =
  useField("description");
const { value: reference, errorMessage: referenceError } =
  useField("reference");
const { value: publicationDate, errorMessage: publicationDateError } =
  useField("publicationDate");
const { value: status, errorMessage: statusError } = useField("status");

const { value: locationTypeId, errorMessage: locationTypeError } =
  useField("locationTypeId");

const { value: location, errorMessage: locationError } = useField("location");
const { value: documentTypeId, errorMessage: documentTypeIdError } =
  useField("documentTypeId");
const { value: documentSubTypeId, errorMessage: documentSubTypeIdError } =
  useField("documentSubTypeId");

  
const { value: featured, errorMessage: featuredIdError } =
  useField("isFeatured");
//MOUNTED
onMounted(() => {
  getDocumentTypes();
  getDocumentSubTypes();
  getCluster();
  getPartner();
  getLocationTypes();
  getThemes();
  getDisasters();
  getDistricts();
});
//WATCH
watch(documentTypeId, (newValue, oldValue) => {
  filteredDocumentSubTypes.length = 0; //empty array
  filteredDocumentSubTypes.push(
    ...documentSubTypes.filter((item) => {
      return item.documentTypeId == newValue;
    })
  );
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {


      if (user.value.roleId == "ADMIN1") {
    location.value =
      location.value == undefined ? (location.value = "") : location.value;

      
    featured.value =
      featured.value == undefined ? (featured.value = false) : featured.value;

    let model = {
      name: name.value,
      description: description.value,
      reference: reference.value,
      publicationDate: moment(publicationDate.value),
      status: status.value,
      featured: featured.value,
      documentSubTypeId: documentSubTypeId.value,
      locationTypeId: locationTypeId.value,
      location: location.value,
    };
    emit("create", model);
    open.value = false;
    actions.resetForm();
  } else if (user.value.roleId == "ADMIN2") {
    location.value = user.value.admin2Id;
      featured.value =
      featured.value == undefined ? (featured.value = false) : featured.value;

    locationTypeId.value = "DISTRICT";

    let model = {
      name: name.value,
      description: description.value,
      reference: reference.value,
      publicationDate: moment(publicationDate.value),
      status: status.value, 
      featured: featured.value,
      documentSubTypeId: documentSubTypeId.value,
      locationTypeId: locationTypeId.value,
      location: location.value,
    };
    emit("create", model);
    open.value = false;
    actions.resetForm();
  }
});

const getDocumentTypes = async () => {
  isLoading.value = true;
  documentTypeStore
    .get()
    .then((result) => {
      documentTypes.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get document types error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDocumentSubTypes = async () => {
  isLoading.value = true;
  documentSubTypeStore
    .get()
    .then((result) => {
      documentSubTypes.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get document subtypes error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getCluster = async () => {
  isLoading.value = true;
  clusterStore
    .get()
    .then((result) => {
      clusters.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get clusters error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getPartner = async () => {
  isLoading.value = true;
  partnerStore
    .get()
    .then((result) => {
      partners.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get partners error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getLocationTypes = async () => {
  isLoading.value = true;
  locationTypeStore
    .get()
    .then((result) => {
      locationTypes.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get location types error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getThemes = async () => {
  isLoading.value = true;
  themeStore
    .get()
    .then((result) => {
      themes.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get themes error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDisasters = async () => {
  isLoading.value = true;
  disasterStore
    .get()
    .then((result) => {
      disasters.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get disasters error (" + error + ")",
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
  boundaryStore
    .getAllAdmin2()
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
</script>
