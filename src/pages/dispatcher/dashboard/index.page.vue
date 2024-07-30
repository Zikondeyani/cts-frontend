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



        <button type="button"
          class="tab-button active-tab font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
          @click="navigateToLeanSeasonLoadingPlans">
          <TemplateIcon class="h-5 w-5 mr-2" />
          Manage Lean Season Dispatches
        </button>

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
              <div class="bg-white p-6 shadow-2xl">
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
                      National
                    </span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-100 p-5">
                <div
                  class="grid gap-4">
                  <!-- Stats Cards -->
                  <div v-for="stat in statsToShow" :key="stat.label"
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
                    <div class="text-sm text-gray-500 mt-4">
                      <router-link v-if="stat.label == 'Pending Instructions (Emergency Response)'"
                        to="/dispatcher/instruction-management" class="text-blue-500 hover:underline">
                        View Details
                      </router-link>

                      <router-link v-if="stat.label == 'Pending Loading Plans (Lean Season Response)'"
                        to="/dispatcher/loadingplans" class="text-blue-500 hover:underline">
                        View Details
                      </router-link>

                    </div>
                  </div>

                </div>
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
import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import ChartComponent from '../../../components/pages/charts/dashboardcharts.vue'; // Adjust path as needed
import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";
import MaizeDistributionTable from './MaizeDistributionTable.vue';
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import html2canvas from 'html2canvas';
import { usereceiptstore } from "../../../stores/receipt.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
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
import { SearchIcon } from "@headlessui/vue";
const screenshotMode = ref(false);
const currentView = ref('dashboard'); // The initial view can be 'dashboard' or 'charts'
const toggleView = (view) => {
  currentView.value = view;
};


const showTooltip = ref(false);
const maizeTable = ref(null);
const takeScreenshot = () => {
  screenshotMode.value = true;
  if (maizeTable.value) {
    html2canvas(maizeTable.value.$el || maizeTable.value).then((canvas) => {
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.download = 'maize-distribution.png';
      link.href = image;
      link.click();
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
    label: "Origin Warehouse",
    field: row => row.instruction?.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Destination District",
    field: row => row.instruction?.district?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Date Created",
    field: row => moment(row.instruction?.CreatedOn).format("DD/MM/yyyy"),
    sortable: true,
    firstSortType: "asc",
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
const warehouseStore = usewarehousestore();
const warehouseCount = ref(0);
const recieptStore = usereceiptstore();
const receipts = reactive([]);
const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const userStore = useUserStore();
const dispatchStore = useInstructedDispatchesStore();
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
const loadingPlanSummary = reactive([]);
let userCount = ref(0);
let bookingCount = ref(0);
const receiptcount = ref(0)
const dispatchcount = ref(0)
//MOUNTEDgetCatalogue
onMounted(() => {
  getCatalogue();
  getUsers();
  getBookings();
  getInstructions();
  getDispatches();
  getReceipts();
  getDispatchesCount();
  getLoadingPlans()
  getLoadingPlansPending();
  getloadingplansSummary();
  getdispatchSummary();
  getloadingplansSummaryByCommodity();
  getWarehouses();
});
//WATCH
const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};
const getWarehouses = async () => {
  warehouseStore.get().then((result) => {
    warehouseCount.value = result.filter(item => item.district.Name == user.value.district).length;

  });
};
const getReceipts = async () => {
  recieptStore.count().then((result) => {
    receiptcount.value = result.count;
  });
};
import { useinstructionstore } from "../../../stores/instructions.store";
const instructionsStore = useinstructionstore();
const instructions = reactive([]);
const newInstructionsCount = ref(0)
const newLoadingPlanCount = ref(0)

//FUNCTIONS
const getInstructions = async () => {
  instructionsStore
    .get()
    .then((result) => {
      instructions.length = 0;
      instructions.push(result.filter(item =>  !item.IsArchived && item.IsApproved));
      newInstructionsCount.value = instructions[0].length;
    })
};
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(maizeDistributionData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Maize Distribution');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, 'table.xlsx');
};
const getloadingplansSummaryByCommodity = async () => {
  loadingPlanStore
    .getloadingplansSummaryByCommodity()
    .then(result => {
      loadingPlanSummary.length = 0;
      loadingPlanSummary.push(...result);
    })
}
const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      const sortedDispatches = [...result].sort((a, b) => {
        return new Date(b.createdon) - new Date(a.createdon);
      });
      dispaches.length = 0;
      let reversedData = sortedDispatches.reverse();
      dispaches.push(...reversedData);
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
  loadingPlanStore
    .get()
    .then(result => {
     
      loadingplans.length = 0;
      loadingplans.push(...result.filter(item =>  !item.IsArchived && item.IsApproved));
      newLoadingPlanCount.value = loadingplans.length
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
  loadingPlanStore
    .getloadingplansPending()
    .then(result => {
      pendingplans.value = result.count
    })
}
const getdispatchSummary = async () => {
  dispatchStore
    .getdispatchSummary()
    .then(result => {
      totalDispatched.value = result.totalDispatched.toLocaleString() + " MT"
      totalReceived.value = result.totalReceived
      receivedPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% received'
      receivedPercentage.value = result.dispatchPercentage.toFixed(2)
    })
}
const getloadingplansSummary = async () => {
  loadingPlanStore
    .getloadingplansSummary()
    .then(result => {
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
      users.length = 0;
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
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }
  loadingPlanStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });
      $router.push('/admin/loadingplans');
    })
    .catch(error => {
      console.error('Error:', error);
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
  /* {
    label: computed(() => `Number of Warehouses in ${user.value.district}`),
    value: warehouseCount,
    icon: ClipboardListIcon,
    iconColor: 'green-500',
    percentageText: null,
    moreInfo: true,
  }, */
  {
    label: 'Pending Instructions (Emergency Response)',
    value: newInstructionsCount,
    icon: DocumentIcon,
    iconColor: 'gray-400',
    percentageText: '',
    textColor: 'gray-600',
    showProgress: false
  },
  {
    label: 'Pending Loading Plans (Lean Season Response)',
    value: newLoadingPlanCount,
    icon: DocumentIcon,
    iconColor: 'gray-400',
    percentageText: '',
    textColor: 'gray-600',
    showProgress: false
  }
]);
const statsToShow = computed(() => {
 
    return stats.value.filter(stat => stat.label !== 'Number of Warehouses');
  
});
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
const navigateToLeanSeasonLoadingPlans = () => {
  $router.push("/dispatcher/loadingplans");
};
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.active-tab {
  background-color: #248cd6;
  color: white;
}

.bg-blue-500 {
  background-color: #096eb4;
}

.h-20 {
  height: 80px;
}

.mr-4 {
  margin-right: 16px;
}

img.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
