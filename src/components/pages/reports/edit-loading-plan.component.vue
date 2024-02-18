

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="closeDialog" static>
      <div class="flex items-start justify-center min-h-screen px-4 pt-20 pb-4 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <!-- Trick to center the modal content -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <TransitionChild as="template" enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

          <div
            class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl">
            <div
              class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white">
              <h5 class="font-body text-md font-bold leading-normal text-blue-400" id="formModalLabel">
                Update Loading Plan
              </h5>
              <!-- <button type="button"
                class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                @click="open = false"></button> -->
            </div>

            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-2">



                <div class="col-span-6 sm:col-span-3">
                  <label for="transporter" class="block text-sm font-medium text-gray-700">
                    Select Transporter</label>
                  <select id="transporter" name="transporter" v-model="loadingPlan.transporterId"
                    autocomplete="transporter-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="transporter in transporters" :key="transporter" :value="transporter.id"
                      class="uppercase">
                      {{ transporter.Name }}
                    </option>
                  </select>

                </div>




                <div class="col-span-6 sm:col-span-3">
                  <label for="transporter" class="block text-sm font-medium text-gray-700">
                    Select Commodity</label>
                  <select id="commodity" name="commodity" v-model="loadingPlan.commodityId" autocomplete="commodity-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="commodity in commodities" :key="commodity" :value="commodity.id" class="uppercase">
                      {{ commodity.Name }}
                    </option>
                  </select>

                </div>

              </div>

              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-3">
                  <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>

                  <input type="number" name="quantity" v-model="loadingPlan.Quantity" id="reportFrom"
                    autocomplete="quantity"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="warehouse" class="block text-sm font-medium text-gray-700">Warehouse</label>

                  <select id="warehouse" name="warehouse" v-model="loadingPlan.warehouseId" autocomplete="warehouse-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="warehouse in warehouses" :key="warehouse" :value="warehouse.id" class="uppercase">
                      {{ warehouse.Name }}
                    </option>
                  </select>
                </div>
              </div>



              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-3">
                  <label for="destination-district" class="block text-sm font-medium text-gray-700">Destination
                    District</label>

                  <select id="destination" name="destination" v-model="loadingPlan.districtId"
                    autocomplete="destination-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="district in districts" :key="district" :value="district.id" class="uppercase">
                      {{ district.Name }}
                    </option>
                  </select>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="project" class="block text-sm font-medium text-gray-700">Project</label>

                  <select id="project" name="project" v-model="loadingPlan.projectId" autocomplete="project-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="project in projects" :key="project" :value="project.id" class="uppercase">
                      {{ project.Name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-3">
                  <label for="destination-district" class="block text-sm font-medium text-gray-700">Activity</label>

                  <select id="activity" name="activity" v-model="loadingPlan.activityId" autocomplete="activity-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option v-for="activity in activities" :key="activity" :value="activity.id" class="uppercase">
                      {{ activity.Name }}
                    </option>
                  </select>
                </div>

                <div class="col-span-3 sm:col-span-3">
                  <label for="project" class="block text-sm font-medium text-gray-700">Start Date</label>



                  <input type="date" name="Start Date" v-model="formattedStartDate"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                </div>

                <div class="col-span-3 sm:col-span-3">
                  <label for="End Date" class="block text-sm font-medium text-gray-700">End Date</label>

                  <input type="date" name="End Date" v-model="formattedEndDate" id="End Date" autocomplete="End Date"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button @click="updateLoadingPlan" style="background-color: #329ce7;"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Save
              </button>
            </div>
          </div>



        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogOverlay, TransitionRoot, TransitionChild } from '@headlessui/vue';

import { inject, ref, reactive, onMounted, watch, computed } from "vue";


const Swal = inject("Swal");
const moment = inject("moment");
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { useprojectstore } from "../../../stores/project.store";
import { useactivitiestore } from "../../../stores/activity.store";
import { useSessionStore } from "../../../stores/session.store";


const roleStore = useRoleStore();
const loadingplanstore = useloadingplanstore();
const loadingplans = reactive([])
const activitiestore = useactivitiestore();
const activities = ref([]);
const districtstore = usedistrictstore();
const districts = ref([]);
const projectstore = useprojectstore();
const projects = ref([]);
const warehouseStore = usewarehousestore();
const warehouses = ref([]);
const userStore = useUserStore();
const roles = ref([]);
const sessionStore = useSessionStore();

const open = ref(false);
// Props
const props = defineProps({
  isOpen: Boolean,
  loadingPlan: Object
});




// Emits
const emit = defineEmits(['update', 'close']);



const closeDialog = () => {
  emit('close');
};

// Data
const transporters = ref([]);

const loadingPlan = ref(props.loadingPlan || {});

const NewLoadingPlan = ref({})

// Watch for changes in props.loadingPlan
watch(() => props.loadingPlan, (newVal) => {
  loadingPlan.value = { ...newVal };
});

// Stores
const loadingPlanStore = useloadingplanstore();
const transporterStore = usetransporterstore();


const commoditiesstore = usecommoditiestore();
const commodities = ref([]);

;

// Methods
const updateLoadingPlan = async () => {


  try {
    // Destructure to remove specific objects and keep the rest in a new object
    const { commodity, district, transporter, warehouse, user, originalIndex, vgt_id, ...updatedLoadingPlan } = loadingPlan.value;

    // Now, updatedLoadingPlan is a copy of loadingPlan.value without the specified properties
    await loadingPlanStore.update(updatedLoadingPlan);


    emit('update');

    // Show success message
    Swal.fire({
      title: "Loading Plan Updated",
      html: `
      <p>Your loading plan has been successfully updated.</p>
    `,
      icon: "success",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "View All Loading Plans",

      cancelButtonColor: '#aaa',
    }).then((result) => {

      emit('close');
    });
  } catch (error) {
    console.error('Failed to update loading plan:', error);
    // Handle error (e.g., show an error message)
  }

};

// Fetch data for dropdowns
const fetchTransporters = async () => {
  transporters.value = await transporterStore.get();
};

// Fetch data for dropdowns
const fetchCommodities = async () => {
  commodities.value = await commoditiesstore.get();
};



// Fetch data for dropdowns
const fetchActivities = async () => {
  activities.value = await activitiestore.get();
};


// Fetch data for dropdowns
const fetchProjects = async () => {
  projects.value = await projectstore.get();
};


// Fetch data for dropdowns
const fetchDistricts = async () => {
  districts.value = await districtstore.get();
};

// Fetch data for dropdowns
const fetchWarehouses = async () => {
  warehouses.value = await warehouseStore.get();
};
// ... other fetch functions ...

// Computed property for StartDate
const formattedStartDate = computed({
  get: () => {
    // Convert to 'YYYY-MM-DD' format for the HTML date input
    return loadingPlan.value.StartDate ? moment(loadingPlan.value.StartDate).format('YYYY-MM-DD') : '';

  },
  set: (newValue) => {
    // Update loadingPlan's StartDate
    loadingPlan.value.StartDate = newValue;
  }
});

// Computed property for EndDate
const formattedEndDate = computed({
  get: () => {
    // Convert to 'YYYY-MM-DD' format for the HTML date input
    return loadingPlan.value.EndDate ? moment(loadingPlan.value.EndDate).format('YYYY-MM-DD') : '';
  },
  set: (newValue) => {
    // Update loadingPlan's EndDate
    loadingPlan.value.EndDate = newValue;
  }
});

// On mounted
onMounted(() => {
  fetchTransporters();
  fetchWarehouses();
  fetchCommodities();
  fetchDistricts();
  fetchProjects();
  fetchActivities();
  // loadingPlan.value.StartDate = moment(loadingPlan.value.StartDate).format('MM/DD/YYYY')



  // ... other fetch calls ...
});
</script>
