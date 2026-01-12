<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto flex mt-6 items-center justify-center"
      @close="closeDialog" static>
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <TransitionChild as="template" enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div
            class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:max-w-4xl sm:w-full max-h-screen overflow-y-auto">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="container mx-auto px-4 py-6">
                <!-- Flex container for the two main sections -->
                <div class="flex flex-nowrap">

                  <!-- Left Side: Form for Dispatch Creation -->
                  <div class="flex-grow p-4 bg-white">
                    <h2 class="text-lg font-semibold mb-2 text-blue-400">Create a Dispatch</h2>

                    <h2 class="text-xs font-semibold mb-5 text-blue-400"> System Delivery Note:
                      {{ dispatch.DeliveryNote }}</h2>


                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div>
                        <label for="DNote" class="block text-sm font-bold text-gray-700 mb-1">
                          Delivery Note</label>
                        <input type="text" name="DNote" v-model="dispatch.DNote" id="DNote"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>


                      <div>
                        <label for="FinalDestinationPoint" class="block text-sm font-bold text-gray-700 mb-1">Final
                          Destination Point</label>
                        <input type="text" name="FinalDestinationPoint" v-model="dispatch.FinalDestinationPoint"
                          id="FinalDestinationPoint"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>

                      <div>
                        <label for="NoBags" class="block text-sm font-bold text-gray-700 mb-1">Number of Bags</label>
                        <input type="number" name="NoBags" @keypress="validateNumberInput" required
                          v-model="dispatch.NoBags" id="NoBags"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>

                      <div>
                        <label for="Quantity" class="block text-sm font-bold text-gray-700 mb-1">Tonnage (MT)</label>
                        <input type="number" name="Quantity" :value="computedTonnage" id="Quantity" readonly
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md bg-gray-100" />
                      </div>

                      <div>
                        <label for="Date" class="block text-sm font-bold text-gray-700 mb-1">Date</label>
                        <input type="date" name="Date" v-model="dispatch.Date" id="Date"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                          :max="new Date().toISOString().split('T')[0]" />
                      </div>
                    </div>

                    <hr class="my-4">


                    <h2 class="text-lg font-semibold mb-2 text-blue-400">Driver Details</h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label for="DriverName" class="block text-sm font-bold text-gray-700 mb-1">Driver Name</label>
                        <input type="text" name="DriverName" required v-model="dispatch.DriverName" id="DriverName"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>

                      <div>
                        <label for="DriverLicense" class="block text-sm font-bold text-gray-700 mb-1">Driver
                          License</label>
                        <input type="text" name="DriverLicense" required v-model="dispatch.DriverLicense"
                          id="DriverLicense"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>

                      <div>
                        <label for="PhoneNumber" class="block text-sm font-bold text-gray-700 mb-1">Driver Phone
                          #</label>
                        <input type="text" name="PhoneNumber" required v-model="dispatch.PhoneNumber" id="PhoneNumber"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>

                      <div>
                        <label for="TruckNumber" class="block text-sm font-bold text-gray-700 mb-1">Truck Number</label>
                        <input type="text" name="TruckNumber" required v-model="dispatch.TruckNumber" id="TruckNumber"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
                      </div>
                    </div>


                    <h2 class="text-lg font-semibold mb-1 text-blue-400 mt-2" v-if="!loadingPlan?.IsPrepositioned">Other
                      Dispatch Details <p class="text-xs italic text-gray-400 mb-2">These details are optional</p>
                    </h2>

                    <div v-if="loadingPlan?.IsPrepositioned" class="mt-4">
                      <h2 class="text-lg font-semibold text-blue-500 mb-3">Stock Prepositioning Details</h2>
                      <div class="text-sm text-gray-500">
                        <p class="italic">
                          <span class="font-semibold text-gray-700">From:</span> {{ loadingPlan?.warehouseFrom }}
                        </p>
                        <p class="italic">
                          <span class="font-semibold text-gray-700">To:</span> {{ loadingPlan?.warehouseTo }}
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="!loadingPlan?.IsPrepositioned">
                      <!-- Dispatch Status Dropdown -->
                      <div>
                        <label for="IsIntransit" class="block text-sm font-bold text-gray-700 mb-1">Dispatch
                          Type</label>
                        <select name="IsIntransit" v-model="dispatch.IsIntransit" id="toWarehouse"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md">
                          <option disabled value="">Select dispatch status</option>
                          <option :value="true">Going to warehouse</option>
                          <option :value="false">Going to FDP</option>
                        </select>
                      </div>

                      <!-- To Warehouse Dropdown, only visible when IsIntransit is true -->
                      <div v-if="dispatch.IsIntransit === true">
                        <label for="toWarehouse" class="block text-sm font-bold text-gray-700 mb-1">To Warehouse</label>
                        <select name="toWarehouse" v-model.number="dispatch.warehouseId" id="toWarehouse"
                          class="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md">
                          <option disabled value="">Select a Warehouse</option>
                          <option v-for="warehouse in warehoouses" :key="warehouse.id" :value="warehouse.id">{{
                            warehouse.Name }}</option>
                        </select>

                      </div>
                    </div>


                    <div class="flex justify-end mt-4">
                      <button @click="resetDispatch()"
                        class="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none mr-2">
                        Reset
                      </button>
                      <button @click="submitDispatch()" :disabled="loading" style="background-color: #096eb4;"
                        class="`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                        <span v-if="!loading">Submit Dispatch</span>
                        <span v-else>
                          Processing...
                        </span>
                      </button>
                    </div>

                  </div>


                  <!-- Vertical divider line -->
                  <div class="hidden sm:block sm:w-px sm:bg-gray-200"></div>

                  <!-- Right Side: Loading Plan Details -->
                  <div class="flex-initial w-96 p-4 bg-white">
                    <h2 class="text-xl font-semibold mb-4 text-blue-400">Loading Plan Details - ID
                      {{ loadingPlan.id }}</h2>
                    <!-- ... Loading Plan Details ... -->

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">ATC #: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.ATCNumber }}</span>
                    </div>

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Created By: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.user?.username?.replace(/\./g, ' ') }}</span>
                    </div>

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Created On: </span>
                      <span class="text-sm text-gray-600"> {{ moment(loadingPlan.createdOn).format("DD/MM/YYYY")
                      }}</span>
                    </div>
                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Commodity: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.commodity.Name }}</span>
                    </div>

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Origin: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.warehouse?.Name == undefined ?
                        loadingPlan?.warehouseFrom : loadingPlan.warehouse?.Name }}</span>
                    </div>


                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Destination: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan?.district?.Name }}</span>
                    </div>

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Transporter: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan?.transporter?.Name }}</span>
                    </div>

                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Activity: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan?.activity?.Name || 'Stock Prepositioning'
                        }}</span>
                    </div>



                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Total Quantity: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.Quantity }} MT</span>
                    </div>


                    <div class="mb-7">
                      <span class="text-sm font-bold text-gray-700">Balance: </span>
                      <span :class="{
                        'text-sm text-gray-600': (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) >= 0,
                        'text-sm text-red-600 font-italic text-italic': (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) < 0
                      }">
                        {{
                          (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) >= -0.9 &&
                            (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) <= 0 ? '0.00'
                            : (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) }} MT <br>
                      </span>

                      <span v-if="(loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)).toFixed(2) < 0"
                        class="text-red-600 text-italic">
                        * Negative balances are not allowed, please dispatch within the balance available!
                      </span>
                    </div>


                  </div>

                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:w-auto sm:text-sm"
                @click="closeDialog">
                Close
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
import { useRouter } from "vue-router";
import { inject, ref, reactive, defineEmits, onMounted, watch, computed } from "vue";
import { usedriverstore } from "../../../stores/driver.store";

import { usewarehousestore } from "../../../stores/warehouse.store";
import { useDispatcherStore } from "../../../stores/dispatch.store";
import { useSessionStore } from "../../../stores/session.store";


import { XIcon, DocumentTextIcon, SaveIcon, CheckCircleIcon } from "@heroicons/vue/outline";

const $router = useRouter();
const driverstore = usedriverstore();

const warehousestore = usewarehousestore();
const dispatchstore = useDispatcherStore();
const drivers = ref([]);

const warehoouses = ref([]);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const moment = inject("moment");
const Swal = inject("Swal");
const emit = defineEmits(['update', 'close']);

const props = defineProps({
  isOpen: Boolean,
  loadingPlan: Object
});

const dispatch = ref({ NoBags: 0, warehouseId: 0, });

const closeDialog = () => {
  emit('close');
};

const fetchDrivers = async () => {
  drivers.value = await driverstore.get();
};


const fetchWarehouses = async () => {
  warehoouses.value = await warehousestore.get();
};

onMounted(() => {
  fetchWarehouses();
  fetchDrivers();
  generateUniqueDeliveryNote();
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    generateUniqueDeliveryNote();
  }
});

const resetDispatch = () => {
  dispatch.value = {};
  generateUniqueDeliveryNote();
};

const isDecimal = (num) => {
  return num % 1 !== 0;
};

const computedTonnage = computed(() => {
  let TonnageConversion = props.loadingPlan.commodity.PackSize / 1000;
  if (isDecimal(TonnageConversion)) {
    TonnageConversion = parseFloat(TonnageConversion.toFixed(2));
  }
  let Tonnage = dispatch.value.NoBags * TonnageConversion;
  return isDecimal(Tonnage) ? parseFloat(Tonnage.toFixed(2)) : Tonnage;
});

const validateNumberInput = (event) => {
  if (!/^\d*$/.test(event.key)) {
    event.preventDefault();
  }
};

const generateUniqueDeliveryNote = () => {
  const timestamp = new Date().getTime().toString(36);
  const uniqueString = Math.random().toString(36).substr(2, 5).toUpperCase();
  dispatch.value.DeliveryNote = `DODMA-LSR-${timestamp}-${uniqueString}`;
};

const loading = ref(false);

const submitDispatch = async () => {
  if (loading.value) return; // Prevent multiple submissions
  loading.value = true; // Start loader

  // Calculate remaining balance and normalize small negative values to 0
  const remainingBalance = (parseFloat(props.loadingPlan.Balance.toFixed(2)) ?? 0) - (parseFloat(computedTonnage.value.toFixed(2)) ?? 0);
  const normalizedBalance = Math.abs(remainingBalance) < 0.01 ? 0 : remainingBalance; // Treat -0.00 as 0

  // Check if the number of bags is zero
  if (dispatch.value.NoBags === 0) {
    Swal.fire({
      title: "Dispatch Denied",
      text: "Unable to create the dispatch (Number of bags cannot be zero)",
      icon: "error",
      confirmButtonText: "Review Details",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      focusConfirm: false,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button"
      }
    });
    loading.value = false; // Stop loader
    return;
  }

  // Check if the remaining balance would be negative
  if (normalizedBalance < 0) {
    Swal.fire({
      title: "Insufficient Balance",
      text: `Unable to create the dispatch. The dispatched quantity exceeds the available balance. Remaining balance: ${props.loadingPlan.Balance} MT.`,
      icon: "error",
      confirmButtonText: "Review Details",
      customClass: {
        confirmButton: "swal-confirm-button",
      }
    });
    loading.value = false; // Stop loader
    return;
  }

  // Show confirmation dialog before submission
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to submit this dispatch?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Submit",
    cancelButtonText: "No, Cancel",
    customClass: {
      confirmButton: "swal-confirm-button",
      cancelButton: "swal-cancel-button"
    }
  });

  // If user cancels, stop the process
  if (!confirmResult.isConfirmed) {
    loading.value = false; // Stop loader
    return;
  }

  // Format date if it's available
  if (dispatch.value.Date) {
    dispatch.value.Date = moment(dispatch.value.Date).toISOString();
  }

  // Determine warehouseId based on loadingPlan.IsPrepositioned
  dispatch.value.warehouseId = props.loadingPlan.IsPrepositioned
    ? props.loadingPlan.moveToWarehouseId
    : 0;

  dispatch.value.DispatcherId = user.value.id;
  dispatch.value.loadingPlanId = props.loadingPlan.id;
  dispatch.value.Quantity = computedTonnage.value;

  try {
    // Create the dispatch
    const result = await dispatchstore.create(dispatch.value);

    // Emit update event on success
    emit('update');

    // Show success message
    Swal.fire({
      title: "Dispatch Created",
      html: `
        <p>Your dispatch has been successfully created.</p>
        <p><strong>Dispatch ID:</strong> ${result.id}</p>
      `,
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "swal-confirm-button",
      }
    });

    // Clear dispatch.value after successful submission
    dispatch.value = {
      NoBags: 0,
      Date: null,
      DispatcherId: null,
      loadingPlanId: null,
      Quantity: null,
      // Add other properties as needed based on your dispatch object structure
    };

    closeDialog(); // Close the dialog after success
    loading.value = false; // Stop loader

  } catch (error) {
    // Handle errors during dispatch creation
    Swal.fire({
      title: "Error",
      text: "There was an issue creating the dispatch. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "swal-confirm-button",
      }
    });
  } finally {
    loading.value = false; // Stop loader
  }
};




</script>
