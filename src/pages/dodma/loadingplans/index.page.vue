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





        <div class="mt-5 flex ml-4 justify-center sm:mt-0">

          <create-report-form v-on:create="createReport" />
        </div>

      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-lg bg-white rounded-table">
        <!-- Online/Offline Status -->
        <div class="flex items-center justify-end mb-2">
          <div class="flex items-center">
            <GlobeAltIcon :class="{ 'bg-white text-green-600': isOnline, 'bg-white text-red-600': !isOnline }"
              class="h-5 w-5 text-gray-600" /> <!-- Globe icon -->
            <div :class="{ 'bg-white text-green-600': isOnline, 'bg-white text-red-600': !isOnline }"
              class="p-4 rounded-lg">
              <p>{{ onlineStatusMessage }}</p>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
    <vue-good-table
      :columns="columns"
      :rows="loadingplans"
      :search-options="{ enabled: true }"
      style="font-weight: bold; color: #096eb4;"
      :pagination-options="{ enabled: true }"
      theme="polar-bear"
      styleClass="vgt-table striped"
      compactMode
    >
      <template #table-actions> </template>
      <template #table-row="props">
        <div v-if="props.column.label === 'Status'">
          <span
            v-if="props.row.IsApproved"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800"
          >
            Approved
          </span>
          <span
            v-else
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800"
          >
            Not Approved
          </span>
        </div>
        <div v-if="props.column.label == 'Options'" class="flex flex-col sm:flex-row sm:space-x-2">
          <button
            @click="openEditDialog(props.row)"
            v-if="isOnline"
            class="text-green-500 hover:text-green-700 transition duration-300 mb-2 sm:mb-0"
          >
            <PencilIcon class="h-5 w-5 inline-block mr-1" />
            Edit
          </button>

          <button
            @click="openAttachmentDialog(props.row)"
            v-if="isOnline"
            class="text-blue-500 hover:text-blue-500 transition duration-300 mb-2 sm:mb-0"
          >
            <PaperclipIcon class="h-5 w-5 inline-block mr-1" />
            Attachments
          </button>

          <button
            v-if="props.row.Balance > 0"
            @click="deleteItem(props.row.id)"
            class="text-red-500 hover:text-red-700 transition duration-300"
          >
            <TrashIcon class="h-5 w-5 inline-block mr-1" />
            Delete
          </button>
        </div>
      </template>
    </vue-good-table>
  </div>

        <!-- Edit Loading Plan Dialog -->
        <EditLoadingPlanDialog :isOpen="isEditDialogOpen" :loadingPlan="selectedLoadingPlan" @close="closeEditDialog"
          v-on:update="reloadPage" />

        <DispatchLoadingPlanDialog :isOpen="isDispatchDialogOpen" :loadingPlan="selectedLoadingPlan"
          @close="closeDispatchDialog" v-on:update="reloadPage" />


        <AttachDocumentsDialog :isOpen="isAttachmentDialogOpen" :loadingPlan="selectedLoadingPlan"
          @close="closeAttachmentForm" @submit="submitAttachments" />

      </div>

    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted, computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  PaperclipIcon,
  PencilIcon, TrashIcon, TruckIcon
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createListingForm from "../../../components/pages/catalogue/create.component.vue";
//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";

import createDispatchForm from "../../../components/pages/dispatch/create.component.vue";

import createReportForm from "../../../components/pages/reports/create.component.vue";


import { saveDataOffline, getDataOffline, getOfflineLoadingPlans, removeDataOffline } from '@/services/localbase';

import { checkOnlineStatus } from '@/services/utils/network';

import EditLoadingPlanDialog from "../../../components/pages/reports/edit-loading-plan.component.vue";

import AttachDocumentsDialog from "../../../components/pages/reports/attach-documents.component.vue"; // Import your AttachDocumentsDialog component


import DispatchLoadingPlanDialog from "../../../components/pages/reports/create.dispatch-planner.component.vue";

import { useSessionStore } from "../../../stores/session.store";
const onlineStatusMessage = ref("Checking status..."); // Ref for online status message

//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Loading Plans", href: "#", current: true },
  { name: "Lean Season Response", href: "#", current: true },
];


import { useloadingplanstore } from "../../../stores/loadingplans.store";

import * as XLSX from 'xlsx';


const loadingPlanStore = useloadingplanstore();

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
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">By: ${row.transporter?.Name}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Stocks",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Qty: ${row.Quantity} MT</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Bal: ${row.Balance !== null ? row.Balance + " MT" : "Pending"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },

  {
    label: "Status",
    hidden: false,
    field: row => row.IsApproved,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


  {
    label: "Options",
    field: row => row,
    sortable: false
  }


]);

const isLoading = ref(false);
const isOnline = ref(false);
const loadingplans = reactive([]);

const isEditDialogOpen = ref(false);

const selectedLoadingPlan = ref(null);

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
const isAttachmentDialogOpen = ref(false); // Add this variable

// Function to open the edit dialog
const openDispatchDialog = (loadingPlan) => {
  selectedLoadingPlan.value = loadingPlan;
  isDispatchDialogOpen.value = true;
};

// Function to close the edit dialog
const closeDispatchDialog = () => {
  isDispatchDialogOpen.value = false;
};




const closeAttachmentForm = () => {
  isAttachmentDialogOpen.value = false;
};

const submitAttachments = (attachments) => {
  // Logic for submitting the attachments
};

const openAttachmentDialog = (loadingPlan) => {
  selectedLoadingPlan.value = loadingPlan;
  isAttachmentDialogOpen.value = true;
};

// Function to periodically update online status
const startOnlineStatusCheck = () => {
  setInterval(updateOnlineStatusMessage, 3000); // Update every 60 seconds (adjust as needed)

};

//MOUNTED
onMounted(async () => {
  startOnlineStatusCheck(); // Start periodic online status check
  await updateOnlineStatusMessage();
  await getLoadingplans();

});
//FUNCTIONS

// Function to check the online status and update the message
const updateOnlineStatusMessage = async () => {
  try {
    const onlineval = await checkOnlineStatus();
    isOnline.value = onlineval;
    onlineStatusMessage.value = onlineval ? "You are online" : "You are offline";
  } catch (error) {
    console.error("Error checking online status:", error);
    onlineStatusMessage.value = "Error checking online status";
  }
};




const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getLoadingplans();

  // Navigate to the route after the data has been updated
  $router.push('/dodma/loadingplans');
}


// Functions to get the loading plans
const getLoadingplans = async () => {
  try {
    isLoading.value = true;
    let data = [];

    if (isOnline.value) {
      data = await loadingPlanStore.get();
    } else {
      data = await getOfflineLoadingPlans();
    }

    // Clear existing data and push new data
    loadingplans.splice(0, loadingplans.length, ...data.reverse());
  } catch (error) {
    console.error("Error fetching loading plans:", error);
  } finally {
    isLoading.value = false;
  }
};



// Automatically update online status message whenever `isOnline` changes
watchEffect(async () => {
  updateOnlineStatusMessage();
  getLoadingplans(); // Refresh data whenever online status changes
  if (isOnline.value) {
    syncOfflineData(); // Trigger synchronization when back online
  }
});

const createReport = async (reportData) => {
  try {
    isLoading.value = true;

    
    const data = {
      ...reportData,
      userId: user.value.id,
      IsApproved: false,
      Balance: reportData.Quantity  // Set Quantity to Balance if offline
    };


    if (isOnline.value) {
      await loadingPlanStore.create(data); // Save directly to server
    } else {
      await saveDataOffline('loading-plans', data); // Save offline with syncstatus
    }

    await getLoadingplans(); // Refresh loading plans after creating report
  } catch (error) {
    console.error("Error creating report:", error);
  } finally {
    isLoading.value = false;
  }
};


// Function to handle synchronization when back online
const syncOfflineData = async () => {
  try {
    // Check if there are offline plans to sync
    const offlinePlans = await getOfflineLoadingPlans();

    if (offlinePlans.length === 0) {
      return;
    }

    for (const plan of offlinePlans) {
      // Remove specified fields before sync
      const { id, key, transporter, commodity, district, project, warehouse, ...planToSync } = plan;

      // Ensure StartDate and EndDate follow date-time format
      planToSync.StartDate = new Date(planToSync.StartDate).toISOString();
      planToSync.EndDate = new Date(planToSync.EndDate).toISOString();

      try {
        // Create loading plan on server
        await loadingPlanStore.create(planToSync);

        // Remove from offline storage only if server creation is successful
        await removeDataOffline('loading-plans', id);
      } catch (error) {
        console.error(`Failed to sync plan with id ${id} to server:`, error);
        // Handle specific error or log it for debugging
        // You can choose to retry or leave the item in offline storage
      }
    }

    await getLoadingplans(); // Refresh data after synchronization
    Swal.fire('Sync Success', 'Offline data synced successfully!', 'success');
  } catch (error) {
    console.error('Error syncing offline data:', error);
    Swal.fire('Sync Error', 'Failed to sync offline data.', 'error');
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




const deleteItem = async (id) => {
  try {
    // First, ask for confirmation and reason
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Please enter the reason for deletion:",
      input: 'textarea',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!'
        }
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    // If confirmed and reason provided, proceed to delete
    if (result.isConfirmed && result.value) {
      isLoading.value = true;

      // Create object with id and reason
      const deletePayload = {
        id: id,
        reason: result.value
      };

      // Check online status
      if (isOnline.value) {
        await loadingPlanStore.removeWithComments(deletePayload);
      } else {
        // Call local offline delete function
        await removeDataOffline("loading-plans", id); // Adjust this function according to your service
      }

      // Show success message
      await Swal.fire("Deleted!", "Your Offline loading plan has been deleted.", "success");

      // Refresh the dispatches
      await getLoadingplans();
    }
  } catch (error) {
    // Handle errors here
    Swal.fire({
      title: "Failed",
      text: "Failed to remove loading plan (" + error.message + ")",
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
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
