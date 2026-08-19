<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-white text-2xl">
            Warehouse Requisitions Dispatches
          </h2>
        </div>

        <div class="mt-5 flex ml-4 sm:mt-0">
          <button
            type="button"
            class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
            @click="exportToExcel()"
          >
            <i class="fas fa-file-export mr-2"></i>
            <!-- Icon (Font Awesome used as an example) -->
            Export Data
          </button>
        </div>
      </div>

      <section class="bg-transparent mt-6 rounded-table">
        <div class="container mx-auto min-w-full shadow-xl rounded-table">
          <div class="overflow-x-auto">
            <vue-good-table
              :columns="columns"
              :rows="dispatches"
              :search-options="{ enabled: true }"
              :pagination-options="{ enabled: true }"
              style="font-weight: bold; color: #096eb4"
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
                  <button
                    class="text-blue-600 text-sm hover:underline"
                    @click="openEditDispatch(props.row)"
                  >
                    Edit
                  </button>
                </span></template
              >
            </vue-good-table>
          </div>
        </div>
      </section>
    </div>
    <TransitionRoot as="template" :show="showDispatchModal">
      <Dialog as="div" class="relative z-50" @close="closeDispatchDialog">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full max-w-2xl sm:p-6"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {{ dispatchForm.id ? "Edit Dispatch" : "Create Dispatch" }}
                </DialogTitle>

                <!-- Dispatch Form Fields -->
                <!-- Professional Dispatch Form Layout -->
                <div class="space-y-6">
                  <!-- Dispatch Details -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-700 mb-2">
                      Dispatch Details
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Delivery Note</label
                        >
                        <input
                          v-model="dispatchForm.DeliveryNote"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter delivery note"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Driver Name</label
                        >
                        <input
                          v-model="dispatchForm.DriverName"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter driver's name"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Driver License</label
                        >
                        <input
                          v-model="dispatchForm.DriverLicense"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter license number"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Phone Number</label
                        >
                        <input
                          v-model="dispatchForm.PhoneNumber"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Truck Number</label
                        >
                        <input
                          v-model="dispatchForm.TruckNumber"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter truck number"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Destination Point</label
                        >
                        <input
                          v-model="dispatchForm.FinalDestinationPoint"
                          type="text"
                          class="mt-1 w-full input"
                          placeholder="Enter final destination"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Dispatch Date</label
                        >
                        <input
                          v-model="dispatchForm.Date"
                          type="date"
                          class="mt-1 w-full input"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >District</label
                        >
                        <select
                          v-model="dispatchForm.districtId"
                          class="mt-1 w-full input"
                        >
                          <option disabled value="">Select District</option>
                          <option
                            v-for="d in districts"
                            :key="d.id"
                            :value="d.id"
                          >
                            {{ d.Name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Items Section -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-md font-semibold text-gray-700">
                        Items to Dispatch
                      </h4>
                      <button
                        @click="addItem"
                        type="button"
                        class="text-blue-600 text-sm hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>
                    <div
                      v-for="(item, index) in dispatchForm.items"
                      :key="index"
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end"
                    >
                      <div class="md:col-span-6">
                        <label class="block text-sm font-medium text-gray-700"
                          >Commodity</label
                        >
                        <select
                          v-model="item.commodityId"
                          class="mt-1 w-full input"
                        >
                          <option disabled value="">Select Commodity</option>
                          <option
                            v-for="c in selectedRequisition?.items || []"
                            :key="c.commodity.id"
                            :value="c.commodity.id"
                          >
                            {{ c.commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="md:col-span-4">
                        <label class="block text-sm font-medium text-gray-700"
                          >Quantity</label
                        >
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          class="mt-1 w-full input"
                          placeholder="Enter quantity"
                        />
                      </div>

                      <div class="md:col-span-2 flex justify-end">
                        <button
                          @click="removeItem(index)"
                          type="button"
                          class="text-red-500 hover:text-red-700 font-semibold text-lg"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div
                    class="flex justify-end gap-3 pt-4 border-t border-gray-200"
                  >
                    <button
                      type="button"
                      @click="closeDispatchDialog"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="submitDispatch"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      {{ dispatchForm.id ? "Update" : "Submit" }}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch, inject, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import spinnerWidget from "@/components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "@/components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useWarehouseRequisitionsStore } from "@/stores/warehouserequisition.store";
import { useWarehouseDispatchesStore } from "@/stores/warehousedispatches.store";

import { usedistrictstore } from "@/stores/districts.store";

const Swal = inject("Swal");
const moment = inject("moment");
import { useSessionStore } from "@/stores/session.store";
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
import html2pdf from "html2pdf.js";
const WarehouseRequisitionStore = useWarehouseRequisitionsStore();
import * as XLSX from "xlsx";
const WarehouseDispathcesStore = useWarehouseDispatchesStore();

const districtstore = usedistrictstore();
const districts = reactive([]);

const dispatches = reactive([]);
const router = useRouter();
const selectedLetter = ref(null);

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/planner/dashboard", current: false },
  { name: "Requisitions", href: "#", current: true },
  { name: "Warehouse", href: "#", current: true },
];
const columns = ref([
  { label: "#", field: (row) => row.originalIndex + 1 },
  {
    label: "Document Ref #",
    field: (row) => row.warehouserequisitions?.referenceNumber,
  },
  { label: "Commodity", field: (row) => row.commodity?.Name },

  { label: "FDP", field: (row) => row.FinalDestinationPoint },
  {
    label: "Quantity",
    field: (row) => `${row.Quantity} ${row.commodity?.Container_type}`,
    sortable: true,
    firstSortType: "asc",
  },
  { label: "Options", field: (row) => row, sortable: false },
]);
const loadingplans = reactive([]);
// Props
const props = defineProps({
  showLetterModal: Boolean,
  selectedLetter: Object,
});

// Emits
const emit = defineEmits(["update:showLetterModal"]);

const openEditDispatch = (dispatch) => {
  dispatchForm.id = dispatch?.id;
  dispatchForm.DeliveryNote = dispatch?.DeliveryNote || "";
  dispatchForm.DriverName = dispatch?.DriverName || "";
  dispatchForm.DriverLicense = dispatch?.DriverLicense || "";
  dispatchForm.FinalDestinationPoint = dispatch?.FinalDestinationPoint || "";
  dispatchForm.TruckNumber = dispatch?.TruckNumber || "";
  dispatchForm.PhoneNumber = dispatch?.PhoneNumber || "";
  dispatchForm.Date = dispatch?.Date || "";
  dispatchForm.districtId = dispatch?.districtId || "";
  dispatchForm.warehouserequisitionsId =
    dispatch?.warehouserequisitionsId || "";
  dispatchForm.warehouserequisitions = dispatch?.warehouserequisitions || "";

  dispatchForm.items = [
    {
      commodityId: dispatch?.commodity?.id || null,
      quantity: dispatch?.Quantity || null,
    },
  ];

  selectedRequisition.value = dispatch?.warehouserequisitions || null;
  showDispatchModal.value = true;
};

onMounted(async () => {
  await getDispatches();
  await getLoadingplans();
  await getDistricts();
});

const exportToExcel = () => {
  const formattedData = dispatches.map((row, index) => ({
    "#": index + 1,
    "Document Ref #": row.warehouserequisitions?.referenceNumber || "",
    Commodity: row.commodity?.Name || "",
    FDP: row.FinalDestinationPoint || "",
    Quantity: `${row.Quantity} ${row.commodity?.Container_type || ""}`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dispatches");

  XLSX.writeFile(workbook, "Warehouse_Requisitions_Dispatches.xlsx");
};

const getDistricts = async () => {
  isLoading.value = true;
  try {
    const data = await districtstore.get();
    districts.splice(0, districts.length, ...data);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const getDispatches = async () => {
  isLoading.value = true;
  try {
    const data = await WarehouseDispathcesStore.get();
    dispatches.splice(
      0,
      dispatches.length,
      ...data.reverse() // to prevent mutating the original array
    );
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const getLoadingplans = async () => {
  isLoading.value = true;
  try {
    const data = await WarehouseRequisitionStore.get();
    loadingplans.splice(
      0,
      loadingplans.length,
      ...data
        .filter(
          ({ warehouse, isClosed }) =>
            warehouse?.district?.Name === user.value.district && !isClosed
        )
        .slice()
        .reverse() // to prevent mutating the original array
    );
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const showDispatchModal = ref(false);
const selectedRequisition = ref(null);

const getRemainingBalance = (commodityId, qty) => {
  console.log(selectedRequisition.value, "commodityId in getRemainingBalance");
  const reqItem = selectedRequisition.value.items.find(
    (item) => item.commodity.id === commodityId
  );
  return reqItem?.balance ?? 0;
};

const dispatchForm = reactive({
  DeliveryNote: "",
  DriverName: "",
  DriverLicense: "",
  FinalDestinationPoint: "",
  warehouserequisitionsId: "",
  TruckNumber: "",
  PhoneNumber: "",
  Date: "",
  districtId: "",
  items: [],
});

const addItem = () => {
  dispatchForm.items.push({ commodityId: null, quantity: null });
};

const removeItem = (index) => {
  dispatchForm.items.splice(index, 1);
};

const closeDispatchDialog = () => {
  showDispatchModal.value = false;
  dispatchForm.id = null;
  dispatchForm.DeliveryNote = "";
  dispatchForm.DriverName = "";
  dispatchForm.DriverLicense = "";
  dispatchForm.FinalDestinationPoint = "";
  dispatchForm.TruckNumber = "";
  dispatchForm.PhoneNumber = "";
  dispatchForm.Date = "";
  dispatchForm.districtId = "";
  dispatchForm.items = [];
};

const submitDispatch = async () => {
  if (!dispatchForm.items || dispatchForm.items.length === 0) {
    Swal.fire({
      title: "No Items",
      text: "Please add at least one item to dispatch.",
      icon: "warning",
    });
    return;
  }

  const commodityIds = dispatchForm.items.map((item) => item.commodityId);
  const uniqueIds = new Set(commodityIds);
  if (commodityIds.length !== uniqueIds.size) {
    Swal.fire({
      title: "Duplicate Commodities",
      text: "Each item must have a unique commodity.",
      icon: "warning",
    });
    return;
  }

  const requiredFields = [
    "DeliveryNote",
    "FinalDestinationPoint",
    "Date",
    "DriverName",
    "DriverLicense",
    "PhoneNumber",
    "TruckNumber",
    "districtId",
  ];
  const missingField = requiredFields.find((field) => !dispatchForm[field]);
  if (missingField) {
    Swal.fire({
      title: "Missing Info",
      text: "Please complete all dispatch details before submitting.",
      icon: "warning",
    });
    return;
  }

  const invalidItem = dispatchForm.items.find(
    (item) => !item.commodityId || !item.quantity || item.quantity <= 0
  );
  if (invalidItem) {
    Swal.fire({
      title: "Invalid Item",
      text: "All items must have a selected commodity and a quantity greater than 0.",
      icon: "warning",
    });
    return;
  }

  const baseDispatchDetails = {
    DeliveryNote: dispatchForm.DeliveryNote,
    FinalDestinationPoint: dispatchForm.FinalDestinationPoint,
    Date: moment(dispatchForm.Date).toISOString(),
    DriverName: dispatchForm.DriverName,
    DriverLicense: dispatchForm.DriverLicense,
    PhoneNumber: dispatchForm.PhoneNumber,
    TruckNumber: dispatchForm.TruckNumber,
    districtId: Number(
      dispatchForm.districtId?.id ||
      dispatchForm.districtId ||
      selectedRequisition.value?.districtId ||
      selectedRequisition.value?.warehouse?.district?.id
    ),
    warehouserequisitionsId: Number(selectedRequisition.value?.id),
  };

  try {
    if (dispatchForm.id) {
      // UPDATE LOGIC
      const payload = {
        ...baseDispatchDetails,
        commodityId: Number(dispatchForm.items[0].commodityId),
        Quantity: Number(dispatchForm.items[0].quantity),
        id: dispatchForm.id,
      };

      await WarehouseDispathcesStore.update(payload);

      Swal.fire({
        title: "Success",
        text: "Dispatch updated successfully.",
        icon: "success",
      });
    } else {
      // CREATE LOGIC
      const dispatchPromises = dispatchForm.items.map((item) => {
        const payload = {
          ...baseDispatchDetails,
          commodityId: Number(item.commodityId),
          Quantity: Number(item.quantity),
        };
        return WarehouseDispathcesStore.create(payload);
      });

      await Promise.all(dispatchPromises);

      Swal.fire({
        title: "Success",
        text: "Dispatches created for all items successfully.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }

    showDispatchModal.value = false;
    await getLoadingplans();
    await getDispatches();
    closeDispatchDialog();
  } catch (error) {
    console.error("Dispatch submission failed", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong while submitting dispatches.",
      icon: "error",
    });
  }
};

const selectedCommodityIds = computed(() => {
  return dispatchForm.items.map((item) => item.commodityId).filter(Boolean);
});
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
}
.btn {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50;
}
</style>
