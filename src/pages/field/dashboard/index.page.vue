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

                        {{ user?.username.replace(/\./g, ' ') }}


                      </p>
                      <p class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase">
                        {{ role?.name }}
                      </p>
                    </div>
                  </div>


                </div>

              </div>


              <div class="bg-gray-100 p-5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">


                  <!-- Stats Cards -->
                  <div v-for="stat in stats" :key="stat.label"
                    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold text-gray-800">{{ stat.value }}</span>
                        <component v-if="stat.label == 'Dispatch Status'"
                          :is="stat.progress >= 50 ? CheckCircleIcon : ExclamationCircleIcon"
                          :class="`h-6 w-6 text-${stat.progress >= 50 ? 'green-500' : 'red-500'}`" />
                        <component v-else :is="stat.icon" :class="`h-6 w-6 text-${stat.iconColor}`" />
                      </div>

                      <div class="text-sm font-medium text-gray-600 mt-2">{{ stat.label }}</div>
                    </div>
                    <div v-if="stat.percentageText" class="mt-4">

                      <div class="flex items-center justify-between">
                        <span :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'">{{ stat.percentageText
                          }}</span>
                        <component :is="stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon" class="h-5 w-5"
                          :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'" />
                      </div>


                      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div :class="stat.progress >= 50 ? 'bg-green-500' : 'bg-red-500'" class="h-2 rounded-full"
                          :style="{ width: stat.progress + '%' }">
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Actions panel -->
          <section aria-labelledby="quick-links-title" class="shadow-2xl bg-white rounded-table">
            <div class="container mx-auto p-4">
              <div class="bg-white rounded-lg shadow-md p-4">

                <p class="text-center text-gray-600 mt-4 font-bold mb-2">Recent Dispatches</p>

                <div class="align-middle inline-block min-w-full mt-1 rounded-lg">
                  <div class="flex justify-center mb-4">
                    <button class="tab-button" :class="{ 'active-tab': activeTab === 'lean' }"
                      @click="activeTab = 'lean'">
                      Lean Season
                      <span v-if="leanSeasonCount > 0" class="badge badge-red">{{ leanSeasonCount }}</span>

                    </button>
                    <button class="tab-button" :class="{ 'active-tab': activeTab === 'emergency' }"
                      @click="activeTab = 'emergency'">
                      Emergency Response
                      <span v-if="emergencyCount > 0" class="badge badge-red">{{ emergencyCount }}</span>

                    </button>


                  </div>
                </div>
              </div>
              <div v-if="activeTab === 'lean'">
                <vue-good-table :columns="columns" :rows="expectedDispatches" :search-options="{ enabled: true }"
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
                  @close="closeReceiptDialog" v-on:update="createLeanReceipt" :close="closeModal" />
              </div>

              <div v-if="activeTab === 'emergency'">
                <vue-good-table :columns="columns2" :rows="dispaches" :search-options="{ enabled: true }"
                  style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
                  styleClass="vgt-table striped" compactMode>
                  <template #table-actions> </template>
                  <template #table-row="props">
                    <span v-if="props.column.label == 'Options'">
                      <div class="flex space-x-2">
                        <create-instruction-receipt-form :row-id="props.row.id" v-on:create="createReceipt"
                          :dispatch="props.row" />
                      </div>
                    </span>
                  </template>
                </vue-good-table>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";
import createInstructionReceiptForm from "../../../components/pages/instruction/receipt.component.vue";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import "jspdf-autotable";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useUserStore } from "../../../stores/user.store";
import { useDispatcherStore } from "../../../stores/dispatch.store";

import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import ChartComponent from '../../../components/pages/charts/dashboardcharts.vue'; // Adjust path as needed
import { userequisitionstore } from "../../../stores/requisition.store";
import { useDisasterstore } from "../../../stores/disaster.store";


import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";

import MaizeDistributionTable from './MaizeDistributionTable.vue';


import { useloadingplanstore } from "../../../stores/loadingplans.store";
import html2canvas from 'html2canvas';


import { usereceiptstore } from "../../../stores/receipt.store";

import { useInstructedReceiptsStore } from "../../../stores/instructedReceipts.store";

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
import { saveDataOffline, getDataOffline, clearDataOffline } from '@/services/localbase';

const screenshotMode = ref(false);

const activeTab = ref('lean');
const expectedDispatches = reactive([]);

import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt-recipient.component.vue";

import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";
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
const currentView = ref('dashboard'); // The initial view can be 'dashboard' or 'charts'

const toggleView = (view) => {
  currentView.value = view;
};

const closeModal = () => {

  isOpen.value = false
}

const showTooltip = ref(false);


const maizeTable = ref(null);



const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};


const takeScreenshot = () => {
  screenshotMode.value = true;

  if (maizeTable.value) {


    html2canvas(maizeTable.value.$el || maizeTable.value).then((canvas) => {
      // Create an image from the canvas
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      // Create a link element, set the download attribute, and trigger a click to download
      const link = document.createElement('a');
      link.download = 'maize-distribution.png';
      link.href = image;
      link.click();
      //screenshotMode.value = false; // Hide screenshot specific content after taking the screenshot

    }).catch(error => {
      console.error('Error taking screenshot:', error);
    });
  }
};

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


const columns2 = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "From Warehouse",
    field: row => row.instruction?.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Dispatched By",
    field: row => row.Dispatcher?.username.replace(/\./g, ' '),
    sortable: true,
    firstSortType: "asc",
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
  },


  {
    label: "Options",
    field: row => row,
    sortable: false
  }



]);


const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);

const requisitionStore = userequisitionstore();
const requisitions = reactive([]);

const disasterStore = useDisasterstore();
const disasters = reactive([]);


const recieptStore = usereceiptstore();

const instructedreceiptStore = useInstructedReceiptsStore();

const receipts = reactive([]);

const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const userStore = useUserStore();

const dispatchStore = useInstructedDispatchesStore();

const leanseasondispatchStore = useDispatcherStore();

const receivedCommodityStore = useReceivedCommoditiesStore();

const catalogueStore = useListingStore();
const bookingStore = usebookingstore();

const bookings = reactive([]);
const role = ref(sessionStore.getRole);

const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "", href: "#", current: true },
];

let catalogueCount = ref(0);

const emergencyCount = computed(() => {
  return dispaches.length;
});

const leanSeasonCount = computed(() => {
  return expectedDispatches.length;
});

const users = reactive([]);

const dispaches = reactive([]);
const isLoading = ref(false);

const loadingPlanSummary = reactive([]);
let userCount = ref(0);

let bookingCount = ref(0);

const receiptcount = ref(0)
const expectedDispatchCount = ref(0);


const fetchUser = async () => {

  try {
    const offlineUserData = await getDataOffline("user");

    if (offlineUserData.length > 0) {
      user.value = offlineUserData[0];
    } else {
      user.value = sessionStore.getUser;
    }
    role.value = sessionStore.getRole;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
const dispatchcount = ref(0)
//MOUNTEDgetCatalogue
onMounted(async () => {
  await fetchUser()
  getCatalogue();
  getExpectedDispatches()
  getUsers();
  getBookings();
  getDispatches();
  getReceipts();
  getDispatchesCount();
  getLoadingPlansPending();
  getloadingplansSummary();
  getloadingplansSummaryByCommodity();
  getRequisitions();
  getDisasters();
});
//WATCH


// Create dispatched commodities with the dispatch ID
// Create received commodities with the receipt ID
const createReceivedCommodities = async (receiptId, receivedCommodity) => {
  const receiptModel = {
    instructedReceiptId: receiptId,
    commodityId: receivedCommodity.commodityId,
    BatchNumber: receivedCommodity.BatchNumber,
    FinalDestinationPoint: receivedCommodity.FinalDestinationPoint,
    Quantity: receivedCommodity.Quantity,
    NoBags: receivedCommodity.NoBags,
    Remarks: receivedCommodity.Remarks,
  };

  await receivedCommodityStore.create(receiptModel); // Assuming receivedCommodityStore is the correct reference
};

// Create receipt and associated received commodities
const createReceipt = async (originalModel) => {
  // Separate relief items from the original model
  const { receivedCommodities, ...receiptModel } = originalModel;

  try {
    // Create the receipt without the relief items
    const createdReceipt = await instructedreceiptStore.create(receiptModel);
    const receiptId = createdReceipt.id;

    // Loop through each commodity and create it with the receipt ID
    for (const commodity of originalModel.receivedCommodities) {
      await createReceivedCommodities(receiptId, commodity);
    }

    Swal.fire({
      title: "Success",
      text: "Created a receipt and associated commodities successfully",
      icon: "success",
      confirmButtonText: "Ok"
    });

    await getReceipts();
    $router.push({ path: '/field/receipts/emergency' });

  } catch (error) {
    Swal.fire({
      title: "Creation Failed",
      text: `Failed to create receipt and associated commodities: ${error}`,
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
};


const createReceipts = async (item) => {

  // Wait for all promises to complete
  await recieptStore.create(item);

  getExpectedDispatches();

  getDispatches();
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
    await getReceipts()
    $router.push({ path: '/field/receipts/leanseason' });
  } catch (error) {
    Swal.fire({
      title: "Creation Failed",
      text: `Failed to create receipt(s): ${error}`,
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
};


const getExpectedDispatches = async () => {

  leanseasondispatchStore
    .expected(user.value.district)
    .then((result) => {

      expectedDispatchCount.value = result.length


      expectedDispatches.length = 0; //empty array

      let sorteddata = result.reverse();
      expectedDispatches.push(...sorteddata);


    })
    .catch((error) => {

    })

};

const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};


const requisitionCount = ref(0)
const getRequisitions = async () => {
  requisitionStore.get().then((result) => {
    requisitionCount.value = result.filter(item => item.requesterId == user.value.id).length;
  });
};


const disasterCount = ref(0)
const getDisasters = async () => {
  disasterStore.get().then((result) => {
    disasterCount.value = result.filter(item => item.district == user.value.district).length;
  });
};

const getReceipts = async () => {
  recieptStore.count().then((result) => {
    receiptcount.value = result.count;
  });
};





// Export to Excel method
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(maizeDistributionData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Maize Distribution');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, 'table.xlsx');
};


const getloadingplansSummaryByCommodity = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansSummaryByCommodity()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      loadingPlanSummary.length = 0;
      loadingPlanSummary.push(...result);

    })
}

const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      const sortedDispatches = [...result].sort((a, b) => {
        // Convert the `createdOn` field to a Date object and compare
        return new Date(b.createdon) - new Date(a.createdon);
      });

      // Clear the existing dispatches and push the sorted results
      dispaches.length = 0;
      let reversedData = sortedDispatches.reverse();
      dispaches.push(...reversedData.filter(item => !item.IsArchived && item.instruction.district?.Name == user.value.district));
    })
    .finally(() => {
      isLoading.value = false;
    });
}


const getDispatchesCount = async () => {
  dispatchStore.count().then((result) => {
    dispatchcount.value = result.count;
  });
}

const getLoadingPlans = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .get()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      const sortedDispatches = [...result].sort((a, b) => {
        // Convert the `createdOn` field to a Date object and compare
        return new Date(b.createdon) - new Date(a.createdon);
      });

      // Clear the existing dispatches and push the sorted results
      loadingplans.length = 0;
      loadingplans.push(...sortedDispatches);
    })
}

const pendingplans = ref(0)

const totalBalance = ref(0)

const totalStockPlanned = ref("")
const dispatchPercentageFormated = ref("")
const totalDispatched = ref("")
const totalReceived = ref("")
const receivedPercentageFormated = ref("")
const receivedPercentage = ref("")
const dispatchPercentage = ref("")

const getLoadingPlansPending = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansPending()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field
      pendingplans.value = result.count
    })
}


/* const getdispatchSummary = async () => {
  // isLoading.value = true;
  dispatchStore
    .getdispatchSummary()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field

      totalDispatched.value = result.totalDispatched.toLocaleString() + " MT"
      totalReceived.value = result.totalReceived
      receivedPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% received'

      receivedPercentage.value = result.dispatchPercentage.toFixed(2)
    })
} */


const getloadingplansSummary = async () => {
  // isLoading.value = true;
  loadingPlanStore
    .getloadingplansSummary()
    .then(result => {
      // Assuming `result` is an array of dispatches and each dispatch has a `createdOn` field

      totalStockPlanned.value = result.totalStockPlanned.toLocaleString() + " MT"
      totalBalance.value = result.totalBalance
      dispatchPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% dispatched'
      dispatchPercentage.value = result.dispatchPercentage.toFixed(2)
    })
}

const getUsers = async () => {
  userStore.count().then((result) => {
    userCount.value = result.count;
  });

  userStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      users.length = 0; //empty array
      users.push(...result);

      users.sort((a, b) => new Date(b.created) - new Date(a.created));

    })


    .finally(() => {
      isLoading.value = false;
    });
};

const getBookings = async () => {
  bookingStore.count().then((result) => {
    bookingCount.value = result.count;
  });

  bookingStore.getbookingsClean().then((result) => {
    bookings.length = 0;
    bookings.push(...result);
  });
};



const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Dummy data for stats
const stats = ref([
  {
    label: 'Total Disasters Recorded',
    value: disasterCount,
    icon: ClipboardListIcon,
    iconColor: 'green-500',
    percentageText: null
  },


  {
    label: 'Requisitions',
    value: requisitionCount,
    icon: ClipboardListIcon,
    iconColor: 'gray-400',
    percentageText: '',
    textColor: 'gray-600',
    showProgress: false
  },
]);
const actions = [
  {
    icon: IdentificationIcon,
    name: "Catalogue",
    href: "/admin/catalogue",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all service catalogue",
  },
  {
    icon: OfficeBuildingIcon,
    name: "Enquiries",
    href: "/admin/bookings",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all Enquiries made to services",
  },
];



const dispatchstatus = ref(0)


</script>
<style scoped>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}


.bg-blue-500 {
  background-color: #096eb4;
  /* Tailwind CSS color, replace with your project's color if not using Tailwind */
}

.h-20 {
  height: 80px;
  /* Adjust according to your needs */
}

.mr-4 {
  margin-right: 16px;
  /* Adjust according to your needs */
}

img.img-fluid {
  max-width: 100%;
  height: auto;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  background-color: #e2e8f0;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active-tab {
  background-color: #3182ce;
  color: white;
}

.tabs button:not(.active-tab):hover {
  background-color: #cbd5e0;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 0.75em;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-red {
  background-color: rgba(255, 0, 0, 0.874);
  color: white;
}


.active-tab {
  background-color: #096eb4;
  color: white;
}

.badge {
  background-color: red;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  margin-left: 0.5rem;
}

.container {
  max-width: 100%;
}

.tab-button {
  flex: 1;
  padding: 10px;
  margin: 0 2px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.active-tab {
  background-color: #096eb4;
  color: white;
}

.good-table {
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 10px;
}
</style>