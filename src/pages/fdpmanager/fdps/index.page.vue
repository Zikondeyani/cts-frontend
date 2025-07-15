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

          <button
            @click="exportToExcel"
            class="bg-gray-500 text-white px-4 py-2 ml-3 rounded text-sm hover:bg-gray-600"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-show="uploadProgress !== null" class="mt-4">
        <label for="progress" class="text-sm font-medium text-white"
          >Upload Progress: {{ uploadProgress }}%
        </label>

        <div class="w-full bg-gray-300 rounded-full h-3 mt-2 overflow-hidden">
          <div
            class="bg-green-500 h-3 transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table"
      >
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
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link
                :to="{ path: '/fdpmanager/fdps/manage/' + props.row.id }"
              >
                <a
                  href="#"
                  class="text-blue-500 text-sm hover:text-gray-600 transition duration-300"
                >
                  Manage
                </a>
              </router-link>
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles
import * as XLSX from "xlsx";

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
    field: (row) => row.location_name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "District",
    field: (row) => row.admin_level_2,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Coordinates",
    field: (row) => [row.latitude, row.longitude].filter(Boolean).join(", "),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Options",
    field: (row) => row,
    sortable: false,
  },
]);
//MOUNTED
onMounted(() => {
  getFDPs();
});

const exportToExcel = () => {
  if (!FDPs.length) {
    Swal.fire("No data", "There are no FDPs to export.", "info");
    return;
  }

  // Convert full FDP objects directly
  const worksheet = XLSX.utils.json_to_sheet(FDPs);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "FDPs");

  XLSX.writeFile(workbook, "FDPs_DATA.xlsx");
};

const handleCsvUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadProgress.value = 0;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data;
      const added = [];
      const skipped = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        if (!row.latitude || !row.longitude) {
          skipped.push(row);
          continue;
        }

        const { id, ...rowWithoutId } = row;
        const match = FDPs.find(
          (f) =>
            f.location_name === rowWithoutId.location_name &&
            f.latitude === rowWithoutId.latitude &&
            f.longitude === rowWithoutId.longitude
        );

        if (match) {
          skipped.push(row);
        } else {
          await FDPsStore.create(rowWithoutId);
          added.push(row);
        }

        // Update progress manually
        uploadProgress.value = Math.round(((i + 1) / rows.length) * 100);
      }

      await getFDPs();

      Swal.fire({
        title: "Upload Complete",
        html: `
          <p><strong>${added.length}</strong> FDPs added.</p>
          <p><strong>${skipped.length}</strong> skipped (already exist or missing latitude/longitude).</p>
        `,
        icon: "success",
      });

      // Close progress after short delay
      setTimeout(() => {
        uploadProgress.value = null;
      }, 1000);
    },
    error: (error) => {
      Swal.fire("Upload Error", error.message, "error");
      uploadProgress.value = null;
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

      console.log("FDPs", FDPs);
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
