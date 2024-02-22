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
            Receipts
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="open = true">
          Export Data
        </button>
      </div>


      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="receipts" :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" :pagination-options="{
            enabled: true,
          }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">

              <!-- Edit Button with Pencil Icon -->
              <!-- <button @click="openEditDialog(props.row)"
                class="text-green-500 hover:text-green-700 transition duration-300">
                <PencilIcon class="h-5 w-5 inline-block mr-1" />
                Edit
              </button> -->

              <!-- Delete Button with Trash Icon -->

              <button @click="openDispatchDialog(props.row)"
                class="text-blue-400 hover:text-blue-300 transition duration-300">
                <EyeIcon class="h-5 w-5 inline-block mr-1" />
                View
              </button>


              <button @click="deleteItem(props.row.id)" class="text-red-500 hover:text-red-700 transition duration-300">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />
                Delete
              </button>

            </span>
          </template>
        </vue-good-table>

        <!-- Edit Loading Plan Dialog -->
        <EditReceiptDialog :isOpen="isEditDialogOpen" :Receipt="selectedReceipt" @close="closeEditDialog"
          v-on:update="reloadPage" />




        <ReceiptViewDialog :isOpen="isReceiptDialogOpen" :receipt="selectedReceipt" @close="closeReceiptDialog"
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
  EyeIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptViewDialog from "../../../components/pages/dispatches/view.receipt.component.vue";


import EditReceiptDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";



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
  { name: "Receipts", href: "#", current: true },
];


import { usereceiptstore } from "../../../stores/receipt.store";



const receiptStore = usereceiptstore();
const receipts = reactive([]);



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
    label: "Date",
    hidden: false,
    field: row => `<span> ${moment(row.Date).format("DD/MM/YYYY") !== null ? moment(row.Date).format("DD/MM/YYYY") : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span >D.N: ${row.dispatch.DeliveryNote !== undefined ? row.dispatch.DeliveryNote : "N/A"}</span><br>`
      +
      `<span>To: ${row.FinalDestinationPoint !== null ? row.FinalDestinationPoint : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  },

  {
    label: "Quantity",
    field: row => `
    <span class="by-color"> ${row.Quantity + " MT" || "Unknown"}</span>`,
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





const selectedDispatch = ref(null);



const selectedReceipt = ref(null);



// Function to open the edit dialog
const openDispatchDialog = (dispatch) => {
  selectedReceipt.value = dispatch;
  isReceiptDialogOpen.value = true;
};




const isEditDialogOpen = ref(false);


// Function to open the edit dialog
const openEditDialog = (dispatch) => {
  selectedReceipt.value = dispatch;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};



const isReceiptDialogOpen = ref(false);

// Function to open the edit dialog
const openReceiptDialog = (dispatch) => {
  selectedReceipt.value = dispatch;
  isReceiptDialogOpen.value = true;
};

// Function to close the edit dialog
const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};




//MOUNTED
onMounted(() => {
  getReceipts();
  // getLatest()
});
//FUNCTIONS



const getReceipts = async () => {
  isLoading.value = true;
  receiptStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      receipts.length = 0; //empty array
      receipts.push(...result);


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

      await receiptStore.remove(id);

      // Show success message
      await Swal.fire("Deleted!", "Your Receipt has been deleted.", "success");

      // Refresh the loading plans
      await getReceipts();
    }
  } catch (error) {
    // Handle errors here
    Swal.fire({
      title: "Failed",
      text: "Failed to remove Receipt (" + error.message + ")",
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
