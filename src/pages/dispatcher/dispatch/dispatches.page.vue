<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="my-4 border-b border-gray-400 ">
        <div class="flex flex-wrap ">

          <button @click="activeTab = 'all'"
            :class="{ 'tab-button text-white': activeTab === 'all', 'bg-white text-blue-800 border border-blue-800': activeTab !== 'all' }"
            class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out">
            <i class="fas fa-file-alt mr-2"></i> <!-- Draft icon -->
            All Dispatches
            <span v-if="allCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center px-4">
              {{ allCount }}
            </span>
          </button>

          <button @click="activeTab = 'my'"
            :class="{ 'tab-button text-white': activeTab === 'my', 'bg-white text-blue-800 border border-blue-800': activeTab !== 'my' }"
            class="relative flex items-center mr-1 py-2 px-4 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out">
            <i class="fas fa-check-circle mr-2 pt-10"></i> <!-- Submitted icon -->

            My Dispatches
            <span v-if="myCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center px-4">
              {{ myCount }}
            </span>
          </button>


        </div>
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Dispatches
          </h2>
        </div>

        <button type="button" v-if="activeTab == 'all'"
          class="font-body inline-block px-6 py-2.5 mt-2 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel()">
          Export Data
        </button>

        <button type="button" v-if="activeTab == 'my'"
          class="font-body inline-block px-6 py-2.5 mt-2 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcelUser()">
          Export Data
        </button>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">

        <vue-good-table :columns="columns" :rows="dispaches" v-if="activeTab == 'all'"
          :search-options="{ enabled: true }" style="font-weight: bold; color: blue;" :pagination-options="{
            enabled: true,
          }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <div v-if="props.column.label === 'Options'" class="flex space-x-2">
              <!-- Edit Button with Pencil Icon -->
              <button @click="openEditDialog(props.row)"
                v-if="!props.row.IsArchived && props.row.Dispatcher?.email === user.email"
                class="flex items-center text-green-500 hover:text-green-700 transition duration-300 ease-in-out">
                <PencilIcon class="h-5 w-5 inline-block mr-1" />
                <span>Edit</span>
              </button>

              <!-- Delete Button with Trash Icon -->
              <button @click="deleteItem(props.row.id)"
                v-if="!props.row.IsArchived && props.row.Dispatcher?.email === user.email"
                class="flex items-center text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />


                <span>Delete</span>
              </button>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                v-if="props.row.IsArchived"> Completed</span>

            </div>
          </template>

        </vue-good-table>



        <div v-if="activeTab == 'my'">
          <div class="filters flex flex-wrap gap-4 items-center">

            <select v-model="selectedATC"
              class="focus:ring-gray-500  mb-3 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-400 rounded-md">
              <option value="all">All ATC Numbers</option>
              <option v-for="atc in atcNumbers" :key="atc" :value="atc">{{ atc }}</option>
            </select>

            <select v-model="selectedTransporter"
              class="focus:ring-gray-500 mb-3  w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-400 rounded-md">
              <option value="all">All Transporters</option>
              <option v-for="transporter in transporters" :key="transporter" :value="transporter">
                {{ transporter }}
              </option>
            </select>

            <select v-model="selectedDistrict"
              class="focus:ring-gray-500 mb-3  w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-400 rounded-md">
              <option value="all">All Districts</option>
              <option v-for="district in districts" :key="district" :value="district">
                {{ district }}
              </option>
            </select>

            <select v-model="selectedDateFilter"
              class="focus:ring-gray-500 mb-3  w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-400 rounded-md">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">Last 7 Days</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          <vue-good-table :columns="columns2" :rows="filteredDispatches" :search-options="{ enabled: true }"
            :pagination-options="{ enabled: true }" theme="polar-bear" styleClass="vgt-table striped" compactMode>
          </vue-good-table>
        </div>



        <!-- Edit Loading Plan Dialog -->
        <EditDispatchDialog :isOpen="isEditDialogOpen" :Dispatch="selectedDispatch" @close="closeEditDialog"
          v-on:update="reloadPage" />


        <ReceiptLoadingPlanDialog :isOpen="isReceiptDialogOpen" :dispatch="selectedDispatch" @close="closeReceiptDialog"
          v-on:update="reloadPage" />

      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  TrashIcon,
  PencilIcon
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt.component.vue";


import EditDispatchDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";



import createListingForm from "../../../components/pages/catalogue/create.component.vue";
//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";

import * as XLSX from 'xlsx';

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Dispatches", href: "#", current: true },
];


import { useDispatcherStore } from "../../../stores/dispatch.store";


const activeTab = ref("all"); // Default to "All Dispatches"

const dispatchStore = useDispatcherStore();
const dispaches = reactive([]);

const userdispaches = reactive([]);

const atcNumbers = ref([]);
const transporters = ref([]);
const districts = ref([]);

// Selected filters
const selectedATC = ref('all');
const selectedTransporter = ref('all');
const selectedDistrict = ref('all');
const selectedDateFilter = ref('all'); // Options: 'all', 'today', 'yesterday', 'lastMonth'
const myCount = ref(0)
const allCount = ref(0)

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Quantity",
    hidden: false,
    field: (row) => `
      <span class="badge badge-info">${row.NoBags ? row.NoBags + " Bags" : "Not specified"}</span><br>
      <span class="badge badge-primary">${row.Quantity !== null ? row.Quantity + " MT" : "Pending"}</span>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Details",
    hidden: false,
    field: (row) => `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">D.N: ${row.DeliveryNote || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">ATC #: <strong>${row.loadingPlan?.ATCNumber || "N/A"}</strong></span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">To: ${row.FinalDestinationPoint || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">On: ${moment(row.Date).format("DD/MM/YYYY") || "N/A"}</span>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Dispatch Details",
    field: (row) => `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Driver: ${row.DriverName || "Not Specified"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">Truck: ${row.TruckNumber || "Not Available"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">By: ${row.Dispatcher?.username.replace(/\./g, ' ') || "Unknown"}</span>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Receipt Status",
    field: (row) => {
      const today = moment();
      const endDate = moment(row.loadingPlan?.EndDate);

      if (row.IsArchived) {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800'>Expensed</span>";
      } else if (!row.IsArchived && endDate.isBefore(today)) {
        const diffDays = today.diff(endDate, 'days');
        if (diffDays <= 3) {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800'>Delayed</span>";
        } else {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800'>Long Overdue</span>";
        }
      } else {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>Pending</span>";
      }
    },
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Options",
    field: (row) => row,
    sortable: false,
  }
]);


const columns2 = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Username",
    field: (row) => `
      <span class="badge badge-primary">${row.username || "Unknown"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },

  {
    label: "Transporter",
    field: (row) => `
      <span class="badge badge-warning">${row.transporter || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },

  {
    label: "Truck #",
    field: (row) => `
      <span class="badge badge-warning">${row.truckNumber || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },

  {
    label: "District",
    field: (row) => `
      <span class="badge badge-success">${row.district || "Unknown"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "ATC #",
    field: (row) => `
      <span class="badge badge-dark">${row.atcNumber || "Not Available"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Date of Dispatch",
    field: (row) => `
      <span class="badge badge-primary">${moment(row.dateOfDispatch).format("DD/MM/YYYY") || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Created On",
    field: (row) => `
      <span class="badge badge-info">${moment(row.createdOn).format("DD/MM/YYYY") || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Quantity",
    field: (row) => `
      <span class="badge badge-primary">${row.quantity ? row.quantity + " MT" : "Not Specified"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize"
  },

]);




const isEditDialogOpen = ref(false);

const selectedDispatch = ref(null);

// Function to open the edit dialog
const openEditDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};



const isReceiptDialogOpen = ref(false);

// Function to open the edit dialog
const openDispatchDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isReceiptDialogOpen.value = true;
};

// Function to close the edit dialog
const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};




//MOUNTED
onMounted(async () => {
  try {
    await Promise.all([getDispatches(), getUserDispatches()]);
    // Optionally include: getLatest()
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

//FUNCTIONS


// Filter logic
// Computed property to handle filtering
const filteredDispatches = computed(() => {
  let filtered = userdispaches;

  // Filter by ATC number
  if (selectedATC.value !== 'all') {
    filtered = filtered.filter(item => item.atcNumber === selectedATC.value);

  }

  // Filter by Transporter
  if (selectedTransporter.value !== 'all') {
    filtered = filtered.filter(item => item.transporter === selectedTransporter.value);
  }

  // Filter by District
  if (selectedDistrict.value !== 'all') {
    filtered = filtered.filter(item => item.district === selectedDistrict.value);
  }

  // Filter by Date
  if (selectedDateFilter.value && selectedDateFilter.value !== 'all') {
    const today = moment();  // Current date using Moment.js

    if (selectedDateFilter.value === 'today') {
      filtered = filtered.filter(dispatch =>
        moment(dispatch.createdOn).isSame(today, 'day')  // Compare dates as moment objects
      );
    } else if (selectedDateFilter.value === 'yesterday') {
      const yesterday = moment().subtract(1, 'day');  // Get yesterday's date
      filtered = filtered.filter(dispatch =>
        moment(dispatch.createdOn).isSame(yesterday, 'day')  // Compare dates as moment objects
      );
    } else if (selectedDateFilter.value === 'lastMonth') {
      const lastMonth = moment().subtract(1, 'month');  // Get the same day last month
      filtered = filtered.filter(dispatch =>
        moment(dispatch.createdOn).isSame(lastMonth, 'month')  // Compare by month
      );
    } else if (selectedDateFilter.value === 'thisWeek') {
      const startOfWeek = moment().startOf('week');  // Get the start of this week (Sunday)
      const endOfWeek = moment().endOf('week');  // Get the end of this week (Saturday)
      filtered = filtered.filter(dispatch =>
        moment(dispatch.createdOn).isBetween(startOfWeek, endOfWeek, 'days', '[]')  // Compare within this week
      );
    }
  }

  myCount.value = filtered?.length
  return filtered;
});

watch([selectedATC, selectedTransporter, selectedDistrict, selectedDateFilter]);


const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Dispatches';

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = dispaches.map(({ CreatedOn, UpdatedOn, DispatcherId, loadingPlanId, Dispatcher, loadingPlan, ...keepAttrs }) => keepAttrs);

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'Dispatches.xlsx');
};

const generateExcelUser = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'UserDispatches';

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = filteredDispatches.value;

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'UserDispatches.xlsx');
};


const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getDispatches();

  // Navigate to the route after the data has been updated
  $router.push('/dispatcher/dispatches');
}


const getUserDispatches = async () => {
  isLoading.value = true;
  try {
    const result = await dispatchStore.getdispatchUserSummary();
    const sortedData = result.reverse();
    const userFilteredData = sortedData.filter(item => item.email === user.value.email);

    userdispaches.length = 0
    userdispaches.push(...userFilteredData);

    // Populate filter datasets
    atcNumbers.value = [...new Set(userFilteredData.map(item => item.atcNumber))];

    transporters.value = [...new Set(userFilteredData.map(item => item.transporter))];
    districts.value = [...new Set(userFilteredData.map(item => item.district))];

    myCount.value = userdispaches.length
  } finally {
    isLoading.value = false;
  }
};


const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispaches.length = 0; //empty array


      let sorteddata = result.reverse();

      const filterByDistrict = sorteddata.filter(plan => plan.Dispatcher?.district == user.value.district)


      dispaches.push(...filterByDistrict);


      allCount.value = dispaches.length
    })


    .finally(() => {
      isLoading.value = false;
    });

}


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

      await dispatchStore.removeWithComments(deletePayload);

      // Show success message
      await Swal.fire("Deleted!", "Your Dispatch has been deleted.", "success");

      // Refresh the dispatches
      await getDispatches();
    }
  } catch (error) {
    // Handle errors here
    Swal.fire({
      title: "Failed",
      text: "Failed to remove Dispatch (" + error.message + ")",
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


.tab-button {
  background-color: #248cd6;
  color: white;
  border: none;
}

.active-tab {
  background-color: #0f6c97;
  color: white;
}
</style>
