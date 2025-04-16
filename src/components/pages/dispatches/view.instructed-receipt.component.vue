<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto"
      @close="closeDialog"
      static
    >
      <div
        class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            id="content"
            class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="container mx-auto px-4 py-6">
                <!-- Title -->
                <div class="text-center mb-4">
                  <img
                    src="../../../assets/images/images.png"
                    alt="Department Logo"
                    class="w-20 mx-auto mb-2"
                  />
                  <h3 class="font-bold text-xl">
                    DEPARTMENT OF DISASTER MANAGEMENT AFFAIRS
                  </h3>
                </div>

                <h2 class="text-center text-2xl font-semibold text-gray-800">
                  Emergency Response Goods Receive Note
                </h2>
                <h2 class="text-center text-lg font-bold text-gray-800 mb-6">
                  {{ receipt.district }}
                </h2>

                <!-- Form Section -->
                <div class="mt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Ref No:</label
                      >
                      <p class="text-sm text-gray-600">
                        {{ receipt?.referenceNumber }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Delivery Note No:</label
                      >
                      <p class="text-sm text-gray-600">
                        {{
                          [...new Set(receipt.physicalDeliveryNotes)].length ===
                          1
                            ? receipt.physicalDeliveryNotes[0]
                            : [...new Set(receipt.physicalDeliveryNotes)].join(
                                ", "
                              )
                        }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Purpose:</label
                      >
                      <p class="text-sm text-gray-600">Emergency Response</p>
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Created On:</label
                      >
                      <p class="text-sm text-gray-600">
                        {{
                          moment(receipt.receipts[0]?.CreatedOn).format(
                            "DD-MM-YYYY"
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Goods List Section -->
                <div class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-700">
                    Condition of received commodity
                  </h3>
                  <table class="min-w-full mt-2 bg-white">
                    <thead>
                      <tr class="w-full bg-gray-200">
                        <th class="px-4 py-2">FDP</th>
                        <th class="px-4 py-2">Commodity</th>
                        <th class="px-4 py-2">Condition</th>
                        <th class="px-4 py-2">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in receipt.receipts"
                        :key="item.id"
                        class="w-full text-center"
                      >
                        <td class="border px-4 py-2">
                          {{ item.FinalDestinationPoint }}
                        </td>

                        <td class="border px-4 py-2">
                          {{ item.commodityName }}
                        </td>
                        <td class="border px-4 py-2">
                          {{ item.Remarks }}
                          <span v-if="item.Remarks === 'other'">
                            ({{ item.Comments }})</span
                          >
                        </td>
                        <td class="border px-4 py-2">
                          {{ item.Quantity }} {{ item.commodityContainerType }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="text-center mb-4 mt-4">
                  <img
                    src="../../../assets/received.jpg"
                    alt="Received"
                    class="w-20 mx-auto mb-2"
                  />
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="w-full mr-3 no-print inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:w-auto sm:text-sm"
                @click="closeDialog"
              >
                Close
              </button>
              <button
                @click="printPDF"
                class="mr-3 bg-gray-500 text-white px-4 py-2 rounded-md no-print"
              >
                Print
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import { ref, inject, defineEmits } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const emit = defineEmits(["close"]);
const props = defineProps({
  isOpen: Boolean,
  receipt: Object,
});

const moment = inject("moment");

const closeDialog = () => {
  emit("close");
};

const printPDF = async () => {
  const noPrintElements = document.querySelectorAll(".no-print");
  noPrintElements.forEach((el) => (el.style.display = "none"));

  const contentElement = document.getElementById("content");
  const scaleFactor = 2;
  const canvas = await html2canvas(contentElement, {
    scale: scaleFactor,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  const currentDate = new Date().toLocaleString();
  pdf.setFontSize(10);
  pdf.text(`DODMA COMMODITY TRACKING SYSTEM - ${currentDate}`, 10, 290);

  pdf.save("GoodsReceipt.pdf");

  noPrintElements.forEach((el) => (el.style.display = "block"));
};
</script>
