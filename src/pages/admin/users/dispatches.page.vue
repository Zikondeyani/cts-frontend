<template>
  <main class="min-h-screen">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap"></div>
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2
            class="text-lg font-bold leading-7 text-white sm:text-2xl sm:truncate"
          >
            Dispatches
          </h2>
        </div>

        <button
          type="button"
          class="mt-3 w-full md:w-auto px-6 py-2 bg-gray-500 text-white font-medium text-sm rounded shadow-md hover:bg-gray-600 focus:ring focus:ring-gray-400 focus:outline-none transition ease-in-out"
          @click="generateExcelUser"
        >
          Export Data
        </button>
      </div>

      <!-- Table Section -->
      <div
        class="align-middle inline-block w-full rounded-table mx-0 overflow-x-auto mb-2"
      >
        <!-- Filters -->
        <div
          class="filters flex flex-wrap gap-4 gap-y-2 items-center mt-2 mb-2"
        >
          <select
            v-model="selectedATC"
            class="w-full sm:w-40 p-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-300"
          >
            <option value="all">All ATC Numbers</option>
            <option v-for="atc in atcNumbers" :key="atc" :value="atc">
              {{ atc }}
            </option>
          </select>

          <select
            v-model="selectedTransporter"
            class="w-full sm:w-40 p-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-300"
          >
            <option value="all">All Transporters</option>
            <option
              v-for="transporter in transporters"
              :key="transporter"
              :value="transporter"
            >
              {{ transporter }}
            </option>
          </select>

          <select
            v-model="selectedDistrict"
            class="w-full sm:w-40 p-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-300"
          >
            <option value="all">All Districts</option>
            <option
              v-for="district in districts"
              :key="district"
              :value="district"
            >
              {{ district }}
            </option>
          </select>

          <select
            v-model="selectedDateFilter"
            class="w-full sm:w-40 p-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-300"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">Last 7 Days</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>

        <!-- Table -->
        <div class="align-middle inline-block w-full rounded-table mx-0 overflow-x-auto font-semibold">
          <vue-good-table
            :columns="columns2"
            :rows="filteredDispatches"
            :search-options="{ enabled: true }"
            :pagination-options="{ enabled: true }"
            theme="polar-bear"
            styleClass="vgt-table striped"
            compactMode
          />
        </div>
      </div>

      <!-- Modals -->
      <EditDispatchDialog
        :isOpen="isEditDialogOpen"
        :Dispatch="selectedDispatch"
        @close="closeEditDialog"
        v-on:update="reloadPage"
      />

      <ReceiptLoadingPlanDialog
        :isOpen="isReceiptDialogOpen"
        :dispatch="selectedDispatch"
        @close="closeReceiptDialog"
        v-on:update="reloadPage"
      />
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
  PencilIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt.component.vue";

import EditDispatchDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";


import * as XLSX from "xlsx";

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

const dispatchStore = useDispatcherStore();
const dispaches = reactive([]);

const userdispaches = reactive([]);

const atcNumbers = ref([]);
const transporters = ref([]);
const districts = ref([]);

// Selected filters
const selectedATC = ref("all");
const selectedTransporter = ref("all");
const selectedDistrict = ref("all");
const selectedDateFilter = ref("all"); // Options: 'all', 'today', 'yesterday', 'lastMonth'
const myCount = ref(0);
const allCount = ref(0);

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

const columns2 = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Username",
    field: (row) => `
      <span class="badge badge-primary">${row.username || "Unknown"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },

  {
    label: "Transporter",
    field: (row) => `
      <span class="badge badge-warning">${row.transporter || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },

  {
    label: "Truck #",
    field: (row) => `
      <span class="badge badge-warning">${row.truckNumber || "N/A"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },

  {
    label: "District",
    field: (row) => `
      <span class="badge badge-success">${row.district || "Unknown"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "ATC #",
    field: (row) => `
      <span class="badge badge-dark">${row.atcNumber || "Not Available"}</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Date of Dispatch",
    field: (row) => `
      <span class="badge badge-primary">${
        moment(row.dateOfDispatch).format("DD/MM/YYYY") || "N/A"
      }</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Created On",
    field: (row) => `
      <span class="badge badge-info">${
        moment(row.createdOn).format("DD/MM/YYYY") || "N/A"
      }</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Quantity",
    field: (row) => `
      <span class="badge badge-primary">${
        row.quantity ? row.quantity + " MT" : "Not Specified"
      }</span>
    `,
    sortable: true,
    html: true,
    tdClass: "capitalize",
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
    await Promise.all([getUserDispatches()]);
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
  if (selectedATC.value !== "all") {
    filtered = filtered.filter((item) => item.atcNumber === selectedATC.value);
  }

  // Filter by Transporter
  if (selectedTransporter.value !== "all") {
    filtered = filtered.filter(
      (item) => item.transporter === selectedTransporter.value
    );
  }

  // Filter by District
  if (selectedDistrict.value !== "all") {
    filtered = filtered.filter(
      (item) => item.district === selectedDistrict.value
    );
  }

  // Filter by Date
  if (selectedDateFilter.value && selectedDateFilter.value !== "all") {
    const today = moment(); // Current date using Moment.js

    if (selectedDateFilter.value === "today") {
      filtered = filtered.filter(
        (dispatch) => moment(dispatch.createdOn).isSame(today, "day") // Compare dates as moment objects
      );
    } else if (selectedDateFilter.value === "yesterday") {
      const yesterday = moment().subtract(1, "day"); // Get yesterday's date
      filtered = filtered.filter(
        (dispatch) => moment(dispatch.createdOn).isSame(yesterday, "day") // Compare dates as moment objects
      );
    } else if (selectedDateFilter.value === "lastMonth") {
      const lastMonth = moment().subtract(1, "month"); // Get the same day last month
      filtered = filtered.filter(
        (dispatch) => moment(dispatch.createdOn).isSame(lastMonth, "month") // Compare by month
      );
    } else if (selectedDateFilter.value === "thisWeek") {
      const startOfWeek = moment().startOf("week"); // Get the start of this week (Sunday)
      const endOfWeek = moment().endOf("week"); // Get the end of this week (Saturday)
      filtered = filtered.filter(
        (dispatch) =>
          moment(dispatch.createdOn).isBetween(
            startOfWeek,
            endOfWeek,
            "days",
            "[]"
          ) // Compare within this week
      );
    }
  }

  myCount.value = filtered?.length;
  return filtered;
});

watch([selectedATC, selectedTransporter, selectedDistrict, selectedDateFilter]);

const generateExcelUser = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "UserDispatches";

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = filteredDispatches.value;

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, "UserDispatches.xlsx");
};

const reloadPage = async () => {
  // Wait for getLoadingplans to complete its data fetching
  await getDispatches();

  // Navigate to the route after the data has been updated
  $router.push("/admin/user-dispatches");
};

const getUserDispatches = async () => {
  isLoading.value = true;
  try {
    const result = await dispatchStore.getdispatchUserSummary();
    const sortedData = result.reverse();
    const userFilteredData = sortedData;

    userdispaches.length = 0;
    userdispaches.push(...userFilteredData);

    // Populate filter datasets
    atcNumbers.value = [
      ...new Set(userFilteredData.map((item) => item.atcNumber)),
    ];

    transporters.value = [
      ...new Set(userFilteredData.map((item) => item.transporter)),
    ];
    districts.value = [
      ...new Set(userFilteredData.map((item) => item.district)),
    ];
  } finally {
    isLoading.value = false;
  }
};

const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispaches.length = 0; //empty array

      let sorteddata = result.reverse();

      const filterByDistrict = sorteddata.filter(
        (plan) => plan.Dispatcher?.district == user.value.district
      );

      dispaches.push(...filterByDistrict);

      allCount.value = dispaches.length;
    })

    .finally(() => {
      isLoading.value = false;
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
