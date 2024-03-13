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
                Update Dispatch
              </h5>
              <!-- <button type="button"
                class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                @click="open = false"></button> -->
            </div>

            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-2">

                <div class="col-span-6 sm:col-span-3">
                  <label for="deliverynote" class="block text-sm font-medium text-gray-700">Delivery Note</label>

                  <input type="text" name="deliverynote" v-model="Dispatch.DeliveryNote" id="deliverynote"
                    autocomplete="deliverynote"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>




                <div class="col-span-6 sm:col-span-3">
                  <label for="FinalDestinationPoint" class="block text-sm font-medium text-gray-700">Final Destination
                    Point</label>

                  <input type="text" name="FinalDestinationPoint" v-model="Dispatch.FinalDestinationPoint"
                    id="FinalDestinationPoint" autocomplete="FinalDestinationPoint"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

              </div>


              <div class="grid grid-cols-6 gap-2">

                <div class="col-span-6 sm:col-span-3">
                  <label for="NoBags" class="block text-sm font-medium text-gray-700 mb-2  mt-2">Number of Bags</label>
                  <input type="number" name="NoBags" @keypress="validateNumberInput" v-model="Dispatch.Quantity"
                    id="NoBags" autocomplete="NoBags"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="Quantity" class="block text-sm font-medium text-gray-700 mb-2  mt-2">Tonnage</label>
                  <input type="number" name="Quantity" :value="computedTonnage" id="Quantity" autocomplete="Quantity"
                    readonly
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" />
                </div>
              </div>



              <hr>
              <h2 class="text-xl font-semibold mb-4  mt-5 text-blue-400 ">Driver Details</h2>


              <div class="grid grid-cols-6 gap-2">

                <div class="col-span-6 sm:col-span-3">
                  <label for="DriverName" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Driver Name</label>

                  <input type="text" name="DriverName" v-model="Dispatch.DriverName" id="DriverName"
                    autocomplete="DriverName"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>


                <div class="col-span-6 sm:col-span-3">
                  <label for="DriverLicense" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Driver's
                    License</label>

                  <input type="text" name="DriverLicense" v-model="Dispatch.DriverLicense" id="DriverLicense"
                    autocomplete="DriverLicense"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="TruckNumber" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Truck Number</label>

                  <input type="text" name="TruckNumber" v-model="Dispatch.TruckNumber" id="TruckNumber"
                    autocomplete="TruckNumber"
                    class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

              </div>





            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button @click="updateDispatch" style="background-color: #329ce7;"
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

import { usedriverstore } from "../../../stores/driver.store";
import { useprojectstore } from "../../../stores/project.store";
import { useactivitiestore } from "../../../stores/activity.store";
import { useSessionStore } from "../../../stores/session.store";

import { useDispatcherStore } from "../../../stores/dispatch.store";

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
  Dispatch: Object
});




// Emits
const emit = defineEmits(['update', 'close']);



const closeDialog = () => {
  emit('close');
};

// Data
const transporters = ref([]);

const drivers = ref([])

const Dispatch = ref(props.Dispatch || {});


// Watch for changes in props.Dispatch
watch(() => props.Dispatch, (newVal) => {
  Dispatch.value = { ...newVal };
});

// Stores
const DispatchStore = useDispatcherStore();
const transporterStore = usetransporterstore();


const driverStore = usedriverstore();


const commoditiesstore = usecommoditiestore();
const commodities = ref([]);



const computedTonnage = computed(() => {
  return Dispatch.value.Quantity * 0.05; // Assuming 1 bag = 0.05 tons
});


// Methods
const updateDispatch = async () => {


  try {
    // Destructure to remove specific objects and keep the rest in a new object


    Dispatch.value.UpdatedOn = moment().format().toString();


    Dispatch.value.IsArchived = false;

    const { Dispatcher, Driver, loadingPlan, originalIndex, vgt_id, NoBags, ...updatedDispatch } = Dispatch.value;

    // Now, updatedDispatch is a copy of Dispatch.value without the specified properties
    await DispatchStore.update(updatedDispatch);


    emit('update');

    // Show success message
    Swal.fire({
      title: "Loading Plan Updated",
      html: `
      <p>Dispatch has been successfully updated.</p>
    `,
      icon: "success",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "View All Dispatches",

      cancelButtonColor: '#aaa',
    }).then((result) => {

      emit('close');
    });
  } catch (error) {
    console.error('Failed to update dispatches:', error);
    // Handle error (e.g., show an error message)
  }

};

// Fetch data for dropdowns
const fetchTransporters = async () => {
  drivers.value = await driverStore.get();
};

// Computed property for StartDate
const formattedStartDate = computed({
  get: () => {
    // Convert to 'YYYY-MM-DD' format for the HTML date input
    return Dispatch.value.StartDate ? moment(Dispatch.value.StartDate).format('YYYY-MM-DD') : '';

  },
  set: (newValue) => {
    // Update Dispatch's StartDate
    Dispatch.value.StartDate = newValue;
  }
});

// Computed property for EndDate
const formattedEndDate = computed({
  get: () => {
    // Convert to 'YYYY-MM-DD' format for the HTML date input
    return Dispatch.value.EndDate ? moment(Dispatch.value.EndDate).format('YYYY-MM-DD') : '';
  },
  set: (newValue) => {
    // Update Dispatch's EndDate
    Dispatch.value.EndDate = newValue;
  }
});


const validateNumberInput = (event) => {
  // Allow only numeric input
  if (!/^\d*$/.test(event.key)) {
    event.preventDefault();
  }
}


// On mounted
onMounted(() => {
  fetchTransporters();
  // ... other fetch calls ...
});
</script>
