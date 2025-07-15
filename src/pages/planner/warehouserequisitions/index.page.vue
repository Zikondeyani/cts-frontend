<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-white text-2xl">Warehouse Requisitions</h2>
        </div>

        <router-link
          to="/planner/stock-management"
          class="ml-4 font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white text-xs rounded shadow-md hover:bg-gray-600 transition"
        >
          View Stocks
        </router-link>

        <div class="mt-5 flex ml-4 justify-center sm:mt-0">
          <create-report-form v-on:create="createReport" />
        </div>
      </div>

      <section class="bg-transparent mt-6 rounded-table">
        <div class="container mx-auto min-w-full shadow-xl rounded-table">
          <div class="overflow-x-auto">
            <vue-good-table
              :columns="columns"
              :rows="loadingplans"
              :search-options="{ enabled: true }"
              :pagination-options="{ enabled: true }"
              style="font-weight: bold; color: #096eb4"
              theme="polar-bear"
              styleClass="vgt-table striped"
              compactMode
            >
              <template #table-row="props">
                <div
                  v-if="props.column.label === 'Options'"
                  class="flex flex-wrap md:flex-nowrap gap-2 max-w-full"
                >
                  <!-- View Request -->
                  <button
                    v-if="!props.row.isFromHQ"
                    @click="openViewLetterModalFrom(props.row)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-green-500 text-green-500 font-semibold text-xs rounded-md shadow-sm hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150 whitespace-nowrap"
                  >
                    <DocumentIcon class="h-4 w-4 mr-1" />
                    View
                  </button>

                  <button
                    v-else
                    @click="openViewLetterModal(props.row)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-green-500 text-green-500 font-semibold text-xs rounded-md shadow-sm hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150 whitespace-nowrap"
                  >
                    <DocumentIcon class="h-4 w-4 mr-1" />
                    View
                  </button>

                  <!-- Approve Button - show only if not approved -->
                  <button
                    v-if="!props.row.isApproved"
                    @click="approveRequisition(props.row)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-yellow-500 text-yellow-500 font-semibold text-xs rounded-md shadow-sm hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150 whitespace-nowrap"
                  >
                    <CheckCircleIcon class="h-4 w-4 mr-1" />
                    Approve
                  </button>

                  <!-- Delete Button -->
                  <button
                    @click="deleteItem(props.row.id)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-red-500 text-red-500 font-semibold text-xs rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150 whitespace-nowrap"
                  >
                    <TrashIcon class="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </template>
            </vue-good-table>
          </div>
        </div>

        <TransitionRoot as="template" :show="showLetterModalFrom">
          <Dialog
            as="div"
            class="relative z-10"
            @close="showLetterModalFrom = false"
          > 
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />
            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-8 shadow-xl transition-all"
                  >
                    <div id="letterContent">
                      <DialogTitle
                        class="text-xl font-bold text-center text-gray-900 mb-6"
                      >
                        <img
                          src="../../../assets/images/images.png"
                          alt="DODMA Logo"
                          class="h-20 mx-auto mb-4"
                        />
                        DEPARTMENT OF DISASTER MANAGEMENT AFFAIRS 
                      </DialogTitle>

                      <div
                        class="text-left text-gray-800 leading-relaxed text-[15px] font-[Times New Roman]"
                      >
                        <p>
                          <strong>Ref. No:</strong>
                          {{ selectedLetter?.referenceNumber }}
                          <span class="float-right"
                            ><strong>{{ selectedLetter?.date }}</strong></span
                          >
                        </p>

                        <p class="mt-4">
                          <strong>From:</strong> {{ selectedLetter?.toName }}
                        </p>

                        <p class="mt-6">
                          <strong>Subject:</strong>
                          {{ selectedLetter?.subject }}
                        </p>

                        <p class="mt-4">
                          {{ selectedLetter?.description }}
                        </p>

                        <p class="mt-4"><strong>Items Requested:</strong></p>
                        <ul class="list-decimal list-inside space-y-1">
                          <li
                            v-for="(item, index) in selectedLetter?.items"
                            :key="index"
                            class="text-sm text-gray-700"
                          >
                            <span class="font-semibold">
                              {{ item.commodity?.Name || "Unnamed Commodity" }}
                            </span>
                            -
                            <span>
                              {{ item.quantity || "0" }}
                              {{ item?.commodity?.Container_type || "" }}
                            </span>
                            <span class="ml-2 text-gray-500">
                              ({{ item.priority || "Unspecified" }} Priority)
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="mt-8 flex justify-between">
                      <button @click="downloadPDF" class="btn btn-primary">
                        Download Letter
                      </button>
                      <button
                        @click="showLetterModalFrom = false"
                        class="btn btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <TransitionRoot as="template" :show="showLetterModal">
          <Dialog
            as="div"
            class="relative z-10"
            @close="showLetterModal = false"
          >
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />
            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-8 shadow-xl transition-all"
                  >
                    <div id="letterContent">
                      <DialogTitle
                        class="text-xl font-bold text-center text-gray-900 mb-6"
                      >
                        <img
                          src="../../../assets/images/images.png"
                          alt="DODMA Logo"
                          class="h-20 mx-auto mb-4"
                        />
                        DEPARTMENT OF DISASTER MANAGEMENT AFFAIRS
                      </DialogTitle>

                      <div
                        class="text-left text-gray-800 leading-relaxed text-[15px] font-[Times New Roman]"
                      >
                        <p>
                          <strong>Ref. No:</strong>
                          {{ selectedLetter?.referenceNumber }}
                          <span class="float-right"
                            ><strong>{{ selectedLetter?.date }}</strong></span
                          >
                        </p>

                        <p class="mt-4 uppercase">
                          <strong>From:</strong> The Commissioner for Disaster
                          Management Affairs
                        </p>
                        <p>P/Bag 336, Lilongwe 3</p>

                        <p class="mt-4 uppercase">
                          <strong>To:</strong>
                          {{
                            selectedLetter.district?.id ||
                            "Warehouse Officer and Stores Assistant"
                          }}
                        </p>

                        <p class="mt-6">
                          <strong>Subject:</strong>
                          {{ selectedLetter?.subject }}
                        </p>

                        <p class="mt-4">
                          {{ selectedLetter?.description }}
                        </p>

                        <p class="mt-4"><strong>Items Requested:</strong></p>
                        <ul class="list-decimal list-inside space-y-1">
                          <li
                            v-for="(item, index) in selectedLetter?.items"
                            :key="index"
                            class="text-sm text-gray-700"
                          >
                            <span class="font-semibold">
                              {{ item.commodity?.Name || "Unnamed Commodity" }}
                            </span>
                            -
                            <span>
                              {{ item.quantity || "0" }}
                              {{ item?.commodity?.Container_type || "" }}
                            </span>
                            <span class="ml-2 text-gray-500">
                              ({{ item.priority || "Unspecified" }} Priority)
                            </span>
                          </li>
                        </ul>

                        <p class="mt-8 font-semibold uppercase">
                          {{ selectedLetter?.signedBy }}
                        </p>
                        <p class="mt-2 font-semibold">
                          For: COMMISSIONER FOR DISASTER MANAGEMENT AFFAIRS
                        </p>
                      </div>
                    </div>
                    <div class="mt-8 flex justify-between">
                      <button @click="downloadPDF" class="btn btn-primary">
                        Download Letter
                      </button>
                      <button
                        @click="showLetterModal = false"
                        class="btn btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <TransitionRoot as="template" :show="showDispatchModal">
          <Dialog
            as="div"
            class="relative z-10"
            @close="showDispatchModal = false"
          >
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />
            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  enter="ease-out duration-300"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-6xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all text-left"
                  >
                    <div class="flex flex-col md:flex-row gap-6">
                      <!-- Dispatch Form -->
                      <div class="md:w-1/2">
                        <h2 class="text-lg font-semibold mb-2 text-blue-400">
                          Create a Dispatch
                        </h2>
                        <form @submit.prevent="submitDispatch">
                          <div class="space-y-4">
                            <!-- Row 1 -->
                            <div class="flex gap-4">
                              <input
                                v-model="dispatchForm.DeliveryNote"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Delivery Note"
                              />
                              <input
                                v-model="dispatchForm.DriverName"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Driver Name"
                              />
                            </div>

                            <!-- Row 2 -->
                            <div class="flex gap-4">
                              <input
                                v-model="dispatchForm.DriverLicense"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Driver License"
                              />
                              <input
                                v-model="dispatchForm.TruckNumber"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Truck Number"
                              />
                            </div>

                            <!-- Row 3 -->
                            <div class="flex gap-4">
                              <input
                                v-model="dispatchForm.PhoneNumber"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Phone Number"
                              />
                              <select
                                id="district"
                                name="district"
                                v-model="dispatchForm.districtId"
                                autocomplete="district-name"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option disabled value="">
                                  Select district
                                </option>
                                <option
                                  v-for="district in districts"
                                  :key="district.id"
                                  :value="district.id"
                                  class="uppercase"
                                >
                                  {{ district.Name }}
                                </option>
                              </select>
                            </div>

                            <!-- Row 4 -->
                            <div class="flex gap-4">
                              <input
                                v-model="dispatchForm.FinalDestinationPoint"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Final Destination"
                              />
                              <input
                                v-model="dispatchForm.Date"
                                type="date"
                                class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Dispatch Date"
                              />
                            </div>

                            <!-- Commodity List -->
                            <div class="mt-4">
                              <h3
                                class="text-lg font-semibold mb-2 text-blue-400"
                              >
                                Items to Dispatch
                              </h3>
                              <div
                                v-for="(item, index) in dispatchForm.items"
                                :key="index"
                                class="flex gap-2 items-center mt-2"
                              >
                                <select
                                  v-model="item.commodityId"
                                  class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option disabled value="">
                                    Select Commodity
                                  </option>
                                  <option
                                    v-for="reqItem in selectedRequisition.items"
                                    :key="reqItem.commodity.id"
                                    :value="reqItem.commodity.id"
                                    :disabled="
                                      selectedCommodityIds.includes(
                                        reqItem.commodity.id
                                      ) &&
                                      item.commodityId !== reqItem.commodity.id
                                    "
                                  >
                                    {{ reqItem.commodity?.Name }}
                                  </option>
                                </select>

                                <input
                                  v-model.number="item.quantity"
                                  type="number"
                                  min="0"
                                  :max="getRemainingBalance(item.commodityId)"
                                  class="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Qty"
                                />
                                <span
                                  v-if="item.commodityId"
                                  class="text-xs text-gray-500 ml-1"
                                >
                                  (Max:
                                  {{ getRemainingBalance(item.commodityId) }})
                                </span>

                                <button
                                  @click.prevent="removeItem(index)"
                                  class="text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                              <button
                                @click.prevent="addItem"
                                class="mt-2 text-sm font-semibold mb-2 text-blue-400"
                              >
                                + Add Commodity
                              </button>
                            </div>

                            <!-- Submit Buttons -->
                            <div class="flex gap-2 mt-4">
                              <button
                                type="button"
                                @click="showDispatchModal = false"
                                class="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                class="inline-flex ml-3 items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                              >
                                <CheckCircleIcon class="h-5 w-5 mr-1" />
                                Submit Dispatch
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      <!-- Requisition Summary -->
                      <div
                        class="md:w-1/2 bg-white border-l-2 border-gray-200 pl-6"
                      >
                        <h2 class="text-lg font-semibold mb-2 text-blue-400">
                          Requisition Summary
                        </h2>

                        <div class="mb-6">
                          <span class="text-sm font-bold text-gray-700"
                            >Ref:</span
                          >
                          <span class="text-sm text-gray-600">
                            {{ selectedRequisition.referenceNumber }}
                          </span>
                        </div>

                        <div class="mb-6">
                          <span class="text-sm font-bold text-gray-700"
                            >Date:</span
                          >
                          <span class="text-sm text-gray-600">
                            {{ selectedRequisition.date }}
                          </span>
                        </div>

                        <div class="mb-6">
                          <span class="text-sm font-bold text-gray-700"
                            >To:</span
                          >
                          <span class="text-sm text-gray-600">
                            {{ selectedRequisition.toName }}
                          </span>
                        </div>

                        <div class="mb-6">
                          <span class="text-sm font-bold text-gray-700"
                            >Subject:</span
                          >
                          <span class="text-sm text-gray-600">
                            {{ selectedRequisition.subject }}
                          </span>
                        </div>

                        <div class="mb-6">
                          <span class="text-sm font-bold text-gray-700"
                            >Description:</span
                          >
                          <span class="text-sm text-gray-600">
                            {{ selectedRequisition.description }}
                          </span>
                        </div>

                        <h3 class="text-lg font-semibold mb-2 text-blue-400">
                          Requested Items
                        </h3>
                        <ul class="list-disc ml-5 mt-1 space-y-1">
                          <li
                            v-for="(item, index) in selectedRequisition.items"
                            :key="index"
                            class="text-sm text-gray-700"
                          >
                            <span class="font-semibold">
                              {{ item.commodity?.Name || "Unnamed Commodity" }}
                            </span>
                            -
                            <span>
                              {{ item.quantity || "0" }}
                              {{ item?.commodity?.Container_type || "unit(s)" }}
                            </span>
                            <span class="ml-2 text-gray-500">
                              ({{ item.priority || "Unspecified" }} Priority)
                            </span>
                            <div class="ml-4 text-gray-600">
                              <span class="italic">Remaining balance:</span>
                              <span class="font-medium"
                                >{{ item.balance ?? "0" }}
                                {{
                                  item?.commodity?.Container_type || "unit(s)"
                                }}</span
                              >
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </section>
    </div>
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
import {
  DocumentIcon,
  TrashIcon,
  TruckIcon,
  CheckCircleIcon,
} from "@heroicons/vue/solid";

import spinnerWidget from "@/components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "@/components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createReportForm from "@/components/pages/reports/create.component-warehousereq.vue";
import { useWarehouseRequisitionsStore } from "@/stores/warehouserequisition.store";
import { useWarehouseDispatchesStore } from "@/stores/warehousedispatches.store";

import { usedistrictstore } from "@/stores/districts.store";

const Swal = inject("Swal");
import { useSessionStore } from "@/stores/session.store";
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
import html2pdf from "html2pdf.js";
const WarehouseRequisitionStore = useWarehouseRequisitionsStore();

const WarehouseDispathcesStore = useWarehouseDispatchesStore();

const districtstore = usedistrictstore();
const districts = reactive([]);
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
  { label: "Document Ref #", field: (row) => row.referenceNumber },
  { label: "Created", field: (row) => row.date },
  { label: "Warehouse", field: (row) => row.warehouse?.Name },
  { label: "Options", field: (row) => row },
]);
const loadingplans = reactive([]);
// Props
const props = defineProps({
  showLetterModal: Boolean,
  showLetterModalFrom: Boolean,
  selectedLetter: Object,
});

// Emits
const emit = defineEmits([
  "update:showLetterModal",
  "update:showLetterModalFrom",
]);

const openViewLetterModalFrom = (row) => {
  selectedLetter.value = row;
  showLetterModalFrom.value = true;
};
// Function to close modal
const showLetterModal = ref(props.showLetterModal);
watch(
  () => props.showLetterModal,
  (val) => (showLetterModal.value = val)
);
watch(showLetterModal, (val) => emit("update:showLetterModal", val));

// Function to close modal
const showLetterModalFrom = ref(props.showLetterModalFrom);
watch(
  () => props.showLetterModalFrom,
  (val) => (showLetterModalFrom.value = val)
);
watch(showLetterModalFrom, (val) => emit("update:showLetterModalFrom", val));

// PDF Download
const downloadPDF = () => {
  const element = document.getElementById("letterContent");
  html2pdf()
    .set({
      margin: 1,
      filename: "Warehouse_Requisition_Letter.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(element)
    .save();
};

onMounted(async () => {
  await getLoadingplans();
  await getDistricts();
});

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

const getLoadingplans = async () => {
  isLoading.value = true;
  try {
    const data = await WarehouseRequisitionStore.get();
    loadingplans.splice(
      0,
      loadingplans.length,
      ...data.slice().reverse() // to prevent mutating the original array
    );
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const createReport = async (reportData) => {
  const result = await Swal.fire({
    title: "Create Report?",
    text: "Are you sure you want to create this warehouse requisition?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, create it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  isLoading.value = true;
  try {
    const payload = {
      ...reportData,
      isFromHQ: true,
      releasedFromHQ: false,
      isApproved: true,
    };

    await WarehouseRequisitionStore.create(payload);
    await getLoadingplans();

    await Swal.fire({
      title: "Success!",
      text: "The report was created successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (e) {
    console.error(e);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong while creating the report.",
      icon: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
const deleteItem = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This requisition will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await WarehouseRequisitionStore.remove(id);
    await getLoadingplans();

    await Swal.fire({
      title: "Deleted!",
      text: "The requisition has been deleted.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "Something went wrong while deleting.", "error");
  }
};
const openViewLetterModal = (row) => {
  selectedLetter.value = row;
  showLetterModal.value = true;
};

const showDispatchModal = ref(false);
const selectedRequisition = ref(null);

const openDispatchDialog = (row) => {
  selectedRequisition.value = row;
  showDispatchModal.value = true;
};

const closeDispatchDialog = () => {
  showDispatchModal.value = false;
};
const getRemainingBalance = (commodityId) => {
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

const submitDispatch = async () => {
  // Check if at least one item exists
  if (!dispatchForm.items || dispatchForm.items.length === 0) {
    Swal.fire({
      title: "No Items",
      text: "Please add at least one item to dispatch.",
      icon: "warning",
    });
    return;
  }

  // Check for duplicates
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

  // Check if all required base fields are filled
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

  // Validate each item
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

  const overLimitItem = dispatchForm.items.find((item) => {
    const remaining = getRemainingBalance(item.commodityId);
    return item.quantity > remaining;
  });
  if (overLimitItem) {
    Swal.fire({
      title: "Quantity Exceeded",
      text: "One or more items exceed the allowed remaining balance.",
      icon: "warning",
    });
    return;
  }

  // Proceed with dispatch creation
  const baseDispatchDetails = {
    DeliveryNote: dispatchForm.DeliveryNote,
    FinalDestinationPoint: dispatchForm.FinalDestinationPoint,
    Date: dispatchForm.Date,
    DriverName: dispatchForm.DriverName,
    DriverLicense: dispatchForm.DriverLicense,
    PhoneNumber: dispatchForm.PhoneNumber,
    TruckNumber: dispatchForm.TruckNumber,
    districtId: dispatchForm.districtId?.id,
    warehouserequisitionsId: selectedRequisition.value.id,
  };

 
  try {
    const dispatchPromises = dispatchForm.items.map((item) => {
      const payload = {
        ...baseDispatchDetails,
        commodityId: item.commodityId,
        Quantity: item.quantity,
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

    showDispatchModal.value = false;

    getLoadingplans();
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

const approveRequisition = async (row) => {
  try {
    const confirmed = await Swal.fire({
      title: "Approve this requisition?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
    });

    if (confirmed.isConfirmed) {
      await WarehouseRequisitionStore.update({
        id: row.id,
        isApproved: true,
        isFromHQ: true,
        signedBy: user.value.firstname + " " + user.value.lastname,
      });
      await getLoadingplans();
      Swal.fire("Approved!", "The requisition has been approved.", "success");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Something went wrong while approving.", "error");
  }
};
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
