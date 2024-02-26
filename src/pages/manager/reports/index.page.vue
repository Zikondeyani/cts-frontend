<template>
  <main class="min-h-screen p-5">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="container mx-auto">
      <div class="mt-1 mb-4">

        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="mb-4">
          <h2 class="font-bold leading-7 text-gray-800 sm:text-2xl sm:truncate">
            Reports
          </h2>
        </div>

        <!-- Filters Section -->
        <div class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <!-- District Filter -->
            <div class="md:col-span-1">
              <label for="district" class="block text-sm font-medium text-gray-700">District</label>
              <select v-model="selectedDistrict" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Districts</option>
                <option v-for="district in districts" :key="district" :value="district.Name">{{ district.Name }}</option>
              </select>
            </div>

            <!-- Warehouse Filter -->
            <div class="md:col-span-1">
              <label for="warehouse" class="block text-sm font-medium text-gray-700">Warehouse</label>
              <select v-model="selectedWarehouse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Warehouses</option>
                <option v-for="warehouse in warehouses" :key="warehouse" :value="warehouse.Name">{{ warehouse.Name }}
                </option>
              </select>
            </div>

            <!-- Transporter Filter -->
            <div class="md:col-span-1">
              <label for="transporter" class="block text-sm font-medium text-gray-700">Transporter</label>
              <select v-model="selectedTransporter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Transporters</option>
                <option v-for="transporter in transporters" :key="transporter" :value="transporter.Name">{{
                  transporter.Name }}</option>
              </select>
            </div>

            <!-- Commodity Filter -->
            <div class="md:col-span-1">
              <label for="commodity" class="block text-sm font-medium text-gray-700">Commodity</label>
              <select v-model="selectedCommodity" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">All Commodities</option>
                <option v-for="commodity in commodities" :key="commodity" :value="commodity.Name">{{ commodity.Name }}
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
            <button @click="generateExcel"
              class="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-blue-400">
              <i class="fas fa-file-excel mr-2"></i>
              Export to Excel
            </button>
          </div>

        </div>

    

        <!-- Table -->
        <div class="relative overflow-x-auto rounded-table">
          <vue-good-table :columns="columns" :rows="loadingplans" :search-options="{ enabled: true }"
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
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Report Management", href: "#", current: true },
];


import { useloadingplanstore } from "../../../stores/loadingplans.store";

import * as XLSX from 'xlsx';


const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);



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
  $router.push('/admin/loadingplans');
}


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
// Reactive data for filtered loading plans
const filteredLoadingPlans = computed(() => {
  // Filtering logic based on selected filters
  return loadingplans.filter(plan => {
    return (!selectedDistrict.value || plan.district === selectedDistrict.value) &&
      (!selectedWarehouse.value || plan.warehouse === selectedWarehouse.value) &&
      (!selectedTransporter.value || plan.transporter === selectedTransporter.value); loadingplans
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
}</style>
