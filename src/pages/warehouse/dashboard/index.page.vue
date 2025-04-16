<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>

      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-4">

          
          <!-- Welcome panel -->
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
                      <p class="text-xl font-bold text-gray-900 sm:text-2xl capitalize">
                        {{ user.username.replace(/\./g, ' ') }}
                      </p>
                      <p class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase">
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
                  <!-- Stats Cards -->
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold text-gray-800">{{
                          stat.value
                        }}</span>
                        <component
                          v-if="stat.label == 'Dispatch Status'"
                          :is="
                            stat.progress >= 50
                              ? CheckCircleIcon
                              : ExclamationCircleIcon
                          "
                          :class="`h-6 w-6 text-${
                            stat.progress >= 50 ? 'green-500' : 'red-500'
                          }`"
                        />
                        <component
                          v-else
                          :is="stat.icon"
                          :class="`h-6 w-6 text-${stat.iconColor}`"
                        />
                      </div>

                      <div class="text-sm font-medium text-gray-600 mt-2">
                        {{ stat.label }}
                      </div>
                    </div>
                    <div v-if="stat.percentageText" class="mt-4">
                      <div class="flex items-center justify-between">
                        <span
                          :class="
                            stat.progress >= 50
                              ? 'text-green-500'
                              : 'text-red-500'
                          "
                          >{{ stat.percentageText }}</span
                        >
                        <component
                          :is="
                            stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon
                          "
                          class="h-5 w-5"
                          :class="
                            stat.progress >= 50
                              ? 'text-green-500'
                              : 'text-red-500'
                          "
                        />
                      </div>

                      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          :class="
                            stat.progress >= 50 ? 'bg-gray-500' : 'bg-red-500'
                          "
                          class="h-2 rounded-full"
                          :style="{ width: stat.progress + '%' }"
                        ></div>
                      </div>
                    </div>
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
import { ref, reactive, onMounted, computed } from "vue";
import {
  AcademicCapIcon,
  TemplateIcon, // Assuming this is for Dashboard
  ChartBarIcon, // Assuming this is for Charts
  BadgeCheckIcon,
  DocumentDownloadIcon, // or an alternative if this specific icon doesn't exist
  CameraIcon,
  BellIcon,
  CashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
  TruckIcon,
  DocumentDuplicateIcon,
  CollectionIcon,
  IdentificationIcon,
  DocumentTextIcon,
  OfficeBuildingIcon,
  DocumentIcon, ClipboardListIcon, ExclamationCircleIcon, ExclamationIcon, ArrowUpIcon, ArrowDownIcon
} from "@heroicons/vue/outline";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";
import { useUserStore } from "../../../stores/user.store";
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import { usewarehousestore } from "../../../stores/warehouse.store";

const $router = useRouter();
const sessionStore = useSessionStore();
const userStore = useUserStore();
const loadingPlanStore = useloadingplanstore();
const warehouseStore = usewarehousestore();


const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);


const prepositionedStock = reactive([]);
const warehouseCount = ref(0);
const isLoading = ref(false);

// Fetch warehouses filtered by the user's district
const getWarehouses = async () => {
  const result = await warehouseStore.get();
  warehouseCount.value = result.filter((item) => item.district.Name === user.value.district).length;
};

// Fetch prepositioned stock filtered by the user's district
const getPrepositionedStock = async () => {
  const result = await loadingPlanStore.getloadingplansPrepo();
  prepositionedStock.length = 0;
  prepositionedStock.push(...result.filter((item) => item.district === user.value.district));
};


const totals = computed(() => {
  return prepositionedStock.reduce(
    (acc, item) => {
      acc.totalTonnagePlanned += item.totalTonnagePlanned;
      acc.totalTonnageDispatched += item.totalTonnageDispatched;
      return acc;
    },
    { totalTonnagePlanned: 0, totalTonnageDispatched: 0 }
  );
});

// Mount lifecycle hook
onMounted(() => {
  getWarehouses();
  getPrepositionedStock();
});


const stats = computed(() => [
  {
    label: "Total Stock Prepositioned",
    value: `${totals.value.totalTonnagePlanned} MT`,
    icon: ClipboardListIcon,
    iconColor: "green-500",
    percentageText: null,
  },
  {
    label: "Total Dispatched (In Transit)",
    value: `${totals.value.totalTonnageDispatched} MT`,
    icon: TruckIcon,
    iconColor: "blue-400",
    percentageText: "",
    textColor: "blue-600",
    showProgress: false,
  },
]);



</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.active-tab {
  background-color: #248cd6;
  color: white;
}

.bg-blue-500 {
  background-color: #096eb4;
}

.h-20 {
  height: 80px;
}

.mr-4 {
  margin-right: 16px;
}

img.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
