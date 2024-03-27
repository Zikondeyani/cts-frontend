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
                  <div class="mt-5 flex justify-center sm:mt-0">
                    <create-report-form v-on:create="createReport" />
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
                        <div v-if="stat.progress > 50" :class="`bg-green-500 h-2 rounded-full`"
                          :style="{ width: stat.progress + '%' }">
                        </div>

                        <div v-else :class="`bg-red-500 h-2 rounded-full`" :style="{ width: stat.progress + '%' }">
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
            <p class="text-center text-gray-600 mt-4 font-bold"> Recent Loading Plans</p>

            <div class="align-middle inline-block min-w-full mt-1 rounded-table mx-0">
              <vue-good-table :columns="columns" :rows="loadingplans" :search-options="{ enabled: true }"
                style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
                styleClass="vgt-table striped" compactMode>
                <!-- ... -->
              </vue-good-table>
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


import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";



import { useloadingplanstore } from "../../../stores/loadingplans.store";


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
    label: "Origin Warehouse",
    field: row => row.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Destination District",
    field: row => row.district?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Date Created",
    field: row => moment(row.CreatedOn).format("DD/MM/yyyy"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Loading Plan #",
    field: row => row.LoadingPlanNumber,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "Tonnage (MT)",
    hidden: false,
    field: row => row.Quantity,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Balance (MT)",
    hidden: false,
    field: row => row.Balance,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },





]);



const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);




const recieptStore = usereceiptstore();
const receipts = reactive([]);

const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const userStore = useUserStore();

const dispatchStore = useDispatcherStore();

const catalogueStore = useListingStore();
const bookingStore = usebookingstore();

const bookings = reactive([]);
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "", href: "#", current: true },
];

let catalogueCount = ref(0);

const users = reactive([]);

const dispaches = reactive([]);
const isLoading = ref(false);
let userCount = ref(0);

let bookingCount = ref(0);

const receiptcount = ref(0)

const dispatchcount = ref(0)
//MOUNTEDgetCatalogue
onMounted(() => {
  getCatalogue();
  getUsers();
  getBookings();
  getDispatches();
  getReceipts();
  getLoadingPlans();
  getDispatchesCount();
  getLoadingPlansPending();
  getloadingplansSummary();
  getdispatchSummary();
});
//WATCH

const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};


const getReceipts = async () => {
  recieptStore.count().then((result) => {
    receiptcount.value = result.count;
  });
};


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
      dispaches.push(...sortedDispatches);
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

      // Clear the existing dispatches and push the sorted results
      loadingplans.length = 0;
      let sorteddata = result.reverse()
      loadingplans.push(...sorteddata);
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


const getdispatchSummary = async () => {
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
}


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





const createReport = async (model) => {
  isLoading.value = true;

  model.userId = user.value.id

  model.Balance = model.Quantity
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }
  // List of required fields
  const requiredFields = ['StartDate', 'EndDate', 'Quantity', /* other required fields */];

  // Check if all required fields are filled
  for (const field of requiredFields) {
    if (!model[field]) {
      Swal.fire({
        title: "Missing Information",
        text: `Please fill in the ${field}.`,
        icon: "error",
        confirmButtonText: "Ok"
      }).then(() => {
        isLoading.value = false; // Stop loading
      });
      return; // Stop the function
    }
  }

  // Format the StartDate and EndDate using moment.js
  model.userId = user.value.id;
  model.Balance = model.Quantity;
  model.StartDate = moment(model.StartDate).toISOString();
  model.EndDate = moment(model.EndDate).toISOString();

  loadingPlanStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      $router.push('/planner/loadingplans'); // Navigate to loading plans
    })
    .catch(error => {
      // Handling error
    })
    .finally(() => {
      isLoading.value = false;
      getDispatches();
      getLoadingPlans();
    });
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Dummy data for stats
const stats = ref([
  {
    label: 'Total Stocks Planned',
    value: totalStockPlanned,
    // Use a ternary operator for the icon
    icon: dispatchPercentage < 50 ? CheckCircleIcon : ExclamationCircleIcon,
    iconColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
    percentageText: dispatchPercentageFormated,
    textColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
    showProgress: true,
    progress: dispatchPercentage,
    isProgressPositive: dispatchPercentage >= 50,
    progressColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
  },

  {
    label: 'Dispatch Status',
    value: totalDispatched,
    // Use a ternary operator to decide between ExclamationCircleIcon and CheckCircleIcon
    icon: receivedPercentage > 50 ? ExclamationCircleIcon : CheckCircleIcon,
    iconColor: dispatchPercentage > 50 ? 'green-500' : 'red-500',
    percentageText: receivedPercentageFormated,
    textColor: receivedPercentage > 50 ? 'green-500' : 'red-500',
    showProgress: true,
    progress: receivedPercentage,
    isProgressPositive: receivedPercentage > 50,
    progressColor: receivedPercentage > 50 ? 'green-500' : 'red-500',
    progressText: ''
  },

  /*  {
     label: 'Dispatches Done',
     value: dispatchcount,
     icon: ClipboardListIcon,
     iconColor: 'green-500',
     percentageText: null
   },
  
   {
     label: 'Pending Loading Plans',
     value: pendingplans,
     icon: DocumentIcon,
     iconColor: 'gray-400',
     percentageText: '',
     textColor: 'gray-600',
     showProgress: false
   } */
  /* ,
   {
     label: 'Requisitions',
     value: 11,
     icon: ClipboardListIcon,
     iconColor: 'gray-400',
     percentageText: '',
     textColor: 'gray-600',
     showProgress: false
   }, */
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
<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>