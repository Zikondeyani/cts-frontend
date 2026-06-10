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
            Outbound Stock
          </h2>
        </div>
      </div>

      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap justify-between items-center gap-2">
          <!-- Tabs -->
          <div class="flex gap-2 flex-wrap">
            <button
              @click="activeTab = 'FoodItems'"
              :class="{
                'tab-button text-white': activeTab === 'FoodItems',
                'bg-white text-gray-800 border border-blue-800':
                  activeTab !== 'FoodItems',
              }"
              class="flex items-center py-2 px-4 rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
            >
              <i class="fas fa-check-circle mr-2"></i>
              Food Items
              <span
                v-if="foodItemsCount > 0"
                class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ foodItemsCount }}
              </span>
            </button>

            <button
              @click="activeTab = 'NFIS'"
              :class="{
                'tab-button text-white': activeTab === 'NFIS',
                'bg-white text-gray-800 border border-blue-800':
                  activeTab !== 'NFIS',
              }"
              class="flex items-center py-2 px-4 rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
            >
              <i class="fas fa-file-alt mr-2"></i>
              Non-Food Items
              <span
                v-if="nfisCount > 0"
                class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ nfisCount }}
              </span>
            </button>

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

          <!-- Actions: Export + Create -->
          <div class="flex gap-2 ml-auto">
            <button
              v-if="activeTab === 'FoodItems'"
              @click="exportFoodItems"
              class="font-body inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
            >
              Export Food Items
            </button>
            <button
              v-else-if="activeTab === 'NFIS'"
              @click="exportNFIS"
              class="font-body inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
            >
              Export NFIs
            </button>

            <!-- New Stock Register -->
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'NFIS'" class="mt-5">
        <section class="bg-transparent mt-6 rounded-table">
          <div class="container mx-auto min-w-full shadow-xl rounded-table">
            <!-- Export Button -->

            <div class="overflow-x-auto">
              <vue-good-table
                :columns="columns"
                :rows="nfisData"
                :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4"
                :pagination-options="{ enabled: true }"
                theme="polar-bear"
                styleClass="vgt-table striped"
                compactMode
              >
                <template #table-actions> </template>

                <template #table-row="props">
                  <span v-if="props.column.label == 'Options'">
                    <button
                      type="button"
                      @click="openTransferModal(props.row)"
                      class="font-heading inline-flex items-center px-4 py-2 border border-green-600 text-green-600 font-semibold text-xs rounded-md shadow-sm hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition ease-in-out duration-150"
                    >
                      <ArrowCircleRightIcon class="h-5 w-5 mr-2" />
                      Transfer Stock
                    </button>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'FoodItems'" class="mt-5">
        <section class="bg-transparent mt-6 rounded-table">
          <div class="container mx-auto min-w-full shadow-xl rounded-table">
            <!-- Export Button -->

            <div class="overflow-x-auto">
              <vue-good-table
                :columns="columns"
                :rows="foodItemsData"
                :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4"
                :pagination-options="{ enabled: true }"
                theme="polar-bear"
                styleClass="vgt-table striped"
                compactMode
              >
                <template #table-actions> </template>

                <template #table-row="props">
                  <span v-if="props.column.label == 'Options'">
                    <button
                      type="button"
                      @click="openTransferModal(props.row)"
                      class="font-heading inline-flex items-center px-4 py-2 border border-green-600 text-green-600 font-semibold text-xs rounded-md shadow-sm hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition ease-in-out duration-150"
                    >
                      <ArrowCircleRightIcon class="h-5 w-5 mr-2" />
                      Transfer Stock
                    </button>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
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
                  <span v-if="props.column.label == 'Status'">
                    <span
                      v-if="!props.row.IsReceived"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      <XCircleIcon class="h-4 w-4 mr-1" /> Not Received
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <CheckCircleIcon class="h-4 w-4 mr-1" /> Received
                    </span>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
      </div>

      <!-- Modal for Grouped Items -->
      <template v-if="showTransferModal">
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Transfer Stock</h3>

            <div class="space-y-4">
              <!-- Commodity Info -->
              <div>
                <label class="block text-sm font-medium">Commodity</label>
                <input
                  type="text"
                  :value="selectedInventory?.commodity?.Name"
                  readonly
                  class="w-full border rounded px-3 py-2 bg-gray-100"
                />

                <label class="block text-sm font-medium mt-2"
                  >Batch Number</label
                >
                <input
                  type="text"
                  :value="selectedInventory?.BatchNumber"
                  readonly
                  class="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>


                 <div>
                <label class="block text-sm font-medium"
                  >Action Requestor</label
                >
                <select
                  v-model="transferForm.actionrequestorsId"
                  class="w-full border rounded px-3 py-2"
                >
                  <option disabled value="">Select Action Requestor</option>
                  <option
                    v-for="wh in actionrequestor"
                    :key="wh.id"
                    :value="wh.id"
                  >
                    {{ wh.name }}
                  </option>
                </select>
              </div>

              <!-- Quantity to Transfer -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Quantity to Transfer
                  <span
                    v-if="selectedInventory?.commodity?.Container_type"
                    class="text-gray-500"
                  >
                    ({{ selectedInventory?.commodity?.Container_type }})
                  </span>
                </label>
                <input
                  type="number"
                  v-model="transferForm.quantity"
                  class="w-full border rounded px-3 py-2"
                />
              </div>

              <!-- Reason for Transfer -->
              <div>
                <label class="block text-sm font-medium mb-1"
                  >Reason for Transfer</label
                >
                <textarea
                  v-model="transferForm.reason"
                  class="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="Enter reason for transfer"
                ></textarea>
              </div>

              <!-- Delivery Note -->
              <div>
                <label class="block text-sm font-medium mb-1"
                  >Delivery Note</label
                >
                <input
                  type="text"
                  v-model="transferForm.deliveryNote"
                  class="w-full border rounded px-3 py-2"
                  placeholder="Enter delivery note (e.g. Transporter, vehicle details)"
                />
              </div>

              <!-- Destination Warehouse -->
              <div>
                <label class="block text-sm font-medium"
                  >Transfer To Warehouse</label
                >
                <select
                  v-model="transferForm.toWarehouseId"
                  class="w-full border rounded px-3 py-2"
                >
                  <option disabled value="">Select Warehouse</option>
                  <option
                    v-for="wh in warehouses.filter(
                      (wh) => wh.id !== selectedInventory?.warehouse?.id
                    )"
                    :key="wh.id"
                    :value="wh.id"
                  >
                    {{ wh.Name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end mt-6 space-x-2">
              <button
                @click="closeTransferModal"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                @click="transferStock"
                style="background-color: #096eb4"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </template>
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


import { useactionrequestorstore } from "../../../stores/action.requestor.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
// Variables
const isLoading = ref(false);
const activeTab = ref("FoodItems"); // Default tab
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


const actionrequestorstore = useactionrequestorstore();
const actionrequestor = reactive([]);

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
    label: "Batch No",
    field: (row) => row.BatchNumber,
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
    label: "Batch No",
    field: (row) => row.BatchNumber,
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
  getActionRequestors()
  getCommodityInventories();
  getWarehouses();
  getCommodityTransfers();
});

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
      ...inventories.filter(
        (item) =>
          item.commodity?.commodityTypeId == 2 &&
          item.warehouse?.district?.Name == user.value.district
      )
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
  actionrequestorsId: null,
  reason: "",
  deliveryNote: "",
  IsApproved: false,  
  IsReceived: false,
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

const getActionRequestors = async () => {
  actionrequestorstore
    .get()
    .then((result) => {
      actionrequestor.length = 0; //empty array

      actionrequestor.push(
        ...result
      );
    })
    .catch((error) => {})
    .finally(() => {});
};


const getCommodityTransfers = async () => {
  commodityTransferStore
    .get()
    .then((result) => {
      transfers.length = 0; //empty array

      transfers.push(
        ...result.filter(
          (item) => item.fromwarehouse?.district?.Name == user.value.district
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
button.bg-[#096eb4] {
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
