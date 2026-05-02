<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Dispatches
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold">
        <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
                  style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
                  styleClass="vgt-table striped" compactMode>
                  <template #table-actions> </template>
                  <template #table-row="props">
                    <span v-if="props.column.label == 'Options'">




                      <button @click="openDispatchDialog(props.row)"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100">
                        <PlusCircleIcon class="h-5 w-5 mr-1" />
                        Create Receipt
                      </button>
                    </span>
                  </template>
                </vue-good-table>

                <ReceiptLoadingPlanDialog :isOpen="isReceiptDialogOpen" :dispatch="selectedDispatch"
                  @close="closeReceiptDialog" v-on:update="createLeanReceipt"
                  :close="closeModal" />

      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

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
  PlusCircleIcon,
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
import { SearchIcon } from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt-recipient.component.vue";

import EditDispatchDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";


import { usereceiptstore } from "../../../stores/receipt.store";


import eventBus from '../../../services/events/eventbus';

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/receipient/dashboard", current: false },
  { name: "Expected Dispatches", href: "#", current: true },
  { name: "Lean Season Response", href: "#", current: true },
];


import { useDispatcherStore } from "../../../stores/dispatch.store";



const dispatchStore = useDispatcherStore();
const dispaches = reactive([]);
const recieptStore = usereceiptstore();


import * as XLSX from 'xlsx';

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);


const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


  {
    label: "Quantity",
    hidden: false,
    field: row => `
    <span >${row.Quantity !== null ? row.Quantity + " MT" : "Pending"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span >D.N: ${row.DeliveryNote}</span><br>`
      +
      `<span>To: ${row.FinalDestinationPoint !== null ? row.FinalDestinationPoint : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },

  {
    label: "Dispatch Details",
    field: row => `
    <span class="from-color">Driver: ${row.DriverName || "Driver Not Specified"}</span><br>
    <span class="to-color">Truck: ${row.TruckNumber || "Not Available"}</span><br>
    <span class="by-color">By: ${row.Dispatcher?.username.replace(/\./g, ' ') || "Unknown"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Status",
    field: row => {
      const today = moment();
      const endDate = moment(row.loadingPlan?.EndDate);

      if (row.IsArchived) {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800'>Expensed</span>";
      } else if (!row.IsArchived && endDate.isBefore(today)) {
        const diffDays = today.diff(endDate, 'days');
        if (diffDays <= 3) {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>Delayed</span>";
        } else {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800'>Not Delivered</span>";
        }
      } else {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>Pending</span>";
      }
    },
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  }
  ,

  {
    label: "Options",
    field: row => row,
    sortable: false
  }


]);




const isEditDialogOpen = ref(false);

const selectedDispatch = ref(null);

// Function to open the edit dialog
const openEditDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};



const isReceiptDialogOpen = ref(false);

// Function to open the edit dialog
const openDispatchDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isReceiptDialogOpen.value = true;

};

// Function to close the edit dialog
const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};



const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Dispatches';

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = dispaches.map(({ CreatedOn, UpdatedOn, DispatcherId, loadingPlanId, Dispatcher, loadingPlan, InstructionId, ...keepAttrs }) => keepAttrs);

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dispaches);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'Dispatches.xlsx');
};


//MOUNTED
onMounted(() => {
  getDispatches();
  // getLatest()
});
//FUNCTIONS



const getDispatches = async () => {


  dispatchStore
    .expected(user.value.district)
    .then((result) => {
      dispaches.length = 0; //empty array
      let sorteddata = result.reverse();
      dispaches.push(...sorteddata);
    })
    .catch((error) => {

    })

}



const createReceipts = async (item) => {

// Wait for all promises to complete
await recieptStore.create(item);


getDispatches();
eventBus.emit('leaseasonDispatchesArchived', item.id);
  eventBus.emit('emergencyDispatchesArchived', item.id);
};


const createLeanReceipt = async (originalModel) => {

// Separate relief items from the original model

try {
  // Create the dispatch without the relief items

  // Pass the dispatch ID and the original relief items to create dispatched commodities

  for (const item of originalModel) {
    await createReceipts(item);
  }

  Swal.fire({
    title: "Success",
    text: "Created receipt(s) successfully",
    icon: "success",
    confirmButtonText: "Ok"
  });
  await recieptStore.get();

  $router.push({ path: '/receipient/receipts/leanseason' });
} catch (error) {
  Swal.fire({
    title: "Creation Failed",
    text: `Failed to create receipt(s): Contact Administrator for support! ${error}`,
    icon: "error",
    confirmButtonText: "Ok"
  });
} finally {
  isLoading.value = false;
}
};





</script>

<style scoped>
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
</style>
