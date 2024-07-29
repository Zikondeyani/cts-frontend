<template>
  <main>
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="
              font-bold
              leading-7
              text-white
              sm:text-2xl sm:truncate
            ">
            Instructions
          </h2>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button @click="currentTab = 'leanSeason'" class="rounded-md" :class="{ active: currentTab === 'leanSeason' }">
          Lean Season Instructions
          <span v-if="emergencyResponseInstructions.length > 0" class="badge badge-red">{{
      emergencyResponseInstructions.length }}</span>
        </button>
        <button @click="currentTab = 'emergencyResponse'" class="rounded-md"
          :class="{ active: currentTab === 'emergencyResponse' }">
          Emergency Response Instructions
          <span v-if="leanSeasonInstructions.length > 0" class="badge badge-red">{{ leanSeasonInstructions.length
            }}</span>
        </button>
      </div>

      <!-- Content for Tabs -->
      <div v-if="currentTab === 'emergencyResponse'">
        <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
          <vue-good-table :columns="columns" :rows="leanSeasonInstructions" :search-options="{ enabled: true }"
            style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
            styleClass="vgt-table striped" compactMode>
            <template #table-actions> </template>

            <template #table-row="props">
              <span v-if="props.column.label === 'Status'">
                <div>
                  <!--  <span v-if="props.row.IsRejected !== null">
                    <span v-if="props.row.IsRejected"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Rejected
                    </span>
                    <span v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Approved
                    </span>
                  </span> -->
                  <span>
                    <span v-if="props.row.IsRejected"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Rejected
                    </span>
                    <span v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      On-hold
                    </span>
                  </span>
                </div>
              </span>
              <span v-if="props.column.label == 'Options'">

                <div class="flex space-x-2">

                  <!-- Create Instruction Button -->

                  <create-instruction-dispatch-form :row-id="props.row.id" v-on:create="updateInstruction"
                    :instruction="props.row" :commodities="filteredCommodities(props.row.id)" :commodity="commodity"
                    v-on:reject="rejectInstruction" />

                </div>
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>

      <div v-if="currentTab === 'leanSeason'">
        <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
          <vue-good-table :columns="columns2" :rows="emergencyResponseInstructions" :search-options="{ enabled: true }"
            style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
            styleClass="vgt-table striped" compactMode>
            <template #table-actions> </template>

            <template #table-row="props">
              <span v-if="props.column.label === 'Status'">
                <div>

                  <span>
                    <span v-if="props.row.IsRejected"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Rejected
                    </span>
                    <span v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      On-hold
                    </span>
                  </span>
                </div>
              </span>
              <span v-if="props.column.label == 'Options'">

                <div class="flex space-x-2">

                  <!-- Create Instruction Button -->

                  <button @click="openEditDialog(props.row)"
                    class="text-green-500 hover:text-green-700 transition duration-300">
                    <PencilIcon class="h-5 w-5 inline-block mr-1" />
                    Edit
                  </button>

                  <EditLoadingPlanDialog :isOpen="isEditDialogOpen" :loadingPlan="selectedLoadingPlan"
                    @close="closeEditDialog" v-on:update="getLoadingPlans" />

                  <create-approval-loadingplan :row-id="props.row.id" v-on:create="updateApproval"
                    :emergencyResponseInstructions="props.row" :commodities="filteredCommodities(props.row.id)"
                    :commodity="commodity" v-on:reject="rejectLoadingPlan" />

                </div>
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, reactive, onMounted, inject, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import spinnerWidget from '../../../components/widgets/spinners/default.spinner.vue';
import breadcrumbWidget from '../../../components/widgets/breadcrumbs/admin.breadcrumb.vue';
import createInstructionDispatchForm from '../../../components/pages/instruction/instructionRejection.component.vue';
import createApprovalLoadingplan from '../../../components/pages/instruction/instructionRejectionER.component.vue';
import EditLoadingPlanDialog from "../../../components/pages/instruction/edit-loading-plan.component.vue";

import { useloadingplanstore } from '../../../stores/loadingplans.store';

import { useinstructionstore } from '../../../stores/instructions.store';
import { useSessionStore } from '../../../stores/session.store';
import { useInstructedCommoditiesStore } from '../../../stores/instructedCommodities.store';
import { usecommoditiestore } from '../../../stores/commodity.store';
import { useInstructedDispatchesStore } from '../../../stores/instructedDispatches.store';
import { useDispatchedCommoditiesStore } from '../../../stores/dispatchedCommodities.store';

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/dodma/dashboard", current: false },
  { name: "Instructions", href: "#", current: true },
  { name: "Rejected", href: "#", current: true }
];



const instructionsStore = useinstructionstore();
const instructions = reactive([]);


const loadingplansStore = useloadingplanstore()
const loadingplans = reactive([]);

const leanSeasonInstructions = reactive([]);
const emergencyResponseInstructions = reactive([]);
const InstructedDispatchesStore = useInstructedDispatchesStore();
const InstructedDispatches = reactive([]);
const DispatchedCommoditiesStore = useDispatchedCommoditiesStore();
const DispatchedCommodities = reactive([]);
const instructedCommodityStore = useInstructedCommoditiesStore();
const commodities = reactive([]);
const CommodityStore = usecommoditiestore();
const commodity = reactive([]);
import eventBus from '../../../services/events/eventbus';


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
      const warehouseFormatted = `<span style="color: #096eb4;">From: ${row.warehouse.Name}</span>`;
      const districtFormatted = `<span style="color: green;">To: ${row.district.Name}</span>`;
      return `${warehouseFormatted}<br/>${districtFormatted}`;
    },
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
    html: true,
    tdAttr: { "v-html": true }
  },
  {
    label: "Transporter",
    field: row => row.transporter.Name,
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
    label: "Status",
    hidden: false,
    field: row => row.IsRejected,
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

const currentTab = ref('leanSeason');

// Fetch instructions based on their type
onMounted(() => {
  getInstructions();
  getInstructedCommodities();
  getCommodity();
  getLoadingPlans();


});



const isEditDialogOpen = ref(false);

const selectedLoadingPlan = ref(null);

// Function to open the edit dialog
const openEditDialog = (loadingPlan) => {
  selectedLoadingPlan.value = loadingPlan;
  isEditDialogOpen.value = true;
  open.value = false; // Close the main dialog when the edit dialog is opened
};

// Function to close the edit dialog
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};


//FUNCTIONS
const getInstructions = async () => {
  isLoading.value = true;
  instructionsStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      leanSeasonInstructions.length = 0;

      leanSeasonInstructions.push(...result.filter(item => item.IsRejected));

      

    })
    .catch(error => {
      Swal.fire({
        title: "User Retrieval Failed",
        text: "failed to get instructions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const getLoadingPlans = async () => {
  isLoading.value = true;
  loadingplansStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   instructions.push(...result);
      // }
      emergencyResponseInstructions.length = 0;


      emergencyResponseInstructions.push(...result.filter(item => item.IsRejected));


    })
    .catch(error => {
      Swal.fire({
        title: "User Retrieval Failed",
        text: "failed to get Emergency Response Instructions (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const getCommodity = async () => {
  isLoading.value = true;
  CommodityStore.get()
    .then(result => {
      commodity.length = 0;
      commodity.push(...result);
    });
};

const getInstructedCommodities = async () => {
  isLoading.value = true;
  instructedCommodityStore.get()
    .then(result => {
      commodities.length = 0;
      commodities.push(...result);
    });
};



const updateInstruction = async (newValues) => {
  isLoading.value = true;
  instructionsStore.update(newValues)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Successfully updated instruction",
        icon: "success",
      });

      eventBus.emit('instructionArchived', newValues.id);

      getInstructions();
    })
    .catch(error => {
      Swal.fire({
        title: "Failed",
        text: "Failed to update instruction (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const rejectInstruction = async (newValues) => {
  isLoading.value = true;
  instructionsStore.update(newValues)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Instruction Rejected!",
        icon: "success",
      });

      eventBus.emit('instructionArchived', newValues.id);

      getInstructions();
    })
    .catch(error => {
      Swal.fire({
        title: "Failed",
        text: "Failed to update instruction (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const updateApproval = async (newValues) => {
  isLoading.value = true;
  loadingplansStore.update(newValues)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Successfully approved loading plan",
        icon: "success",
      });

      eventBus.emit('loadingplanArchived', newValues.id);

      getLoadingPlans();
    })
    .catch(error => {
      Swal.fire({
        title: "Failed",
        text: "Failed to approve loading plan (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const rejectLoadingPlan = async (newValues) => {
  isLoading.value = true;
  loadingplansStore.update(newValues)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Loading Plan rejected!",
        icon: "success",
      });

      eventBus.emit('loadingplanArchived', newValues.id);

      getLoadingPlans();
    })
    .catch(error => {
      Swal.fire({
        title: "Failed",
        text: "Failed to approve loading plan (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const filteredCommodities = (instructionID) => {
  return commodities.filter((item) => item.instructionId === instructionID);
};


const columns2 = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Commodity",
    field: row => row.commodity?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Details",
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">From: ${row.warehouse?.Name}</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">To: ${row.district?.Name}</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">By: ${row.transporter?.Name}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // This is important to render HTML
    tdClass: "capitalize"
  },

  {
    label: "Stocks",
    hidden: false,
    field: row => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Qty: ${row.Quantity} MT</span><br>` +
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Bal: ${row.Balance !== null ? row.Balance + " MT" : "Pending"}</span>`,
    sortable: true,
    firstSortType: "asc",
    html: true, // Important for rendering HTML
    tdClass: "capitalize"
  },

  {
    label: "Status",
    hidden: false,
    field: row => row.IsApproved,
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

</script>
<style>
.tabs {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.tabs button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #f1f1f1;
  border: none;
  cursor: pointer;
}

.tabs button.active {
  background-color: #1c85d0;
  color: white;
}

.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 0.75em;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-red {
  background-color: rgba(255, 0, 0, 0.874);
  color: white;
}
</style>
