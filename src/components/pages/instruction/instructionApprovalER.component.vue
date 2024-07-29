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
      <CheckCircleIcon class="h-5 w-5 mr-1" />
      View & Approve
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="closeDialog" static>
        <div class="flex min-h-screen text-center md:block md:px-2 lg:px-4" style="font-size: 0">
          <TransitionChild v-if="open" as="template" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <!-- Centering element -->
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
                <h5 class="text-md font-medium leading-normal text-gray-800">
                  Approve Loading Plan
                </h5>
                <button type="button" @click="closeDialog"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>

              <form @submit.prevent="onSubmit" class="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                <!-- Instruction Details -->
                <div class="flex gap-8">
                  <!-- Left: Instructions Panel -->
                  <div class="flex-1 bg-white rounded-table">
                    <h3 class="text-xl font-semibold mb-4">Loading Plan Details</h3>
                    <p class="mb-4"><strong>Loading Plan Number:</strong> {{ emergencyResponseInstructions.LoadingPlanNumber }}</p>
                    <p class="mb-4"><strong>Quantity:</strong> {{ emergencyResponseInstructions.Quantity }} {{ emergencyResponseInstructions?.commodity?.commodityTypeId == 1 ? " MT" : " Units" }}</p>
                    <p class="mb-4"><strong>Start Date:</strong> {{ formatDate(emergencyResponseInstructions.StartDate) }}</p>
                    <p class="mb-4"><strong>End Date:</strong> {{ formatDate(emergencyResponseInstructions.EndDate) }}</p>
                    <p class="mb-4"><strong>Warehouse (From):</strong> {{ emergencyResponseInstructions.warehouse.Name }}</p>
                    <p class="mb-4"><strong>District (To):</strong> {{ emergencyResponseInstructions.district.Name }}</p>
                    <p class="mb-4"><strong>Transporter:</strong> {{ emergencyResponseInstructions.transporter.Name }}</p>
                 <!--    <p class="mb-4" v-if="emergencyResponseInstructions.IsRejected !== null"><strong>Comments (If Rejected):</strong> {{ emergencyResponseInstructions?.RejectionComment }}</p>
                 -->  </div>
                </div>

                <!-- Comments Section (only show when rejecting) -->
                <div v-if="isRejecting" class="mt-4">
                  <textarea v-model="RejectionComment" placeholder="Add comments here..." rows="3"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                </div>

                <!-- Footer Buttons -->
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button @click="closeDialog"
                    class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">Close</button>
                  <button type="submit" v-if="!isRejecting"
                    class="px-4 py-2 mr-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    <CheckCircleIcon class="h-5 w-5 mr-1" />
                    Approve Loading Plan
                  </button>
               <button @click.prevent="startRejection" v-if="!isRejecting"
                    class="px-4 py-2 mr-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    <XIcon class="h-5 w-5 mr-1" />
                    Reject Loading Plan
                  </button> 
                  <button @click="submitRejection" v-if="isRejecting"
                    class="px-4 py-2 mr-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    <XIcon class="h-5 w-5 mr-1" />
                    Confirm Rejection
                  </button>
                  <button @click="cancelRejection" v-if="isRejecting"
                    class="px-4 py-2 mr-3 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center">
                    Cancel Rejection
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
  CheckCircleIcon,
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
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useSubmitForm } from "vee-validate";

// COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";

// SCHEMA AND STORES
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

// INJECTIONS
const $router = useRouter();
const $route = useRoute();
const showForm = ref(false);
const props = defineProps({
  rowId: {
    type: [String, Number],
    required: true
  },
  emergencyResponseInstructions: Object,
});

const moment = inject("moment");
const emit = defineEmits(["create", "reject"]);

// VARIABLES
const open = ref(false);
const isRejecting = ref(false);
const RejectionComment = ref("");

// STORES
const requisitionStore = userequisitionstore();
const requisitions = reactive([]);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

// FORM
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

// MOUNTED
onMounted(() => {
  getRequisition();
});

// FUNCTIONS
const getRequisition = async () => {
  requisitionStore.get().then(result => {
    requisitions.length = 0; // empty array
    requisitions.push(...result);
  }).catch(error => {
    console.error(error);
  }).finally(() => {
  });
};

const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    id: props.rowId,
    IsApproved: true,
    ApprovedBy: user.value.username.replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  };
  emit("create", model);
  open.value = false;
});

const startRejection = () => {
  isRejecting.value = true;
};

const submitRejection = async () => {
  let model = {
    id: props.rowId, 
    IsRejected: true,
    RejectionComment: RejectionComment.value
  };
  emit("reject", model);
  isRejecting.value = false;
  open.value = false;
};

const cancelRejection = () => {
  isRejecting.value = false;
  RejectionComment.value = "";
};

const closeDialog = () => {
  open.value = false;
  isRejecting.value = false;
  RejectionComment.value = "";
};

const formatDate = (dateString) => {
  return moment(dateString).format('MMMM Do YYYY');
};
</script>
