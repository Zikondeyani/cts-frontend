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
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold">


        <vue-good-table :columns="columns" :rows="dispaches" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <div class="flex space-x-2">
                <create-instruction-receipt-form :row-id="props.row.id" v-on:create="createReceipt"
                  :dispatch="props.row" v-on:draft="draftReceipt" />
              </div>
            </span>
          </template>
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
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import createInstructionReceiptForm from "../../../components/pages/instruction/receipt.component.vue";


//SCHEMA//AND//STORES
 


import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/receipient/dashboard", current: false },
  { name: "Expected Dispatches", href: "#", current: true },
  { name: "Emergency Response", href: "#", current: true },
];

const open = ref(true)
import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useDispatchedCommoditiesStore } from "../../../stores/dispatchedCommodities.store";
import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";
import { useInstructedReceiptsStore } from "../../../stores/instructedReceipts.store";

import eventBus from '../../../services/events/eventbus';


const dispatchStore = useInstructedDispatchesStore();
const dispaches = reactive([]);

const receiptStore = useInstructedReceiptsStore();
const receipt = reactive([]);


const dispatchedCommodityStore = useDispatchedCommoditiesStore();
const dispatchedCommodities = reactive([]);

import { usewarehousestore } from "../../../stores/warehouse.store";

const receivedCommodityStore = useReceivedCommoditiesStore();
const receivedCommodities = reactive([]);

const warehouseStore = usewarehousestore();
const warehouses = reactive([]);

import * as XLSX from 'xlsx';

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
    label: "Target FDP",
    field: (row) => {
      const warehouseFormatted = `<span style="color: #096eb4; display: inline-block; max-width: 250px; white-space: normal; word-wrap: break-word;">${row.FinalDestinationPoint}</span>`;
      return `${warehouseFormatted}`;
    },
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize whitespace-normal break-words", // Ensure wrapping and breaking words
    thClass: "w-1/6", // Set width to 1/6th of the table
    html: true,
    tdAttr: { "v-html": true },
  },

  {
    label: "Dispatched By",
    field: row => row.Dispatcher?.username.replace(/\./g, ' '),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },

  {
    label: "Status",
    field: row => {
      const today = moment();
      const endDate = moment(row.loadingPlan?.EndDate);

      if (row.IsArchived) {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800'>Expensed</span>";
      } else if (!row.IsArchived && endDate.isBefore(today)) {
        const diffDays = today.diff(endDate, 'days');
        if (diffDays <= 3) {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>Delayed</span>";
        } else {
          return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800'>Not Delivered</span>";
        }
      } else {
        return "<span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>Pending</span>";
      }
    },
    sortable: true,
    firstSortType: "asc",
    html: true,
    tdClass: "capitalize"
  },


  {
    label: "Options",
    field: row => row,
    sortable: false
  }



]);


const getWarehouses = async () => {
  try {
    const result = await warehouseStore.get();
    warehouses.length = 0; // Empty array before pushing new results
    warehouses.push(...result);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
  }
};








const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Dispatches';

  // Assuming dispaches is an array of objects
  // Map over dispaches and exclude certain fields
  const dataForExport = dispaches.map(({ CreatedOn, UpdatedOn, DispatcherId, loadingPlanId, Dispatcher, loadingPlan, instructionId, Date, instruction, dispatchedCommodities, IsArchived, ...keepAttrs }) => keepAttrs);

  // Create a worksheet from the filtered data array
  const ws = XLSX.utils.json_to_sheet(dataForExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'Dispatches.xlsx');
};


//MOUNTED
onMounted(() => {
  getDispatches();
  getDispatchedCommodities();
  getReceipts();
  getWarehouses();
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
      receipt.length = 0; //empty array
      let sorteddata = result.reverse()
      receipt.push(...sorteddata);


    })


    .finally(() => {
      isLoading.value = false;
    });

}


const getDispatches = async () => {
  isLoading.value = true;

  try {
    const result = await dispatchStore.get();

    // Sort dispatches by `createdOn` date
    const sortedDispatches = [...result].sort((a, b) => new Date(b.createdon) - new Date(a.createdon));

    dispaches.length = 0; // Clear existing dispatches
    const reversedData = sortedDispatches.reverse();

    // Filter and map the dispatches
    const filteredDispatches = reversedData
      .filter(item => !item.IsArchived && item.instruction.district?.Name === user.value.district)
      .map(dispatch => {
        // Map warehouse IDs to warehouse objects
        const warehouseArray = dispatch.instruction?.warehouseIds?.map(warehouseId => {
          return warehouses.find(warehouse => warehouse.id === warehouseId);
        }).filter(warehouse => warehouse); // Filter out undefined results


        // Add the warehouse array to the dispatch object
        return {
          ...dispatch,
          warehouses: warehouseArray,
        };
      });

    // Update dispatches with the mapped data
    dispaches.push(...filteredDispatches);


  } catch (error) {
    console.error('Error fetching dispatches:', error);
  } finally {
    isLoading.value = false;
  }
};


const createReceipt = async (originalModel) => {
  // Separate relief items from the original model
  const { receivedCommodities, ...receiptModel } = originalModel;

  try {
    // Create the receipt without the relief items
    const createdReceipt = await receiptStore.create(receiptModel);
    const receiptId = createdReceipt.id;

    // Loop through each commodity and create it with the receipt ID
    for (const commodity of originalModel.receivedCommodities) {
      await createReceivedCommodities(receiptId, commodity);
    }

    Swal.fire({
      title: "Success",
      text: "Created a receipt and associated commodities successfully",
      icon: "success",
      confirmButtonText: "Ok"
    });

    await receiptStore.get()
    $router.push({ path: '/receipient/receipts/emergency' });

  } catch (error) {
    Swal.fire({
      title: "Creation Failed",
      text: `Failed to create receipt and associated commodities: Contact Administrator for support!`,
      icon: "error",
      confirmButtonText: "Ok"
    });
  } finally {
    isLoading.value = false;
  }
};




const createReceivedCommodities = async (receiptId, receivedCommodity) => {
  const receiptModel = {
    instructedReceiptId: receiptId,
    commodityId: receivedCommodity.commodityId,
    BatchNumber: receivedCommodity.BatchNumber,
    PhysicalDeliveryNote: receivedCommodity.PhysicalDeliveryNote,
    TruckNumber: receivedCommodity.TruckNumber,
    FinalDestinationPoint: receivedCommodity.FinalDestinationPoint,
    Quantity: receivedCommodity.Quantity,
    NoBags: receivedCommodity.NoBags,
    RefNO: receivedCommodity.RefNO,
    Remarks: receivedCommodity.Remarks,
  };

  await receivedCommodityStore.create(receiptModel); // Assuming receivedCommodityStore is the correct reference
  eventBus.emit('leaseasonDispatchesArchived', receiptId);
  eventBus.emit('emergencyDispatchesArchived', receiptId);
};



const getDispatchedCommodities = async () => {
  isLoading.value = true;
  dispatchedCommodityStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      dispatchedCommodities.length = 0; //empty array
      let sorteddata = result.reverse()
      dispatchedCommodities.push(...sorteddata);


    })


    .finally(() => {
      isLoading.value = false;
    });

}



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
