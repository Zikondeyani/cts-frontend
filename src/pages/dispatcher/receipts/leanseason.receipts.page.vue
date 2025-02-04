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
          @click="generateExcel">
          Export Data
        </button>

      </div>
      <!-- table  -->

      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap">
          <button @click="activeTab = 'submitted'"
            :class="{ 'tab-button text-white': activeTab === 'submitted', 'bg-white text-blue-800 border border-blue-800': activeTab !== 'submitted' }"
            style="background-color: #248cd6;"
            class="relative flex items-center mr-1 py-2 px-4 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out">
            <i class="fas fa-check-circle mr-2"></i> <!-- Submitted icon -->
            Submitted Receipts

            <span v-if="submittedCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center px-3">
              {{ submittedCount }}
            </span>
          </button>

          <!--   <button @click="activeTab = 'draft'"
            :class="{ 'bg-blue-500 text-white': activeTab === 'draft', 'bg-white text-blue-500 border border-blue-500': activeTab !== 'draft' }"
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

      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
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
                <EyeIcon class="h-5 w-5 inline-block mr-4" />
                View Receipt
              </button>


             <!--  <button @click="requestReversal(props.row)" v-if="props.row.receipts[0].status !== 4"
                class="text-orange-500 hover:text-orange-700 transition duration-300  ml-2 mr-2">
                <XIcon class="h-5 w-5 inline-block" />
                Request Reversal
              </button>

              <span v-else
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 ml-1">
                <span> submitted for reversal</span>
              </span> -->
              <!-- 
              <button @click="deleteItem(props.row.id)" class="text-red-500 hover:text-red-700 transition duration-300">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />
                Delete
              </button> -->

            </span>
          </template>
        </vue-good-table>


        <vue-good-table v-if="activeTab == 'draft'" :columns="columns2" :rows="receiptsClean"
          :search-options="{ enabled: true }" style="font-weight: bold; color: blue;" :pagination-options="{
            enabled: true,
          }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">


              <!-- Edit Button with Pencil Icon -->


              <button @click="editDispatchDialog(props.row)"
                class="text-blue-400 hover:text-blue-300 transition duration-300">
                <PencilIcon class="h-5 w-5 mr-3 inline-block mx-3" />

                Edit
              </button>
              <!-- Delete Button with Trash Icon -->

              <button @click="openDispatchDialog(props.row)"
                class="text-blue-400 hover:text-blue-300 transition duration-300">
                <EyeIcon class="h-5 w-5 inline-block ml-4 mr-1" />
                View Receipt
              </button>

              <!-- 
              <button @click="deleteItem(props.row.id)" class="text-red-500 hover:text-red-700 transition duration-300">
                <TrashIcon class="h-5 w-5 inline-block mr-1" />
                Delete
              </button> -->

            </span>
          </template>
        </vue-good-table>
        <ReceiptLoadingPlanDialog :isOpen="isEditDialogOpen" :dispatch="selectedDispatch" :receipts="receiptsClean"
          @close="closeReceiptDialog" v-on:update="createLeanReceipt" v-on:draft="draftLeanReceipt" />
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
  UndoIcon,
  EyeIcon,
  PencilIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";


import ReceiptViewDialog from "../../../components/pages/dispatches/view.receipt.component.vue";

import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/edit.receipt-recipient.component.vue";

import EditReceiptDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";
const activeTab = ref('submitted');




import * as XLSX from 'xlsx';


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
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Receipts", href: "#", current: true },
  { name: "Lean Season Response", href: "#", current: true },
];


import { usereceiptstore } from "../../../stores/receipt.store";
import { XIcon } from "@heroicons/vue/outline";
const draftCount = ref(0);
const submittedCount = ref(0);


const updateCounts = () => {
  draftCount.value = receiptsClean.filter(r => r.status == 3).length;
  submittedCount.value = receipts.length;
};
const receiptStore = usereceiptstore();
const receipts = reactive([]);
const receiptsClean = reactive([]);



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
    field: row => `<span> ${moment(row.createdOn).format("DD/MM/YYYY") !== null ? moment(row.createdOn).format("DD/MM/YYYY") : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Delivery Note",
    hidden: false,
    field: row => {
      // Extracting PhysicalDeliveryNote from the first receipt, assuming it's the relevant one
      const physicalDeliveryNote = row.receipts.length > 0 ? row.receipts[0].PhysicalDeliveryNote : "N/A";
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-blue-100 text-blue-800" >
              D.N: ${physicalDeliveryNote}
            </span><br>`;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  }
  ,

  {
    label: "District",
    hidden: false,
    field: row => {
      // Extracting PhysicalDeliveryNote from the first receipt, assuming it's the relevant one
      const District = row.district;
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-yellow-100 text-yellow-800" > ${District}
            </span><br>`;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  }
  ,

  {
    label: "ATC #",
    hidden: false,
    field: row => {
      // Extracting PhysicalDeliveryNote from the first receipt, assuming it's the relevant one
      const physicalDeliveryNote = row.atcNumber;
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-orange-100 text-orange-800" > ${physicalDeliveryNote}
            </span><br>`;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  }
  ,

  {
    label: "Received By",
    hidden: false,
    field: row => {
      // Extracting PhysicalDeliveryNote from the first receipt, assuming it's the relevant one
      const physicalDeliveryNote =  row.recipient;
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-semibold bg-blue-100 text-blue-800" >
             ${physicalDeliveryNote}
            </span><br>`;
    },
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

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
    label: "Date",
    hidden: false,
    field: row => `<span> ${moment(row.createdOn).format("DD/MM/YYYY") !== null ? moment(row.createdOn).format("DD/MM/YYYY") : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  }
  ,

  {
    label: "Details",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800" >D.N: ${row.deliveryNote !== undefined ? row.deliveryNote : "N/A"}</span><br>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML

    tdClass: "capitalize"
  },

  {
    label: "Dispatcher",
    field: row => {
      return `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800"> ${row.dispatcher}</span><br>`;
    },
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

    for (const item of row.receipts) {
      await receiptStore.update({ id: item.id, ReversalComments: reason, status: 4, ReverserDistrict: user.value.district, ReversedBy: user?.value.username.replace(/\./g, ' ') });
    }

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
    getReceiptsClean();
    getReceipts();
  }
};


const isEditDialogOpen = ref(false);
const selectedReceipt = ref(null);
const selectedDispatch = ref(null);


const openDispatchDialog = (receipt) => {
  selectedReceipt.value = receipt;
  isReceiptDialogOpen.value = true;
};





const editDispatchDialog = (receipt) => {
  selectedDispatch.value = receipt;
  isEditDialogOpen.value = true;
};







// Function to open the edit dialog
const openEditDialog = (dispatch) => {
  selectedReceipt.value = dispatch;
  isEditDialogOpen.value = true;
};

// Function to close the edit dialog
const closeReceiptDialog = () => {
  isReceiptDialogOpen.value = false;
};



const isReceiptDialogOpen = ref(false);

// Function to open the edit dialog
const openReceiptDialog = (dispatch) => {
  selectedReceipt.value = dispatch;
  isReceiptDialogOpen.value = true;
};

// Function to close the edit dialog



const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'LeanSeasonReceipts';
  // Create a worksheet from the flattened data array


  const dataToExport = receiptsClean;

  // Map over the array to flatten each object
  const flattenedData = dataToExport.map(receipt => ({
    id: receipt.id,
    ReceivedOn: moment(receipt.CreatedOn).format("DD/MM/YYYY"),
    NoBags: receipt.NoBags,
    Quantity: receipt.Quantity,
    FinalDestinationPoint: receipt.FinalDestinationPoint,
    Remarks: receipt.Remarks
  }))


  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  // Export the workbook
  XLSX.writeFile(wb, 'LeanSeasonReceipts.xlsx');
};


//MOUNTED
onMounted(() => {
  getReceipts();
  getReceiptsClean();
  // getLatest()
});
//FUNCTIONS

const getReceipts = async () => {
  isLoading.value = true;

  try {
    // Fetch all receipts
    const allReceipts = await receiptStore.groupedbydeliverynote();

    // Filter receipts based on the current user's district and exclude those with status 3


    // Update the receipts array with the filtered results
    receipts.length = 0;

    let sorteddata = allReceipts.reverse();
    receipts.push(...sorteddata);

    updateCounts();
  } catch (error) {
    console.error('Failed to fetch receipts:', error);
  } finally {
    isLoading.value = false;
  }
};





const getReceiptsClean = async () => {
  isLoading.value = true;

  try {
    // Fetch all receipts
    const allReceipts = await receiptStore.get();


    // Filter receipts based on the current user's ID

    const filteredReceipts = allReceipts.filter(receipt =>

      receipt.dispatch?.loadingPlan?.district.Name === user.value.district

    );

    // Update the receipts array with the filtered results
    receiptsClean.length = 0;

    let sorteddata = filteredReceipts.reverse();
    receiptsClean.push(...sorteddata);
    updateCounts()
  } catch (error) {
    console.error('Failed to fetch receipts:', error);
  } finally {
    isLoading.value = false;
  }
};



const createReceipts = async (item) => {
  // Wait for the receipt creation promise to complete
  await receiptStore.create(item);
};

const draftLeanReceipt = async (originalModel) => {
  try {
    // Fetch the clean receipts

    // Extract existing RefNO values from the receiptsClean array
    const existingRefNOs = new Set(receiptsClean.map(receipt => receipt.RefNO));

    // Iterate through each item in the originalModel
    for (const item of originalModel) {
      console.log(item.RefNO, "rules");

      if (item.RefNO && existingRefNOs.has(item.RefNO)) {
        // If the RefNO exists in the receiptsClean array, update the item
        await receiptStore.update(item);
      } else {
        // If the RefNO does not exist, create a new item
        await createReceipts(item);
      }
    }

    // Clean up receipts
    await getReceiptsClean();

    // Redirect to the receipts page
    $router.push({ path: '/field/receipts/leanseason' });
  } catch (error) {
    Swal.fire({
      title: "Creation Failed",
      text: `Failed to draft receipt(s): ${error.message}`,
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
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

.tab-button {
  background-color: #248cd6;
  color: white;
  border: none;
}

.active-tab {
  background-color: #0f6c97;
  color: white;
}
</style>
