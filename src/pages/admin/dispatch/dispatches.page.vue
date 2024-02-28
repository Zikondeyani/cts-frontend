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
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" :pagination-options="{
            enabled: true,
          }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <button type="button" @click="openDispatchDialog(props.row)"
                class="font-heading inline-flex items-center px-6 py-2.5 border border-blue-400 text-blue-400 font-bold text-xs rounded shadow-md hover:bg-blue-300 hover:text-white hover:shadow-lg focus:outline-none focus:ring-0 active:border-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize">
                <DocumentTextIcon class="h-5 w-5 mr-2" />
                Receive
              </button>


              <!-- Edit Button with Pencil Icon -->
              <button @click="openEditDialog(props.row)"
                class="text-green-500 hover:text-green-700 transition duration-300">
                <PencilIcon class="h-5 w-5 inline-block mr-1" />
                Edit
              </button>

              <!-- Delete Button with Trash Icon -->
              <button @click="deleteItem(props.row.id)" class="text-red-500 hover:text-red-700 transition duration-300">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />
                Delete
              </button>

            </span>
          </template>
        </vue-good-table>

        <!-- Edit Loading Plan Dialog -->
        <EditDispatchDialog :isOpen="isEditDialogOpen" :Dispatch="selectedDispatch" @close="closeEditDialog"
          v-on:update="reloadPage" />


        <ReceiptLoadingPlanDialog :isOpen="isReceiptDialogOpen" :dispatch="selectedDispatch" @close="closeReceiptDialog"
          v-on:update="reloadPage" />

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
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/create.receipt.component.vue";


import EditDispatchDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";



import createListingForm from "../../../components/pages/catalogue/create.component.vue";
//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";


import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Dispatches", href: "#", current: true },
];


import { useDispatcherStore } from "../../../stores/dispatch.store";



const dispatchStore = useDispatcherStore();
const dispaches = reactive([]);



const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);


import * as XLSX from 'xlsx';
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
    <span class="from-color">Driver: ${row.DriverName || "Driver Not Specified"}</span><br>
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




//MOUNTED
onMounted(() => {
  getDispatches();
  // getLatest()
});
//FUNCTIONS


const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Dispatches';
  // Create a worksheet from the flattened data array


  const ws = XLSX.utils.json_to_sheet(dispaches);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  // Export the workbook
  XLSX.writeFile(wb, 'Dispatches.xlsx');
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

      let sorteddata = result.reverse()
      dispaches.push(...sorteddata);


    })


    .finally(() => {
      isLoading.value = false;
    });

}


const deleteItem = async (id) => {
  // First, ask for confirmation
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    // If confirmed, proceed to delete
    if (result.isConfirmed) {
      isLoading.value = true;

      await dispatchStore.remove(id);

      // Show success message
      await Swal.fire("Deleted!", "Your Dispatch has been deleted.", "success");

      // Refresh the loading plans
      await getDispatches();
    }
  } catch (error) {
    // Handle errors here
    Swal.fire({
      title: "Failed",
      text: "Failed to remove Dispatch (" + error.message + ")",
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
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
