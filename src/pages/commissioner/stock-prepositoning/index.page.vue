<template>
  <main class="">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Prepositioned Stock Summary
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>
      </div>
      <!-- Table -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold">
        <vue-good-table 
          :columns="columns" 
          :rows="prepostocks" 
          :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" 
          :pagination-options="{ enabled: true }" 
          theme="polar-bear" 
          styleClass="vgt-table striped" 
          compactMode>
          <template #table-actions> </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import * as XLSX from 'xlsx';
import { useSessionStore } from "../../../stores/session.store";
import { useloadingplanstore } from "../../../stores/loadingplans.store";

const $router = useRouter();
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/commissioner/dashboard", current: false },
  { name: "Stock Prepositioning", href: "#", current: true },
];
const loadingplanStore = useloadingplanstore();
const prepostocks = reactive([]);
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
    label: "District",
    field: (row) => row.district,
    sortable: true,
    tdClass: "capitalize",
  },
  {
    label: "To Warehouse",
    field: (row) => row.warehouse,
    sortable: true,
    tdClass: "capitalize",
  },
  {
    label: "Commodity",
    field: (row) => row.commodity,
    sortable: true,
    tdClass: "capitalize",
  },
  {
    label: "Total Tonnage (MT)",
    field: (row) => row.totalTonnagePlanned,
    sortable: true,
    tdClass: "capitalize",
  },

  {
    label: "Total Dispatched Currently (MT)",
    field: (row) => row.totalTonnageDispatched,
    sortable: true,
    tdClass: "capitalize",
  },
]);

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Prepositioned_Stock';
  const dataToExport = prepostocks;
  const flattenedData = dataToExport.map(item => ({
    District: item.district,
    Commodity: item.commodity,
    'Total Tonnage (MT)': item.totalTonnage,
  }));

  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, 'Prepositioned_Stock_Summary.xlsx');
};

onMounted(() => {
  getPrepoStocks();
});

const getPrepoStocks = async () => {
  isLoading.value = true;
  try {
    const result = await loadingplanStore.getloadingplansPrepo();
    prepostocks.length = 0;
    const sortedData = result
    prepostocks.push(...sortedData);
  } catch (error) {
    console.error("Error fetching prepositioned stock data:", error);
  } finally {
    isLoading.value = false;
  }
};
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
