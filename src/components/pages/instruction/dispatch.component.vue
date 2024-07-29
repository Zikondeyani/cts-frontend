<template>
  <div>
    <button @click="openDialog" class="
        inline-flex
        items-center
        px-3
        py-2
        text-sm
        font-medium
        text-green-600
        hover:text-green-900
        bg-white
        rounded-md
        border
        border-gray-200
        hover:bg-gray-100
      ">
      <!-- Heroicon PlusCircle (Create Instruction) -->
      <TruckIcon class="h-5 w-5 mr-1" />
      Create Dispatch
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="open = false" static>
        <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-2 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <TransitionChild as="template" v-if="open" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <!-- Modal content -->
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

            <div
              class="inline-block align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-start sm:my-8 sm:max-w-4xl sm:w-full">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="text-md font-medium leading-normal text-gray-800 mb-1" id="formModalLabel">
                  Create Dispatch for Instruction (<b>ID: {{ props.rowId }} </b>)
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <form @submit.prevent="onSubmit" :validation-schema="CreateRequisitionSchema">
                <div class="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                  <div class="container mx-auto px-4 py-6">
                    <div class="flex gap-8"> <!-- Increased gap between panels -->
                      <!-- Left: Instructions Panel -->
                      <div class="flex-1 bg-white rounded-table p-4">
                        <h3 class="text-xl font-semibold mb-4">Instruction Details</h3>
                        <p class="mb-4"><strong>Purpose:</strong> {{ instruction.Purpose }}</p>
                        <p class="mb-4"><strong>Vehicle Reg #:</strong> {{ instruction.VehicleRegNo }}</p>
                        <p class="mb-4"><strong>Driver Name:</strong> {{ instruction.DriverName }}</p>
                        <p class="mb-4"><strong>Warehouse (From):</strong> <br>{{ instruction.warehouse.Name }}</p>
                        <p class="mb-4"><strong>District (To):</strong> {{ instruction.district.Name }}</p>
                        <p class="mb-4"><strong>Transporter:</strong> {{ instruction.transporter.Name }}</p>

                        <!-- Table for Goods List -->
                        <h3 class="text-lg font-semibold text-blue-500 mb-3">List of Items Required: </h3>
                        <div>
                          <table class="min-w-full bg-white border border-0 rounded-lg">
                            <thead class="bg-blue-100">
                              <tr>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  #</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Commodity</th>
                                <th
                                  class="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  Quantity</th>
                                
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                              <tr v-for="(item, index) in commodities" :key="index" class="hover:bg-gray-100">
                                <td class="py-2 px-2 border-b">{{ index + 1 }}</td>
                                <td class="py-2 px-3 border-b">{{ item.commodity.Name }}</td>
                                <td class="py-2 px-3 border-b">{{ item.Quantity }} {{  item.commodity.Unit == "Kg" ? "MT": "Units" }} ({{item.NoBags}} {{item.commodity.Container_type}})</td>
                            
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <!-- Vertical Divider (Gray) -->
                      <div class="w-px bg-gray-100"></div>

                      <!-- Right: Dispatch Form -->
                      <div class="flex-1 bg-white p-4 rounded-table">
                        <h3 class="text-xl font-semibold mb-3">Dispatch Form</h3>

                        <!-- Form Inputs -->
                        <label for="deliveryNote" class="block font-medium">Delivery Note:</label>
                        <input type="text" id="deliveryNote" v-model="DeliveryNote"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" readonly>

                        <label for="finalDestination" class="block font-medium mt-3">Final Destination Point:</label>
                        <input type="text" id="finalDestination" v-model="FinalDestinationPoint"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                        <label for="driverName" class="block font-medium">Driver Name:</label>
                        <input type="text" id="driverName" v-model="DriverName"  class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                        <label for="driverLicense" class="block font-medium">Driver License:</label>
                        <input type="text" id="driverLicense" v-model="DriverLicense"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                        <label for="truckNumber" class="block font-medium">Truck Number:</label>
                        <input type="text" id="truckNumber" v-model="TruckNumber"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                        <!-- Relief Items Form -->
                        <div class="overflow-hidden sm:rounded-md mt-3">
                          <div class="bg-white">
                            <div class="space-y-3">
                              <!-- Loop to Add Multiple Relief Items -->
                              <div v-for="(item, index) in reliefItems" :key="index"
                                class="flex space-x-4 items-center">
                                <div class="flex-1">
                                  <label class="block text-sm font-bold text-gray-700">Commodity</label>
                                  <select v-model="item.commodityId" @change="validateCommodity(index)"
                                  class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    <option value="" disabled>Commodity</option>
                                    <option v-for="comm in commodityInventories.filter(item => instruction?.warehouse?.id == item.warehouseId)" :key="comm" :value="comm">
                                     {{ comm.commodity.Name }} ( Batch : {{ comm.BatchNumber}})
                                    </option>
                                  </select>
                                  <!-- Display Error Message if the Commodity is Duplicated -->
                                  
                                  <p v-if="item.error" class="text-red-500 text-xs italic pt-1">{{ item.error }}</p>
                                </div>

                                <div class="flex-1">
                                  <label class="block text-sm font-bold text-gray-700">Quantity <span v-if="item.commodityId"> ({{ item.commodityId?.commodity?.Container_type}})</span></label>
                                  <input type="number" v-model="item.Quantity"
                                  class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Quantity" />
                                </div>

                                <!-- Remove Item Button -->
                                <button type="button" @click="removeItem(item.id)"
                                  class="text-red-500 hover:text-red-700">
                                  &times; <!-- A simple cross to remove the item -->
                                </button>
                              </div>

                              <!-- Button to Add New Item -->
                              <button type="button" @click="addNewItem"
                                class="mt-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                                + Add Relief Item
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
               

                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button @click="closeDialog"
                    class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">Close</button>
                  <button type="submit"
                    class="px-4 py-2 mr-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    <CheckCircleIcon class="h-5 w-5 mr-1" />
                    Create Dispatch
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
import {
  SearchIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon, PlusCircleIcon
} from "@heroicons/vue/solid";

import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateRequisitionSchema } from "../../../services/schema/requisition.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { usedistrictstore } from "../../../stores/districts.store";

import { useDisasterstore } from "../../../stores/disaster.store";


import { useactivitiestore } from "../../../stores/activity.store";

import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";



import { userequisitionstore } from "../../../stores/requisition.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();

const $route = useRoute();
const showForm = ref(false);
const props = defineProps({
  rowId: {
    type: [String, Number],
    required: true
  },
  instruction: Object,
  commodities: Array,
  commodity: Array,
  commodityInventories: Array
});

const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);

const districtstore = usedistrictstore();
const districts = reactive([])

const warehouseStore = usewarehousestore()
const warehouses = reactive([])

const transporterStore = usetransporterstore()
const transporters = reactive([])

const activityStore = useactivitiestore();
const activities = reactive([])

const disasterStore = useDisasterstore();
const disasters = reactive([])

const requisitionStore = userequisitionstore();
const requisitions = reactive([])

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

//FORM
const { meta } = useForm({
  validationSchema: CreateRequisitionSchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    commodityId: "",
    warehouseId: "",
    userId: ""

  },
});
///FIELDS
const { value: DeliveryNote, errorMessage: DeliveryNoteError } = useField("DeliveryNote");
const { value: TruckNumber, errorMessage: TruckNumberError } = useField("TruckNumber");
const { value: FinalDestinationPoint, errorMessage: FinalDestinationPointError } = useField("FinalDestinationPoint");
const { value: DriverLicense, errorMessage: DriverLicenseError } = useField("DriverLicense");
const { value: DriverName, errorMessage: DriverNameError } = useField("DriverName");

onMounted(() => {
  getRequisition();
  getActivities();
  getDisasters();
  getDistricts();
  getWarehouses();
  getTransporters();
  generateUniqueDeliveryNote();
});

const openDialog = () => {
  open.value = true;
  generateUniqueDeliveryNote();
};

const closeDialog = () => {
  open.value = false;
};

// Function to generate a unique delivery note
const generateUniqueDeliveryNote = () => {
  const timestamp = new Date().getTime().toString(12); // Base36 timestamp
  const uniqueString = Math.random().toString(12).substr(2, 5).toUpperCase(); // Random 5-character string
  DeliveryNote.value = `DODMA-EMR-${timestamp}-${uniqueString}`;
};

// Check if a Commodity is Duplicated
const validateCommodity = (index) => {
  const selectedCommodity = reliefItems.value[index].commodityId;
  const isDuplicate = reliefItems.value.some((item, idx) => item.commodityId === selectedCommodity && idx !== index);
  reliefItems.value[index].error = isDuplicate ? "Commodity already added. Please select another." : "";
};

// Relief Items List
const reliefItems = ref([
  { id: 1, commodityId: '', Quantity: '', error: '' }
]);

// Add New Relief Item
const addNewItem = () => {
  reliefItems.value.push({ id: reliefItems.value.length + 1, commodityId: '', Quantity: '', error: '' });
};

// Remove Relief Item
const removeItem = (id) => {
  reliefItems.value = reliefItems.value.filter(item => item.id !== id);
};

const getTransporters = async () => {
  transporterStore
    .get()
    .then(result => {
      transporters.length = 0; //empty array
      transporters.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const getWarehouses = async () => {
  warehouseStore
    .get()
    .then(result => {
      warehouses.length = 0; //empty array
      warehouses.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const getRequisition = async () => {
  requisitionStore
    .get()
    .then(result => {
      requisitions.length = 0; //empty array
      requisitions.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {
      districts.length = 0; //empty array
      districts.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const getDisasters = async () => {
  disasterStore
    .get()
    .then(result => {
      disasters.length = 0; //empty array
      disasters.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const getActivities = async () => {
  activityStore
    .get()
    .then(result => {
      activities.length = 0; //empty array
      activities.push(...result);
    })
    .catch(error => {})
    .finally(() => {});
};

const currentDate = ref(moment().format('YYYY-MM-DD HH:mm:ss'));

const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    DeliveryNote: DeliveryNote.value,
    DriverLicense: DriverLicense.value,
    TruckNumber: TruckNumber.value,
    FinalDestinationPoint: FinalDestinationPoint.value,
    DispatcherId: user.value.id,
    instructionId: props.rowId,
    DriverName: DriverName.value,
    reliefItems: reliefItems.value
  };

  emit("create", model);
  open.value = false;
  actions.resetForm();
});

const AffectedAreas = ref([]); // Array of tags (places)
const newVillage = ref(''); // Input value for new tags
const AffectedAreaError = ref(''); // Error message (if applicable)

// Methods
function addTag() {
  const place = newVillage.value.trim();
  if (place && !AffectedAreas.value.includes(place)) {
    AffectedAreas.value.push(place);
    newVillage.value = '';
    AffectedAreaError.value = '';
  } else {
    AffectedAreaError.value = 'Village name is either empty or already added!';
  }
}

function removeTag(index) {
  AffectedAreas.value.splice(index, 1);
}

</script>
