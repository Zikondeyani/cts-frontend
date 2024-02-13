<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            visibility
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Document Visibility status i.e published state is publicly visible
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form
            class=""
            @submit="onSubmit"
            :validation-schema="UpdateDocumentSchema"
          >
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="status"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      :disabled="
                        model.files == undefined ||
                        model.partners == undefined ||
                        model.clusters == undefined ||
                        model.themes == undefined
                      "
                      id="status"
                      name="status"
                      v-model="status"
                      autocomplete="status-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option :value="true">Published</option>
                      <option :value="false">Draft</option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ statusError }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
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
import { UpdateDocumentSchema } from "../../../services/schema/document.schema";
import { useDocumentTypeStore } from "../../../stores/document-type.store";
import { useDocumentSubTypeStore } from "../../../stores/document-subtype.store";
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
const showModal = ref(false);
const documentTypeStore = useDocumentTypeStore();
const documentSubTypeStore = useDocumentSubTypeStore();
const roles = reactive([]);
const { model } = toRefs(props);
//VALUES
const documentTypes = reactive([]);
const documentSubTypes = reactive([]);
const filteredDocumentSubTypes = reactive([]);
//FORM
const { meta } = useForm({
  validationSchema: UpdateDocumentSchema,
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
const { value: documentTypeId, errorMessage: documentTypeIdError } =
  useField("documentTypeId");
const { value: documentSubTypeId, errorMessage: documentSubTypeIdError } =
  useField("documentSubTypeId");
//MOUNTED
onMounted(() => {
  //Assign
  name.value = model.value.name;
  description.value = model.value.description;
  reference.value = model.value.reference;
  publicationDate.value = moment(model.value.publicationDate).format(moment.HTML5_FMT.DATE);
  status.value = model.value.status;
  documentTypeId.value = model.value.documentSubType.documentTypeId;
  documentSubTypeId.value = model.value.documentSubTypeId;
  filteredDocumentSubTypes.push(
    ...documentSubTypes.filter((item) => {
      return item.documentTypeId == documentTypeId.value;
    })
  );
  //Methods
  getDocumentTypes();
  getDocumentSubTypes();
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
  let newValues = {
    id: model.value.id,
    name: name.value,
    description: description.value,
    reference: reference.value,
    publicationDate: moment(model.value.publicationDate),
    status: status.value,
    documentSubTypeId: documentSubTypeId.value,
    updated: moment(),
  };
  emit("update", newValues);
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
      filteredDocumentSubTypes.push(
        ...documentSubTypes.filter((item) => {
          return item.documentTypeId == documentTypeId.value;
        })
      );
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
</script>
