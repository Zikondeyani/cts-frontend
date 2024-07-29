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
            Requested Commodities
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>
      </div>


      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="requested" :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" :pagination-options="{
      enabled: true,
    }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-actions> </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import * as XLSX from 'xlsx';
import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dodma/dashboard", current: false },
  { name: "Required Commodities", href: "#", current: true },
  { name: "Emergency Response", href: "#", current: true },
];
import { userequisitionstore } from "../../../stores/requisition.store";

const requestedStore = userequisitionstore();
const requested = reactive([]);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const colorMap = reactive({
  Maize: "inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-purple-100 text-purple-500",
  Rice: "inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-blue-100 text-blue-500",
  Beans: "inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold bg-green-100 text-green-500",
  // Add more commodities and their respective colors here
});

const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Details",
    hidden: false,
    field: row => `<span class="${colorMap[row.commodity] || 'text-black'}">Commodity: ${row.commodity}</span><br>` + `<span>Disaster: ${row.disaster}</span><br>` +
      `<span>District: ${row.district}</span><br>` +
      `<span>Disaster Date: ${row.disasterDate}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Status",
    field: row => {
      if (row.distributed === row.required) {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Completed</span>`;
      } else if (row.distributed > 0) {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">Distribution in Progress</span>`;
      } else {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">Not Started</span>`;
      }
    },
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },
  {
    label: "Required (MT)",
    field: row => row.required.toLocaleString(),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Distributed (MT)",
    field: row => row.distributed.toLocaleString(),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 
  {
    label: "Percentage (%)",
    field: row => row.percentage + '%',
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
]);

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Lean-season-requested';
  const dataToExport = requested;
  const flattenedData = dataToExport.map(item => ({
    Disaster: item.disaster,
    'Disaster Date': item.disasterDate,
    District: item.district,
    Commodity: item.commodity,
    'Required (MT)': item.required,
    'Distributed (MT)': item.distributed,
    'Balance (MT)': item.balance,
    'Percentage (%)': item.percentage,
  }));

  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, 'Lean-season-requested-commodities.xlsx');
};

//MOUNTED
onMounted(() => {
  getrequested();
});

const getrequested = async () => {
  isLoading.value = true;
  requestedStore
    .getCommodityDistributionSummary()
    .then(result => {
      requested.length = 0;
      let sorteddata = result.reverse();
      requested.push(...sorteddata);
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.from-color {
  color: #096eb4;
}

.to-color {
  color: green;
}

.by-color {
  color: gray;
}
</style>
