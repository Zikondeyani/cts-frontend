<template>
  <main class="">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-5xl lg:px-8">
      <!-- Breadcrumb -->
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Receipts Reversals
          </h2>
        </div>
      </div>

      <!-- Tabs -->
      <div class="my-4 border-b border-gray-400">
        <div class="flex flex-wrap gap-2">
          <button
            @click="activeTab = 'lean'"
            :class="{
              'tab-button text-white': activeTab === 'lean',
              'bg-white text-gray-800 border border-blue-800': activeTab !== 'lean',
            }"
            class="flex items-center py-2 px-4 rounded-t-lg font-semibold transition-colors duration-300 ease-in-out w-full sm:w-auto"
          >
            <i class="fas fa-file-alt mr-2"></i>
            Lean Season & Emergency Assistance Receipts
            <span
              v-if="leanCount > 0"
              class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ leanCount }}
            </span>
          </button>

          <button
            @click="activeTab = 'emergency'"
            :class="{
              'tab-button text-white': activeTab === 'emergency',
              'bg-white text-gray-800 border border-blue-800': activeTab !== 'emergency',
            }"
            class="flex items-center py-2 px-4 rounded-t-lg font-semibold transition-colors duration-300 ease-in-out w-full sm:w-auto"
          >
            <i class="fas fa-check-circle mr-2"></i>
            Emergency Response Receipts
            <span
              v-if="EmerCount > 0"
              class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ EmerCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="mt-5 overflow-x-auto bg-white shadow-xl rounded-lg">
        <!-- Lean Tab -->
        <vue-good-table
          v-if="activeTab == 'lean'"
          :columns="columns2"
          :rows="receipts"
          :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <button
                @click="openDispatchDialog(props.row)"
                class="text-blue-500 hover:text-blue-400 transition duration-300"
              >
                <EyeIcon class="h-5 w-5 inline-block ml-2 mr-1" />
                View Receipt
              </button>
              <button
                @click="confirmReversal(props.row, 'lean')"
                class="text-orange-500 hover:text-orange-400 transition duration-300 ml-2"
              >
                <XIcon class="h-5 w-5 inline-block" />
                Approve Reversal
              </button>
            </span>
          </template>
        </vue-good-table>

        <!-- Emergency Tab -->
        <vue-good-table
          v-if="activeTab == 'emergency'"
          :columns="columns"
          :rows="ireceipts"
          :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <button
                @click="openDispatchDialogEmer(props.row)"
                class="text-blue-500 hover:text-blue-400 transition duration-300"
              >
                <EyeIcon class="h-5 w-5 inline-block mr-1" />
                View Receipt
              </button>
              <button
                @click="confirmReversal(props.row, 'emergency')"
                class="text-orange-500 hover:text-orange-400 transition duration-300 ml-2"
              >
                <XIcon class="h-5 w-5 inline-block" />
                Approve Reversal
              </button>
            </span>
          </template>
        </vue-good-table>

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
  
  import IReceiptViewDialog from "../../../components/pages/dispatches/view.instructed-receipt.component.vue";
  
  
  
  import ReceiptLoadingPlanDialog from "../../../components/pages/dispatches/edit.receipt-recipient.component.vue";
  
  import EditReceiptDialog from "../../../components/pages/dispatches/edit-dispatch.component.vue";
  const activeTab = ref('lean');
  
  
  import * as XLSX from 'xlsx';
  

  import { useDispatcherStore } from "../../../stores/dispatch.store";
  import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
  import { useInstructedReceiptsStore } from "../../../stores/instructedReceipts.store";
  
  
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
    { name: "Reversals", href: "#", current: true },
  ];
  
  import eventBus from '../../../services/events/eventbus';
  
  import { usereceiptstore } from "../../../stores/receipt.store";
  
  
  import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";
  
  import { XIcon } from "@heroicons/vue/outline";
  const leanCount = ref(0);
  const EmerCount = ref(0);
  
  
  
  const receiptStore = usereceiptstore();
  const receipts = reactive([]);
  const receiptsClean = reactive([]);
  
  
  const receivedCommoditiesStore = useReceivedCommoditiesStore();
  const receivedCommodities = reactive([]);
  
  const dispatchStore = useDispatcherStore();
  const dispatch = reactive([]);
  
  const ireceiptStore = useInstructedReceiptsStore();
  const ireceipts = reactive([]);
  
  const idispatchStore = useInstructedDispatchesStore();
  const idispatch = reactive([]);
  
  
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
      label: "Details",
      hidden: false,
      field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800" >D.N: ${row.instructedDispatch?.DeliveryNote !== undefined ? row.instructedDispatch?.DeliveryNote : "N/A"}</span><br>`,
      sortable: true,
      firstSortType: "asc",
      html: true, // Important for rendering HTML
  
      tdClass: "capitalize"
    },
  
   
  
    {
      label: "Reversed By",
      field: row => {
        return `
         ${row.ReversedBy}`;
      },
      sortable: true,
      firstSortType: "asc",
      html: true, // This is important to render HTML
      tdClass: "capitalize"
    },
  
    {
      label: "District",
      field: row => {
        return `
   ${row.ReverserDistrict}`;
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
  
  
  const columns2 = ref([
  
    {
      label: "#",
      field: (row) => row.originalIndex + 1,
      sortable: true,
      firstSortType: "asc",
      tdClass: "capitalize"
    },
  
  
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
      label: "Reversed By",
      field: row => {
        return `
  ${row.receipts[0]?.ReversedBy}`;
      },
      sortable: true,
      firstSortType: "asc",
      html: true, // This is important to render HTML
      tdClass: "capitalize"
    },
  
    {
      label: "District",
      field: row => {
        return `
  ${row.receipts[0]?.ReverserDistrict}`;
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
  
  
  
  
  const isEditDialogOpen = ref(false);
  const selectedReceipt = ref(null);
  const selectedDispatch = ref(null);
  
  const selectedIReceipt = ref(null);
  
  const openDispatchDialog = (receipt) => {
    selectedReceipt.value = receipt;
    isReceiptDialogOpen.value = true;
  };
  
  const openDispatchDialogEmer = (receipt) => {
    selectedIReceipt.value = receipt;
    isIReceiptDialogOpen.value = true;
  };
  
  
  const updateIdispatch = async (data) => {
  
    await idispatchStore.update(data)
  
  };
  
  const updatedispatch = async (data) => {
    await dispatchStore.update(data)
  
  }
  
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
  
  
  const closeIReceiptDialog = () => {
    isIReceiptDialogOpen.value = false;
  };
  
  
  const isReceiptDialogOpen = ref(false);
  const isIReceiptDialogOpen = ref(false);
  
  
  // Function to close the edit dialog
  
  
  
  const confirmReversal = async (row, category) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Approve Reversal',
      html: `
        <div style="text-align: left; padding: 15px; font-family: Arial, sans-serif;">
          <p style="font-size: 16px; color: #333;">Are you sure you want to approve this reversal?</p>
          <div style="background-color: #f8f8f8; padding: 10px; border-radius: 5px; margin-top: 15px;">
               <p style="margin-top: 5px; margin-bottom: 5px; font-size: 14px; color: #666;"><strong>District: </strong> ${category == 'lean' ? row?.receipts[0]?.ReverserDistrict : row?.ReverserDistrict}</p>
          <p style="margin-top: 5px; margin-bottom: 6px; font-size: 14px; color: #666;"><strong>Requestor:</strong> ${category == 'lean' ? row?.receipts[0]?.ReversedBy : row?.ReversedBy}</p>
          
            <p style="margin: 0; font-size: 14px; color: #666;"><strong>Reason sited for Reversal:</strong></p>
           
            <p style="margin-top: 5px; font-size: 14px; color: #000;">${category == 'lean' ? row?.receipts[0]?.ReversalComments : row?.ReversalComments}</p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      background: '#fff',
      customClass: {
        popup: 'swal-popup-class',
        title: 'swal-title-class',
        confirmButton: 'swal-confirm-button-class',
        cancelButton: 'swal-cancel-button-class'
      }
    });
  
    if (isConfirmed) {
      if (category == 'lean') {
        await updatedispatch({ id: row?.receipts[0]?.dispatch?.id, IsArchived: false });
  
        for (const item of row.receipts) {
          await receiptStore.update({ id: item.id, status: 2, IsDeleted: true });
        }
  
  
        getReceiptsClean()
        getReceipts()
        eventBus.emit('reversalTriggered', row?.receipts[0]?.dispatch?.id)
      } else {
        await updateIdispatch({ id: row.instructedDispatch?.id, IsArchived: false });
  
        await ireceiptStore.remove(row.id);
  
        for (const item of row.receivedCommodities) {
          await receivedCommoditiesStore.remove(item.id);
        }
  
        getIReceipts()
  
        eventBus.emit('reversalTriggered', row.id);
  
      }
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Reversal Approved Successfully',
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    }
  };
  
  
  
  
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
    getIReceipts();
    // getLatest()
  });
  //FUNCTIONS
  
  const getReceipts = async () => {
    isLoading.value = true;
  
    try {
      // Fetch all receipts
      const allReceipts = await receiptStore.groupedbydeliverynote();
  
      // Filter receipts based on the current user's district and exclude those with status 3
      const filteredReceipts = allReceipts.filter(receipt =>
        receipt.receipts?.some(r => r.status == 4
        )
      );
  
      // Update the receipts array with the filtered results
      receipts.length = 0;
  
      let sorteddata = filteredReceipts.reverse();
      receipts.push(...sorteddata);
  
      leanCount.value = receipts.length
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  
  
  
  
  const getIReceipts = async () => {
    isLoading.value = true;
  
    try {
      // Fetch all receipts
      const allReceipts = await ireceiptStore.get();
  
      // Filter receipts where at least one item has status 4
      const filteredReceipts = allReceipts.filter(receipt => receipt.status === 4);
  
  
      // Update the receipts array with the filtered results
      ireceipts.length = 0; // Clear the current receipts array
      ireceipts.push(...filteredReceipts.reverse()); // Update with new filtered and reversed data
  
      EmerCount.value = ireceipts.length
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
  
  
      // Update the receipts array with the filtered results
      receiptsClean.length = 0;
  
      let sorteddata = allReceipts.filter(item => item.status == 4).reverse();
  
      receiptsClean.push(...sorteddata);
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
      $router.push({ path: '/admin/receipts/leanseason' });
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
      $router.push({ path: '/admin/receipts/leanseason' });
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