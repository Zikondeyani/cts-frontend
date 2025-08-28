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
            Inbound Stock Register
          </h2>
        </div>
      </div>

      <!-- Tabs Section -->

      <!-- Tabs Section -->
      <!-- Tabs + Actions Section -->
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
              Non Food Items
              <span
                v-if="nfisCount > 0"
                class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ nfisCount }}
              </span>
            </button>
          </div>

          <!-- Actions: Export + Create -->
          <div class="flex gap-2 ml-auto">
            <button
              v-if="activeTab === 'FoodItems'"
              @click="exportFoodItems"
              class="font-body inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
            >
              Export Food Items Data
            </button>
            <button
              v-else-if="activeTab === 'NFIS'"
              @click="exportNFIS"
              class="font-body inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
            >
              Export Non Food Item Data
            </button>

            <!-- New Stock Register -->
            <create-stock-form v-on:create="createStock" />
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
                  <span
                    v-if="props.column.label === 'Options'"
                    class="flex gap-2"
                  >
                    <!-- Edit Button -->

                    <span v-if="props.column.label === 'State'">
                      <span
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="[
                          !props.row.state || props.row.state === 'Ready'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ props.row.state || "Ready" }}
                      </span>
                    </span>

                    <button
                      @click="editStockState(props.row)"
                      class="inline-flex items-center px-3 py-1 bg-white text-green-600 font-semibold text-xs border border-green-600 rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300 transition ease-in-out duration-150"
                    >
                      <PencilIcon class="h-4 w-4 mr-1 text-green-600" />
                      Edit State
                    </button>

                    <!-- View Breakdown Button -->
                    <button
                      type="button"
                      @click="openGroupedItemsModal(props.row)"
                      class="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 font-semibold text-xs rounded-md shadow-sm hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition ease-in-out duration-150"
                    >
                      <EyeIcon class="h-5 w-5 mr-2" />
                      View Stock Breakdown
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
                  <span v-if="props.column.label === 'Warehouse'">
                    <span
                      class="whitespace-normal break-words text-sm text-gray-800"
                    >
                      {{ props.row.warehouse?.Name }}
                    </span>
                  </span>
                  <span v-if="props.column.label === 'State'">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="[
                        !props.row.state || props.row.state === 'Ready'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ props.row.state || "Ready" }}
                    </span>
                  </span>

                  <span
                    v-if="props.column.label === 'Options'"
                    class="flex gap-2"
                  >
                    <!-- Edit Stock State Button -->
                    <button
                      @click="editStockState(props.row)"
                      class="inline-flex items-center px-3 py-1 bg-white text-green-600 font-semibold text-xs border border-green-600 rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300 transition ease-in-out duration-150"
                    >
                      <PencilIcon class="h-4 w-4 mr-1 text-green-600" />
                      Edit State
                    </button>

                    <!-- View Stock Breakdown Button -->
                    <button
                      type="button"
                      @click="openGroupedItemsModal(props.row)"
                      class="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 font-semibold text-xs rounded-md shadow-sm hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                    >
                      <EyeIcon class="h-5 w-5 mr-2" />
                      View Stock Breakdown
                    </button>
                  </span>
                </template>
              </vue-good-table>
            </div>
          </div>
        </section>
      </div>

      <!-- Modal for Grouped Items -->
      <template v-if="openGroupedItems">
        <div id="content">
          <div
            class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
          >
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-5">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Grouped Stock Items</h3>
              </div>

              <div class="overflow-auto max-h-96">
                <table class="min-w-full table-auto border-collapse">
                  <thead>
                    <tr class="bg-blue-100">
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                      >
                        Commodity
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                      >
                        Stock From
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                      >
                        Quantity
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                      >
                        Type
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                      >
                        Created On
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in groupedItemsToView" :key="item.id">
                      <td class="px-4 py-2 text-sm text-gray-900">
                        {{ item.commodity?.Name }}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900">
                        {{ item.StockFrom }}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900">
                        {{ item.Quantity }} {{ item.commodity?.Container_type }}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900">
                        {{ item.type }}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900">
                        {{
                          moment(item.CreatedOn).format("MMMM Do YYYY, h:mm a")
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="flex justify-end mt-4">
                <button
                  type="button"
                  class="no-print px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  @click="closeGroupedItems"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Edit Stock State Modal -->
      <template v-if="editItem">
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">
              Edit Stock State
            </h3>

            <div class="space-y-4 text-sm text-gray-700">
              <div>
                <strong>Commodity:</strong> {{ selectedStock?.commodity?.Name }}
              </div>
              <div>
                <strong>Warehouse:</strong> {{ selectedStock?.warehouse?.Name }}
              </div>
              <div>
                <strong>Quantity:</strong> {{ selectedStock?.Quantity }}
                {{ selectedStock?.commodity?.Container_type }}
              </div>
              <div><strong>Stock Type:</strong> {{ selectedStock?.type }}</div>

              <div class="mt-4">
                <label for="stockState" class="block font-medium"
                  >Update Stock State</label
                >
                <select
                  id="stockState"
                  v-model="selectedStock.state"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option disabled value="">Select new state</option>
                  <option value="Ready">Ready</option>
                  <option value="Fumigation">Fumigation</option>
                  <option value="Rebagging">Rebagging</option>
                  <option value="Repacking">Repacking</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                @click="saveStockState"
                class="px-4 py-2 bg-[#096eb4] text-white rounded hover:bg-blue-700"
              >
                Save
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
import { useRouter, useRoute } from "vue-router";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsRightLeftIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createStockForm from "../../../components/pages/stocks/create.component.vue";
//SCHEMA//AND//STORES
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
// Variables
const isLoading = ref(false);
const activeTab = ref("FoodItems"); // Default tab
const nfisData = reactive([]); // Placeholder for NFIS data
const foodItemsData = reactive([]); // Placeholder for Food Items data

const editItem = ref(null);
const editItemState = ref("");
const selectedStock = ref(null);

const openGroupedItems = ref(false);
const groupedItemsToView = ref([]);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Stock Register", href: "#", current: true },
];
const commodityInventorieStore = usecommodityinventoriestore();
const inventories = reactive([]);
const columns = ref([
  {
    label: "Commodity",
    field: (row) => row.commodity.Name,
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
    label: "Batch",
    field: (row) => row.BatchNumber,
    sortable: true,
    firstSortType: "asc",
  },

  {
    label: "State",
    field: (row) => row.state || "Ready",
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Age",
    field: (row) => {
      const ageInDays = moment().diff(moment(row.CreatedOn), "days");
      return `${ageInDays} days`;
    },
    tdClass: (row) => {
      const ageInDays = moment().diff(moment(row.CreatedOn), "days");
      if (ageInDays > 180) return "text-red";
      if (ageInDays > 90) return "text-orange";
      return "text-green";
    },
    sortable: true,
    firstSortType: "desc",
  },
  {
    label: "Quantity",
    field: (row) => `${row.Quantity} ${row.commodity?.Container_type}`,
    sortable: true,
    firstSortType: "asc",
  },
  { label: "Options", field: (row) => row, sortable: false },
]);

onMounted(() => {
  getCommodityInventories();

  console.log(route.params.id);
});

const editStockState = (item) => {
  selectedStock.value = { ...item }; // shallow clone
  editItem.value = item;
  editItemState.value = item.state || "";
};

const cancelEdit = () => {
  editItem.value = null;
  editItemState.value = "";
};

const saveStockState = async () => {
  console.log("Stock state updated:");

  if (editItem.value) {
    // Update locally
    editItem.value.state = selectedStock.value.state;

    // Optionally, send update to API
    try {
      await commodityInventorieStore.update({
        id: editItem.value.id,
        state: editItem.value.state,
      });

      console.log("Stock state updated:", editItem.value.state);
      Swal.fire({
        title: "Updated",
        text: "Stock state successfully updated",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update stock state",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    cancelEdit();
  }
};

// Fetching data for NFIS and Food Items
const getCommodityInventories = async () => {
  isLoading.value = true;
  try {
    const result = await commodityInventorieStore.get();
    inventories.length = 0; // Clear inventories
    nfisData.length = 0;
    foodItemsData.length = 0;
    inventories.push(...result.reverse());
    inventories.sort((a, b) => new Date(b.created) - new Date(a.created));

    nfisData.push(
      ...inventories.filter(
        (item) =>
          item.commodity?.commodityTypeId === 2 &&
          item.warehouse?.id === Number(route.params.id)
      )
    );

    foodItemsData.push(
      ...inventories.filter(
        (item) =>
          item.commodity?.commodityTypeId === 1 &&
          item.warehouse?.id === Number(route.params.id)
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
