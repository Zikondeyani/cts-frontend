<template>
  <div>
    <button @click="openDialog" class="
        inline-flex
        items-center
        px-2
        py-1
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
      <TruckIcon class="h-4 w-4 mr-1" />
      Create Dispatch
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="open = false" static>
        <div class="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          <TransitionChild as="template" v-if="open" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

            <div
              class="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full">
              <div class="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
                <h5 class="text-md font-medium text-gray-800">
                  Create Dispatch for Instruction (<b>ID: {{ props.rowId }} </b>)
                </h5>
                <button type="button" @click="open = false" class="p-1 text-black">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <form @submit.prevent="onSubmit" :validation-schema="CreateRequisitionSchema">
                <div class="px-2 mx-5 pb-2">
                  <!-- Top: Instructions Panel -->
                  <div class="bg-white p-2 mb-4">
                    <h3 class="text-lg font-semibold mb-2">Instruction Details</h3>
                    <p class="mb-2"><strong>Purpose:</strong> {{ instruction.Purpose }}</p>
                    <p class="mb-2"><strong>Warehouse (From):</strong> {{ instruction.warehouses?.map(warehouse =>
                      warehouse?.name).join(', ') }}</p>
                    <p class="mb-2"><strong>District (To):</strong> {{ instruction.district.Name }}</p>
                    <p class="mb-2"><strong>Transporter:</strong> {{ instruction.transporter.Name }}</p>

                    <!-- Table for Goods List -->
                    <h3 class="text-lg font-semibold text-blue-500 mb-2">List of Items Required:</h3>
                    <table class="min-w-full bg-white border border-0 rounded-lg">
                      <thead class="bg-blue-100">
                        <tr>
                          <th class="py-1 px-2 text-left text-xs font-medium text-gray-700 uppercase border-b">#</th>
                          <th class="py-1 px-2 text-left text-xs font-medium text-gray-700 uppercase border-b">Commodity
                          </th>
                          <th class="py-1 px-2 text-left text-xs font-medium text-gray-700 uppercase border-b">Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="(item, index) in commodities" :key="index" class="hover:bg-gray-100">
                          <td class="py-1 px-1 border-b">{{ index + 1 }}</td>
                          <td class="py-1 px-2 border-b">{{ item.commodity.Name }}</td>
                          <td class="py-1 px-2 border-b">{{ item.Quantity }} {{ item.commodity.Unit == "Kg" ? "MT" :
                            "Units" }} ({{ item.NoBags }} {{ item.commodity.Container_type }})</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Bottom: Dispatch Form -->
                  <div class="bg-white p-2 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2">Dispatch Form</h3>

                    <!-- Form Inputs -->
                    <label for="deliveryNote" class="block font-medium">Delivery Note:</label>
                    <input type="text" id="deliveryNote" v-model="DeliveryNote"
                      class="mt-1 block w-full shadow-sm border-gray-300 rounded-md" readonly>

                    <label for="finalDestination" class="block font-medium mt-2">Final Destination Point:</label>
                    <input type="text" id="finalDestination" v-model="FinalDestinationPoint"
                      class="mt-1 block w-full shadow-sm border-gray-300 rounded-md">

                    <!-- Relief Items Form -->
                    <div class="mt-2">
                      <div class="space-y-2">
                        <!-- Loop to Add Multiple Relief Items -->
                        <div v-for="(item, index) in reliefItems" :key="index"
                          class="grid grid-cols-2 gap-2 border-t-2 border-gray-200 pt-2 mt-2">
                          <div>
                            <label class="block text-sm font-bold text-gray-700">Commodity</label>
                            <select v-model="item.commodityId" @change="validateCommodity(index)"
                              class="mt-1 block w-full shadow-sm border-gray-300 rounded-md">
                              <option value="" disabled>Commodity</option>
                              <option
                                v-for="comm in commodityInventories.filter(comm => instruction.warehouses.some(wh => wh.id === comm.warehouseId))"
                                :key="comm" :value="comm">
                                {{ comm.commodity.Name }} (Batch: {{ comm.BatchNumber }})
                              </option>
                            </select>
                            <p v-if="item.error" class="text-red-500 text-xs italic mt-1">{{ item.error }}</p>
                          </div>

                          <div>
                            <label class="block text-sm font-bold text-gray-700">Qty <span v-if="item.commodityId">({{
                              item.commodityId?.commodity?.Container_type }})</span></label>
                            <input type="number" v-model="item.Quantity"
                              class="mt-1 block w-full shadow-sm border-gray-300 rounded-md" placeholder="Qty" />
                          </div>

                          <div>
                            <label class="block text-sm font-bold text-gray-700">Truck</label>
                            <input type="text" v-model="item.TruckNumber"
                              class="mt-1 block w-full shadow-sm border-gray-300 rounded-md" placeholder="Truck #" />
                          </div>

                          <div>
                            <label class="block text-sm font-bold text-gray-700">Phone</label>
                            <input type="text" v-model="item.PhoneNumber"
                              class="mt-1 block w-full shadow-sm border-gray-300 rounded-md" placeholder="Phone #" />
                          </div>

                          <div class="flex items-left justify-left">
                            <button @click="removeItem(item.id)" type="button"
                              class="ml-2 p-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                              <MinusCircleIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button @click.prevent="addNewItem"
                            class="inline-flex px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-blue-500 bg-white hover:bg-gray-100">
                            + Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-end bg-gray-50 px-4 py-3 border-t border-gray-200 rounded-b-md">
                  <button type="button" @click="open = false"
                    class="inline-flex px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100">
                    Cancel
                  </button>
                

                  <button type="submit"
                      class="inline-flex ml-3 items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CheckCircleIcon class="h-5 w-5 mr-1" />
                      Submit Dispatch
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
  MinusCircleIcon,
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
  //  reliefItems.value[index].error = isDuplicate ? "Commodity already added. Please select another." : "";
};

// Relief Items List
const reliefItems = ref([
  { id: 1, commodityId: '', Quantity: '', DriverLicense: '', TruckNumber: '', PhoneNumber: '', DriverName: '', error: '' }
]);

// Add New Relief Item
const addNewItem = () => {
  reliefItems.value.push({ id: reliefItems.value.length + 1, commodityId: '', Quantity: '', DriverLicense: '', TruckNumber: '', PhoneNumber: '', DriverName: '', error: '' });
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
    .catch(error => { })
    .finally(() => { });
};

const getWarehouses = async () => {
  warehouseStore
    .get()
    .then(result => {
      warehouses.length = 0; //empty array
      warehouses.push(...result);
    })
    .catch(error => { })
    .finally(() => { });
};

const getRequisition = async () => {
  requisitionStore
    .get()
    .then(result => {
      requisitions.length = 0; //empty array
      requisitions.push(...result);
    })
    .catch(error => { })
    .finally(() => { });
};

const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {
      districts.length = 0; //empty array
      districts.push(...result);
    })
    .catch(error => { })
    .finally(() => { });
};

const getDisasters = async () => {
  disasterStore
    .get()
    .then(result => {
      disasters.length = 0; //empty array
      disasters.push(...result);
    })
    .catch(error => { })
    .finally(() => { });
};

const getActivities = async () => {
  activityStore
    .get()
    .then(result => {
      activities.length = 0; //empty array
      activities.push(...result);
    })
    .catch(error => { })
    .finally(() => { });
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
