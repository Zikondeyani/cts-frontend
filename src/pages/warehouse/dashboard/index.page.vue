<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2
            class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate"
          >
            Inventory Dashboard 
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
                    <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                      <p class="text-md font-medium font-heading text-gray-600">
                        Welcome back,
                      </p>
                      <p
                        class="text-xl font-bold text-gray-900 sm:text-2xl capitalize"
                      >
                        {{ user.username.replace(/\./g, " ") }}
                      </p>
                      <p
                        class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase"
                      >
                        {{ role.name }}
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
                
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                >
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between"
                    :class="{
                      'cursor-pointer hover:bg-gray-100': stat.clickable,
                    }"
                    @click="stat.clickable ? stat.onClick() : null"
                  >
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold text-gray-800">{{
                          stat.value
                        }}</span>
                        <component
                          :is="stat.icon"
                          class="h-6 w-6"
                          :class="`text-${stat.iconColor}`"
                        />
                      </div>
                      <div class="text-sm font-medium text-gray-600 mt-2">
                        {{ stat.label }}
                      </div>
                    </div>
                  </div>
                </div>


                 <div
                  v-if="showExpiryDialog"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                  <div
                    class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6"
                  >
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-semibold">
                       Commodities Nearing Expiry
                      </h3>
                      <button
                        class="text-gray-600 hover:text-gray-900"
                        @click="closeExpiryDialog"
                        aria-label="Close dialog"
                      >
                        &times;
                      </button>
                    </div>

                    <vue-good-table
                      :columns="expiryColumns"
                      :rows="expiryRows"
                      :pagination-options="{ enabled: true, perPage: 5 }"
                      :search-options="{ enabled: true }"
                      styleClass="vgt-table striped"
                      compactMode
                    />
                  </div>
                </div>

                <!-- No Movement Modal Dialog -->
                <div
                  v-if="showNoMovementDialog"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                  <div
                    class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6"
                  >
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-semibold">
                        No Movement Commodities
                      </h3>
                      <button
                        class="text-gray-600 hover:text-gray-900"
                        @click="closeNoMovementDialog"
                        aria-label="Close dialog"
                      >
                        &times;
                      </button>
                    </div>

                    <vue-good-table
                      :columns="movementColumns"
                      :rows="noMovementRows"
                      :pagination-options="{ enabled: true, perPage: 5 }"
                      :search-options="{ enabled: true }"
                      styleClass="vgt-table striped"
                      compactMode
                    />
                  </div>
                </div>

                <!-- Fast Moving Modal Dialog -->
                <div
                  v-if="showFastMovingDialog"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                  <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-semibold">Fast Moving Commodities</h3>
                      <button
                        class="text-gray-600 hover:text-gray-900"
                        @click="closeFastMovingDialog"
                        aria-label="Close dialog"
                      >
                        &times;
                      </button>
                    </div>

                    <vue-good-table
                      :columns="movementColumns"
                      :rows="fastMovingRows"
                      :pagination-options="{ enabled: true, perPage: 5 }"
                      :search-options="{ enabled: true }"
                      styleClass="vgt-table striped"
                      compactMode
                    />
                  </div>
                </div>

                <!-- Slow Moving Modal Dialog -->
                <div
                  v-if="showSlowMovingDialog"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                  <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-semibold">Slow Moving Commodities</h3>
                      <button
                        class="text-gray-600 hover:text-gray-900"
                        @click="closeSlowMovingDialog"
                        aria-label="Close dialog"
                      >
                        &times;
                      </button>
                    </div>

                    <vue-good-table
                      :columns="movementColumns"
                      :rows="slowMovingRows"
                      :pagination-options="{ enabled: true, perPage: 5 }"
                      :search-options="{ enabled: true }"
                      styleClass="vgt-table striped"
                      compactMode
                    />
                  </div>
                </div>

                <!-- Chart Section -->
                <div class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">
                   Inventory Movement Dashboard
                  </h3>
                  <div class="bg-white rounded-lg shadow-md p-4 h-120">
                    <MovementChart
                      :summary="classificationData.summary || {}"
                      :classification="classificationData"
                      :classificationCommodities="
                        classificationData.classificationCommodities
                      "
                    />
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

const showExpiryDialog = ref(false);

const showNoMovementDialog = ref(false);
const showFastMovingDialog = ref(false);
const showSlowMovingDialog = ref(false);

const movementColumns = [
  {
    label: "Commodity",
    field: "commodityName",
    sortable: true,
  },
  {
    label: "Status",
    field: "status",
    sortable: false,
  },
];

const expiryColumns = [
  {
    label: "Commodity",
    field: "commodityName",
    sortable: true,
  },
  {
    label: "Expiry Date",
    field: "expiryDate",
    sortable: false,
  },
];



const expiryRows = computed(() => {
  return (
    classificationData.value?.nearingExpiryCommodities || []
  ).map((item) => ({
    commodityName: item.commodityName,
    expiryDate: item.expiryDate,
  }));
});

const noMovementRows = computed(() => {
  return (
    classificationData.value?.classificationCommodities?.["no movement"] || []
  ).map((item) => ({
    commodityName: item.commodityName,
    status: "No Movement",
  }));
});

const fastMovingRows = computed(() => {
  return (
    classificationData.value?.classificationCommodities?.fast || []
  ).map((item) => ({
    commodityName: item.commodityName,
    status: "Fast Moving",
  }));
});

const slowMovingRows = computed(() => {
  return (
    classificationData.value?.classificationCommodities?.slow || []
  ).map((item) => ({
    commodityName: item.commodityName,
    status: "Slow Moving",
  }));
});

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

onMounted(async () => {
  const allWarehouses = await warehouseStore.get();
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
      item.warehouse?.district?.Name == user.value.district && !item.isClosed
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
.bg-blue-500 {
  background-color: #096eb4;
}
</style>
