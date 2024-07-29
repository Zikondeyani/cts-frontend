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
            Emergency Commodity Losses
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>
      </div>

      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="damages" :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" :pagination-options="{
      enabled: true,
    }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
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
import * as XLSX from 'xlsx';
import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dodma/dashboard", current: false },
  { name: "Emergency Response Losses", href: "#", current: true },
];

import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";

const damageStore = useReceivedCommoditiesStore();
const damages = reactive([]);

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
    label: "Commodity",
    hidden: false,
    field: row => row.commodity,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">District: ${row.district}</span><br>` + 
    `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">Type Of Loss: ${row.typeOfLoss}</span><br>` ,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  },


  {
    label: "Status",

    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800" >Dispatched : ${row.originQuantity}MT</span><br>`
      +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">Damaged: ${row.totalQuantity}MT</span><br>`,

    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },




  {
    label: "Percentage of Damage",
    field: row => {
      let colorClass = '';
      if (row.damagePercentage < 10) {
        colorClass = 'bg-green-100 text-green-800';
      } else if (row.damagePercentage >= 10 && row.damagePercentage < 50) {
        colorClass = 'bg-yellow-100 text-yellow-800';
      } else {
        colorClass = 'bg-red-100 text-red-800';
      }
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}">${row.damagePercentage}%</span>`;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

]);



const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Emergency-losses';
  // Create a worksheet from the flattened data array

  const dataToExport = damages;

  const flattenedData = dataToExport.map(damage => ({
    Commodity: damage.commodity,
    District: damage.district,
    "Quantity Dispatched (MT)": damage.originQuantity,
    "Quantity Damaged (MT)": damage.totalQuantity,
    "Type of Loss": damage.typeOfLoss,
    "Percentage Damaged (%)": damage.damagePercentage,
    "Comments": damage.comments,
  }))


  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  // Export the workbook
  XLSX.writeFile(wb, 'Emergency-losses.xlsx');
};





//MOUNTED
onMounted(() => {
  getdamages();
  // getLatest()
});
//FUNCTIONS



const getdamages = async () => {
  isLoading.value = true;
  damageStore
    .getdispatchDamageSummary()
    .then(result => {

      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      damages.length = 0; //empty array
      let sorteddata = result.summary.reverse()
      damages.push(...sorteddata.filter(item => item.typeOfLoss !== "" ));


    })


    .finally(() => {
      isLoading.value = false;
    });

}





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
