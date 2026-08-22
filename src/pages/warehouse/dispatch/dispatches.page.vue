<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Dispatches
          </h2>
        </div>

        <button type="button"
          class="font-body inline-block px-6 py-2.5 mt-2 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel()">
          Export Data
        </button>
      </div>

      <!-- table -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold">
        <vue-good-table :columns="columns" :rows="myDispatches"
          :search-options="{ enabled: true }" style="font-weight: bold; color: blue;" :pagination-options="{ enabled: true }"
          theme="polar-bear" styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <div v-if="props.column.label === 'Options'" class="flex space-x-2">
              <button @click="openEditDispatch(props.row)"
                class="flex items-center text-green-500 hover:text-green-700 transition duration-300 ease-in-out">
                <PencilIcon class="h-5 w-5 inline-block mr-1" />
                <span>Edit</span>
              </button>
            </div>
          </template>
        </vue-good-table>

        <!-- Edit Dispatch Dialog -->
        <TransitionRoot as="template" :show="isEditDialogOpen">
          <Dialog as="div" class="relative z-50" @close="closeEditDialog">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
              leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 z-50 overflow-y-auto">
              <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <TransitionChild as="template" enter="ease-out duration-300"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                  leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                  <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full max-w-2xl sm:p-6">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Edit Dispatch
                    </DialogTitle>
                    <div class="space-y-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Delivery Note</label>
                          <input v-model="dispatchForm.DeliveryNote" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Driver Name</label>
                          <input v-model="dispatchForm.DriverName" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Driver License</label>
                          <input v-model="dispatchForm.DriverLicense" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input v-model="dispatchForm.PhoneNumber" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Truck Number</label>
                          <input v-model="dispatchForm.TruckNumber" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Destination Point</label>
                          <input v-model="dispatchForm.FinalDestinationPoint" type="text" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Dispatch Date</label>
                          <input v-model="dispatchForm.Date" type="date" class="mt-1 w-full input" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">District</label>
                          <select v-model="dispatchForm.districtId" class="mt-1 w-full input">
                            <option disabled value="">Select District</option>
                            <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.Name }}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Quantity</label>
                        <input v-model.number="dispatchForm.quantity" type="number" class="mt-1 w-full input" />
                      </div>
                      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeEditDialog"
                          class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm">
                          Cancel
                        </button>
                        <button type="button" @click="updateDispatch"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                          Update
                        </button>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

      </div>
    </div>
  </main>
</template>
<script setup>
// import the styles

import { inject, ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  PencilIcon,
} from "@heroicons/vue/solid";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import * as XLSX from "xlsx";

import { useWarehouseDispatchesStore } from "../../../stores/warehousedispatches.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { useSessionStore } from "../../../stores/session.store";

//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/warehouse/dashboard", current: false },
  { name: "Dispatches", href: "#", current: true },
];

const dispatchStore = useWarehouseDispatchesStore();
const districtstore = usedistrictstore();
const sessionStore = useSessionStore();
const dispaches = reactive([]);
const userdispaches = reactive([]);
const districts = reactive([]);

// Tab state (mirrors dispatcher page)
const activeTab = ref("all");
const allCount = ref(0);
const myCount = ref(0);
const user = ref(sessionStore.getUser);

const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Quantity",
    field: (row) => `
      <span class="badge badge-info">${row.Quantity ? row.Quantity + " " + (row.commodity?.Container_type || "") : "Not specified"}</span><br>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Details",
    field: (row) => `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Ref: ${row.warehouserequisitions?.referenceNumber || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">D.N: ${row.DeliveryNote || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">To: ${row.FinalDestinationPoint || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">On: ${moment(row.Date).format("DD/MM/YYYY") || "N/A"}</span>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Dispatch Details",
    field: (row) => `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Commodity: ${row.commodity?.Name || "N/A"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">Truck: ${row.TruckNumber || "Not Available"}</span><br>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Driver: ${row.DriverName || "Not Specified"}</span>
    `,
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize",
  },
  {
    label: "Options",
    field: (row) => row,
    sortable: false,
  },
]);
// "My Dispatches" - dispatches whose district matches the current user's district
const myDispatches = computed(() => {
  if (!user.value?.district) return userdispaches;
  return userdispaches.filter((d) => d.district?.Name === user.value.district);
});

// Edit dialog state
const isEditDialogOpen = ref(false);
const selectedDispatch = ref(null);
const dispatchForm = reactive({
  id: null,
  DeliveryNote: "",
  DriverName: "",
  DriverLicense: "",
  FinalDestinationPoint: "",
  TruckNumber: "",
  PhoneNumber: "",
  Date: "",
  districtId: "",
  warehouserequisitionsId: "",
  commodityId: null,
  quantity: null,
});

const openEditDispatch = (dispatch) => {
  dispatchForm.id = dispatch.id;
  dispatchForm.DeliveryNote = dispatch.DeliveryNote || "";
  dispatchForm.DriverName = dispatch.DriverName || "";
  dispatchForm.DriverLicense = dispatch.DriverLicense || "";
  dispatchForm.FinalDestinationPoint = dispatch.FinalDestinationPoint || "";
  dispatchForm.TruckNumber = dispatch.TruckNumber || "";
  dispatchForm.PhoneNumber = dispatch.PhoneNumber || "";
  dispatchForm.Date = dispatch.Date ? moment(dispatch.Date).format("YYYY-MM-DD") : "";
  dispatchForm.districtId = dispatch.districtId || "";
  dispatchForm.warehouserequisitionsId = dispatch.warehouserequisitionsId || "";
  dispatchForm.commodityId = dispatch.commodityId || null;
  dispatchForm.quantity = dispatch.Quantity ?? null;
  selectedDispatch.value = dispatch;
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  selectedDispatch.value = null;
};

const updateDispatch = async () => {
  try {
    const payload = {
      id: dispatchForm.id,
      DeliveryNote: dispatchForm.DeliveryNote,
      FinalDestinationPoint: dispatchForm.FinalDestinationPoint,
      Date: moment(dispatchForm.Date).toISOString(),
      DriverName: dispatchForm.DriverName,
      DriverLicense: dispatchForm.DriverLicense,
      PhoneNumber: dispatchForm.PhoneNumber,
      TruckNumber: dispatchForm.TruckNumber,
      districtId: Number(dispatchForm.districtId),
      warehouserequisitionsId: Number(dispatchForm.warehouserequisitionsId),
      commodityId: Number(dispatchForm.commodityId),
      Quantity: Number(dispatchForm.quantity),
    };
    await dispatchStore.update(payload);
    await Swal.fire({
      title: "Success",
      text: "Dispatch updated successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });
    closeEditDialog();
    await getDispatches();
  } catch (error) {
    console.error("Dispatch update failed", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong while updating the dispatch.",
      icon: "error",
    });
  }
};

const getDistricts = async () => {
  try {
    const data = await districtstore.get();
    districts.splice(0, districts.length, ...data);
  } catch (error) {
    console.error("Error fetching districts:", error);
  }
};

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "Dispatches";
  const dataForExport = dispaches.map((keepAttrs) => ({
    "Document Ref #": keepAttrs.warehouserequisitions?.referenceNumber || "",
    Commodity: keepAttrs.commodity?.Name || "",
    FDP: keepAttrs.FinalDestinationPoint || "",
    Quantity: `${keepAttrs.Quantity ?? ""} ${keepAttrs.commodity?.Container_type || ""}`,
    "Driver Name": keepAttrs.DriverName || "",
    "Truck Number": keepAttrs.TruckNumber || "",
    "Dispatch Date": keepAttrs.Date ? moment(keepAttrs.Date).format("DD/MM/YYYY") : "",
  }));
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, "Warehouse_Requisition_Dispatches.xlsx");
};

const generateExcelUser = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "Dispatches";
  const dataForExport = myDispatches.value.map((keepAttrs) => ({
    "Document Ref #": keepAttrs.warehouserequisitions?.referenceNumber || "",
    Commodity: keepAttrs.commodity?.Name || "",
    FDP: keepAttrs.FinalDestinationPoint || "",
    Quantity: `${keepAttrs.Quantity ?? ""} ${keepAttrs.commodity?.Container_type || ""}`,
    "Driver Name": keepAttrs.DriverName || "",
    "Truck Number": keepAttrs.TruckNumber || "",
    "Dispatch Date": keepAttrs.Date ? moment(keepAttrs.Date).format("DD/MM/YYYY") : "",
  }));
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, "My_Dispatches.xlsx");
};

//MOUNTED
onMounted(() => {
  getDispatches();
  getDistricts();
});

const reloadPage = async () => {
  await getDispatches();
};

const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then((result) => {
      dispaches.length = 0;
      userdispaches.length = 0;
      // Show all warehouse requisition dispatches (most recent first)
      dispaches.push(...result.reverse());
      userdispaches.push(...dispaches);
      allCount.value = dispaches.length;
      myCount.value = user.value?.district
        ? userdispaches.filter((d) => d.district?.Name === user.value.district).length
        : userdispaches.length;
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>
<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
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
</style>
