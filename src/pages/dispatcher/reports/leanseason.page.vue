<template>
  <main class="min-h-screen">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />
    <span class="text-white font-bold">Lean Season Loading Plan Reports</span>

    <div class="container mx-auto">

      <div class="bg-white p-6 rounded-lg shadow-lg mt-5">
      
        <!-- Filters Section -->
        <div class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <!-- District Filter -->
            <div class="md:col-span-1">
              <label for="district" class="block text-sm font-medium text-gray-700">District</label>
              <select v-model="selectedDistrict" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Districts</option>
                <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.Name }}
                </option>
              </select>
            </div>

            <!-- Warehouse Filter -->
            <div class="md:col-span-1">
              <label for="warehouse" class="block text-sm font-medium text-gray-700">Warehouse</label>
              <select v-model="selectedWarehouse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Warehouses</option>
                <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">{{ warehouse.Name }}
                </option>
              </select>
            </div>

            <!-- Transporter Filter -->
            <div class="md:col-span-1">
              <label for="transporter" class="block text-sm font-medium text-gray-700">Transporter</label>
              <select v-model="selectedTransporter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Transporters</option>
                <option v-for="transporter in transporters" :key="transporter.id" :value="transporter.id">{{
      transporter.Name }}</option>
              </select>
            </div>

            <!-- Commodity Filter -->
            <div class="md:col-span-1">
              <label for="commodity" class="block text-sm font-medium text-gray-700">Commodity</label>
              <select v-model="selectedCommodity" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Commodities</option>
                <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">{{ commodity.Name }}
                </option>
              </select>
            </div>

            <!-- Start Date Filter -->
            <div class="md:col-span-1">
              <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" v-model="startDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>

            <!-- End Date Filter -->
            <div class="md:col-span-1">
              <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" v-model="endDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
          </div>

          <!-- Filter Actions -->
          <!-- Filter Actions -->
          <div class="mt-6 flex justify-between items-center">
            <div>
              <button @click="resetFilters"
                class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 mr-2">
                Reset
              </button>
              <button @click="applyFilters"
                class="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded"
                style="background-color: #248cd6;">
                Apply Filters
              </button>
            </div>

            <div class="relative inline-block text-left">
              <button type="button" @click="opendropdown = !opendropdown"
                class="inline-flex justify-center w-full px-4 py-2 bg-gray-500 text-sm font-medium text-white rounded-md hover:bg-blue-400 focus:outline-none"
                id="menu-button" aria-expanded="true" aria-haspopup="true">
                Export
                <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <div v-if="opendropdown" @mouseleave="opendropdown = false"
                class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" style="position: relative;">
                <div class="py-1" role="none">
                  <!-- Export to PDF -->
                  <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem"
                    @click="generatePDF">
                    Export to PDF
                  </a>

                  <!-- Export to Excel -->
                  <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem"
                    @click="generateExcel">
                    Export to Excel
                  </a>


                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Table -->
        <div class="relative overflow-x-auto rounded-table">
          <vue-good-table :columns="columns" :rows="filteredLoadingPlans" :search-options="{ enabled: true }"
            :pagination-options="{ enabled: true }" theme="polar-bear" styleClass="vgt-table striped">
            <!-- Table slots -->
          </vue-good-table>
        </div>
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


import { useUserStore } from "../../../stores/user.store";

import { usecommoditiestore } from "../../../stores/commodity.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { useprojectstore } from "../../../stores/project.store";
import { useactivitiestore } from "../../../stores/activity.store";
import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);


import { useloadingplanstore } from "../../../stores/loadingplans.store";
import { leftHeaderImage, rightHeaderImage } from "../../../../util/imagedata";

import * as XLSX from 'xlsx';


const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);

const opendropdown = ref(false)

const commoditiesstore = usecommoditiestore();
const commodities = reactive([])
const activitiestore = useactivitiestore();
const activities = reactive([])
const districtstore = usedistrictstore();
const districts = reactive([])
const projectstore = useprojectstore();
const projects = reactive([])
const transporterStore = usetransporterstore();
const transporters = reactive([])
const warehouseStore = usewarehousestore();
const warehouses = reactive([])
const userStore = useUserStore();
const roles = reactive([]);
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
  getCommodities(); getDistricts(); getProjects(); getTransporters(); getWarehouses();
});
//FUNCTIONS


const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getLoadingplans();

  // Navigate to the route after the data has been updated
  $router.push('/manager/loadingplans');
}


const generatePDF = () => {
  const doc = new jsPDF();



  // Draw the header images and text
  doc.addImage(leftHeaderImage, 'JPEG', 18, 7, 25, 20); // Adjust dimensions and position as needed
  doc.addImage(rightHeaderImage, 'JPEG', 160, 2, 30, 30); // Adjust dimensions and position as needed
  doc.setFontSize(12); // Set the title font size
  doc.text('DoDMA Commodity Tracking System Report', 105, 20, null, null, 'center'); // Centered title

  const dataToExport = filteredLoadingPlans.value.length > 0 ? filteredLoadingPlans.value : loadingplans;

  const tableData = dataToExport.map(plan => ([
    plan.LoadingPlanNumber,
    plan.Quantity,
    plan.Balance,
    moment(plan.StartDate).format("DD/MM/yyyy"),
    moment(plan.EndDate).format("DD/MM/yyyy"),
    plan.commodity?.Name,
    plan.warehouse?.Name,
    plan.transporter?.Name,
    plan.district?.Name
  ]));

  autoTable(doc, {
    startY: 30, // Adjust the starting position of the table
    styles: { fontSize: 8 }, // Smaller font size for table
    head: [['LPlan #', 'Qty (MT)', 'Balance (MT)', 'Start Date', 'End Date', 'Commodity', 'From', 'Transporter Name', 'To']],
    body: tableData
  });

  doc.save('LoadingPlans.pdf');
};




const getCommodities = async () => {
  commoditiesstore
    .get()
    .then(result => {

      commodities.length = 0; //empty array
      commodities.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {

      districts.length = 0; //empty array
      districts.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};



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

  // Determine whether to use filtered data or all data
  const dataToExport = filteredLoadingPlans.value.length > 0 ? filteredLoadingPlans.value : loadingplans;

  // Map over the array to flatten each object
  const flattenedData = dataToExport.map(plan => ({
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

      $router.push('/admin/loadingplans'); // Use the router's push method to navigate

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


const selectedDistrict = ref('');
const selectedWarehouse = ref('');
const selectedTransporter = ref('');
const selectedCommodity = ref('');
const startDate = ref('');
const endDate = ref('');
// Reactive data for filtered loading plans
const filteredLoadingPlans = computed(() => {
  // Filtering logic based on selected filters
  return loadingplans.filter(plan => {
    return (!selectedDistrict.value || plan.district?.id === selectedDistrict.value) &&
      (!selectedWarehouse.value || plan.warehouse?.id === selectedWarehouse.value) &&
      (!selectedTransporter.value || plan.transporter?.id === selectedTransporter.value) &&
      (!selectedCommodity.value || plan.commodity?.id === selectedCommodity.value) &&
      (!startDate.value || plan.StartDate === startDate.value) &&
      (!endDate.value || plan.EndDate === endDate.value);
  });
});

// Methods
const applyFilters = () => {
  // Implement filter application logic here
};

const resetFilters = () => {
  selectedDistrict.value = '';
  selectedWarehouse.value = '';
  selectedTransporter.value = '';
  endDate.value = '';
  startDate.value = '';
  selectedCommodity.value = '';
};




const getProjects = async () => {
  projectstore
    .get()
    .then(result => {

      projects.length = 0; //empty array
      projects.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const getTransporters = async () => {
  transporterStore
    .get()
    .then(result => {

      transporters.length = 0; //empty array
      transporters.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const getWarehouses = async () => {
  warehouseStore
    .get()
    .then(result => {

      warehouses.length = 0; //empty array
      warehouses.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
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
