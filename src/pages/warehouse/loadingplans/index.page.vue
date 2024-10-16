<template>
  <main>
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Stock In Transit
          </h2>
        </div>

        <!-- Export Data Button -->
        <button type="button"
          class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
          @click="generateExcel()">
          <i class="fas fa-file-export mr-2"></i> <!-- Icon (Font Awesome used as an example) -->
          Export Data
        </button>
      </div>

      <!-- Table -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-lg bg-white rounded-table">
        <vue-good-table :columns="columns" :rows="loadingplans" :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }" theme="polar-bear" styleClass="vgt-table striped" compactMode>
          <template #table-actions></template>
          <template #table-row="props">
            <div v-if="props.column.label === 'Options'" class="flex space-x-2">
              <template v-if="props.row.totalQuantity > 0">
                <div class="mt-5 flex ml-4 justify-center sm:mt-0">

                  <create-report-form
                    v-on:create="(reportData) => createReport(reportData, props.row.warehouseId, props.row.atcNumber)" />
                </div>

                <button type="button" @click="openRecentDispatches(props.row.atcNumber, props.row.warehouseId)"
                  class="font-heading inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 font-semibold text-xs rounded-md shadow-sm hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                  <EyeIcon class="h-5 w-5 mr-2" />
                  Recent Loadingplans
                </button>
              </template>
            </div>
          </template>

        </vue-good-table>

        <template v-if="isRecentLoadingPlansOpen">
          <div id="content">
            <div class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
              <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-5">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Recent LoadingPlans</h3>
                </div>

                <div class="overflow-auto max-h-96">
                  <table class="min-w-full table-auto border-collapse">
                    <thead>
                      <tr class="bg-blue-100">
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ATC #</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Handled By</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Qty (MT)</th>
                        <!-- New column for isClosed status -->
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="loadingplan in recentLoadingplans" :key="loadingplan.id">
                        <td class="px-4 py-2 text-sm text-gray-900">{{ loadingplan.ATCNumber }}</td>
                        <td class="px-4 py-2 text-sm text-gray-900">{{ loadingplan.HandledBy }}</td>
                        <td class="px-4 py-2 text-sm text-gray-900">{{ loadingplan.Quantity }} MT</td>

                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="flex justify-end mt-4">
                  <button @click="printPDF" id="printButton" v-if="recentLoadingplans.length > 0"
                    class="mr-3 bg-green-500 text-white px-4 py-2 rounded-md no-print">Print</button>
                  <button type="button" id="closeButton"
                    class="no-print px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    @click="closeRecentDispatches">Close</button>
                </div>
              </div>
            </div>
          </div>
        </template>




      </div>
    </div>
  </main>
</template>
<script setup>
// import the styles
import { ref, reactive, onMounted, inject } from "vue";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import * as XLSX from 'xlsx';
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import createReportForm from "../../../components/pages/reports/create.component-warehouse.vue";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon, TrashIcon, TruckIcon,
  EyeIcon
} from "@heroicons/vue/solid";

const moment = inject("moment");

const Swal = inject("Swal");
// Define your reactive variables and methods
const isLoading = ref(false);
const loadingplans = reactive([]);

import { useSessionStore } from "../../../stores/session.store";

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
// Define breadcrumbs for navigation
const breadcrumbs = [
  { name: "Home", href: "/warehouse/dashboard", current: false },
  { name: "Stock In Transit", href: "#", current: true },
];

// Load the data from the store
const loadingPlanStore = useloadingplanstore();

// Table columns definition
const columns = ref([
  {
    label: "ATC Number",
    field: "atcNumber",
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


  {
    label: "Total Quantity (MT)",
    field: "totalQuantity",
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Options",
    field: "options",
    sortable: false
  }
]);

// Fetch loading plans from store
onMounted(() => {
  getLoadingplans();
});

// Function to fetch loading plans
const getLoadingplans = async () => {
  isLoading.value = true;
  try {
    await loadingPlanStore.getWarehouseLoad();
    const result = await loadingPlanStore.getLoadings();
    loadingplans.length = 0;
    loadingplans.push(...result);
  } catch (error) {
    console.error("Failed to fetch loading plans:", error);
  } finally {
    isLoading.value = false;
  }
};


const isRecentLoadingPlansOpen = ref(false);
const recentLoadingplans = ref([]);

// Methods to Open/Close the Modal
const openRecentDispatches = async (id, atc) => {
  isRecentLoadingPlansOpen.value = true;
  await fetchRecentDispatches(id, atc);
};

const closeRecentDispatches = () => {
  isRecentLoadingPlansOpen.value = false;
};

// Fetch Recent Dispatches
const fetchRecentDispatches = async (id, warehouseId) => {
  try {
    const result = await loadingPlanStore.get();

    // Assign data to recentLoadingplans, including the atc parameter
    recentLoadingplans.value = result.filter(item => item.ATCNumber == id && item.warehouseId == warehouseId && item.IsDivertedLoad == true )

  } catch (error) {
    console.error('Failed to fetch recent dispatches:', error);
  }
};



const createReport = async (reportData, warehouseId, atcNumber) => {
  try {
    isLoading.value = true;

    // Find the selected loading plan by ATC number and warehouse ID
    const selectedLoadingPlan = loadingplans.find(
      (plan) => plan.atcNumber === atcNumber && plan.warehouseId === warehouseId
    );

    if (!selectedLoadingPlan) {
      Swal.fire({
        title: 'Error!',
        text: 'Selected loading plan not found!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      isLoading.value = false;
      return;
    }

    // Check if the entered quantity exceeds the available total quantity
    if (reportData.Quantity > selectedLoadingPlan.totalQuantity) {
      Swal.fire({
        title: 'Error!',
        text: `The entered quantity (${reportData.Quantity} MT) exceeds the available total quantity (${selectedLoadingPlan.totalQuantity} MT).`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      isLoading.value = false;
      return;
    }

    const data = {
      ...reportData,
      userId: user.value.id,
      IsApproved: true,
      IsDivertedLoad: true,
      Balance: reportData.Quantity, // Set Quantity to Balance if offline
      warehouseId: parseInt(warehouseId),   // Include the warehouseId
      ATCNumber: atcNumber      // Include the ATC number
    };

    await loadingPlanStore.createWarehouseLoad(data); // Save directly to server

    await getLoadingplans(); // Refresh loading plans after creating report

    // Show success alert
    Swal.fire({
      title: 'Success!',
      text: 'Report created successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });

  } catch (error) {
    console.error("Error creating report:", error);
    // Show an error alert
    Swal.fire({
      title: 'Error!',
      text: 'There was an issue creating the report.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  } finally {
    isLoading.value = false;
  }
};


// Export data as Excel
const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "Loading Plans Summary";

  const flattenedData = loadingplans.map(plan => ({
    "ATC Number": plan.atcNumber,
    "Warehouse ID": plan.warehouseId,
    "Total Dispatches": plan.totalDispatches,
    "Total Quantity": plan.totalQuantity
  }));

  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, "LoadingPlansSummary.xlsx");
};
</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}

.from-color {
  color: #096eb4;
  /* or any color you prefer */
}

.to-color {
  color: green;
  /* or any color you prefer */
}

.by-color {
  color: gray;
  /* or any color you prefer */
}
</style>