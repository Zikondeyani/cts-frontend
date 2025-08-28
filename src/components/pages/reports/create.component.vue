<template>
  <div>
    <button
      type="button"
      style="background-color: #248cd6"
      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#096eb4] active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      <PlusIcon class="h-5 w-5 mr-2" />
      Create a loading plan
    </button>

    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed z-10 inset-0 overflow-y-auto"
        @close="open = false"
        static
      >
        <div
          class="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style="font-size: 0"
        >
          <!-- Overlay -->
          <TransitionChild
            v-if="open"
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block"
            />
          </TransitionChild>

          <!-- Center Trick -->
          <span
            class="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >

          <!-- Modal Content -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl"
            >
              <!-- Header -->
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white"
              >
                <h5
                  class="font-body text-md font-bold leading-normal text-blue-400"
                >
                  Create Loading Plan
                </h5>
                <button
                  type="button"
                  class="btn-close w-4 h-4 p-1 text-black border-none opacity-50 hover:opacity-75"
                  @click="open = false"
                ></button>
              </div>

              <!-- Form Body -->
              <div class="px-4 py-5 bg-white sm:p-6 space-y-6">
             
                <!-- Section 1: Activity, Transporter or Loan Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Activity -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700"
                      >Select Activity</label
                    >
                    <select
                      v-model="reports.activityId"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option value="stock-prepositioning" class="uppercase">
                        Stock Prepositioning
                      </option>
                      <option
                        v-for="activity in activities"
                        :key="activity.id"
                        :value="activity.id"
                        class="uppercase"
                      >
                        {{ activity.Name }}
                      </option>
                    </select>
                  </div>

                  <!-- Transporter -->
                  <div v-if="selectedActivityName !=='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Select Transporter</label
                    >
                    <select
                      v-model="reports.transporterId"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option
                        v-for="transporter in transporters"
                        :key="transporter.id"
                        :value="transporter.id"
                      >
                        {{ transporter.Name }}
                      </option>
                    </select>
                  </div>

                  <!-- Loan Timeline -->
                  <div v-if="selectedActivityName =='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Loan Timeline</label
                    >
                    <select
                      v-model="reports.LoanTimeline"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="Indefinite">Indefinite</option>
                    </select>
                  </div>

                  <!-- Loan To -->

                  <div v-if="selectedActivityName =='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Loan To</label
                    >
                    <select
                      v-model="reports.LoanTo"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option value="WFP">WFP</option>
                      <option value="ADMARC">ADMARC</option>
                      <option value="NFRA">NFRA</option>
                    </select>
                  </div>

                  <div v-if="selectedActivityName =='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Loan Start Date</label
                    >
                    <input
                      type="date"
                      v-model="reports.LoanStart"
                      :max="
                        reports.LoanStart ||
                        new Date().toISOString().split('T')[0]
                      "
                      class="mt-2 block w-full border-gray-400 rounded-md"
                    />
                  </div>
                </div>

                <!-- Outside the grid -->
                <div v-if="selectedActivityName =='Partner Commodity Loan'" class="mt-4">
                  <label class="block text-sm font-bold text-gray-700"
                    >Loan Description</label
                  >
                  <textarea
                    v-model="reports.LoanDescription"
                    rows="3"
                    class="mt-2 block w-full border-gray-400 rounded-md"
                  ></textarea>
                </div>

                <!-- Section 2: Commodity, Handled By -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Commodity -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700"
                      >Select Commodity</label
                    >
                    <select
                      v-model="reports.commodityId"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option
                        v-for="commodity in commodities.filter(c => c.commodityType.Name === 'Food')"
                        :key="commodity.id"
                        :value="commodity.id"
                      >
                        {{ commodity.Name }}
                      </option>
                    </select>
                  </div>

                  <!-- Handled By -->
                  <div v-if="selectedActivityName !=='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >To Be Handled By</label
                    >
                    <select
                      v-model="reports.HandledBy"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option
                        v-for="item in ['WFP', 'DoDMA']"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Section 3: Quantity & Warehouse -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Quantity -->
                  <div>
                    <label class="block text-sm font-bold text-gray-700">
                      Quantity ({{
                        selectedCommodityName?.commodityType?.Name == "Food"
                          ? "MT"
                          : "Units"
                      }})
                    </label>
                    <input
                      type="number"
                      v-model="reports.Quantity"
                      class="mt-2 block w-full border-gray-400 rounded-md"
                    />
                  </div>

                  <!-- Warehouse -->
                  <div v-if="reports.activityId !== 'stock-prepositioning'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Warehouse</label
                    >
                    <select
                      v-model="reports.warehouseId"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option
                        v-for="warehouse in warehouses"
                        :key="warehouse.id"
                        :value="warehouse.id"
                      >
                        {{ warehouse.Name }}
                      </option>
                    </select>
                    <span
                      v-if="
                        reports.commodityId &&
                        reports.warehouseId &&
                        reports.activityId &&
                        availableBalance !== 'Not Available'
                      "
                      class="text-blue-500 text-sm"
                    >
                      Commodity Balance: {{ availableBalance }}
                    </span>
                  </div>
                </div>

                <!-- Section 4: Stock Prepositioning -->
                <div
                  v-if="reports.activityId === 'stock-prepositioning'"
                  class="space-y-4"
                >
                  <h3
                    class="text-blue-400 font-semibold text-center border-b border-gray-300 pb-2"
                  >
                    Stock Prepositioning
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Move From Warehouse</label
                      >
                      <select
                        v-model="reports.moveFromWarehouseId"
                        class="mt-1 block w-full border-gray-400 rounded-md"
                      >
                        <option
                          v-for="warehouse in warehouses"
                          :key="warehouse.id"
                          :value="warehouse.id"
                        >
                          {{ warehouse.Name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700"
                        >Move To Warehouse</label
                      >
                      <select
                        v-model="reports.moveToWarehouseId"
                        class="mt-1 block w-full border-gray-400 rounded-md"
                      >
                        <option
                          v-for="warehouse in warehouses"
                          :key="warehouse.id"
                          :value="warehouse.id"
                        >
                          {{ warehouse.Name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Section 5: Destination, ATC Number -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-if="selectedActivityName !=='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >Destination District</label
                    >
                    <select
                      v-model="reports.districtId"
                      class="mt-1 block w-full border-gray-400 rounded-md"
                    >
                      <option
                        v-for="district in districts"
                        :key="district.id"
                        :value="district.id"
                      >
                        {{ district.Name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700"
                      >ATC Number</label
                    >
                    <input
                      type="text"
                      v-model="reports.ATCNumber"
                      class="mt-2 block w-full border-gray-400 rounded-md"
                    />
                  </div>
                </div>

                <!-- Section 6: Dates -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  v-if="selectedActivityName !=='Partner Commodity Loan'"
                >
                  <div>
                    <label class="block text-sm font-bold text-gray-700"
                      >Start Date</label
                    >
                    <input
                      type="date"
                      v-model="reports.StartDate"
                      :max="
                        reports.EndDate ||
                        new Date().toISOString().split('T')[0]
                      "
                      class="mt-2 block w-full border-gray-400 rounded-md"
                    />
                  </div>
                  <div v-if="selectedActivityName !=='Partner Commodity Loan'">
                    <label class="block text-sm font-bold text-gray-700"
                      >End Date</label
                    >
                    <input
                      type="date"
                      v-model="reports.EndDate"
                      :min="reports.StartDate"
                      class="mt-2 block w-full border-gray-400 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  @click="onSubmit"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <CheckIcon class="h-5 w-5 mr-2" />
                  Submit Loading Plan
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon, PlusIcon, CheckIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateUserSchema } from "../../../services/schema/user.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";
import { useloadingplanstore } from "../../../stores/loadingplans.store";
import { usecommoditiestore } from "../../../stores/commodity.store";

const Swal = inject("Swal");
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { useprojectstore } from "../../../stores/project.store";
import { useactivitiestore } from "../../../stores/activity.store";
import { useSessionStore } from "../../../stores/session.store";

///FIELDS
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmPassword");
const { value: status, errorMessage: statusError } = useField("status");
const { value: roleId, errorMessage: roleIdError } = useField("roleId");

//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);

//VARIABLES
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(true);
const showModal = ref(false);
const roleStore = useRoleStore();
const loadingplanstore = useloadingplanstore();
const loadingplans = reactive([]);
const commoditiesstore = usecommoditiestore();
const commodities = reactive([]);
const activitiestore = useactivitiestore();
const activities = reactive([]);
const districtstore = usedistrictstore();
const districts = reactive([]);
const projectstore = useprojectstore();
const projects = reactive([]);
const transporterStore = usetransporterstore();
const transporters = reactive([]);
const warehouseStore = usewarehousestore();
const warehouses = reactive([]);

const availableBalance = ref(""); // Hold the available balance

const commodityinventoriestore = usecommodityinventoriestore();
const commodityinventories = reactive([]);

const userStore = useUserStore();
const roles = reactive([]);
const sessionStore = useSessionStore();

//MOUNTED
onMounted(() => {
  getCommodityInventories();
  getActivities();
  getCommodities();
  getDistricts();
  getLoadingplan();
  getProjects();
  getTransporters();
  getWarehouses();
});


const selectedActivityName = computed(() => {
  const activity = activities.find(
    (a) => a.id === reports.value.activityId
  );
  return activity ? activity.Name : "";
});

const selectedCommodityName = computed(() => {
  const selectedCommodity = commodities.find(
    (commodity) => commodity.id === reports.value.commodityId
  );
  return selectedCommodity;
});

const reports = ref({});

//FUNCTIONS

const onSubmit = () => {
  // Ensure warehouseId and activityId default to 0 if not present
  if (!reports.value.warehouseId) {
    reports.value.warehouseId = 0;
  }

  if (!reports.value.activityId) {
    reports.value.activityId = 0;
  }

  reports.value.moveFromWarehouseId = reports.value.moveFromWarehouseId;
  reports.value.moveToWarehouseId = reports.value.moveToWarehouseId;

  // Only validate if activityId is NOT 8
  if (reports.value.activityId !== 8) {
    if (
      !reports.value.transporterId ||
      !reports.value.commodityId ||
      !reports.value.Quantity ||
      !reports.value.districtId ||
      !reports.value.ATCNumber ||
      !reports.value.StartDate ||
      !reports.value.EndDate 
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required!",
      });
      return; // Prevent form submission if any required field is missing
    }
  }

  // Perform form submission
  emit("create", reports.value);
  reports.value = {}; // Reset form
  open.value = false; // Close the modal
};

const getLoadingplan = async () => {
  loadingplanstore
    .get()
    .then((result) => {
      loadingplans.length = 0; //empty array
      loadingplans.push(...result);
    })
    .catch((error) => {})
    .finally(() => {});
};

const getCommodityInventories = async () => {
  commodityinventoriestore
    .get()
    .then((result) => {
      commodityinventories.length = 0; //empty array
      commodityinventories.push(...result);
    })
    .catch((error) => {})
    .finally(() => {});
};

const getWarehouses = async () => {
  warehouseStore
    .get()
    .then((result) => {
      warehouses.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to warehouses
      const sortedWarehouses = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      warehouses.push(...sortedWarehouses);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

const getCommodities = async () => {
  commoditiesstore
    .get()
    .then((result) => {
      commodities.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to commodities
      const sortedCommodities = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      commodities.push(...sortedCommodities);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

const getActivities = async () => {
  activitiestore
    .get()
    .then((result) => {
      activities.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to activities
      const sortedActivities = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      activities.push(...sortedActivities);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

const getDistricts = async () => {
  districtstore
    .get()
    .then((result) => {
      districts.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to districts
      const sortedDistricts = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      districts.push(...sortedDistricts);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

const getProjects = async () => {
  projectstore
    .get()
    .then((result) => {
      projects.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to projects
      const sortedProjects = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      projects.push(...sortedProjects);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

const getTransporters = async () => {
  transporterStore
    .get()
    .then((result) => {
      transporters.length = 0; // empty array

      // Sort alphabetically by 'name' before pushing to transporters
      const sortedTransporters = result.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      transporters.push(...sortedTransporters);
    })
    .catch((error) => {
      // Handle error
    })
    .finally(() => {
      // Optional cleanup or final actions
    });
};

// Watch for changes in commodity and warehouse selections
watch(
  () => [
    reports.value.commodityId,
    reports.value.warehouseId,
    reports.value.activityId,
  ],
  ([newCommodityId, newWarehouseId, newActivityId]) => {
    if (newCommodityId && newWarehouseId) {
      // Find the corresponding inventory record based on the selection
      const matchingInventory = commodityinventories.find(
        (inventory) =>
          inventory.commodityId === newCommodityId &&
          inventory.warehouseId === newWarehouseId
      );

      // Update the available balance if a matching inventory record is found
      availableBalance.value = matchingInventory
        ? `${matchingInventory.Quantity.toFixed(2)} MT`
        : "Not Available";
    } else {
      availableBalance.value = "Select Commodity, Activity and Warehouse";
    }
  }
);
</script>
