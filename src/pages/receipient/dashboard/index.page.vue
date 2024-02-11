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
              <div class="bg-white p-6">
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
              <div
                class="bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6  divide-x divide-y border border-gray-200">
                <div v-for="stat in stats" :key="stat.label" class="flex flex-col shadow-xl rounded-xl mx-3 my-3 items-center py-4">
                  <span class="text-2xl font-semibold text-gray-800">{{ stat.value }}</span>
                  <span class="mt-1 text-sm text-gray-600">{{ stat.label }}</span>
                  <span :class="`text-${stat.color}-500 mt-2`">

                    <component :is="stat.icon" class="h-6 w-6" aria-hidden="true" />

                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Actions panel -->
          <section aria-labelledby="quick-links-title" class=" bg-white rounded-table">
            <p class="text-center text-gray-600 mt-4 font-bold"> Recent dispatches</p>

            <div class="align-middle inline-block min-w-full mt-1 rounded-table mx-0">
              <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
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
  CheckCircleIcon ,
  LocationMarkerIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
  TruckIcon,
  DocumentDuplicateIcon,
  ClipboardListIcon ,
  CollectionIcon,
  IdentificationIcon,
  DocumentTextIcon ,
  OfficeBuildingIcon,
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
    field: row => row.loadingPlan?.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Destination District",
    field: row => row.loadingPlan?.district?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Date Created",
    field: row => moment(row.loadingPlan.CreatedOn).format("d/MM/yyyy"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Loading Plan #",
    field: row => row.loadingPlan.LoadingPlanNumber,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "Tonnage",
    hidden: false,
    field: row => row.Quantity,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


]);
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
//MOUNTEDgetCatalogue
onMounted(() => {
  getCatalogue();
  getUsers();
  getBookings();
  getDispatches();
});
//WATCH

const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};

const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispaches.length = 0; //empty array
      dispaches.push(...result);


    })


    .finally(() => {
      isLoading.value = false;
    });

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
  const doc = new jsPDF();

  // Get the "from" and "to" dates from the model
  const { From, To } = model;

  // Provide default values for "from" and "to" if not defined
  const fromDate = From || new Date(0); // Default to the earliest possible date
  const toDate = To || new Date(); // Default to the current date

  // Filter the bookings by date range
  // Filter the bookings by date range
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = formatDate(booking.bookingFrom);
    const bookingToDate = formatDate(booking.bookingTo);

    return (
      bookingDate >= formatDate(fromDate) && bookingToDate <= formatDate(toDate)
    );
  });

  // Generate the table headers
  const headers = [
    [
      "Booking From",
      "Booking To",
      "Name",
      "Price",
      "Status",
      "Phone",
      "Service Type",
      "Booked On",
    ],
  ];

  // Generate the table rows from the filtered bookings
  const rows = filteredBookings.map((booking) => [
    formatDate(booking.bookingFrom),
    formatDate(booking.bookingTo),
    `${booking.firstname} ${booking.lastname}`,
    booking.listings.price,
    booking.status,
    booking.phone,
    booking.servicetype,
    formatDate(booking.created),
  ]);

  // Set the table style
  const tableStyle = {
    startY: 60, // Adjust the startY value to leave space for the header image
    headStyles: { fillColor: [0, 128, 128] }, // Maroon color
    columnStyles: { 2: { halign: "right" } },
  };

  var imgData =
    "";
  doc.addImage(imgData, "JPEG", 10, 10, 40, 40);

  // Add the heading to the PDF document
  let reportHeading = "DODMA COMMO Service Enquiry Report";
  if (From && To) {
    reportHeading += "\n\n(From: " + From + " To: " + To + ")";
  }
  doc.setFontSize(18);
  doc.text(reportHeading, 60, 25);

  // Add the table to the PDF document
  doc.autoTable({ head: headers, body: rows, ...tableStyle });

  // Save the PDF file
  doc.save("Machawi265 Service Enquiry .pdf");
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

let stats = [
  { label: "Total Stocks Planned", value: userCount, icon: CollectionIcon, color: 'green' },
  { label: "Dispatch Status", value: catalogueCount, icon: LocationMarkerIcon, color: 'blue' },
  { label: "Pending loading plans", value: bookingCount, icon: TruckIcon, color: 'indigo' },

  { label: "Dispatches done", value: userCount, icon: CheckCircleIcon , color: 'violet' },
  { label: "Receipts done", value: catalogueCount, icon: DocumentTextIcon , color: 'yellow' },
  { label: "Requisitions", value: bookingCount, icon: ClipboardListIcon , color: 'purple' },
];
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


</script>
<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>