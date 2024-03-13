<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="closeDialog" static>
      <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="container mx-auto px-4 py-6">
                <!-- Flex container for the two main sections -->
                <div class="flex flex-nowrap">

                  <!-- Left Side: Form for Dispatch Creation -->
                  <div class="flex-grow p-4 bg-white">
                    <h2 class="text-xl font-semibold mb-4 text-blue-400">Create a Dispatch</h2>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="quantity" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Delivery
                        Note</label>

                      <input type="text" name="DeliveryNote" v-model="dispatch.DeliveryNote" id="DeliveryNote"
                        autocomplete="DeliveryNote"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="quantity" class="block text-sm font-bold text-gray-700 mb-2 mt-2">Final Destination
                        Point</label>

                      <input type="text" name="FinalDestinationPoint" v-model="dispatch.FinalDestinationPoint"
                        id="FinalDestinationPoint" autocomplete="FinalDestinationPoint"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="NoBags" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Number of
                        Bags</label>
                      <input type="number" name="NoBags" @keypress="validateNumberInput" required
                        v-model="dispatch.NoBags" id="NoBags" autocomplete="NoBags"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="Quantity" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Tonnage
                        (MT)</label>
                      <input type="number" name="Quantity" :value="computedTonnage" id="Quantity"
                        autocomplete="Quantity" readonly
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" />
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="End Date" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Date</label>

                      <input type="date" name="Date" v-model="dispatch.Date" id="Date" autocomplete="Date"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                    </div>

                    <hr>
                    <h2 class="text-xl font-semibold mb-4  mt-5 text-blue-400 ">Driver Details</h2>



                    <div class="col-span-6 sm:col-span-3">
                      <label for="DriverName" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Driver
                        Name</label>

                      <input type="text" name="DriverName" required v-model="dispatch.DriverName" id="DriverName"
                        autocomplete="DriverName"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="DriverLicense" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Driver
                        License</label>

                      <input type="text" name="DriverLicense" required v-model="dispatch.DriverLicense"
                        id="DriverLicense" autocomplete="DriverLicense"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="TruckNumber" class="block text-sm font-bold text-gray-700 mb-2  mt-2">Truck
                        Number</label>

                      <input type="text" name="TruckNumber" required v-model="dispatch.TruckNumber" id="TruckNumber"
                        autocomplete="TruckNumber"
                        class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>




                    <div class="flex justify-end mt-4">
                      <button @click="resetDispatch()"
                        class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 active:bg-red-700 transition ease-in-out duration-150">
                        Reset
                      </button>
                      <button @click="submitDispatch()"
                        class="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-400 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 active:bg-blue-400 transition ease-in-out duration-150">
                        Submit
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

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created By: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.user?.username?.replace(/\./g, ' ') }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created On: </span>
                      <span class="text-sm text-gray-600"> {{ moment(loadingPlan.createdOn).format("DD/MM/YYYY")
                        }}</span>
                    </div>
                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Commodity: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.commodity.Name }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Origin: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.warehouse.Name }}</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Destination: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.district.Name }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Transporter: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.transporter.Name }}</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Total Quantitye: </span>
                      <span class="text-sm text-gray-600"> {{ loadingPlan.Quantity }} MT</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Balance: </span>
                      <span class="text-sm text-gray-600">
                        {{ (loadingPlan.Balance - (isNaN(computedTonnage) ? 0 : computedTonnage)) }} MT
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


const $router = useRouter();

import { useDispatcherStore } from "../../../stores/dispatch.store";


import { useSessionStore } from "../../../stores/session.store";

const driverstore = usedriverstore();



const dispatchstore = useDispatcherStore();


const drivers = ref([]);


const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

const moment = inject("moment");

const Swal = inject("Swal");
const emit = defineEmits(['update', 'close']);

const props = defineProps({
  isOpen: Boolean,
  loadingPlan: Object
});



const dispatch = ref({ NoBags: 0 })

const closeDialog = () => {
  dispatch.value = {}
  emit('close');
};

// Fetch data for dropdowns
const fetchDrivers = async () => {
  drivers.value = await driverstore.get();
};





onMounted(() => { fetchDrivers(); });


const resetDispatch = async () => {

  dispatch.value = {}

}


const isDecimal = (num) => {
  return num % 1 !== 0;
}




const computedTonnage = computed(() => {
  let TonnageConversion = props.loadingPlan.commodity.PackSize / 1000;

  // Apply toFixed(2) only if the number is a decimal
  if (isDecimal(TonnageConversion)) {
    TonnageConversion = parseFloat(TonnageConversion.toFixed(2));
  }

  let Tonnage = dispatch.value.NoBags * TonnageConversion;

  // Apply toFixed(2) to the final result
  return isDecimal(Tonnage) ? parseFloat(Tonnage.toFixed(2)) : Tonnage;
});

const validateNumberInput = (event) => {
  // Allow only numeric input
  if (!/^\d*$/.test(event.key)) {
    event.preventDefault();
  }
}



const submitDispatch = async () => {


  if (dispatch.value.Date) {
    dispatch.value.Date = moment(dispatch.value.Date).toISOString();
  }

  dispatch.value.DispatcherId = user.value.id
  dispatch.value.loadingPlanId = props.loadingPlan.id
  dispatch.value.Quantity = computedTonnage.value

  dispatchstore
    .create(dispatch.value)
    .then(result => {

      emit('update');
      Swal.fire({
        title: "Dispatch Created",
        html: `
    <p>Your dispatch has been successfully created.</p>
    <p><strong>Dispatch ID:</strong> ${result.id}</p>
    <p>You can now track the dispatch status in the loading plans section.</p>
  `,
        icon: "success",
        confirmButtonColor: '#3085d6',
        confirmButtonText: "Go to Dispatches",
        showCancelButton: true, // Enable the cancel button
        cancelButtonText: "View All Loading Plans", // Change the text to "View All Loading Plans"
        cancelButtonColor: '#aaa', // Optional: style the cancel button
      }).then((result) => {
        closeDialog();
        if (result.isConfirmed) {
          // If "Go to Dispatches" is clicked
          closeDialog();
          $router.push('/dispatcher/dispatches');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // If "View All Loading Plans" (formerly the cancel button) is clicked
          closeDialog();
          $router.push('/dispatcher/loadingplans');
        }
      });


    })
    .catch(error => {

      if (!dispatch.value.NoBags) {
        Swal.fire({
          title: "Dispatch Denied",
          text: "Unable to complete the dispatch (Tonnage cannot be empty)",
          icon: "error",
          confirmButtonText: "Review Details",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          focusConfirm: false,
          customClass: {
            confirmButton: "swal-confirm-button", // Customize the class for confirm button
            cancelButton: "swal-cancel-button" // Customize the class for cancel button
          }
        });
      }

      else {

        Swal.fire({
          title: "Dispatch Denied",
          text: "Unable to complete the dispatch (" + error + ")",
          icon: "error",
          confirmButtonText: "Review Details",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          focusConfirm: false,
          customClass: {
            confirmButton: "swal-confirm-button", // Customize the class for confirm button
            cancelButton: "swal-cancel-button" // Customize the class for cancel button
          }
        });
      }


    })

};
</script>
