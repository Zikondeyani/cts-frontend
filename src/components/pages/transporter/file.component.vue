<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Image</h3>
          <p class="mt-1 text-sm text-gray-500">Your Profile Photo</p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3">
            <table class="min-w-full">
              <tbody>
                <tr
                  v-for="(file, index) in files"
                  :key="file.id"
                  class="border-b"
                >
                  <td
                    class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    <div class="w-64 h-64 rounded-full overflow-hidden">
                      <img
                        :src="system.api + '/files/download/' + file.url"
                        class="w-full h-full object-cover"
                        alt="Image"
                      />
                    </div>
                  </td>

                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      @click="
                        downloadFromUrl(
                          system.api + '/files/download/' + file.url,
                          file.url.substring(file.url.indexOf('.') + 1),
                          file.name +
                            '-' +
                            moment(file.metadata.publicationDate).format(
                              'DD/MM/YYYY'
                            )
                        )
                      "
                      target="_blank"
                      class="text-gray-500 hover:text-green-900 text-xs p-1"
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      @click="remove(file.id)"
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
              v-if="files.length < 1"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Add Picture
            </button>
          </div>
          <div v-show="open">
            <form
              @submit="onSubmit"
              enctype="multipart/form-data"
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
                            File</label
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
                          <input
                            type="file"
                            @change="handleFileUpload($event)"
                            accept="image/*"
                            class="mt-1 p-2 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white"
                          />

                          <p class="text-red-500 text-xs italic pt-1">
                            {{ attachmentError }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!--  <div class="col-span-6 sm:col-span-6">
                      <div class="col-span-6 sm:col-span-4">
                        <label
                          for="publication-datee"
                          class="block text-sm font-medium text-gray-700"
                          >Publication date</label
                        >

                        <input
                          type="date"
                          name="publication-date"
                          id="publication-date"
                          v-model="publicationDate"
                          autocomplete="publication-date"
                          class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <p class="text-red-500 text-xs italic pt-1">
                          {{ publicationDateError }}
                        </p>
                      </div>
                    </div> -->
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
import * as FileSaver from "file-saver";
//COMPONENTS
//SCHEMA AND STORES
import { useFileStore } from "../../../stores/file.store";

//DECLARATIONS
const system = reactive({
  api: process.env.VUE_APP_ROOT_API,
});
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
const fileStore = useFileStore();
const { model } = toRefs(props);
//VALUES
const files = reactive([]);
//FORM
const { meta } = useForm({
  initialValues: {
    attachment: null,
    publicationDate: moment(model.value.publicationDate).format(
      moment.HTML5_FMT.DATE
    ),
  },
});
///FIELDS
const { value: attachment, errorMessage: attachmentError } =
  useField("attachment");
const { value: publicationDate, errorMessage: publicationDateError } =
  useField("publicationDate");
//MOUNTED
onMounted(() => {
  //Methods
  getFiles();
});
//WATCH

//FUNCTIONS
const handleFileUpload = (e) => {
  if (typeof e.target.files[0] != "undefined") {
    attachment.value = e.target.files[0];
  }
};
const download = (dataUrl, ext, title) => {
  if (ext == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    FileSaver.saveAs(dataUrl, `${title}.xlsx`);
  } else if (
    ext == "vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    FileSaver.saveAs(dataUrl, `${title}.docx`);
  } else {
    FileSaver.saveAs(dataUrl, `${title}.${ext}`);
  }
};

const downloadFromUrl = (url, ext, title) => {
  fetch(url).then(function (t) {
    return t.blob().then((b) => {
      download(URL.createObjectURL(b), ext, title);
    });
  });
};

const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    attachment: values.attachment,
    referenceId: model.value.id,
    type: "DOCUMENT",
    name: model.value.name,
    metadata: {
      publicationDate: moment(model.value.publicationDate).format(
        moment.HTML5_FMT.DATE
      ),
    },
  };
  create(newValues);
  open.value = false;
  actions.resetForm();
});

const getFiles = async () => {
  isLoading.value = true;

  fileStore
    .getByReference({ id: model.value.id, type: "DOCUMENT" })
    .then((result) => {
      files.length = 0;
      files.push(...result);
    })
    .catch((error) => {
    /*   Swal.fire({
        title: "Failed",
        text: "failed to get files error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      }); */
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const create = async (data) => {
  isLoading.value = true;
  fileStore
    .upload(data)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added file to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to add file  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getFiles();
      emit("refresh", {});
    });
};

const remove = async (id) => {
  isLoading.value = true;
  fileStore
    .remove(id)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added file to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove file  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getFiles();
      emit("refresh", {});
    });
};
</script>
