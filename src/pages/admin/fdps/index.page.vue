<template>
  <main class="">
    <!-- spinner -->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            FDPs
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <label
            for="csv-upload"
            class="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm"
          >
            Upload CSV
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            @change="handleCsvUpload"
            class="hidden"
          />
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div v-show="uploadProgress !== null" class="mt-4">
        <label for="progress" class="text-sm font-medium text-white">Upload Progress</label>
        <progress
          id="progress"
          max="100"
          :value="uploadProgress"
          class="w-full mt-2 h-2 bg-gray-300 rounded-full"
        >
          {{ uploadProgress }}%
        </progress>
      </div>
      <!-- Table -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table
          :columns="columns"
          :rows="FDPs"
          :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import Papa from "papaparse"; // Ensure you have papaparse installed

//SCHEMA//AND//STORES
import { useFDPstore } from "../../../stores/fdps.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

//VARIABLES
const isLoading = ref(false);
const uploadProgress = ref(null); // Track the upload progress

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "FDPs", href: "#", current: true },
];
const FDPsStore = useFDPstore();
const FDPs = reactive([]);
const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Name",
    field: (row) => row.name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "District",
    field: (row) => row.district,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Coordinates",
    field: (row) => [row.lat, row.long].filter(Boolean).join(", "),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
]);
//MOUNTED
onMounted(() => {
  getFDPs();
});

const handleCsvUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data;
      const added = [];
      const skipped = [];

      for (const row of rows) {
        // Omit 'id' and skip rows without lat/long
        if (!row.lat || !row.long) {
          skipped.push(row);
          continue;
        }

        const { id, ...rowWithoutId } = row;

        // Check if the row already exists
        const match = FDPs.find(
          (f) =>
            f.name === rowWithoutId.name &&
            f.district === rowWithoutId.district &&
            f.type === rowWithoutId.type &&
            f.lat === rowWithoutId.lat &&
            f.long === rowWithoutId.long
        );

        if (match) {
          skipped.push(row);
        } else {
          await FDPsStore.create(rowWithoutId); // Send row without 'id' to backend
          added.push(row);
        }
      }

      await getFDPs();

      Swal.fire({
        title: "Upload Complete",
        html: `
          <p><strong>${added.length}</strong> FDPs added.</p>
          <p><strong>${skipped.length}</strong> skipped (already exist or missing lat/long).</p>
        `,
        icon: "success",
      });
    },
    progress: (progress) => {
      uploadProgress.value = progress.percent; // Update progress value
    },
    error: (error) => {
      Swal.fire("Upload Error", error.message, "error");
    },
  });
};



//FUNCTIONS
const getFDPs = async () => {
  isLoading.value = true;
  FDPsStore.get()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   FDPs.push(...result);
      // }
      FDPs.length = 0; //empty array
      FDPs.push(...result);

      FDPs.sort((a, b) => new Date(b.created) - new Date(a.created));
    })
    .catch((error) => {
      Swal.fire({
        title: "FDPs Retrieval Failed",
        text: "failed to get FDPs (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createFDP = async (model) => {
  isLoading.value = true;
  FDPsStore.create(model)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Created a new FDP successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create user (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getFDPs();
    });
};
</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
