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


        <!--  <div class="mt-5 flex mr-4 justify-center sm:mt-0">
          <create-report-form v-on:create="createReport" />
        </div> -->
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
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>


          <template #table-actions> </template>

          <template #table-row="props">

            <span v-if="props.column.label == 'Approval'">

              <div class="flex space-x-2">

                <!-- Create Instruction Button -->


                <div>
                  <div v-if="props.row.isApproved">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                  <div v-else>


                    <create-approval-loadingplan :row-id="props.row.id" v-on:create="updateApproval"
                      :emergencyResponseInstructions="props.row" :commodity="commodity"
                      v-on:reject="rejectLoadingPlan" />

                  </div>
                </div>



              </div>
            </span>
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
import eventBus from '../../../services/events/eventbus';


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


import DispatchLoadingPlanDialog from "../../../components/pages/reports/create.dispatch.component.vue";
import createApprovalLoadingplan from '../../../components/pages/instruction/instructionApprovalER.component.vue';

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/commissioner/dashboard", current: false },
  { name: "Loading Plans", href: "#", current: true },
  { name: "Lean Season Response & Emergency Assistance", href: "#", current: true },
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
    field: row => row.commodityName,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Details",
    field: (row) => {
      const atcNumber = `<span style="color: #096eb4; font-weight: bold;">ATCNUMBER: ${row.ATCNUMBER}</span>`;
      const district = `<span style="color: green;">District: ${row.district}</span>`;
      const plannedBy = `<span style="color: #0b8ad8;">Planned By: ${row.plannedBy}</span>`;
      const date = `<span style="color: #555;">Date: ${new Date(row.date).toLocaleDateString()}</span>`;

      return `${atcNumber}<br/>${district}<br/>${plannedBy}<br/>${date}`;
    },
    sortable: true,
    firstSortType: "asc",
    tdClass: "whitespace-normal break-words", // Ensure wrapping and breaking words
    thClass: "w-1/6", // Set width to 1/6th of the table
    html: true,
    tdAttr: { "v-html": true },
  },
  {
    label: "Stocks",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-bold bg-blue-100 text-blue-800">Qty: ${row.totalQuantity.toFixed(2)} MT</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },
  // Status column
  /*   {
      label: "Status",
      field: row => {
        const currentDate = new Date();
        const endDate = new Date(row.EndDate);
        const startDate = new Date(row.StartDate);
  
        if (row.Balance !== 0 && currentDate > endDate) {
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Extremely Delayed</span>`;
        } else if (row.Balance > 0 && currentDate <= endDate && currentDate >= startDate) {
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>`;
        } else if (row.Balance === 0) {
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Completed</span>`;
        } else if (row.Balance > 0 && currentDate > endDate) {
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">Delayed</span>`;
        }
        return '';
      },
      sortable: true,
      firstSortType: "asc",
      html: true,
      tdClass: "capitalize"
    }, */
  // Approve/Disapprove column

  {
    label: "Approval",
    field: row => row,
    sortable: false,
    thClass: "w-1/6", // Set width to 1/6th of the table
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
  $router.push('/commissioner/loadingplans');
}



const updateApproval = async (newValues) => {
  isLoading.value = true;

  try {
    // Fetch all loading plans
    const allLoadingPlans = await loadingplansStore.get();

    // Filter loading plans where ATCNumber matches newValues.ATCNUMBER
    const loadingPlans = allLoadingPlans.filter(plan => plan.ATCNumber === newValues.ATCNumber);

    // Check if any loading plans were found
    if (loadingPlans.length === 0) {
      throw new Error("No loading plans found with the specified ATCNUMBER.");
    }

    // Sequentially update each loading plan with the details from newValues
    for (const loadingPlan of loadingPlans) {
      console.log("Updating loading plan", loadingPlan);
      
      // Create an updated object that includes the loading plan ID and new values
      const updatedLoadingPlan = { id: loadingPlan.id, ...newValues };

      // Await each update one by one
      await loadingplansStore.update(updatedLoadingPlan);
    }

    Swal.fire({
      title: "Success",
      text: "Successfully approved loading plans",
      icon: "success",
    });

    eventBus.emit('loadingplanArchived', newValues.id);

    getLoadingPlans();
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: "Failed to approve loading plans (" + error.message + ")",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};


const rejectLoadingPlan = async (newValues) => {
  isLoading.value = true;

  try {
    // Fetch all loading plans
    const allLoadingPlans = await loadingplansStore.get();

    // Filter loading plans where ATCNumber matches newValues.ATCNUMBER
    const loadingPlans = allLoadingPlans.filter(plan => plan.ATCNumber === newValues.ATCNumber);

    // Check if any loading plans were found
    if (loadingPlans.length === 0) {
      throw new Error("No loading plans found with the specified ATCNUMBER.");
    }

    // Sequentially reject each loading plan
    for (const loadingPlan of loadingPlans) {
      console.log("Rejecting loading plan", loadingPlan);
      
      // Create an updated object that includes the loading plan ID and new values for rejection
      const updatedLoadingPlan = { id: loadingPlan.id, ...newValues };

      // Await the rejection one by one
      await loadingplansStore.update(updatedLoadingPlan);
    }

    Swal.fire({
      title: "Success",
      text: "Loading Plans rejected!",
      icon: "success",
    });

    eventBus.emit('loadingplanArchived', newValues.id);

    getLoadingPlans();
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: "Failed to reject loading plans (" + error.message + ")",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};


const getLoadingplans = async () => {
  isLoading.value = true;
  loadingPlanStore
    .getloadingplansByATC()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      loadingplans.length = 0;


      loadingplans.push(...result.filter(item => !item.isRejected));


    })
    .catch(error => {
      Swal.fire({
        title: "Instruction Retrieval Failed",
        text: "failed to get Emergency Response Instructions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Loading Plan';

  // Flatten the dataset to include relevant fields for export
  const flattenedData = loadingplans.map(item => {
    return item.loadingPlans.map(plan => ({
      ATCNUMBER: plan.ATCNumber,
      district: item.district,
      plannedBy: item.plannedBy,
      date: item.date,
      commodityName: item.commodityName,
      warehouseName: item.warehouseName,
      isApproved: plan.IsApproved ? 'Approved' : 'Not Approved',
      isRejected: plan.IsRejected ? 'Rejected' : 'Not Rejected',
      LoadingPlanNumber: plan.LoadingPlanNumber,
      CreatedOn: plan.CreatedOn,
      StartDate: plan.StartDate,
      EndDate: plan.EndDate,
      Quantity: plan.Quantity,
      Balance: plan.Balance
    }));
  }).flat(); // Flatten the array of arrays to a single array

  // Create a worksheet from the flattened data array
  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'LoadingPlans.xlsx');
};


const createReport = async (model) => {
  isLoading.value = true;

  model.userId = user.value.id

  model.Balance = model.Quantity
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }
  // List of required fields
  const requiredFields = ['StartDate', 'EndDate', 'Quantity', /* other required fields */];

  // Check if all required fields are filled
  for (const field of requiredFields) {
    if (!model[field]) {
      Swal.fire({
        title: "Missing Information",
        text: `Please fill in the ${field}.`,
        icon: "error",
        confirmButtonText: "Ok"
      }).then(() => {
        isLoading.value = false; // Stop loading
      });
      return; // Stop the function
    }
  }

  // Format the StartDate and EndDate using moment.js
  model.userId = user.value.id;
  model.Balance = model.Quantity;
  model.StartDate = moment(model.StartDate).toISOString();
  model.EndDate = moment(model.EndDate).toISOString();

  loadingPlanStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      $router.push('/dodma/loadingplans'); // Navigate to loading plans
    })
    .catch(error => {
      // Handling error
    })
    .finally(() => {
      isLoading.value = false;
      reloadPage();
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
