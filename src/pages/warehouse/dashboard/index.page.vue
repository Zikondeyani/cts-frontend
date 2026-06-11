<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <div class="grid grid-cols-1 gap-4 lg:col-span-4">
          <section aria-labelledby="profile-overview-title">
            <div class="rounded-lg bg-white overflow-hidden shadow">
              <h2 class="sr-only" id="profile-overview-title">
                Profile Overview
              </h2>
              <div class="bg-white p-6 shadow-lg">
                <div class="sm:flex sm:items-center sm:justify-between">
                  <div class="sm:flex sm:space-x-5">
                    <div class="bg-white p-2 rounded-2xl shadow-0">
                      <p class="text-2xl font-semibold text-gray-900">
                        {{ greeting }},
                        {{ user.username.replace(/\./g, " ") }}
                      </p>
                      <p class="text-sm text-gray-500 mt-1">
                        It's {{ today }} • {{ currentTime }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-1 flex justify-center sm:mt-0">
                    <LocationMarkerIcon class="h-5 w-5 text-gray mr-2" />
                    <span class="text-gray font-medium text-sm">
                      {{ user.district }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-100 p-5">

                <!-- National Warehouse Directory -->
                <div v-if="user.district === 'National'">
                  <div class="mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">
                      National Warehouse Directory
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Access and monitor all registered warehouses under the national
                      warehouse network.
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div v-for="warehouse in nationalWarehouses" :key="warehouse.id"
                      @click="goToWarehouse(warehouse.id)"
                      class="bg-white border border-gray-200 rounded-lg shadow-sm p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md transition">
                      <div class="flex items-center justify-between">
                        <OfficeBuildingIcon class="h-8 w-8 text-gray-600" />
                      </div>

                      <h4 class="mt-3 text-lg font-semibold text-gray-900">
                        {{ warehouse.name }}
                      </h4>

                      <p class="text-sm text-gray-500 mt-1">
                        {{ warehouse.district?.Name }}
                      </p>

                      <div class="mt-3 text-gray-600 text-sm font-medium" @click="goToWarehouse(warehouse.id)">
                        View Warehouse →
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                    <div class="bg-white p-4 shadow rounded border" @click="goToPendingRequisitions()">
                      <p class="text-sm text-gray-500">
                        Total Requisitions ({{ user.district }})
                      </p>

                      <p class="text-3xl font-bold text-blue-600 mt-3">
                        {{ districtRequisitionCount }}
                      </p>

                      <p class="text-xs text-gray-500 mt-1">
                        Open warehouse requisitions
                      </p>
                    </div>

                    <!-- Low Stock Alerts -->
                    <div class="bg-white p-4 shadow rounded border" @click="openLowStockDialog">
                      <p class="text-sm text-gray-500">Low Stock Alerts</p>
                      <p class="text-2xl font-bold text-yellow-600">
                        {{ lowStockCount }}
                      </p>
                    </div>

                    <!-- Expiring Commodities -->
                    <div class="bg-white p-4 shadow rounded border" @click="openExpiryDialog">
                      <p class="text-sm text-gray-500">Expiring Commodities</p>
                      <p class="text-2xl font-bold text-red-500">
                        {{ expiryCount }}
                      </p>
                    </div>

                  </div>



                </div>

                <div v-if="showLowStockDialog"
                  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                  <div class="bg-white w-3/4 p-6 rounded shadow-lg">

                    <div class="flex justify-between mb-4">
                      <h2 class="text-lg font-bold">
                        Low Stock Commodities - {{ user.district }}
                      </h2>

                      <button @click="closeLowStockDialog">
                        ✕
                      </button>
                    </div>


                    <vue-good-table :columns="lowStockColumns" :rows="districtLowStockCommodities" :pagination-options="{
                      enabled: true,
                      perPage: 10
                    }" :search-options="{
                      enabled: true
                    }" />

                  </div>

                </div>

                <div v-if="showExpiryDialog"
                  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">


                  <div class="bg-white w-3/4 p-6 rounded shadow-lg">


                    <div class="flex justify-between mb-4">

                      <h2 class="text-lg font-bold">
                        Expiring Commodities - {{ user.district }}
                      </h2>


                      <button @click="closeExpiryDialog">
                        ✕
                      </button>

                    </div>


                    <vue-good-table :columns="expiryColumns" :rows="districtExpiryCommodities" :pagination-options="{
                      enabled: true,
                      perPage: 10
                    }" :search-options="{
                      enabled: true
                    }" />


                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  LocationMarkerIcon,
  ExclamationIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  DocumentTextIcon,
  OfficeBuildingIcon,
} from "@heroicons/vue/outline";

import MovementChart from "@/components/MovementChart.vue";
import { useRouter } from "vue-router";

import timeGreetingMixin from "../../../services/utils/timeGreetingMixin";

const { currentTime, greeting, today, updateTime } = timeGreetingMixin.setup();

const router = useRouter();

import { useSessionStore } from "../../../stores/session.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import { useWarehouseRequisitionsStore } from "../../../stores/warehouserequisition.store";
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";

const sessionStore = useSessionStore();
const warehouseStore = usewarehousestore();
const loadingPlanStore = useloadingplanstore();
const requisitionStore = useWarehouseRequisitionsStore();
const inventoryStore = usecommodityinventoriestore();

const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const prepositionedStock = ref([]);
const warehouseCount = ref(0);
const pendingRequisitions = ref([]);
const classificationData = ref({});
const selectedWarehouse = ref(null);
const showExpiryDialog = ref(false);

const showNoMovementDialog = ref(false);
const showFastMovingDialog = ref(false);
const showSlowMovingDialog = ref(false);




const nationalWarehouses = ref([]);


const districtLowStockCommodities = computed(() => {
  const items = classificationData.value?.lowStockCommodities || [];

  return items.filter(item =>
    item.districtName === user.value.district
  );
});


const districtExpiryCommodities = computed(() => {
  const items = classificationData.value?.nearingExpiryCommodities || [];

  return items.filter(item =>
    item.districtName === user.value.district
  );
});


const lowStockCount = computed(() => {
  return districtLowStockCommodities.value.length;
});


const expiryCount = computed(() => {
  return districtExpiryCommodities.value.length;
});

const lowStockColumns = [
  {
    label: "Commodity",
    field: "commodityName",
    sortable: true,
  },
  {
    label: "Type",
    field: "commodityTypeName",
    sortable: true,
  },
  {
    label: "Quantity",
    field: "quantity",
    sortable: true,
  },
  {
    label: "Warehouse",
    field: "warehouseName",
    sortable: true,
  },
];


const expiryColumns = [
  {
    label: "Commodity",
    field: "commodityName",
    sortable: true,
  },
  {
    label: "Type",
    field: "commodityTypeName",
    sortable: true,
  },
  {
    label: "Expiry Date",
    field: "expiryDate",
    sortable: true,
  },
];


function goToWarehouse(warehouseId) {
  router.push(`/warehouse/stock-management/ByWarehouse/${warehouseId}`);
}



function openNoMovementDialog() {
  showNoMovementDialog.value = true;
}
function closeNoMovementDialog() {
  showNoMovementDialog.value = false;
}

function openFastMovingDialog() {
  showFastMovingDialog.value = true;
}

function openExpiryDialog() {
  showExpiryDialog.value = true;
}

function closeFastMovingDialog() {
  showFastMovingDialog.value = false;
}

function openSlowMovingDialog() {
  showSlowMovingDialog.value = true;
}
function closeSlowMovingDialog() {
  showSlowMovingDialog.value = false;
}

function closeExpiryDialog() {
  showExpiryDialog.value = false;
}

const showLowStockDialog = ref(false);

function openLowStockDialog() {
  showLowStockDialog.value = true;
}

function closeLowStockDialog() {
  showLowStockDialog.value = false;
}


const filteredWarehouseStock = computed(() => {
  if (!selectedWarehouse.value) {
    return classificationData.value?.warehouseStock || [];
  }

  return (classificationData.value?.warehouseStock || []).filter(
    w => w.warehouseId === selectedWarehouse.value
  );
});



const districtRequisitionCount = computed(() => {
  return pendingRequisitions.value.length;
});
onMounted(async () => {
  updateTime();
  setInterval(updateTime, 1000);

  classificationData.value = await inventoryStore.getClassification();

  const allWarehouses = await warehouseStore.get();

  // National user
  if (user.value.district === "National") {
    nationalWarehouses.value = allWarehouses.filter(
      (w) => w.organisationId === 2
    );
    return;
  }

  // District users
  warehouseCount.value = allWarehouses.filter(
    (w) => w.district.Name === user.value.district
  ).length;

  const plans = await loadingPlanStore.getloadingplansPrepo();
  prepositionedStock.value = plans.filter(
    (p) => p.district === user.value.district
  );

  const data = await requisitionStore.get();
  pendingRequisitions.value = data.filter(
    (item) =>
      item.warehouse?.district?.Name == user.value.district &&
      !item.isClosed
  );

  classificationData.value = await inventoryStore.getClassification();
});

function goToPendingRequisitions() {
  router.push("/warehouse/warehouserequisitions");
}

function goToWarehouses() {
  router.push("/warehouse/warehouses");
}

const stats = computed(() => [
  {
    label: "Warehouses / Entities",
    value: warehouseCount.value,
    icon: OfficeBuildingIcon,
    iconColor: "blue-500",
    clickable: true,
    onClick: goToWarehouses,
  },
  {
    label: "Pending Requisitions",
    value: pendingRequisitions.value.length,
    icon: ExclamationIcon,
    iconColor: "yellow-500",
    clickable: true,
    onClick: goToPendingRequisitions,
  },
  {
    label: "Items Near Expiry",
    value: classificationData.value?.nearingExpiryCount || 0,
    icon: ClockIcon,
    iconColor: "red-400",
    clickable: true,
    onClick: openExpiryDialog,
  },
  {
    label: "Fast-Moving Items",
    value: classificationData.value?.summary?.fast || 0,
    icon: ArrowUpIcon,
    iconColor: "green-400",
    clickable: true,
    onClick: openFastMovingDialog,
  },
  {
    label: "Slow-Moving Items",
    value: classificationData.value?.summary?.slow || 0,
    icon: ArrowDownIcon,
    iconColor: "gray-500",
    clickable: true,
    onClick: openSlowMovingDialog,
  },
  {
    label: "No Movement",
    value: classificationData.value?.summary?.["no movement"] || 0,
    icon: DocumentTextIcon,
    iconColor: "blue-600",
    clickable: true,
    onClick: openNoMovementDialog,
  },
]);
</script>

<style scoped>
.bg-[#096eb4] {
  background-color: #096eb4;
}
</style>
