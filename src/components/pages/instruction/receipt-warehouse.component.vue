<template>
  <spinner-widget v-bind:open="isLoading" />
  <div>
    <button
      @click="open = true"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100"
    >
      <PlusCircleIcon class="h-5 w-5 mr-1" />
      Create Receipt
    </button>

    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed inset-0 z-10 overflow-y-auto"
        @close="open = false"
        static
      >
        <div class="flex items-center justify-center min-h-screen px-4 py-6">
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
              class="inline-block align-middle bg-white rounded-lg text-left shadow-xl transform transition-all sm:align-middle sm:w-full max-w-4xl max-h-screen overflow-y-auto"
            >
              <div
                class="modal-header flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
              >
                <h5 class="text-lg font-bold text-gray-800">
                  Create Receipt for Request (ID: {{ props.rowId }})
                </h5>
                <button
                  type="button"
                  class="text-gray-500 hover:text-gray-700"
                  @click="open = false"
                >
                  <XIcon class="h-6 w-6" />
                </button>
              </div>

              <form @submit.prevent="confirmSubmission">
                <div class="px-6 py-2 space-y-6">
                  <p>
                    <strong>Delivery Note:</strong> {{ dispatch.DeliveryNote }}
                  </p>
                  <p>
                    <strong>Reference #:</strong>
                    {{ dispatch.warehouserequisitions?.referenceNumber }}
                  </p>
                  <p>
                    <strong>Target FDP:</strong>
                    {{ dispatch?.FinalDestinationPoint }}
                  </p>

                  <p>
                    <strong>Request:</strong>
                    {{ dispatch.warehouserequisitions?.description }}
                  </p>

                  <h3 class="text-lg font-semibold text-blue-500 mb-4">
                    Summary of Dispatched Goods:
                  </h3>

                  <table
                    class="min-w-full divide-y divide-gray-200 border mt-4 text-sm"
                  >
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          class="px-4 py-2 text-left font-medium text-gray-700"
                        >
                          Commodity
                        </th>
                        <th
                          class="px-4 py-2 text-left font-medium text-gray-700"
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                        <td class="px-4 py-2 text-gray-800">
                          {{ dispatch.commodity?.Name || "N/A" }}
                        </td>
                        <td class="px-4 py-2 text-gray-800">
                          {{ dispatch.Quantity }}
                          {{ dispatch.commodity?.Container_type || "N/A" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Physical Delivery Note</label
                    >
                    <input
                      v-model="pdn"
                      type="text"
                      placeholder="Enter PDN"
                      class="mt-1 block w-full p-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Actual Receipt Date</label
                    >
                    <input
                      v-model="actualReceiptDate"
                      type="date"
                      class="mt-1 block w-full p-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div class="flex items-center space-x-2">
                    <label class="text-sm font-bold text-blue-500"
                      >Enable Multiple Destinations</label
                    >
                    <button
                      @click="toggleMultipleDestinations"
                      type="button"
                      :class="
                        multipleDestinations ? 'bg-blue-600' : 'bg-gray-300'
                      "
                      class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                    >
                      <span
                        :class="
                          multipleDestinations
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        "
                        class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                      />
                    </button>
                  </div>

                  <!-- Single Destination -->
                  <template v-if="!multipleDestinations">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >Final Destination Point</label
                      >
                      <input
                        v-model="destinations[0].name"
                        type="text"
                        placeholder="Enter Destination"
                        class="mt-1 block w-full p-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div
                      class="border border-gray-200 rounded-md p-4 mb-4 mt-2"
                    >
                      <label class="text-sm font-medium text-gray-700"
                        >Remarks for Commodity</label
                      >
                      <div
                        v-for="(remark, rIndex) in destinations[0]
                          .commodities[0].remarks"
                        :key="rIndex"
                        class="flex space-x-2 items-start"
                      >
                        <select
                          v-model="remark.remark"
                          class="mt-1 block w-60 p-1 border border-gray-400 rounded-md shadow-sm"
                        >
                          <option value="">Select Remark</option>
                          <option value="received in good condition">
                            Received in good condition
                          </option>
                          <option value="received but damaged">
                            Received but damaged
                          </option>
                          <option value="missing">Missing</option>
                          <option value="received in excess">
                            Received in excess
                          </option>
                          <option value="received but not expected quantity">
                            Not at expected quantity
                          </option>
                          <option value="other">Other (please specify)</option>
                        </select>

                        <input
                          type="number"
                          v-model="remark.quantity"
                          placeholder="Qty"
                          class="w-32 p-1 border border-gray-400 rounded-md shadow-sm"
                          min="0"
                        />

                        <textarea
                          v-if="remark.remark === 'other'"
                          v-model="remark.Comments"
                          class="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                          placeholder="Enter custom remark"
                        ></textarea>

                        <button
                          @click="removeRemark(0, 0, rIndex)"
                          type="button"
                          class="text-white bg-red-600 hover:bg-red-700 p-1 rounded-md mt-1"
                        >
                          <MinusCircleIcon class="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        @click="addRemark(0, 0)"
                        type="button"
                        class="mt-2 text-sm text-green-600 hover:text-green-900 flex items-center rounded-md border border-gray-200 px-3 py-2"
                      >
                        <PlusCircleIcon class="h-5 w-5 mr-1" /> Add Remark
                      </button>
                    </div>
                  </template>

                  <!-- Multiple Destinations -->
                  <template
                    v-for="(destination, dIndex) in destinations"
                    :key="dIndex"
                    v-if="multipleDestinations"
                  >
                    <div class="border border-gray-200 rounded-md p-4 mb-4">
                      <label class="block text-sm font-medium text-gray-700"
                        >Destination {{ dIndex + 1 }}</label
                      >
                      <div class="flex space-x-2 items-center mb-2">
                        <input
                          v-model="destination.name"
                          type="text"
                          class="block w-full p-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter destination point"
                        />
                        <button
                          @click="removeDestination(dIndex)"
                          type="button"
                          class="text-white bg-red-600 hover:bg-red-700 p-2 rounded-md"
                        >
                          <MinusCircleIcon class="h-5 w-5" />
                        </button>
                      </div>

                      <div class="space-y-2">
                        <div>
                          <label class="text-sm font-medium text-gray-700"
                            >Remarks for Commodity</label
                          >
                          <div
                            v-for="(remark, rIndex) in destination
                              .commodities[0].remarks"
                            :key="rIndex"
                            class="flex space-x-2 items-start"
                          >
                            <select
                              v-model="remark.remark"
                              class="mt-1 block w-60 p-1 border border-gray-400 rounded-md shadow-sm"
                            >
                              <option value="">Select Remark</option>
                              <option value="received in good condition">
                                Received in good condition
                              </option>
                              <option value="received but damaged">
                                Received but damaged
                              </option>
                              <option value="missing">Missing</option>
                              <option value="received in excess">
                                Received in excess
                              </option>
                              <option
                                value="received but not expected quantity"
                              >
                                Not at expected quantity
                              </option>
                              <option value="other">
                                Other (please specify)
                              </option>
                            </select>

                            <input
                              type="number"
                              v-model="remark.quantity"
                              placeholder="Qty"
                              class="w-32 p-1 border border-gray-400 rounded-md shadow-sm mt-2"
                              min="0"
                            />

                            <textarea
                              v-if="remark.remark === 'other'"
                              v-model="remark.Comments"
                              class="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                              placeholder="Enter custom remark"
                            ></textarea>

                            <button
                              @click="removeRemark(dIndex, 0, rIndex)"
                              type="button"
                              class="text-white bg-red-600 hover:bg-red-700 p-1 rounded-md mt-1"
                            >
                              <MinusCircleIcon class="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            @click="addRemark(dIndex, 0)"
                            type="button"
                            class="mt-2 text-sm text-green-600 hover:text-green-900 flex items-center rounded-md border border-gray-200 px-3 py-2"
                          >
                            <PlusCircleIcon class="h-5 w-5 mr-1" /> Add Remark
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>

                  <button
                    v-if="multipleDestinations"
                    type="button"
                    @click="addDestination"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    <PlusCircleIcon class="h-5 w-5 mr-1" />
                    Add Destination
                  </button>
                </div>

                <div
                  class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3"
                >
                  <button
                    type="submit"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    <CheckCircleIcon class="h-5 w-5 mr-1" />
                    Submit Receipt
                  </button>
                  <button
                    type="button"
                    @click="open = false"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-400 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, reactive, inject, defineProps } from "vue";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XIcon,
  CheckCircleIcon,
} from "@heroicons/vue/solid";
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import { usewarehouseReceiptsStore } from "../../../stores/warehousereceipts.store";

import { useRouter } from "vue-router";
const warehouseReceiptsStore = usewarehouseReceiptsStore();
const warehouseReceipts = reactive([]);

const isLoading = ref(false);
const Swal = inject("Swal");

const props = defineProps({
  rowId: [String, Number],
  dispatch: Object,
});

const $router = useRouter();
const open = ref(false);
const pdn = ref("");
const actualReceiptDate = ref("");
const multipleDestinations = ref(false);

const destinations = ref([
  {
    name: "",
    commodities: [
      {
        ...props.dispatch,
        remarks: [],
      },
    ],
  },
]);

const toggleMultipleDestinations = () => {
  multipleDestinations.value = !multipleDestinations.value;
  if (!multipleDestinations.value) {
    // Reset to a single destination when toggling off
    destinations.value = [
      {
        name: "",
        commodities: [
          {
            ...props.dispatch,
            remarks: [],
          },
        ],
      },
    ];
  }
};

const addDestination = () => {
  if (destinations.value.every((dest) => dest.name.trim() !== "")) {
    destinations.value.push({
      name: "",
      commodities: [
        {
          ...props.dispatch,
          remarks: [],
        },
      ],
    });
  } else {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Destination",
      text: "Please enter destination name before adding another.",
    });
  }
};

const removeDestination = (index) => {
  destinations.value.splice(index, 1);
};

const addRemark = (destIndex, commIndex) => {
  destinations.value[destIndex].commodities[commIndex].remarks.push({
    remark: "",
    quantity: 0,
  });
};

const removeRemark = (destIndex, commIndex, remarkIndex) => {
  destinations.value[destIndex].commodities[commIndex].remarks.splice(
    remarkIndex,
    1
  );
};

const confirmSubmission = async () => {
  const receipts = [];

  // Prepare receipts from destinations and commodities
  destinations.value.forEach((destination) => {
    destination.commodities.forEach((commodity) => {
      commodity.remarks.forEach((remark) => {
        // Only add the receipt if both quantity and remark are valid
        if (remark.quantity && remark.remark) {
          receipts.push({
            warehousedispatchesId: props.dispatch?.id,
            PhysicalDeliveryNote: pdn.value,
            actual_receipt_date: actualReceiptDate.value,
            FinalDestinationPoint: destination.name,
            Quantity: remark.quantity,
            Remarks: remark.remark,
            Comments: remark.Comments || "",
            CreatedOn: new Date().toISOString(),
            UpdatedOn: new Date().toISOString(),
            status: 1, // or whatever your app uses for new receipts
            IsDeleted: false,
          });
        } else {
          console.warn("Skipping invalid remark:", remark);
        }
      });
    });
  });

  console.log("Prepared receipt rows:", receipts);

  // Show confirmation dialog before submitting
  Swal.fire({
    title: "Are you sure?",
    text: "Once submitted, you will need to go through the reversal process if changes are required.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, submit it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Show the "Processing..." Swal while the receipts are being created
      Swal.fire({
        title: "Processing...",
        text: "Please wait while the receipt is being created.",
        allowOutsideClick: false, // Prevent closing by clicking outside
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      // Submit all receipts concurrently
      try {
        isLoading.value = true;
        const createPromises = receipts.map((receipt) =>
          warehouseReceiptsStore.create(receipt)
        );
        await Promise.all(createPromises); // Wait for all receipts to be created

        Swal.fire({
          title: "Success",
          text: "Created a receipt successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });

        $router.push({ path: "/receipient/receipts/emergency" });
        open.value = false;
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: err.message,
        });
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>
