<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Partners</h3>
          <p class="mt-1 text-sm text-gray-500"></p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
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
                  v-for="(documentPartner, index) in documentPartners"
                  :key="documentPartner.id"
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
                    <div>
                      {{ documentPartner.partner.name }} ({{
                        documentPartner.partner.name_short
                      }})
                    </div>
                    <div class="text-gray-800 text-xs italic ">
                      {{ documentPartner.partner.partnerType.label.default }}
                    </div>
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      @click="remove(documentPartner.id)"
                      class="text-gray-500 hover:text-green-900 text-xs p-1"
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
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Add
            </button>
          </div>
          <div v-show="open">
            <form
              @submit="onSubmit"
              :validation-schema="PartnerSchema"
              class="bg-gray-50"
            >
              <div class="overflow-hidden sm:rounded-md">
                <div class="px-4 py-5 sm:p-6">
                  <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6 sm:col-span-6">
                      <div class="grid grid-cols-6 gap-2">
                        <div class="col-span-5 sm:col-span-5"></div>
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
                        <div class="col-span-3 sm:col-span-3">
                          <label
                            for="documentType"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Partner type</label
                          >
                          <select
                            id="partnerType"
                            name="partnerType"
                            v-model="partnerTypeId"
                            autocomplete="partner-type-name"
                            class="form-multiselect mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          >
                            <option
                              v-for="type in partnersTypes"
                              :key="type.id"
                              :value="type.id"
                              class="uppercase"
                            >
                              {{ type.label.default }}
                            </option>
                          </select>
                          <p class="text-red-500 text-xs italic pt-1">
                            {{ partnerTypeIdError }}
                          </p>
                        </div>
                        <div class="col-span-6 sm:col-span-6">
                          <label
                            for="documentType"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Partner ({{filteredPartners.length}})</label
                          >
                          <select
                            :disabled="filteredPartners.length == 0"
                            id="partners"
                            name="partners"
                            rows="3"
                            v-model="partnerId"
                            autocomplete="partners-name"
                            class="form-multiselect mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          >
                            <option
                              v-for="partner in filteredPartners"
                              :key="partner.id"
                              :value="partner.id"
                              class="uppercase"
                            >
                              {{ partner.name }}
                            </option>
                          </select>
                          <p class="text-red-500 text-xs italic pt-1">
                            {{ partnerIdError }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
import { PartnerSchema } from "../../../services/schema/document.schema";
import { usePartnerTypeStore } from "../../../stores/partner-type.store";
import { usePartnerStore } from "../../../stores/partner.store";
import { useDocumentPartnerStore } from "../../../stores/document-partner.store";

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
const open = ref(false);
const isPwd = ref(true);
const partnerTypeStore = usePartnerTypeStore();
const partnerStore = usePartnerStore();
const documentPartnerStore = useDocumentPartnerStore();
const { model } = toRefs(props);
//VALUES
const partnersTypes = reactive([]);
const partners = reactive([]);
const filteredPartners = reactive([]);
const documentPartners = reactive([]);
//FORM
const { meta } = useForm({
  validationSchema: PartnerSchema,
});
///FIELDS
const { value: partnerTypeId, errorMessage: partnerTypeIdError } =
  useField("partnerTypeId");
const { value: partnerId, errorMessage: partnerIdError } =
  useField("partnerId");
//MOUNTED
onMounted(() => {
  //Methods
  getPartnerTypes();
  getPartners();
  getDocumentPartners();
});
//WATCH
watch(partnerTypeId, (newValue, oldValue) => {
  partnerId.value = "";
  filteredPartners.length = 0; //empty array
  filteredPartners.push(
    ...partners.filter((item) => {
      return item.partnerTypeId == newValue;
    })
  );
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    documentId: model.value.id,
    partnerId: partnerId.value,
  };
  create(newValues);
  open.value = false;
  actions.resetForm();
});

const getPartners = async () => {
  isLoading.value = true;
  partnerStore
    .get()
    .then((result) => {
      partners.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get partner types error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getPartnerTypes = async () => {
  isLoading.value = true;
  partnerTypeStore
    .get()
    .then((result) => {
      partnersTypes.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get partner types error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDocumentPartners = async () => {
  isLoading.value = true;
  documentPartnerStore
    .getByDocumentId(model.value.id)
    .then((result) => {
      documentPartners.length = 0;
      documentPartners.push(...result);
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

const create = async (data) => {
  isLoading.value = true;
  documentPartnerStore
    .create(data)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added partner to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to add partner  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentPartners();
      emit("refresh", {});
    });
};

const remove = async (id) => {
  isLoading.value = true;
  documentPartnerStore
    .remove(id)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added partner to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove partner  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentPartners();
      emit("refresh", {});
    });
};
</script>
