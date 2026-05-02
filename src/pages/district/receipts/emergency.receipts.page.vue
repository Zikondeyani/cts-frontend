<template>
  <main class="">
    <!-- spinner -->
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
          @click="generateExcel">
          Export Data
        </button>
      </div>

      <!-- Tabs -->


      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap">
          <button @click="activeTab = 'submitted'"
            :class="{ 'text-white': activeTab === 'submitted', 'bg-white text-blue-800 border border-blue-800': activeTab !== 'submitted' }"
            style="background-color: #248cd6;" class="relative flex items-center mr-1 py-2 px-4 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out">
            <i class="fas fa-check-circle mr-2"></i> <!-- Submitted icon -->
            Submitted Receipts
            <span v-if="submittedCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {{ submittedCount }}
            </span>
          </button>

          <!-- <button @click="activeTab = 'draft'"
            :class="{ 'bg-[#096eb4] text-white': activeTab === 'draft', 'bg-white text-blue-500 border border-blue-500': activeTab !== 'draft' }"
            class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out">
            <i class="fas fa-file-alt mr-2"></i>
            Draft Receipts
            <span v-if="draftCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {{ draftCount }}
            </span>
          </button> -->

        </div>
      </div>

      <!-- Table -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table bg-white">
        <vue-good-table v-if="activeTab == 'submitted'" :columns="columns" :rows="receipts"
          :search-options="{ enabled: true }" style="font-weight: bold; color: blue;" :pagination-options="{
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
                View Receipt
              </button>


            <!--   <button @click="requestReversal(props.row)" v-if="props.row.status !== 4"
                class="text-orange-500 hover:text-orange-700 transition duration-300  ml-2 mr-2">
                <XIcon class="h-5 w-5 inline-block" />
                Request Reversal
              </button>

              <span v-else
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 ml-1">
                <span> submitted for reversal</span>
              </span>
 -->

            </span>
          </template>
        </vue-good-table>


        <vue-good-table v-if="activeTab == 'draft'" :columns="columns2" :rows="draftreceipts"
          :search-options="{ enabled: true }" style="font-weight: bold; color: blue;" :pagination-options="{
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
                <PencilIcon class="h-5 w-5 mr-3 inline-block mx-3" />

                Edit
              </button>

              <button @click="openDispatchDialog(props.row)"
                class="text-blue-400 hover:text-blue-300 transition duration-300">
                <EyeIcon class="h-5 w-5 inline-block ml-4 mr-1" />
                View Receipt
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
  XIcon,
  PencilIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptViewDialog from "../../../components/pages/dispatches/view.instructed-receipt.component.vue";


import EditReceiptDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";


import * as XLSX from 'xlsx';



const activeTab = ref('submitted');

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/receipient/dashboard", current: false },
  { name: "Receipts", href: "#", current: true },
  { name: "Emergency Response", href: "#", current: true },

];


import { useInstructedReceiptsStore } from "../../../stores/instructedReceipts.store";



const receiptStore = useInstructedReceiptsStore();
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
    field: row => moment(row.CreatedOn).format("DD/MM/YYYY"),
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800" >D.N: ${row.instructedDispatch?.DeliveryNote !== undefined ? row.instructedDispatch?.DeliveryNote : "N/A"}</span><br>`
      +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">To: ${row.instructedDispatch?.FinalDestinationPoint !== null ? row.instructedDispatch?.FinalDestinationPoint : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  },

  {
    label: "Target FDP",
    field: row => `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"> ${row.instructedDispatch?.FinalDestinationPoint || "Unknown"}</span>`,
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

const columns2 = ref([

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
    field: row => moment(row.CreatedOn).format("DD/MM/YYYY"),
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800" >D.N: ${row.instructedDispatch?.DeliveryNote !== undefined ? row.instructedDispatch?.DeliveryNote : "N/A"}</span><br>`
      +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">To: ${row.instructedDispatch?.FinalDestinationPoint !== null ? row.instructedDispatch?.FinalDestinationPoint : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  },

  {
    label: "Target FDP",
    field: row => `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"> ${row.instructedDispatch?.FinalDestinationPoint || "Unknown"}</span>`,
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


const draftCount = ref(0);
const submittedCount = ref(0);



const selectedDispatch = ref(null);

const updateCounts = () => {
  draftCount.value = draftreceipts.filter(r => r.status == 3).length;
  submittedCount.value = receipts.filter(r => r.status !== 3).length;
};

const selectedReceipt = ref(null);

const requestReversal = async (row) => {

  const { value: reason } = await Swal.fire({
    title: 'Request Reversal',
    text: 'Are you sure you want to request a reversal? Please provide a reason:',
    input: 'textarea',
    inputLabel: 'Reason',
    inputPlaceholder: 'Enter the reason for reversal here...',
    showCancelButton: true,
    confirmButtonText: 'Submit Request',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to provide a reason!';
      }
    }
  });

  if (reason) {
    // Process the reversal request here

    await receiptStore.update({ id: row.id, ReversalComments: reason, status: 4, ReverserDistrict: user?.value.district, ReversedBy: user?.value.username.replace(/\./g, ' ')});

    Swal.fire({
      icon: 'success',
      title: 'Reversal Request Submitted',
      text: `Reversal request has been submitted successfully.`,
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
    });
    getReceipts();
  }
};

const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'EmergencyReponseReceipts';
  // Create a worksheet from the flattened data array


  const dataToExport = receipts;

  // Map over the array to flatten each object
  const flattenedData = dataToExport.map(receipt => ({
    id: receipt.id,
    CreatedOn: moment(receipt.CreatedOn).format("DD/MM/YYYY"),
    UpdatedOn: moment(receipt.UpdatedOn).format("DD/MM/YYYY"),
    Quantity: receipt.Quantity,
    FinalDestinationPoint: receipt.FinalDestinationPoint,
  }))


  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  // Export the workbook
  XLSX.writeFile(wb, 'EmergencyReponseReceipts.xlsx');
};


// Function to open the edit dialog
const openDispatchDialog = (instructedDispatch) => {
  selectedReceipt.value = instructedDispatch;
  isReceiptDialogOpen.value = true;
};




const isEditDialogOpen = ref(false);


// Function to open the edit dialog
const openEditDialog = (instructedDispatch) => {
  selectedReceipt.value = instructedDispatch;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};



const isReceiptDialogOpen = ref(false);

// Function to open the edit dialog
const openReceiptDialog = (instructedDispatch) => {
  selectedReceipt.value = instructedDispatch;
  isReceiptDialogOpen.value = true;
};

// Function to close the edit dialog
const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};


const draftreceipts = reactive([])

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
      let sorteddata = result.reverse()
      receipts.push(...sorteddata.filter(item => item.instructedDispatch?.instruction?.district?.Name == user.value.district && item.status !== 3));
      draftreceipts.push(...sorteddata.filter(item => item.instructedDispatch?.instruction?.district?.Name == user.value.district && item.status == 3));
      updateCounts()

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
