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
        <vue-good-table :columns="columns" :rows="loadingplans" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <div v-if="props.column.label == 'Options'" class="flex space-x-2">




              <button type="button" @click="openDispatchDialog(props.row)"
                class="font-heading inline-flex items-center px-6 py-2.5 border border-blue-400 text-blue-400 font-bold text-xs rounded shadow-md hover:bg-blue-300 hover:text-white hover:shadow-lg focus:outline-none focus:ring-0 active:border-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize">
                <TruckIcon class="h-5 w-5 mr-2" />
                Dispatch
              </button>


              <!-- Edit Button with Pencil Icon -->
              <button @click="openEditDialog(props.row)"
                class="text-green-500 hover:text-green-700 transition duration-300">
                <PencilIcon class="h-5 w-5 inline-block mr-1" />
                Edit
              </button>

              <!-- Delete Button with Trash Icon -->
              <button @click="deleteItem(props.row.id)" class="text-red-500 hover:text-red-700 transition duration-300">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />
                Delete
              </button>

            </div>
          </template>
        </vue-good-table>

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


import EditLoadingPlanDialog from "../../../components/pages/reports/edit-loading-plan.component.vue";


import DispatchLoadingPlanDialog from "../../../components/pages/reports/create.dispatch-planner.component.vue";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Loading Plans", href: "#", current: true },
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
    field: row => `<span class="from-color">From: ${row.warehouse?.Name}</span><br>` +
      `<span class="to-color">To: ${row.district?.Name}</span><br>` +
      `<span class="by-color">By: ${row.transporter?.Name}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Stocks",
    hidden: false,
    field: row => `<span class="from-color">Qty: ${row.Quantity} MT</span><br>` +
      `<span class="to-color">Bal: ${row.Balance !== null ? row.Balance + " MT" : "Pending"}</span>`,
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
  $router.push('/planner/loadingplans');
}


const getLoadingplans = async () => {
  isLoading.value = true;

  try {
    const result = await loadingPlanStore.get();

    // Reverse the order of the results
    const reversedLoadingPlans = result.reverse();

    // Empty the loadingplans array and then push the reversed results
    loadingplans.length = 0;
    loadingplans.push(...reversedLoadingPlans);

  } catch (error) {
    // Handle any errors that occur during the get or reverse
    console.error('Failed to fetch and reverse loading plans:', error);
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
  model.userId = user.value.id
  model.Balance = model.Quantity
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

      $router.push('/planner/loadingplans'); // Use the router's push method to navigate

    })
    .catch(error => {
      // Handling error
    })
    .finally(() => {
      isLoading.value = false;
      getLoadingplans();
    });
};





const deleteItem = async (id) => {
  // First, ask for confirmation
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    // If confirmed, proceed to delete
    if (result.isConfirmed) {
      isLoading.value = true;

      await loadingPlanStore.remove(id);

      // Show success message
      await Swal.fire("Deleted!", "Your loading plan has been deleted.", "success");

      // Refresh the loading plans
      await getLoadingplans();
    }
  } catch (error) {
    // Handle errors here
    Swal.fire({
      title: "Failed",
      text: "Failed to remove Loading plan (" + error.message + ")",
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
