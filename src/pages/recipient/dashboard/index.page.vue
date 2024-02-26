<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-4">
          <!-- Welcome panel -->
          <section aria-labelledby="profile-overview-title">
            <div class="rounded-lg bg-white overflow-hidden shadow">
              <h2 class="sr-only" id="profile-overview-title">
                Profile Overview
              </h2>
              <div class="bg-white p-6  shadow-2xl">
                <div class="sm:flex sm:items-center sm:justify-between">
                  <div class="sm:flex sm:space-x-5">
                    <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                      <p class="text-md font-medium font-heading text-gray-600">
                        Welcome back,
                      </p>
                      <p class="text-xl font-bold text-gray-900 sm:text-2xl capitalize">

                        {{ user.username.replace(/\./g, ' ') }}


                      </p>
                      <p class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase">
                        {{ role.name }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-1 flex justify-center sm:mt-0">

                    <LocationMarkerIcon class="h-5 w-5 text-gray mr-2" />
                    <span class="text-gray font-medium text-sm">
                      {{ user.district }}
                    </span>
                  </div>
                </div>


              </div>
              <div class="bg-gray-100 p-5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- Stats Cards -->
                  <div v-for="stat in stats" :key="stat.label"
                    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold text-gray-800">{{ stat.value }}</span>
                        <component :is="stat.icon" :class="`h-6 w-6 text-${stat.iconColor}`" />
                      </div>
                      <div class="text-sm font-medium text-gray-600 mt-2">{{ stat.label }}</div>
                    </div>
                    <div v-if="stat.percentageText" class="mt-4">
                      <div class="flex items-center justify-between">
                        <span :class="`text-${stat.textColor}`">{{ stat.percentageText }}</span>
                        <component :is="stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon" class="h-5 w-5"
                          :class="`text-${stat.textColor}`" />
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div :class="`bg-${stat.iconColor} h-2 rounded-full`" :style="{ width: stat.progress + '%' }">
                        </div>
                      </div>
                    </div>
                    <div v-if="stat.alertText" class="mt-4">
                      <div class="flex items-center">
                        <ExclamationIcon class="h-5 w-5 text-red-500" />
                        <span class="ml-2 text-red-500 text-sm">{{ stat.alertText }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Actions panel -->
          <section aria-labelledby="quick-links-title" class="shadow-2xl bg-white rounded-table">
            <p class="text-center text-gray-600 mt-4 font-bold"> Expected Dispatches</p>

            <div class="align-middle inline-block min-w-full mt-1 rounded-table mx-0">
              <vue-good-table :columns="columns" :rows="expectedDispatches" :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
                styleClass="vgt-table striped" compactMode>
                <template #table-actions> </template>
                <template #table-row="props">
                  <span v-if="props.column.label == 'Options'">
                    <button type="button" @click="openDispatchDialog(props.row)"
                      class="font-heading inline-flex items-center px-6 py-2.5 border border-blue-400 text-blue-400 font-bold text-xs rounded shadow-md hover:bg-blue-300 hover:text-white hover:shadow-lg focus:outline-none focus:ring-0 active:border-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize">
                      <DocumentTextIcon class="h-5 w-5 mr-2" />
                      Receive
                    </button>

                  </span>
                </template>
              </vue-good-table>

              <ReceiptLoadingPlanDialog :isOpen="isReceiptDialogOpen" :dispatch="selectedDispatch"
                @close="closeReceiptDialog" v-on:update="reloadPage" />

            </div>
          </section>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>



import { inject, ref, watch, reactive, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";
import jsPDF from "jspdf";

import "jspdf-autotable";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useUserStore } from "../../../stores/user.store";

import { useDispatcherStore } from "../../../stores/dispatch.store";

import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt-recipient.component.vue";


import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";

import { usereceiptstore } from "../../../stores/receipt.store";

import createReportForm from "../../../components/pages/reports/create.component.vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {

  AcademicCapIcon,
  BadgeCheckIcon,
  BellIcon,
  CashIcon,
  CheckCircleIcon,
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
    <span >${row.NoBags !== null && row.NoBags !== undefined ? row.NoBags + " Bags" : "Not specified"} </span><br>
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
    field: row => `<span >D.N: ${row.DeliveryNote}</span><br>` +
      `<span>L.P: ${row.loadingPlanId !== null ? row.loadingPlanId : "N/A"}</span><br>`
      +
      `<span>To: ${row.FinalDestinationPoint !== null ? row.FinalDestinationPoint : "N/A"}</span><br>` +
      `<span>On: ${moment(row.Date).format("DD/MM/YYYY") !== null ? moment(row.Date).format("DD/MM/YYYY") : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },

  {
    label: "Dispatch Details",
    field: row => `
    <span class="from-color">Driver: ${row.Driver?.Name || "Driver Not Specified"}</span><br>
    <span class="to-color">Truck: ${row.TruckNumber || "Not Available"}</span><br>
    <span class="by-color">By: ${row.Dispatcher?.username.replace(/\./g, ' ') || "Unknown"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },


  {
    label: "Options",
    field: row => row,
    sortable: false
  }




]);
const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const userStore = useUserStore();

const dispatchStore = useDispatcherStore();


const receiptStore = usereceiptstore();

const catalogueStore = useListingStore();
const bookingStore = usebookingstore();

const bookings = reactive([]);


const receipts = reactive([]);

const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const breadcrumbs = [
  { name: "Home", href: "/recipient/dashboard", current: false },
  { name: "", href: "#", current: true },
];


const dispaches = reactive([]);


const expectedDispatchCount = ref(0);


const receiptsCount = ref(0);

const expectedDispatches = reactive([]);


const quantityRecieved = ref("");


const isLoading = ref(false);

const isEditDialogOpen = ref(false);
const selectedDispatch = ref(null);

const openEditDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};

const isReceiptDialogOpen = ref(false);

const openDispatchDialog = (dispatch) => {
  selectedDispatch.value = dispatch;
  isReceiptDialogOpen.value = true;

};

const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};



//MOUNTEDgetCatalogue
onMounted(() => {
  getExpectedDispatches();
  getReceipts();
  getQuantityReceived();
});
//WATCH




const getExpectedDispatches = async () => {

  dispatchStore
    .expected(user.value.district)
    .then((result) => {

      expectedDispatchCount.value = result.length


      expectedDispatches.length = 0; //empty array
      expectedDispatches.push(...result);


    })
    .catch((error) => {

    })

};


const getReceipts = async () => {
  isLoading.value = true;
  receiptStore
    .countbydistrict(user.value.district)
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }

      receiptsCount.value = result.count

    })


    .finally(() => {
      isLoading.value = false;
    });

}



const getQuantityReceived = async () => {
  isLoading.value = true;
  receiptStore
    .quantitybydistrict(user.value.district)
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      quantityRecieved.value = result.totalQuantity + " MT";

    })
    .finally(() => {
      isLoading.value = false;
    });

}




// Dummy data for stats
const stats = ref([
  {
    label: 'Total Receipts',
    value: receiptsCount,
    icon: ClipboardListIcon,
    iconColor: 'green-500',
    percentageText: null
  },
  {
    label: 'Expected Dispatches',
    value: expectedDispatchCount,
    icon: DocumentIcon,
    iconColor: 'blue-500',
    percentageText: null
  },
  {
    label: 'Quantity Received to date',
    value: quantityRecieved,
    icon: DocumentIcon,
    iconColor: 'gray-400',
    percentageText: '',
    textColor: 'gray-600',
    showProgress: false
  }

]);






</script>
<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>