<template>
  <main class="">
    <!-- spinner -->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Stock Transfers
          </h2>
        </div>
      </div>

      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap justify-between items-center gap-2">
          <!-- Tabs -->
          <div class="flex gap-2 flex-wrap">
            <button
              @click="activeTab = 'Transfers'"
              :class="{
                'tab-button text-white': activeTab === 'Transfers',
                'bg-white text-gray-800 border border-blue-800':
                  activeTab !== 'Transfers',
              }"
              class="flex items-center py-2 px-4 rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
            >
              <i class="fas fa-file-alt mr-2"></i>
              Stock Transfers
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'Transfers'" class="mt-5">
        <section class="bg-transparent mt-6 rounded-table">
          <div class="container mx-auto min-w-full shadow-xl rounded-table">
            <!-- Export Button -->

            <div class="overflow-x-auto">
              <vue-good-table
                :columns="columns1"
                :rows="transfers"
                :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4"
                :pagination-options="{ enabled: true }"
                theme="polar-bear"
                styleClass="vgt-table striped"
                compactMode
              >
                <template #table-actions> </template>
                <template #table-row="props">
                  <span
                    v-if="props.column.label === 'Status'"
                    class="flex items-center gap-2"
                  >
                    <span
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                        props.row.IsReceived
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      <component
                        :is="
                          props.row.IsReceived ? CheckCircleIcon : XCircleIcon
                        "
                        class="h-4 w-4 mr-1"
                      />
                      {{ props.row.IsReceived ? "Received" : "Not Received" }}
                    </span>

                    <button
                      v-if="!props.row.IsReceived"
                      @click="markAsReceived(props.row)"
                      class="text-xs border border-blue-500 text-blue-500 rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white transition"
                    >
                      Mark as Received
                    </button>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowCircleRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createStockForm from "../../../components/pages/stocks/create.component.vue";
//SCHEMA//AND//STORES
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import { usecommoditytransfersservice } from "../../../stores/commoditytransfters.store";

import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "../../../stores/session.store";

import eventBus from "../../../services/events/eventbus";

//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
// Variables
const isLoading = ref(false);
const activeTab = ref("Transfers"); // Default tab
const nfisData = reactive([]); // Placeholder for NFIS data
const foodItemsData = reactive([]); // Placeholder for Food Items data

const openGroupedItems = ref(false);
const groupedItemsToView = ref([]);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Outbound Stock", href: "#", current: true },
];
const commodityInventorieStore = usecommodityinventoriestore();

const commodityTransferStore = usecommoditytransfersservice();
const transfers = reactive([]);

const warehouseStore = usewarehousestore();
const warehouses = reactive([]);

const inventories = reactive([]);
const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Commodity",
    field: (row) => row.commodity.Name,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "From",
    field: (row) => {
      if (row.groupedItems && row.groupedItems.length > 1) {
        return "Multiple";
      }
      return row.StockFrom;
    },
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Warehouse",
    field: (row) => row.warehouse.Name,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Quantity",
    field: (row) => `${row.Quantity} ${row.commodity?.Container_type}`,
    sortable: true,
    firstSortType: "asc",
  },
  { label: "Options", field: (row) => row, sortable: false },
]);

const columns1 = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Commodity",
    field: (row) => row.commodityInventory?.commodity.Name,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "From",
    field: (row) => row.fromwarehouse?.Name,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "To",
    field: (row) => row.towarehouse?.Name,
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Quantity",
    field: (row) =>
      `${row.quantity} ${row.commodityInventory?.commodity?.Container_type}`,
    sortable: true,
    firstSortType: "asc",
  },
  { label: "Status", field: (row) => row, sortable: false },
]);

onMounted(() => {
  getCommodityInventories();
  getWarehouses();
  getCommodityTransfers();
});

const markAsReceived = async (row) => {
  const result = await Swal.fire({
    title: "Mark as Received?",
    text: "This transfer will be marked as received.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, mark it!",
  });

  if (!result.isConfirmed) return;

  try {
    isLoading.value = true;
    await commodityTransferStore.update({ id: row.id, IsReceived: true });
  
    await Swal.fire({
      title: "Success!",
      text: "Transfer marked as received.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

 
    eventBus.emit("TransfersArchived", row.id);

    getCommodityTransfers(); // Refresh table


  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to update status", "error");
  } finally {
    isLoading.value = false;
  }
};

// Fetching data for NFIS and Food Items
const getCommodityInventories = async () => {
  isLoading.value = true;
  try {
    const result = await commodityInventorieStore.getAll();
    inventories.length = 0; // Clear inventories
    nfisData.length = 0;
    foodItemsData.length = 0;
    inventories.push(...result.reverse());
    inventories.sort((a, b) => new Date(b.created) - new Date(a.created));

    nfisData.push(
      ...inventories.filter((item) => item.commodity?.commodityTypeId == 2)
    );
    foodItemsData.push(
      ...inventories.filter(
        (item) =>
          item.commodity?.commodityTypeId == 1 &&
          item.warehouse?.district?.Name == user.value.district
      )
    );
  } catch (error) {
    Swal.fire({
      title: "Organisation Retrieval Failed",
      text: "Failed to get Commodity Inventories (Please refresh to try again)",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};

const openGroupedItemsModal = (row) => {
  groupedItemsToView.value = row.groupedItems || [];
  openGroupedItems.value = true;
};

const closeGroupedItems = () => {
  openGroupedItems.value = false;
  groupedItemsToView.value = [];
};

const createStock = async (model) => {
  isLoading.value = true;
  commodityInventorieStore
    .create(model)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Created a new stock successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create user (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getCommodityInventories();
    });
};

const exportToExcel = (data, fileName) => {
  // Format and flatten data
  const formattedData = data.map((item, index) => ({
    "#": index + 1,
    Commodity: item.commodity?.Name || "N/A",
    "Stock From":
      item.groupedItems && item.groupedItems.length > 1
        ? "Multiple"
        : item.StockFrom,
    Warehouse: item.warehouse?.Name || "N/A",
    Quantity: `${item.Quantity} ${item.commodity?.Container_type || ""}`,
    "Created On": moment(item.CreatedOn).format("YYYY-MM-DD HH:mm"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};

const exportFoodItems = () => {
  exportToExcel(foodItemsData, "FoodItems_Stock");
};

const exportNFIS = () => {
  exportToExcel(nfisData, "NFIS_Stock");
};

const showTransferModal = ref(false);
const selectedInventory = ref(null);
const transferForm = reactive({
  quantity: null,
  toWarehouseId: null,
});

const openTransferModal = (row) => {
  selectedInventory.value = row;
  transferForm.quantity = null;
  transferForm.toWarehouseId = null;
  showTransferModal.value = true;
};

const closeTransferModal = () => {
  showTransferModal.value = false;
  selectedInventory.value = null;
};

const transferStock = async () => {
  if (!transferForm.quantity || !transferForm.toWarehouseId) {
    Swal.fire("Error", "Please fill all fields", "error");
    return;
  }

  try {
    isLoading.value = true;
    await commodityTransferStore.create({
      commodityInventoryId: selectedInventory.value.id,
      quantity: transferForm.quantity,
      towarehouseId: transferForm.toWarehouseId,
      fromwarehouseId: selectedInventory.value.warehouse?.id,
    });
    Swal.fire("Success", "Stock transferred successfully", "success");
    closeTransferModal();
    getCommodityInventories(); // Refresh table
  } catch (error) {
    Swal.fire("Error", "Transfer failed", "error");
  } finally {
    isLoading.value = false;
  }
};

const getCommodityTransfers = async () => {
  commodityTransferStore
    .get()
    .then((result) => {
      transfers.length = 0; //empty array

      transfers.push(
        ...result.filter(
          (item) => item.towarehouse?.district?.Name == user.value.district
        )
      );
    })
    .catch((error) => {})
    .finally(() => {});
};

const getWarehouses = async () => {
  warehouseStore
    .get()
    .then((result) => {
      warehouses.length = 0; //empty array

      warehouses.push(
        ...result.filter((item) => item.organisation.Name == "DODMA")
      );
    })
    .catch((error) => {})
    .finally(() => {});
};

const getCommodities = async () => {
  commodityStore
    .get()
    .then((result) => {
      commodities.length = 0; //empty array
      commodities.push(...result);
    })
    .catch((error) => {})
    .finally(() => {});
};
</script>

<style scoped>
/* Styling for tabs */
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
button.bg-blue-500 {
  background-color: #3b82f6;
  color: white;
}

.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
