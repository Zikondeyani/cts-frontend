<template>
  <div class="font-body">
    <button
      type="button"
      class="inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      new event
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed z-10 inset-0 overflow-y-auto"
        @close="open = false"
        static
      >
        <div
          class="font-body flex min-h-screen text-center md:block md:px-2 lg:px-4"
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
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl"
            >
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white"
              >
                <h5
                  class="text-md font-medium leading-normal text-gray-800"
                  id="formModalLabel"
                >
                  Create Event
                </h5>
                <button
                  type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"
                ></button>
              </div>
              <form @submit="onSubmit" :validation-schema="CreateListingSchema">
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

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="location"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Listing Type</label
                      >
                      <select
                        id="listingTypesId"
                        name="listingTypesId"
                        v-model="listingTypesId"
                        autocomplete="listingTypesId"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option
                          v-for="item in catalogueTypes"
                          :key="item.id"
                          :value="item.id"
                          class="uppercase"
                        >
                          {{ item.name }}
                        </option>
                      </select>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="documentType"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Listing Type Category</label
                      >
                      <select
                        :disabled="filteredListingTypesCategories.length == 0"
                        id="catalogueTypeCategory"
                        name="catalogueTypeCategory"
                        v-model="cataloguetypecategoryId"
                        autocomplete="catalogueTypeCategory"
                        class="mt-1 focus:ring-teal-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option
                          v-for="type in filteredListingTypesCategories"
                          :key="type.id"
                          :value="type.id"
                          class="uppercase"
                        >
                          {{ type.name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ cataloguetypecategoryIdIdError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-6">
                      <label
                        for="Price (MWK)"
                        class="block text-sm font-medium text-gray-700"
                        >Price</label
                      >
                      <input
                        type="number"
                        min="0"
                        name="price"
                        id="price"
                        v-model="price"
                        autocomplete="price"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
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
                          :key="item"
                          :value="item"
                          class="uppercase"
                        >
                          {{ item }}
                        </option>
                      </select>
                    </div>

                    <div class="col-span-6 sm:col-span-6">
                      <label
                        for="location_details"
                        class="block text-sm font-medium text-gray-700"
                        >Short Description</label
                      >
                      <input
                        type="text"
                        name="location_details"
                        id="location_details"
                        v-model="location_details"
                        autocomplete="location_details"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
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
                        Brief description of the catalogue.
                      </p>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ descriptionError }}
                      </p>
                    </div>

                    <div class="sm:col-span-3">
                      <div class="mt-2">
                        <span
                          class="flex select-none items-center pb-1 text-gray-500 sm:text-sm"
                          >Date of Event</span
                        >
                        <div
                          class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-600 sm:max-w-md"
                        >
                          <input
                            type="date"
                            name="occuringWhen"
                            v-model="occuringWhen"
                            id="date"
                            autocomplete="occuringWhen"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Event Date"
                          />
                        </div>
                      </div>
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
import { CreateListingSchema } from "../../../services/schema/catalogue.schema";

import { useListingTypeStore } from "../../../stores/catalogue-type.store";

import { useListingTypeCategoryStore } from "../../../stores/catalogue-type-category.store";
import { useListingStore } from "../../../stores/catalogue.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(false);

const isVailable = ref(false);
const showModal = ref(false);

const sessionStore = useSessionStore();

const catalogueTypeStore = useListingTypeStore();
const catalogueTypeCategoryStore = useListingTypeCategoryStore();

const catalogueStore = useListingStore();

const user = ref(sessionStore.getUser);

const catalogueTypes = reactive([]);

const catalogueTypesCategory = reactive([]);

const filteredListingTypesCategories = reactive([]);
const catalogue = reactive([]);

///FIELDS
const { value: name, errorMessage: nameError } = useField("name");

const { value: location, errorMessage: locationError } = useField("location");

const { value: location_details, errorMessage: location_detailsError } =
  useField("location_details");
const { value: description, errorMessage: descriptionError } =
  useField("description");

const { value: price, errorMessage: priceDateError } = useField("price");
const { value: status, errorMessage: statusError } = useField("status");

const { value: occuringWhen, errorMessage: occuringWhenError } = useField("occuringWhen");
const { value: is_event, errorMessage: eventError } = useField("is_event");
const { value: listingTypesId, errorMessage: listingTypesIdError } =
  useField("listingTypesId");
const {
  value: cataloguetypecategoryId,
  errorMessage: cataloguetypecategoryIdIdError,
} = useField("cataloguetypecategoryId");

const Swal = inject("Swal");
const districts = [
  "Chitipa",
  "Karonga",
  "Likoma",
  "Mzimba",
  "Nkhata Bay",
  "Rumphi",
  "Dedza",
  "Dowa",
  "Kasungu",
  "Lilongwe",
  "Salima",
  "Mchinji",
  "Nkhotakota",
  "Ntcheu",
  "Ntchisi",
  "Balaka",
  "Blantyre",
  "Chikwawa",
  "Chiradzulu",
  "Machinga",
  "Mangochi",
  "Mulanje",
  "Mwanza",
  "Neno",
  "Nsanje",
  "Phalombe",
  "Thyolo",
  "Zomba",
];

//MOUNTED
onMounted(() => {
  getCatalogue();
  getListingTypes();
  getListingTypesCategory();
});
//WATCH

watch(listingTypesId, (newValue, oldValue) => {
  filteredListingTypesCategories.length = 0; //empty array
  filteredListingTypesCategories.push(
    ...catalogueTypesCategory.filter((item) => {
      return item.listingTypesId == newValue;
    })
  );
});

const { meta } = useForm({
  initialValues: {
    name: "",
    description: "",
    location: "",
    location_details: "",
    price: "",
    status: true,
    occuringWhen: "",
    is_event: true,
  },
});

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  status.value =
    status.value == undefined ? (status.value = false) : status.value;

  is_event.value =
    is_event.value == undefined ? (is_event.value = false) : is_event.value;

  let model = {
    name: name.value,
    is_event: is_event.value,
    userId: user.value.id,
    description: description.value,
    location_details: location_details.value,
    
    occuringWhen: occuringWhen.value,
    location: location.value,
    status: status.value,
    listingTypesId: listingTypesId.value,
    cataloguetypecategoryId: cataloguetypecategoryId.value,
    price: price.value,
  };
  emit("create", model);
  open.value = false;
  actions.resetForm();
});

const getCatalogue = async () => {
  isLoading.value = true;
  catalogueStore
    .get()
    .then((result) => {
      catalogue.push(...result);
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

const getListingTypes = async () => {
  isLoading.value = true;
  catalogueTypeStore
    .get()
    .then((result) => {
      catalogueTypes.push(...result);
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

const getListingTypesCategory = async () => {
  isLoading.value = true;
  catalogueTypeCategoryStore
    .get()
    .then((result) => {
      catalogueTypesCategory.push(...result);
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
</script>
