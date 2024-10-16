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
          <i class="fas fa-file-export mr-2"></i> <!-- Icon (Font Awesome used as an example) -->
          Export Data
        </button>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-lg bg-white rounded-table">
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
                  class="font-heading inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 font-semibold text-xs rounded-md shadow-sm hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150">
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
    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Recent Dispatches</h3>
        </div>

        <div class="overflow-auto max-h-96">
          <table class="min-w-full table-auto border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Delivery Note</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ATC #</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Dispatcher</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Qty (MT)</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">FDP</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Created</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Driver (Truck #)</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Received</th> <!-- New column -->
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="dispatch in recentDispatches" :key="dispatch.id">
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.DeliveryNote }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.atc }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.dispatcher?.username?.replace(/\./g, ' ') }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.Quantity }} MT</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.FinalDestinationPoint }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ moment(dispatch.CreatedOn).format('MMMM Do YYYY, h:mm a') }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ dispatch.DriverName }} ({{ dispatch.TruckNumber }})</td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  <span 
                    class="inline-block w-3 h-3 rounded-full" 
                    :class="dispatch.received ? 'bg-green-500' : 'bg-red-500'">
                  </span>
                </td> <!-- Received status with dot -->
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end mt-4">
          <button @click="printPDF" id="printButton" v-if="recentDispatches.length > 0" 
            class="mr-3 bg-green-500 text-white px-4 py-2 rounded-md no-print">Print</button>
          <button type="button" id="closeButton"
            class="no-print px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            @click="closeRecentDispatches">Close</button>
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

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon, TrashIcon, TruckIcon,
  EyeIcon
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
import eventBus from '../../../services/events/eventbus';

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Loading Plans", href: "#", current: true },
  { name: "Lean Season Response", href: "#", current: true },

];

import { useloadingplanstore } from "../../../stores/loadingplans.store";

import * as XLSX from 'xlsx';


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
    tdClass: "capitalize"
  },
  {
    label: "Commodity",
    field: row => row.commodity?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Details",
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">From: ${row.warehouse?.Name}</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">To: ${row.district?.Name}</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-green-100 text-green-800">TP: ${row.transporter?.Name}</span> <br>`
      +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold  bg-gray-100 text-gray-800">ATC #: ${row.ATCNumber}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Stocks",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-blue-100 text-blue-800">Qty: ${row.Quantity} MT</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-green-100 text-green-800">Bal: ${row.Balance?.toFixed(2) !== null ? row.Balance?.toFixed(2) + " MT" : "Pending"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },
  {
    label: "Options",
    field: row => row,
    sortable: false
  }
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

// Fetch Recent Dispatches
const fetchRecentDispatches = async (id, atc) => {
  try {
    const result = await loadingPlanStore.getloadingplansDispatchesById(id);

    // Assign data to recentDispatches, including the atc parameter
    recentDispatches.value = result.map(dispatch => ({
      ...dispatch,
      atc, // Add the atc to each dispatch object
    }));

  } catch (error) {
    console.error('Failed to fetch recent dispatches:', error);
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
  // getLatest()
});

//FUNCTIONS

const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getLoadingplans();

  // Navigate to the route after the data has been updated
  $router.push('/dispatcher/loadingplans');
};

const getLoadingplans = async () => {
  isLoading.value = true;

  try {
    const result = await loadingPlanStore.get();

    // Check if user district is national or null
    const isNationalOrNull = !user.value.district || user.value.district === 'National';

    // Separate loading plans that are not closed (isClosed == false) and the rest
    const openLoadingPlans = result.filter(plan => plan.isClosed === false);
    const closedLoadingPlans = result.filter(plan => plan.isClosed === true);

    // Combine the open loading plans first, then the closed ones
    const sortedLoadingPlans = [...openLoadingPlans, ...closedLoadingPlans];

    // Filter based on user district if not national or null
    const filteredLoadingPlans = isNationalOrNull
      ? sortedLoadingPlans.filter(item => item.IsApproved === true) // For national or null, include approved only
      : sortedLoadingPlans.filter(item => item.IsApproved === true && item.district.Name === user.value.district  && item.IsDivertedLoad == true); // For specific district, include approved and match district

    // Clear the loadingplans array and then push the sorted results
    loadingplans.length = 0;
    loadingplans.push(...filteredLoadingPlans);

    // Emit event after updating loading plans
    eventBus.emit('loadingplanArchived', result.id);

  } catch (error) {
    // Handle any errors that occur during the get, filter, or reverse
    console.error('Failed to fetch, filter, and sort loading plans:', error);
  } finally {
    isLoading.value = false;
  }
};

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Loading Plan';

  // Map over the array to flatten each object
  const flattenedData = loadingplans.reverse().map(plan => ({
    id: plan.id,
    CreatedOn: plan.CreatedOn,
    UpdatedOn: plan.UpdatedOn,
    LoadingPlanNumber: plan.LoadingPlanNumber,
    Quantity: plan.Quantity,
    Balance: plan.Balance,
    StartDate: plan.StartDate,
    EndDate: plan.EndDate,

    "ATC #": plan.ATCNumber,
    "Commodity": plan.commodity?.Name,
    "From": plan.warehouse?.Name,
    "Transporter Name": plan.transporter?.Name,
    "To": plan.district?.Name
  }));

  // Create a worksheet from the flattened data array
  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'LoadingPlans.xlsx');
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
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      $router.push('/dispatcher/loadingplans'); // Use the router's push method to navigate
    })
    .catch(error => {
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
