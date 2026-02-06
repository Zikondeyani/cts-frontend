<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Loading Plans
          </h2>
        </div>

        <!-- Export Data Button -->
        <button type="button"
          class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
          @click="generateExcel()">
          <i class="fas fa-file-export mr-2"></i>
          <!-- Icon (Font Awesome used as an example) -->
          Export Data
        </button>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block w-full rounded-table mx-0 overflow-x-auto mt-3">
        <vue-good-table :columns="columns" :rows="loadingplans" :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }" theme="polar-bear" styleClass="vgt-table striped" compactMode>
          <!-- Custom Table Actions -->
          <template #table-actions>
            <!-- You can add custom actions here like export buttons, etc. -->
          </template>

          <!-- Custom Table Row Template -->
          <template #table-row="props">
            <div v-if="props.column.label === 'Options'" class="flex items-center space-x-3">
              <!-- Dispatch Button when balance is greater than 0 -->
              <template v-if="props.row.Balance > 0">
                <button type="button" @click="openDispatchDialog(props.row)"
                  class="font-heading inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 font-semibold text-xs rounded-md shadow-sm hover:bg-[#096eb4] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                  <TruckIcon class="h-5 w-5 mr-2" />
                  Dispatch
                </button>
              </template>

              <!-- Completed Badge when balance is 0 -->
              <template v-else>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </template>

              <!-- Show Recent Dispatches Button -->
              <button type="button" @click="openRecentDispatches(props.row.id, props.row.ATCNumber)"
                class="font-heading inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 font-semibold text-xs rounded-md shadow-sm hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                <EyeIcon class="h-5 w-5 mr-2" />
                Recent Dispatches
              </button>
            </div>
          </template>
        </vue-good-table>

        <!-- Recent Dispatches Modal -->



        <template v-if="isRecentDispatchesOpen">
          <div id="content">
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div class="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-6">

                <!-- Header -->
                <div class="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">
                    Recent Dispatches
                  </h3>

                  <button @click="isRecentDispatchesOpen = false"
                    class="text-gray-400 hover:text-gray-600 text-xl font-bold">
                    ✕
                  </button>
                </div>

                <!-- Search -->
                <div class="mb-4">
                  <input v-model="searchQuery" placeholder="Search delivery note, driver, ATC..."
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring focus:ring-blue-200 focus:outline-none" />
                </div>

                <!-- Table -->
                <div class="overflow-auto max-h-[400px] border rounded-lg">

                  <table class="min-w-full text-sm">

                    <!-- Header -->
                    <thead class="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Delivery Note</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">ATC</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Dispatcher</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Qty (MT)</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">FDP</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Created</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Driver</th>
                        <th class="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>

                    <!-- Body -->
                    <tbody class="divide-y">

                      <tr v-for="dispatch in filteredDispatches" :key="dispatch.id" class="hover:bg-gray-50">
                        <td class="px-4 py-2">{{ dispatch.DNote }}</td>
                        <td class="px-4 py-2">{{ dispatch.atc }}</td>
                        <td class="px-4 py-2">
                          {{
                            dispatch?.dispatcher?.username
                              ?.replace(/\./g, '')
                          ?.replace(/([a-z])([A-Z])/g, '$1 $2')
                          }}
                        </td>

                        <td class="px-4 py-2 font-medium">
                          {{ dispatch.Quantity }}
                        </td>
                        <td class="px-4 py-2">{{ dispatch.FinalDestinationPoint }}</td>
                        <td class="px-4 py-2">
                          {{ moment(dispatch.CreatedOn).format("MMM DD, YYYY") }}
                        </td>
                        <td class="px-4 py-2">
                          {{ dispatch.DriverName }} ({{ dispatch.TruckNumber }})
                        </td>

                        <!-- Status Badge -->
                        <td class="px-4 py-2 text-center">
                          <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="dispatch.received
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'">
                            {{ dispatch.received ? 'Received' : 'Pending' }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="filteredDispatches.length === 0">
                        <td colspan="8" class="text-center py-6 text-gray-400">
                          No matching records found
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                <!-- Footer -->
                <div class="flex justify-end mt-5">
                  <button @click="printPDF" v-if="filteredDispatches.length"
                    class="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md text-sm">
                    Print
                  </button>
                </div>

              </div>
            </div>
          </div>
        </template>

        <!-- Edit Loading Plan Dialog -->
        <EditLoadingPlanDialog :isOpen="isEditDialogOpen" :loadingPlan="selectedLoadingPlan" @close="closeEditDialog"
          v-on:update="reloadPage" />

        <DispatchLoadingPlanDialog :isOpen="isDispatchDialogOpen" :loadingPlan="selectedLoadingPlan"
          @close="closeDispatchDialog" v-on:update="reloadPage" />
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  EyeIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createListingForm from "../../../components/pages/catalogue/create.component.vue";
//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";

import createDispatchForm from "../../../components/pages/dispatch/create.component.vue";

import createReportForm from "../../../components/pages/reports/create.component.vue";

import EditLoadingPlanDialog from "../../../components/pages/reports/edit-loading-plan.component.vue";

import DispatchLoadingPlanDialog from "../../../components/pages/reports/create.dispatch-dispatcher.component.vue";
import eventBus from "../../../services/events/eventbus";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const searchQuery = ref("");

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Loading Plans", href: "#", current: true },
  {
    name: "Lean Season Response & Emergency Assistance",
    href: "#",
    current: true,
  },
];
import { usewarehousestore } from "../../../stores/warehouse.store";
const warehousesStore = usewarehousestore();

import { useloadingplanstore } from "../../../stores/loadingplans.store";

import * as XLSX from "xlsx";

const warehouses = reactive([]);
const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Commodity",
    field: (row) => row.commodity?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Details",
    field: (row) => {
      // Get the matching warehouse name for 'From' and 'To'
      const fromWarehouse = warehouses.find(
        (w) => w.id === row.moveFromWarehouseId
      );
      const toWarehouse = warehouses.find(
        (w) => w.id === row.moveToWarehouseId
      );
      const warehouseName = row.warehouse?.Name;

      // Build the "From" details
      let details = `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        From: ${fromWarehouse ? fromWarehouse.Name : warehouseName || "N/A"}
      </span><br>
    `;

      // Add "To" details only if isPrepositioned is true
      if (row.IsPrepositioned) {
        details += `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-blue-100 text-blue-800">
          To: ${toWarehouse ? toWarehouse.Name : "N/A"}
        </span><br>
      `;
      }

      // Add district and transporter details
      details += `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-blue-100 text-blue-800">
        District: ${row.district?.Name || "Unknown"}
      </span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-green-100 text-green-800">
        TP: ${row.transporter?.Name || "Unknown"}
      </span><br>
    `;

      // Add the ATC Number
      details += `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-gray-100 text-gray-800">
        ATC #: ${row.ATCNumber || "N/A"}
      </span>
    `;

      return details;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize",
  },

  {
    label: "Stocks",
    hidden: false,
    field: (row) =>
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-blue-100 text-blue-800">Qty: ${row.Quantity} MT</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-green-100 text-green-800">Bal: ${row.Balance?.toFixed(2) !== null
        ? row.Balance?.toFixed(2) + " MT"
        : "Pending"
      }</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize",
  },
  {
    label: "Options",
    field: (row) => row,
    sortable: false,
  },
]);

const isEditDialogOpen = ref(false);

const selectedLoadingPlan = ref(null);

const isRecentDispatchesOpen = ref(false);
const recentDispatches = ref([]);

// Methods to Open/Close the Modal
const openRecentDispatches = async (id, atc) => {
  isRecentDispatchesOpen.value = true;
  await fetchRecentDispatches(id, atc);
};

const closeRecentDispatches = () => {
  isRecentDispatchesOpen.value = false;
};

const getWarehouses = async () => {
  try {
    let data = [];

    /* if (isOnline.value) {
      data = await loadingPlanStore.get();
    } else {
      data = await getOfflineLoadingPlans();
    } */
    data = await warehousesStore.get();

    // Clear existing data and push new data
    warehouses.splice(0, warehouses.length, ...data.reverse());
  } catch (error) {
    console.error("Error fetching loading plans:", error);
  } finally {
    isLoading.value = false;
  }
};


const filteredDispatches = computed(() => {
  if (!searchQuery.value) return recentDispatches.value;

  const q = searchQuery?.value?.toLowerCase();

  return recentDispatches.value.filter(d =>
    [
      d?.DNote,
      d?.atc,
      d?.dispatcher?.username,
      d?.Quantity,
      d?.FinalDestinationPoint,
      moment(d?.CreatedOn).format("MMMM Do YYYY"),
      d?.DriverName,
      d?.TruckNumber,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
});

// Fetch Recent Dispatches
const fetchRecentDispatches = async (id, atc) => {
  try {
    const result = await loadingPlanStore.getloadingplansDispatchesById(id);

    // Assign data to recentDispatches, including the atc parameter
    recentDispatches.value = result.map((dispatch) => ({
      ...dispatch,
      atc, // Add the atc to each dispatch object
    }));
  } catch (error) {
    console.error("Failed to fetch recent dispatches:", error);
  }
};

// Function to open the edit dialog
const openEditDialog = (loadingPlan) => {
  selectedLoadingPlan.value = loadingPlan;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};

const isDispatchDialogOpen = ref(false);

// Function to open the edit dialog
const openDispatchDialog = (loadingPlan) => {
  selectedLoadingPlan.value = loadingPlan;
  isDispatchDialogOpen.value = true;
};

// Function to close the edit dialog
const closeDispatchDialog = () => {
  isDispatchDialogOpen.value = false;
};

//MOUNTED
onMounted(() => {
  getLoadingplans();
  getWarehouses();
  // getLatest()
});

//FUNCTIONS

const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getLoadingplans();

  // Navigate to the route after the data has been updated
  $router.push("/dispatcher/loadingplans");
};

const getLoadingplans = async () => {
  isLoading.value = true;

  try {
    const result = await loadingPlanStore.get(); // array of loading plans

    // Check if user district is national or null
    const isNationalOrNull =
      !user.value.district || user.value.district === "National";

    // Filter results
    const filteredLoadingPlans = result.filter((item) => {

      // ❗ Exclude activityId 0
      if (item.activityId === 0) return false;

      const isActivityOpen = item.activity?.IsClosed !== true;
      const isApproved = item.IsApproved === true;
      const isNotPartnerLoan = item.activity?.Name !== "Partner Commodity Loan";

      if (isNationalOrNull) {
        return isApproved && isActivityOpen && isNotPartnerLoan;
      } else {
        return (
          isApproved &&
          isActivityOpen &&
          isNotPartnerLoan &&
          item.district?.Name === user.value.district &&
          item.IsDivertedLoad === true
        );
      }
    });

    // Reset reactive array correctly
    loadingplans.length = 0;
    loadingplans.push(...filteredLoadingPlans.reverse());

    console.log("Filtered Loading Plans:", loadingplans);

    eventBus.emit("loadingplanArchived", filteredLoadingPlans);

  } catch (error) {
    console.error("Failed to fetch, filter, and sort loading plans:", error);
  } finally {
    isLoading.value = false;
  }
};



const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "Loading Plan";

  // Map over the array to flatten each object
  const flattenedData = loadingplans.reverse().map((plan) => ({
    id: plan.id,
    CreatedOn: plan.CreatedOn,
    UpdatedOn: plan.UpdatedOn,
    LoadingPlanNumber: plan.LoadingPlanNumber,
    Quantity: plan.Quantity,
    Balance: plan.Balance,
    StartDate: plan.StartDate,
    EndDate: plan.EndDate,

    "ATC #": plan.ATCNumber,
    Commodity: plan.commodity?.Name,
    From: plan.warehouse?.Name,
    "Transporter Name": plan.transporter?.Name,
    To: plan.district?.Name,
  }));

  // Create a worksheet from the flattened data array
  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, "LoadingPlans.xlsx");
};

const createReport = async (model) => {
  isLoading.value = true;

  // Format the StartDate and EndDate using moment.js
  model.userId = user.value.id;
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }

  loadingPlanStore
    .create(model)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });

      $router.push("/dispatcher/loadingplans"); // Use the router's push method to navigate
    })
    .catch((error) => {
      // Handling error
    })
    .finally(() => {
      isLoading.value = false;
      getLoadingplans();
    });
};

// Function to print the instruction details

const printPDF = () => {
  // Select the modal content
  const modalContent = document.querySelector("#content");

  if (modalContent) {
    // Clone the modal content
    const printContent = modalContent.cloneNode(true);

    // Remove the print and close buttons from the cloned content
    const printButton = printContent.querySelector("#printButton");
    const closeButton = printContent.querySelector("#closeButton");
    if (printButton) printButton.remove();
    if (closeButton) closeButton.remove();

    // Create a new div for the custom title
    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = `
      <h2 style="text-align: center; font-family: Arial, sans-serif; margin-top: 20px;">
        DODMA COMMODITY TRACKING SYSTEM
      </h2>`;

    // Insert the custom title at the beginning of the modal content
    printContent.insertBefore(titleDiv, printContent.firstChild);

    // Create a print window
    const printWindow = window.open("", "_self"); // "_self" keeps it on the same page

    // Set the document title to "dispatches" for a default file name when saving
    printWindow.document.write(`
      <html>
        <head>
          <title>Recent Dispatches</title> <!-- Default file name -->
          <style>
            body { font-family: Aptos, sans-serif; margin: 15px; }
            .modal { display: block; position: relative; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    // Close the document for printing
    printWindow.document.close();
    printWindow.focus();

    // Trigger print
    printWindow.print();

    window.location.reload(); // Reloads the page after the print or cancel action
  } else {
    console.error("Modal content not found!");
  }
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  #content,
  #content * {
    visibility: visible;
  }

  #content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .no-print {
    display: none !important;
  }
}

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
