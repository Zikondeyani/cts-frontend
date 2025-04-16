<template>
  <main>
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Warehouse Management
          </h2>
        </div>
      </div>

      <div class="flex flex-wrap justify-center md:justify-start -mx-2 mt-7">
        <div
          v-for="option in options"
          :key="option.label"
          class="p-2 md:w-1/3 lg:w-1/5 group relative"
        >
          <router-link :to="option.path" class="block relative z-10">
            <div
              class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-400 transition m-2"
            >
              <component :is="option.icon" class="h-6 w-6 mb-2" />
              <span class="text-center p-2">{{ option.label }}</span>

              <!-- Requisition badge (unchanged) -->
              <div
                v-if="option.label === 'Requisitions' && requisitionCount > 0"
                class="absolute bottom-0 right-2 bg-red-600 text-white text-sm font-bold h-5 w-5 flex items-center justify-center rounded-sm"
              >
                {{ requisitionCount }}
              </div>
            </div>
          </router-link>

          <!-- Floating button below for OutBound Stock -->
          <router-link
            v-if="option.label === 'OutBound Stock'"
            to="/warehouse/stock-transfer-management"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap"
          >
            ➔ View Stock Transfers
          </router-link>

          <router-link
            v-if="option.label === 'Requisitions'"
            to="/warehouse/requisition-dispatch-management"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap"
          >
            ➔ View Requisition Dispatches
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import {
  ClipboardListIcon,
  TruckIcon,
  ArchiveIcon,
  WarehouseRefundIcon,
  OfficeBuildingIcon,
  ClipboardIcon,
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
} from "@heroicons/vue/outline";
const requisitionCount = ref(0); // Replace 5 with your dynamic value
const isLoading = ref(false); // Example reactive state
const breadcrumbs = [
  { name: "Home", href: "/manager/dashboard", current: false },
  { name: "Warehouse Management", href: "#", current: true },
];

import { useWarehouseRequisitionsStore } from "../../../stores/warehouserequisition.store";
import { useSessionStore } from "@/stores/session.store";
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const warehouseReqStore = useWarehouseRequisitionsStore();

const warehouseReq = reactive([]);
const options = ref([
  /* { label: 'Instructions', icon: ClipboardListIcon, path: '/instructions' },
  { label: 'Instructed Dispatches', icon: TruckIcon, path: '/instructed-dispatches' },
  { label: 'Instructed Commodities', icon: ArchiveIcon, path: '/instructed-commodities' },
  { label: 'Instructed Warehouses', icon: WarehouseRefundIcon, path: '/instructed-receipts' },
  */ {
    label: "Warehouses",
    icon: OfficeBuildingIcon,
    path: "/warehouse/warehouses",
  },

  {
    label: "Requisitions",
    icon: ClipboardIcon,
    path: "/warehouse/warehouserequisitions",
  },

  {
    label: "InBound Stock",
    icon: ArrowCircleDownIcon,
    path: "/warehouse/stock-management",
  },

  {
    label: "OutBound Stock",
    icon: TruckIcon,
    path: "/warehouse/outbound-stock-management",
  },

  /*  { label: 'Receipts', icon: ClipboardIcon, path: '/warehouse/receipts' },
   */
]);

onMounted(async () => {
  await getcommodityInventory();
});

const getcommodityInventory = async () => {
  try {
    const result = await warehouseReqStore.get();
    warehouseReq.length = 0;
    warehouseReq.push(
      ...result.filter(
        (item) => item.warehouse?.district?.Name == user.value.district && !item.isClosed
      )
    );

    requisitionCount.value = warehouseReq.length;
  } catch (error) {
    console.error("Error fetching Inventory Requestions:", error);
  }
};
</script>

<style>
/* Additional styles if needed */
</style>
