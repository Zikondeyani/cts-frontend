<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Themes</h3>
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
                  v-for="(documentTheme, index) in documentThemes"
                  :key="documentTheme.id"
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
                    {{ documentTheme.theme.name }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      @click="remove(documentTheme.id)"
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
              :validation-schema="ThemeSchema"
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
                            Theme</label
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
                            id="themes"
                            name="themes"
                            v-model="themeId"
                            autocomplete="themes-name"
                            class="form-multiselect mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          >
                            <option
                              v-for="theme in themes"
                              :key="theme.id"
                              :value="theme.id"
                              class="uppercase"
                            >
                              {{ theme.name }}
                            </option>
                          </select>
                          <p class="text-red-500 text-xs italic pt-1">
                            {{ themeIdError }}
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
import { ThemeSchema } from "../../../services/schema/document.schema";
import { useThemeStore } from "../../../stores/theme.store";
import { useDocumentThemeStore } from "../../../stores/document-theme.store";

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
const themeStore = useThemeStore();
const documentThemeStore = useDocumentThemeStore();
const { model } = toRefs(props);
//VALUES
const themes = reactive([]);
const documentThemes = reactive([]);
//FORM
const { meta } = useForm({
  validationSchema: ThemeSchema,
});
///FIELDS
const { value: themeId, errorMessage: themeIdError } = useField("themeId");
//MOUNTED
onMounted(() => {
  //Methods
  getThemes();
  getDocumentThemes();
});
//WATCH

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    documentId: model.value.id,
    themeId: themeId.value,
  };
  create(newValues);
  open.value = false;
  actions.resetForm();
});

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

const getDocumentThemes = async () => {
  isLoading.value = true;
  documentThemeStore
    .getByDocumentId(model.value.id)
    .then((result) => {
      documentThemes.length = 0;
      documentThemes.push(...result);
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

const create = async (data) => {
  isLoading.value = true;
  documentThemeStore
    .create(data)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added theme to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });

    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to add theme  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentThemes();      
      emit("refresh", {});
    });
};

const remove = async (id) => {
  isLoading.value = true;
  documentThemeStore
    .remove(id)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added theme to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove theme  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getDocumentThemes();
      emit("refresh", {});
    });
};
</script>
