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
        <div v-for="option in options" :key="option.label" class="p-2 md:w-1/3 lg:w-1/5 group relative">
          <router-link :to="option.path" class="block relative z-10">
            <div
              class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-400 transition m-2">
              <component :is="option.icon" class="h-6 w-6 mb-2" />


              <span class="text-center p-2">{{ option.label }}</span>

              <!-- Requisition badge (unchanged) -->
              <div v-if="option.label === 'Requisitions' && requisitionCount > 0"
                class="absolute bottom-0 right-2 bg-red-600 text-white text-sm font-bold h-5 w-5 flex items-center justify-center rounded-sm">
                {{ requisitionCount }}
              </div>
            </div>
          </router-link>



          <button v-if="option.label === 'Blank Sheet'" @click.stop="exportBlankInventorySheet"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap">
            ➔ Download Blank inventory count sheet
          </button>


          <router-link v-if="option.label === 'Warehouse Requisitions'" to="/planner/stock-transfer-management"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap">
            ➔ View Stock Transfers
          </router-link>

          <!-- Floating button below for OutBound Stock -->
          <router-link v-if="option.label === 'OutBound Stock'" to="/warehouse/stock-transfer-management"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap">
            ➔ View Stock Transfers
          </router-link>

          <router-link v-if="option.label === 'Requisitions'" to="/warehouse/requisition-dispatch-management"
            class="absolute left-1/2 -translate-x-1/2 mt-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-white text-[#096eb4] text-sm px-3 py-1 rounded shadow z-20 whitespace-nowrap">
            ➔ View Requisition Dispatches
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { DocumentDownloadIcon, DownloadIcon } from "@heroicons/vue/solid";
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const warehouseReqStore = useWarehouseRequisitionsStore();

const warehouseReq = reactive([]);
const options = computed(() => {
  const items = [
    {
      label: "Stock Register",
      icon: ArrowCircleDownIcon,
      path: "/warehouse/stock-management",
    },
    {
      label: "OutBound Stock",
      icon: TruckIcon,
      path: "/warehouse/outbound-stock-management",
    },

    {
      label: "Requisitions",
      icon: TruckIcon,
      path: "/warehouse/warehouserequisitions",
    },

    {
      label: "Blank Sheet",
      icon: DocumentDownloadIcon,
    },
  ];


  return items;
});
onMounted(async () => {
  await getcommodityInventory();
});


const isNational = computed(() => {
  return user.value?.district?.trim().toLowerCase() === "national";
});

const exportBlankInventorySheet = () => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      "Commodity",
      "BatchNumber",
      "Warehouse",
      "PhysicalCount",
      "Unit",
      "State",
      "Remarks",
      "CountedBy",
      "CountDate",
    ],
  ]);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 40 },
    { wch: 25 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Count");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "Inventory_Count_Template.xlsx"
  );
};


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
