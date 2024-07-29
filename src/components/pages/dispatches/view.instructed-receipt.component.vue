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
          <div id="content"
            class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="container mx-auto px-4 py-6">
                <!-- Title -->

                <div class="text-center mb-4">
                  <img src="../../../assets/images/images.png" alt="Department Logo" class="w-20 mx-auto mb-2">
                  <h3 class="font-bold text-xl">DEPARTMENT OF DISASTER MANAGEMENT AFFAIRS</h3>
                </div>

                <h2 class="text-center text-2xl font-semibold text-gray-800">Warehouse Goods Delivery Note</h2>

                <!-- Form Section -->
                <div class="mt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-700">REF NO:</label>
                      <p class="text-sm text-gray-600">{{ receipt.receivedCommodities[0]?.RefNO }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Deliver Note No:</label>
                      <p class="text-sm text-gray-600">{{ receipt.instructedDispatch?.DeliveryNote }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Date:</label>
                      <p class="text-sm text-gray-600">{{ moment(receipt.CreatedOn).format("DD-MM-YYYY") }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Warehouse:</label>
                      <p class="text-sm text-gray-600">{{ receipt.instructedDispatch?.instruction?.warehouse?.Name }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Vehicle Reg No:</label>
                      <p class="text-sm text-gray-600">{{ receipt.instructedDispatch?.instruction?.VehicleRegNo }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Driver Name:</label>
                      <p class="text-sm text-gray-600">{{ receipt.instructedDispatch?.instruction?.DriverName }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Purpose:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.instructedDispatch?.instruction?.Purpose }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Destination:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.instructedDispatch?.instruction?.district?.Name }}
                      </p>
                    </div>

                  
                  </div>
                </div>

                <!-- Goods List Section -->
                <div class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-700">Goods List</h3>
                  <table class="min-w-full mt-2 bg-white">
                    <thead>
                      <tr class="w-full bg-gray-200">
                        <th class="px-4 py-2">Instruction No</th>
                        <th class="px-4 py-2">Warehouse</th>
                        <th class="px-4 py-2">Vehicle Reg No</th>
                        <th class="px-4 py-2">FDP</th>
                        <th class="px-4 py-2">Commodity</th>
                        <th class="px-4 py-2">Condition</th>
                        <th class="px-4 py-2">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in receipt.receivedCommodities" :key="item" class="w-full text-center">
                        <td class="border px-4 py-2">{{ receipt.instructedDispatch?.instruction?.id }}</td>
                        <td class="border px-4 py-2">{{ receipt.instructedDispatch?.instruction?.warehouse?.Name }}</td>
                        <td class="border px-4 py-2">{{ receipt.instructedDispatch?.instruction?.VehicleRegNo }}</td>
                        <td class="border px-4 py-2">{{ item.FinalDestinationPoint }}</td>
                        <td class="border px-4 py-2">{{ item?.commodity?.Name }}</td>
                        <td class="border px-4 py-2">{{ item?.Remarks }}</td>
                        <td class="border px-4 py-2">
                          {{ item?.Quantity }} {{ item.commodity.Unit == "Kg" ? "MT" : item.commodity.Unit }} ({{item.NoBags}} {{item.commodity.Container_type}})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Approvals Section -->
                <div class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-700">Approvals</h3>
                  <div class="grid grid-cols-4 gap-4 mt-2">
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Dispatched By:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.instructedDispatch?.Dispatcher?.firstname }} {{
    receipt.instructedDispatch?.Dispatcher?.lastname }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Authorized By:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.instructedDispatch?.instruction?.ApprovedBy }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Received By:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.Recipient?.firstname }}

                        {{ receipt.Recipient?.lastname }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700">Driver Name:</label>
                      <p class="text-sm text-gray-600">
                        {{ receipt.instructedDispatch?.instruction?.DriverName }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button type="button"
                class="w-full mr-3 no-print inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:w-auto sm:text-sm"
                @click="closeDialog">
                Close
              </button>
              <button @click="printPDF"
                class="mr-3 bg-green-500 text-white px-4 py-2 rounded-md  no-print">Print</button>

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


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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


// Function to print the instruction details
const printPDF = async () => {
  // Temporarily hide the buttons before taking the screenshot
  const noPrintElements = document.querySelectorAll('.no-print');
  noPrintElements.forEach(element => {
    element.style.display = 'none';
  });

  const contentElement = document.getElementById('content');

  // Set high-quality scale factor
  const scaleFactor = 2; // Adjust as needed to improve quality
  const canvas = await html2canvas(contentElement, {
    scale: scaleFactor, // High scale factor improves quality
    useCORS: true, // Allow cross-origin images if used
  });

  const imgData = canvas.toDataURL('image/png');

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: 'portrait', // or 'landscape' based on your content
    unit: 'mm',
    format: 'a4',
  });

  // Set the width and height for the image inside the PDF
  const imgWidth = 190; // Adjust as needed
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Add the image to the PDF
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

  // Add the footer text
  const currentDate = new Date().toLocaleString(); // Get the current date and time
  const footerText = `DODMA COMMODITY TRACKING SYSTEM - ${currentDate}`;
  const footerYPosition = 290; // Adjust this based on the page size
  pdf.setFontSize(10);
  pdf.text(footerText, 10, footerYPosition);

  // Save the PDF file
  pdf.save('GoodsReleaseInstruction.pdf');

  // Show the buttons again after the screenshot is taken
  noPrintElements.forEach(element => {
    element.style.display = 'block';
  });
};




</script>
