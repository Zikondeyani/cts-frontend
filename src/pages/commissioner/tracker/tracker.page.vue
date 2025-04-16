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
            Transporter Tracker
          </h2>
        </div>
        <button
          type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel"
        >
          Export Data
        </button>
      </div>

      <!-- table  -->
      <div
        class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table"
      >
        <vue-good-table
          :columns="columns"
          :rows="expected"
          :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue"
          :pagination-options="{
            enabled: true,
          }"
          theme="polar-bear"
          styleClass=" vgt-table striped "
          compactMode
        >
          <template #table-actions> </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import * as XLSX from "xlsx";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/planner/dashboard", current: false },
  { name: "Transporter Tracker", href: "#", current: true },
];

import { useDispatcherStore } from "../../../stores/dispatch.store";

const expectedStore = useDispatcherStore();
const expected = reactive([]);

const sessionStore = useSessionStore();

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
    label: "Final Destination Point",
    field: (row) => row.FinalDestinationPoint,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Delivery Note",
    field: (row) => row.DNote,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Dispatched By",
    field: (row) => row.Dispatcher?.username.replace(/\./g, " "),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Truck #",
    field: (row) => row.TruckNumber,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Bags / Quantity",
    field: (row) => `${row.NoBags} bags / ${row.Quantity} MT`,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Status",
    field: (row) => {
      const today = moment().startOf("day"); // Start of today
      const createdOn = moment(row.CreatedOn).startOf("day"); // Start of the created date

      if (createdOn.isSame(today)) {
        // If CreatedOn is today, show "Pending"
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>Pending</span>";
      } else if (createdOn.isBefore(today)) {
        const diffDays = today.diff(createdOn, "days");
        if (diffDays <= 3) {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>Delayed</span>";
        } else {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800'> Overdue</span>";
        }
      }
    },
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize",
  },
]);


const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = "Transporter Tracker";
  
  // Extract data matching table fields
  const dataToExport = expected.map((row, index) => {
    return {
      "#": index + 1,
      "Final Destination Point": row.FinalDestinationPoint,
      "Delivery Note": row.DNote,
      "Dispatched By": row.Dispatcher?.username.replace(/\./g, " "),  
      "Truck #": row.TruckNumber,
      "Bags / Quantity": `${row.NoBags} bags / ${row.Quantity} MT`,
      "Status": (() => {
        const today = moment().startOf("day");
        const createdOn = moment(row.CreatedOn).startOf("day");
        
        if (createdOn.isSame(today)) {
          return "Pending";
        } else if (createdOn.isBefore(today)) {
          const diffDays = today.diff(createdOn, "days");
          if (diffDays <= 3) {
            return "Delayed";
          } else {
            return "Overdue";
          }
        }
      })(),
    };
  });

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, "Transporter-Tracker.xlsx");
};


//MOUNTED
onMounted(() => {
  getExpected();
  // getLatest()
});
//FUNCTIONS

const getExpected = async () => {
  isLoading.value = true;
  expectedStore
    .get()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      expected.length = 0; //empty array
      let sorteddata = result.reverse();

      expected.push(...sorteddata.filter(item => item.IsArchived == false));
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
