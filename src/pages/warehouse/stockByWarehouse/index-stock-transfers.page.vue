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
                      {{ props.row.IsReceived ? "Received" : "In Transit" }}
                    </span>

                    <button
                      v-if="!props.row.IsReceived"
                      @click="openReceiveModal(props.row)"
                      class="text-xs border border-blue-500 text-blue-500 rounded-md px-2 py-1 hover:bg-[#096eb4] hover:text-white transition"
                    >
                      Receive
                    </button>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
      </div>
    </div>

    <Dialog :open="showReceiveModal" @close="closeModal">
      <div
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-6 shadow-xl"
        >
          <div class="flex justify-between items-center border-b pb-3">
            <h2 class="text-xl font-semibold text-gray-800">
              Receive Stock Transfer (GRN)
            </h2>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              &times;
            </button>
          </div>

          <!-- Transfer Details -->
          <!-- Transfer Details -->
          <div
            class="bg-gray-100 p-4 rounded-lg space-y-2 text-sm text-gray-700"
          >
            <div>
              <strong>Commodity:</strong>
              {{
                selectedTransfer?.commodityInventory?.commodity?.Name || "N/A"
              }}
            </div>
            <div>
              <strong>Batch No:</strong>
              {{ selectedTransfer?.BatchNumber || "N/A" }}
            </div>
            <div>
              <strong>From:</strong>
              {{ selectedTransfer?.fromwarehouse?.Name || "N/A" }}
            </div>
            <div>
              <strong>To:</strong>
              {{ selectedTransfer?.towarehouse?.Name || "N/A" }}
            </div>
            <div>
              <strong>Quantity:</strong>
              {{ selectedTransfer?.quantity || "N/A" }}
              {{
                selectedTransfer?.commodityInventory?.commodity
                  ?.Container_type || ""
              }}
            </div>
          </div>

          <!-- GRN Entries -->
          <div
            v-for="(entry, index) in grnEntries"
            :key="index"
            class="space-y-4 border-b pb-6"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-semibold text-gray-600">
                Entry {{ index + 1 }}
              </h3>
              <button
                @click="removeEntry(index)"
                v-if="grnEntries.length > 1"
                class="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Quantity</label
                >
                <input
                  type="number"
                  v-model.number="entry.quantity"
                  class="input"
                  placeholder="Quantity"
                  min="1"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Condition</label
                >
                <select v-model="entry.condition" class="input">
                  <option disabled value="">Select condition</option>
                  <option>Good</option>
                  <option>Damaged</option>
                  <option>Expired</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Remarks</label
                >
                <input
                  type="text"
                  v-model="entry.remarks"
                  class="input"
                  placeholder="Enter remarks"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Date Received</label
                >
                <input type="date" v-model="entry.receivedon" class="input" />
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-between items-center pt-2">
            <button
              @click="addEntry"
              class="text-blue-600 text-sm font-medium hover:underline"
            >
              + Add Another Entry
            </button>

            <button
              @click="submitGRN"
              class="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit GRN
            </button>
          </div>
        </div>
      </div>
    </Dialog>
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

import { usecommoditytransfersreceiptsservice } from "../../../stores/commoditytransftersreceipts.store";

import { useSessionStore } from "../../../stores/session.store";

import eventBus from "../../../services/events/eventbus";

const props = defineProps({
  transfer: Object,
  showReceiveModal: Boolean,
});

const selectedTransfer = ref(null);
const showReceiveModal = ref(false);

const emit = defineEmits(["close", "refresh"]);

const grnEntries = ref([
  {
    id: null, // This will be set when the transfer is selected
    quantity: null,
    condition: "",
    remarks: "",
    receivedon: new Date().toISOString().substring(0, 10),
  },
]);

const openReceiveModal = (transfer) => {
  selectedTransfer.value = transfer;
  // Set the id of all existing grn entries to the transfer id
  grnEntries.value = [
    {
      id: transfer.id, // <-- Set id here
      quantity: null,
      condition: "",
      remarks: "",
      receivedon: new Date().toISOString().substring(0, 10),
    },
  ];
  showReceiveModal.value = true;
};

const addEntry = () => {
  grnEntries.value.push({
    id: selectedTransfer.value ? selectedTransfer.value.id : null, // <-- Set id here
    quantity: null,
    condition: "",
    remarks: "",
    receivedon: new Date().toISOString().substring(0, 10),
  });
};

const removeEntry = (index) => {
  grnEntries.value.splice(index, 1);
};

const closeModal = () => {
  showReceiveModal.value = false; // close modal
  emit("close");
  grnEntries.value = [
    {
      quantity: null,
      condition: "",
      remarks: "",
      receivedon: new Date().toISOString().substring(0, 10),
    },
  ];
};

const submitGRN = async () => {
  const allValid = grnEntries.value.every(
    (e) => e.quantity && e.condition && e.receivedon
  );
  if (!allValid) {
    Swal.fire("Error", "Please fill all required GRN fields.", "error");
    return;
  }

  try {
    for (const entry of grnEntries.value) {
      await commodityTransferReceiptsStore.create({
        commoditytransfersId: entry.id,
        quantity: entry.quantity,
        condition: entry.condition,
        remarks: entry.remarks,
        receivedon: entry.receivedon,
      });
    }

    Swal.fire("Success", "GRN entries submitted.", "success");
    closeModal();

    // Refresh the list
    await getCommodityTransfers();
  } catch (error) {
    console.error("GRN submission failed:", error);
    Swal.fire("Error", "Submission failed. Try again.", "error");
  }
};

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

const commodityTransferReceiptsStore = usecommoditytransfersreceiptsservice();

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

.input {
  @apply w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
