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



                  <!-- Right Side: Loading Plan Details -->
                  <div class="flex-initial w-96 p-4 bg-white">
                    <h2 class="text-xl font-semibold mb-4 text-blue-400">Receipt Details - ID
                      {{ receipt.id }}</h2>
                    <!-- ... Loading Plan Details ... -->

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created By: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.Recipient.username.replace(/\./g, ' ')
                      }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Created On: </span>
                      <span class="text-sm text-gray-600"> {{ moment(receipt.Recipient.created).format("DD/MM/YYYY")
                      }}</span>
                    </div>
                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Final Destination: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.FinalDestinationPoint }}</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Quantity Expected: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.dispatch?.Quantity }} MT </span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Quantity Received: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.Quantity }} MT </span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Remarks: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.Remarks }} </span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Date Received: </span>
                      <span class="text-sm text-gray-600"> {{ moment(receipt.Date).format("DD/MM/YYYY") }} </span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Truck Driver #: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.dispatch.DriverName }}</span>
                    </div>


                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Truck Driver License: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.dispatch.DriverLicense }}</span>
                    </div>

                    <div class="mb-12">
                      <span class="text-sm font-bold text-gray-700">Truck #: </span>
                      <span class="text-sm text-gray-600"> {{ receipt.dispatch.TruckNumber }}</span>
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



const $router = useRouter();

import { usereceiptstore } from "../../../stores/receipt.store";


import { useSessionStore } from "../../../stores/session.store";



const dispatchstore = usereceiptstore();



const receiptstore = usereceiptstore();


const selectedRemark = ref('');
const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

const moment = inject("moment");

const Swal = inject("Swal");
const emit = defineEmits(['update', 'close']);

const props = defineProps({
  isOpen: Boolean,
  receipt: Object
});



const closeDialog = () => {
  emit('close');
};








</script>
