<template>
  <div>

    <button @click="open = true" class="
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
      <PlusCircleIcon class="h-5 w-5 mr-1" />
      Create Instruction
    </button>


    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false" static>
        <div class="flex min-h-screen text-center md:block md:px-2 lg:px-4" style="font-size: 0">
          <TransitionChild class=" " v-if="open" as="template" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">&#8203;</span>
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="text-md font-medium leading-normal text-gray-800" id="formModalLabel">
                  Create Instruction
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" /> <!-- Icon added here -->
                </button>

              </div>

              <form @submit="onSubmit" :validation-schema="CreateRequisitionSchema">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">



                    <div class="col-span-12 sm:col-span-12">
                      <label for="user-district" class="block text-sm font-medium text-gray-700">
                        Select Warehouse (From)</label>
                      <select id="activity" name="activity" v-model="warehouseId" autocomplete="activity-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="item in warehouses" :key="item.id" :value="item.id" class="uppercase">
                          {{ item.Name }}
                        </option>
                      </select>

                      <span class="text-md text-red-500 mb-5 text-italic font-medium text-sm" v-if="warehouseId">
                        {{ availableBalance }}</span>

                    </div>

                    <div class="col-span-12 sm:col-span-12">
                      <label for="user-district" class="block text-sm font-medium text-gray-700">
                        District (To)</label>
                    

                      <p class="mt-1 focus:ring-gray-500 font-bold focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        {{ props.district?.Name }}
                      </p>
                     
                    </div>

                    <div class="col-span-12 sm:col-span-12">
                      <label for="user-district" class="block text-sm font-medium text-gray-700">
                        Select transporter</label>
                      <select id="activity" name="activity" v-model="transporterId" autocomplete="activity-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="item in transporters" :key="item.id" :value="item.id" class="uppercase">
                          {{ item.Name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ transporterError }}
                      </p>
                    </div>

                    <div class="col-span-12 sm:col-span-12">
                      <label for="DriverName" class="block text-sm font-medium text-gray-700">Driver Name</label>
                      <input type="text" v-model="DriverName" name="DriverName" id="From" autocomplete="off"
                        placeholder="Driver Name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ DriverNameError }}
                      </p>
                    </div>



                    <div class="col-span-12 sm:col-span-12">
                      <label for="From" class="block text-sm font-medium text-gray-700">Vehicle Reg #</label>
                      <input type="text" v-model="VehicleRegNo" name="Fromr" id="From" autocomplete="off"
                        placeholder="Vehicle Reg #"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ VRnoError }}
                      </p>
                    </div>


                    <div class="col-span-12 sm:col-span-12">
                      <label for="From" class="block text-sm font-medium text-gray-700">Purpose</label>
                      <input type="text" v-model="Purpose" name="Purpose" id="Purpose" autocomplete="off"
                        placeholder="Purpose"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ PurposeError }}
                      </p>
                    </div>








                    <div class="col-span-12 sm:col-span-12">
                      <label for="remarks" class="block text-sm font-medium text-gray-700">
                        Instruction
                      </label>

                      <!-- Textarea for Remarks -->
                      <textarea id="remarks" v-model="Remarks" rows="4" placeholder="Add your instruction here..."
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"></textarea>

                      <!-- Error message -->
                      <p class="text-red-500 text-xs italic pt-1">{{ remarksError }}</p>
                    </div>

                  </div>

                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="submit" style="background-color: #096eb4;"
                    class="`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                    Save
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
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted, watch } from "vue";
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
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";


import { userequisitionstore } from "../../../stores/requisition.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const availableBalance = ref(''); // Hold the available balance

const $route = useRoute();

const commodityinventoriestore = usecommodityinventoriestore();
const commodityinventories = reactive([])

const props = defineProps({
  rowId: {
    type: [String, Number],
    required: true
  },

  district: {
    type: Object,
    required: true
  }
});

const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(false);
const showModal = ref(false);
const roleStore = useRoleStore();

const userStore = useUserStore();
const roles = reactive([]);

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

const getCommodityInventories = async () => {
  commodityinventoriestore
    .get()
    .then(result => {

      commodityinventories.length = 0; //empty array
      commodityinventories.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


//FORM
const { meta } = useForm({
  validationSchema: CreateRequisitionSchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    commodityId: "",
    warehouseId: "",
    districtId: "",
    userId: ""

  },
});
///FIELDS

const { value: AffectedHouseholds, errorMessage: AffectedHouseholdsError } = useField("AffectedHouseholds")
const { value: disasterId, errorMessage: disasterError } = useField("disasterId");
const { value: activityId, errorMessage: activityError } = useField("activityId");
const { value: transporterId, errorMessage: transporterError } = useField("transporterId");
const { value: warehouseId, errorMessage: warehouseError } = useField("warehouseId");
const { value: Remarks, errorMessage: remarksError } = useField("Remarks");
const { value: Purpose, errorMessage: PurposeError } = useField("Purpose");
const { value: VehicleRegNo, errorMessage: VRnoError } = useField("VehicleRegNo");
const { value: DriverName, errorMessage: DriverNameError } = useField("DriverName");



//MOUNTED
onMounted(() => {
  getRequisition();
  getActivities()
  getDisasters()
  getDistricts()
  getWarehouses()
  getTransporters()
  getCommodityInventories()
});
//FUNCTIONS

const getTransporters = async () => {
  transporterStore
    .get()
    .then(result => {

      transporters.length = 0; //empty array
      transporters.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const getWarehouses = async () => {
  warehouseStore
    .get()
    .then(result => {

      warehouses.length = 0; //empty array
      warehouses.push(...result.filter(item => item.organisationId == 2));
  
  
    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const getRequisition = async () => {
  requisitionStore
    .get()
    .then(result => {

      requisitions.length = 0; //empty array
      requisitions.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {

      districts.length = 0; //empty array
      districts.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const getDisasters = async () => {
  disasterStore
    .get()
    .then(result => {

      disasters.length = 0; //empty array
      disasters.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const getActivities = async () => {
  activityStore
    .get()
    .then(result => {

      activities.length = 0; //empty array
      activities.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};

const currentDate = ref(moment().format('YYYY-MM-DD HH:mm:ss'));

const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    warehouseId: warehouseId.value,
    districtId: props.district?.id,
    transporterId: transporterId.value,
    Remarks: Remarks.value,
    userId: user.value.id,
    DriverName: DriverName.value,
    VehicleRegNo: VehicleRegNo.value,
    Purpose: Purpose.value,
    requisitionId: props.rowId,
    UpdatedOn: currentDate.value,
    CreatedOn: currentDate.value
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

watch(
  () => [warehouseId.value],
  ([newWarehouseId]) => {
    if (newWarehouseId) {
      // Attempt to find a matching inventory record for the selected warehouse.
      const matchingInventory = commodityinventories.find(
        inventory => inventory.warehouseId == newWarehouseId
      );

      // Provide a detailed message based on the existence of a matching inventory record.
      availableBalance.value = matchingInventory
        ? `Stock availability confirmed. Detailed commodity checks will occur upon order placement.`
        : 'Stock not available for the selected warehouse.';
    } else {
      // Prompt user to make a selection if the warehouse ID is not yet set.
      availableBalance.value = 'Please select a warehouse to check stock availability.';
    }
  }
);


</script>
