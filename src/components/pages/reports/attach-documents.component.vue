<template>
  <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-1 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Loading Plan Attachments</h3>
              <div class="mt-2">
                <input type="file" multiple @change="handleFileUpload" accept="application/pdf"
                  class="mt-1 p-2 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white" />
              </div>
              <div class="mt-4">
                <h4 class="text-md leading-6 font-medium text-gray-900"> Uploaded Files</h4>
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Download
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="file in files" :key="file.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div>
                            <div class="text-sm font-medium text-gray-900">
                              <a :href="file.url" target="_blank" class="text-blue-600 hover:underline">{{ file.name
                                }}</a>
                            </div>

                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button type="button" @click="
    downloadFromUrl(
      system.api + '/files/download/' + file.url,
      file.url.substring(file.url.indexOf('.') + 1),
      file.name +
      '-' +
      moment(file.metadata.publicationDate).format(
        'DD/MM/YYYY'
      )
    )
    " target="_blank" class="text-blue-600 hover:text-blue-900">
                          Download
                        </button>

                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button @click="deleteFile(file.id)" class="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="submit">Submit</button>
          <button type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="$emit('close')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, onMounted, reactive } from 'vue';
import { useFileStore } from "../../../stores/file.store";
import * as FileSaver from "file-saver";
const system = reactive({
  api: process.env.VUE_APP_ROOT_API,
});
const Swal = inject("Swal");
const moment = inject("moment");
const fileStore = useFileStore();
const props = defineProps({
  isOpen: Boolean,
  loadingPlan: Object
});

const emit = defineEmits(['close', 'submit']);

const files = ref([]);

const handleFileUpload = (e) => {

  if (typeof e.target.files[0] != "undefined") {
    files.value = e.target.files[0];
  }
};

/* const submit = () => {
  emit('submit', files.value);
  emit('close');
};
 */

const submit = () => {
  let newValues = {
    attachment: files.value,
    referenceId: props.loadingPlan.id,
    type: "LP-DOCUMENT",
    name: "DRAWDOWNMEMO-DODMA-" + props.loadingPlan.id,
    metadata: {
      publicationDate: moment(new Date()).format(
        moment.HTML5_FMT.DATE
      ),
    },
  };


  create(newValues);
  emit('close')
  props.isOpen = false;
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

const deleteFile = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      fileStore.remove(id)
        .then(() => {
          Swal.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
          getFiles();
        })
        .catch((error) => {
          Swal.fire({
            title: "Failed",
            text: `Failed to delete file (${error})`,
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    }
  });
};


const create = async (data) => {
  fileStore
    .upload(data)
    .then((result) => {

      Swal.fire({
        title: "Success",
        text: "Loading Plan Attachement Added!",
        icon: "success",
        confirmButtonText: "Ok",
      });


      emit('close')
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
      getFiles();
    });
};




const getFiles = async () => {
  fileStore.getByReference({ id: props.loadingPlan.id, type: "LP-DOCUMENT" })
    .then((result) => {
      files.value = result;
    })
    .catch((error) => {
      console.error("Failed to get files:", error);
    });
};

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.loadingPlan?.id) {
    getFiles();
  }
});
</script>
