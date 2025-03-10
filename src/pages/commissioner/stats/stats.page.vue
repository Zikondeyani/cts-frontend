<template>
  <main>
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between">
        <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
          Statistics By Season
        </h2>
        <button type="button"
          class="font-body px-6 py-2.5 bg-gray-500 text-white rounded shadow-md hover:bg-gray-600 focus:outline-none"
          @click="generateExcel">
          Export Data
        </button>
      </div>

      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="filteredStats" :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }" theme="polar-bear" styleClass="vgt-table striped" compactMode>
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
import { useloadingplanstore } from "../../../stores/loadingplans.store";

const $router = useRouter();
const Swal = inject("Swal");
const isLoading = ref(false);
const statsStore = useloadingplanstore();
const stats = reactive([]);

const breadcrumbs = [
  { name: "Home", href: "/commissioner/dashboard", current: false },
  { name: "Stats By Activity & Season", href: "#", current: true },
];

const columns = ref([
  { label: "Activity", field: "activity", sortable: true, tdClass: "capitalize" },
  { label: "Commodity", field: "commodity", sortable: true, tdClass: "capitalize" },
  { label: "Planned (MT)", field: "totalStockPlanned", sortable: true },
  { label: "Dispatched (MT)", field: "totalTonnageDispatched", sortable: true },
  { label: "Loading Plans", field: "totalLoadingPlans", sortable: true }
]);

const filteredStats = ref([]);

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'CTS_Stats';
  const ws = XLSX.utils.json_to_sheet(filteredStats.value);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, 'stats-per-season.xlsx');
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const result = await statsStore.getDataSummaryAll();
    stats.length = 0;
    stats.push(...result.activities);
    filteredStats.value = stats.flatMap(act => 
      act.commodities.map(com => ({
        activity: act.activity,
        commodity: com.commodity,
        totalStockPlanned: com.totalStockPlanned.toFixed(2),
        totalTonnageDispatched: com.totalTonnageDispatched.toFixed(2),
        totalLoadingPlans: com.totalLoadingPlans,
        dispatchesReceivedPercentage: (com.dispatchesReceivedPercentage * 100).toFixed(2) + "%"
      }))
    );
  } finally {
    isLoading.value = false;
  }
});

</script>

<style>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
</style>
