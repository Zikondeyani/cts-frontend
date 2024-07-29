<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class=" md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="
              font-bold
              leading-7
              text-white
              sm:text-2xl sm:truncate
            ">
            Requisition Management
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-requisitions' }">
            <button
              type="button"
              class="
                ml-3
                inline-flex
                items-center
                px-4
                py-2
                border border-transparent
                rounded
                shadow-sm
                text-sm
                font-medium
                text-white
                bg-blue-500
                hover:bg-blue-400
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-blue-500
                capitalize
              "
            >
              new requisition
            </button>
          </router-link> -->
          <!--  <create-requisition-form v-on:create="createInstruction" />
 -->
        </div>
      </div>
      <!-- table  -->


      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="requisitions" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-row="props">
            <span v-if="props.column.label === 'Options'">
              <div class="flex space-x-2">
                <!-- Manage Button -->
                <button @click.prevent="openRequisitionDetails(props.row)" class="
          inline-flex
          items-center
          px-3
          py-2
          text-sm
          font-medium
          text-blue-500
          hover:text-green-900
          bg-white
          rounded-md
          border
          border-gray-200
          hover:bg-gray-100
        ">
                  <!-- Heroicon Pencil (Manage) -->
                  <EyeIcon class="h-5 w-5 mr-1" />




                </button>

                <!-- Create Instruction Button -->

                <create-instruction-form :row-id="props.row.id" :district="props.row.district" v-on:create="createInstruction" />


              </div>
            </span>
          </template>
        </vue-good-table>
        <TransitionRoot as="template" :show="isModalOpen">
          <Dialog as="div" class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
            @close="closeModal">
            <!-- Background overlay -->
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
              leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <!-- Modal content -->
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:scale-95">
              <div
                class="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div
                  class="modal-header flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-md">
                  <h5 class="text-lg font-medium leading-normal text-gray-800">Requisition Details</h5>
                  <button type="button" @click="closeModal"
                    class="btn-close box-content w-4 h-4 p-1 text-black border-none opacity-50 hover:text-black hover:opacity-75 focus:outline-none">
                    <XIcon class="h-4 w-4" />
                  </button>
                </div>
                <div class="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 class="text-lg font-semibold mb-2">Requisition Information</h3>
                    <p><strong>Disaster:</strong> {{ selectedRequisition?.disaster.name }}</p>
                    <p><strong>Activity:</strong> {{ selectedRequisition?.activity.Name }}</p>
                    <p><strong>District:</strong> {{ selectedRequisition?.district.Name }}</p>
                    <p><strong>Affected Areas:</strong> {{ selectedRequisition?.AffectedAreas }}</p>
                    <p><strong>Affected Households:</strong> {{ selectedRequisition?.AffectedHouseholds }}</p>
                  </div>

                  <!-- Requested Commodities Table -->
                  <div class="mt-4">
                    <h3 class="text-lg font-semibold text-blue-500 mb-2">Requested Commodities</h3>
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead class="bg-blue-100">
                        <tr>
                          <th
                            class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                            #
                          </th>
                          <th
                            class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                            Commodity</th>
                          <th
                            class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                            Quantity</th>
                       
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="(item, index) in selectedRequisition?.requestedCommodities" :key="index"
                          class="hover:bg-gray-100">
                          <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
                          <td class="py-2 px-4 border-b">{{ item.commodity.Name }}</td>
                          <td class="py-2 px-4 border-b">{{ item.NoBags }} {{item.commodity?.Container_type}} ({{item.Quantity}}{{item.commodity?.Unit == 'Kg' ? 'MT': 'Units'}})</td> 
                  
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button @click="closeModal"
                    class="inline-flex justify-center py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-400">Close</button>
                </div>
              </div>
            </TransitionChild>
          </Dialog>
        </TransitionRoot>

      </div>

    </div>
  </main>
</template>

<script setup>
// import the styles
import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon, PlusCircleIcon
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createInstructionForm from "../../../components/pages/instruction/create.component.vue";


//SCHEMA//AND//STORES
import { userequisitionstore } from "../../../stores/requisition.store";

import { useinstructionstore } from "../../../stores/instructions.store";

//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
const isModalOpen = ref(false);
const selectedRequisition = ref(null);

const isDropdownOpen = ref(null);
// Toggle dropdown visibility based on the row ID
const toggleDropdown = (rowId) => {
  isDropdownOpen.value = isDropdownOpen.value === rowId ? null : rowId;
};

import eventBus from '../../../services/events/eventbus';


//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Requisition Management", href: "#", current: true },
  { name: "Emergency Response", href: "#", current: true }
];
const requisitionsStore = userequisitionstore();
const instructionStore = useinstructionstore()
const requisitions = reactive([]);

const instructions = reactive([]);

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
    field: (row) => {
      // Combine the disaster and activity names with proper formatting
      const disasterFormatted = `<span style="color: #096eb4;">Disaster: ${row.disaster.name}</span>`;
      const activityFormatted = `<span style="color: green;">Activity: ${row.activity.Name}</span>`;
      return `${disasterFormatted}<br/>${activityFormatted}`;
    },
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
    html: true, // This is important to render HTML
    tdAttr: { "v-html": true } // Use v-html directive to render HTML
  },

  {
    label: "Affected Areas",
    field: row => row.AffectedAreas,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },


  {
    label: "Affected HH",
    field: row => row.AffectedHouseholds,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "District",
    hidden: false,
    field: row => row.district.Name,
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
//MOUNTED
onMounted(() => {
  getRequisitions();
});




//FUNCTIONS
const getRequisitions = async () => {
  isLoading.value = true;
  requisitionsStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   requisitions.push(...result);
      // }
      requisitions.length = 0; //empty array
      requisitions.push(...result.filter(item => !item.IsArchived));


      requisitions.sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn));
      requisitions.reverse()
    })
    .catch(error => {
      Swal.fire({
        title: "Requisition Retrieval Failed",
        text: "failed to get requisitions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createInstruction = async model => {
  isLoading.value = true;
  instructionStore
    .create(model)
    .then(async result => {
      Swal.fire({
        title: "Success",
        text: "Created a new instructions successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      await eventBus.emit('requisitionArchived', result.id);
  
      $router.push({ path: '/dodma/instruction-management/manage/' + result.id });

     
    })
    .catch(error => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create user (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;

    });
};



const openRequisitionDetails = (row) => {
  selectedRequisition.value = row;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
