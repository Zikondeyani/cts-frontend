<template>
  <div>
    <button
      type="button"
      style="background-color: #248cd6"
      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      <PlusIcon class="h-5 w-5 mr-2" />
      Create Warehouse Requisition
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
          <TransitionChild
            class=" "
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

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span
            class="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
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
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white"
              >
                <h5
                  class="font-body text-md font-bold leading-normal text-blue-400"
                  id="formModalLabel"
                >
                  Create Warehouse Requisition
                </h5>
                <button
                  type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"
                ></button>
              </div>

              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <!-- Title -->
                  <div class="col-span-6">
                    <label
                      for="title"
                      class="block text-sm font-bold text-gray-700"
                      >Title</label
                    >
                    <input
                      type="text"
                      v-model="reports.subject"
                      required
                      id="title"
                      class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    />
                  </div>

                  <div class="col-span-6">
                    <label
                      for="Description"
                      class="block text-sm font-bold text-gray-700"
                      >Description</label
                    >
                    <textarea
                      v-model="reports.description"
                      required
                      placeholder="Type letter description/justification"
                      id="description"
                      class="mt-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    ></textarea>
                  </div>

                  <div class="col-span-12 sm:col-span-3 mb-5">
                    <label
                      for="warehouse"
                      class="block text-sm font-bold text-gray-700"
                      >Action Requestor</label
                    >

                    <select
                      id="requestor"
                      name="requestor"
                      v-model="reports.actionrequestorsId"
                      autocomplete="warehouse-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    >
                      <option
                        v-for="actionrequestor in actionrequestors"
                        :key="actionrequestor"
                        :value="actionrequestor"
                        class="uppercase"
                      >
                        {{ actionrequestor?.name }}
                      </option>
                    </select>
                  </div>

                  <div class="col-span-12 sm:col-span-3 mb-5">
                    <label
                      for="warehouse"
                      class="block text-sm font-bold text-gray-700"
                      >Warehouse</label
                    >

                    <select
                      id="warehouse"
                      name="warehouse"
                      v-model="reports.warehouseId"
                      autocomplete="warehouse-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    >
                      <option
                        v-for="warehouse in warehouses"
                        :key="warehouse"
                        :value="warehouse"
                        class="uppercase"
                      >
                        {{ warehouse.Name }}
                      </option>
                    </select>
                  </div>

                  <!-- Items -->
                  <!-- Items Table -->
                  <div class="col-span-6">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                      Requested Items
                    </label>

                    <div
                      v-for="(item, index) in reports.items"
                      :key="index"
                      class="grid grid-cols-12 gap-2 mb-2 items-center"
                    >
                      <div class="col-span-6 sm:col-span-3 relative">
                        <label
                          class="block text-xs font-medium text-gray-700 mb-3"
                        >
                          Search commodity
                        </label>

                        <input
                          type="text"
                          v-model="commodityInputs[index]"
                          @input="filterCommodities(index)"
                          placeholder="Search commodity"
                          class="focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md px-3 py-2"
                        />

                        <ul
                          v-if="filteredCommoditiesList[index]?.length"
                          class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow z-50 max-h-48 overflow-y-auto"
                        >
                          <li
                            v-for="commodity in filteredCommoditiesList[index]"
                            :key="commodity.id"
                            @click="selectCommodity(commodity, index)"
                            class="cursor-pointer p-2 hover:bg-gray-200"
                          >
                            {{ commodity.Name }}
                          </li>
                        </ul>
                      </div>

                      <!-- Quantity -->
                      <div class="col-span-6 sm:col-span-3 relative">
                        <input
                          type="number"
                          v-model.number="item.quantity"
                          placeholder="Qty"
                          class="block w-full shadow-sm sm:text-sm border-gray-400 rounded-md mt-7"
                        />
                        <span
                          v-if="unitOfMeasures[index]"
                          class="absolute top-1 left-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 mb-2"
                        >
                          {{ unitOfMeasures[index] }}
                        </span>
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <select
                          v-model="item.priority"
                          class="col-span-4 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md mt-7"
                        >
                          <option disabled value="">Priority</option>
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                      <!-- Remove item -->
                      <button
                        @click="removeItem(index)"
                        class="text-red-500 hover:text-red-700 text-sm mt-7"
                      >
                        ✕
                      </button>
                    </div>

                    <!-- Add new item button -->
                    <button
                      type="button"
                      @click="addItem"
                      class="mt-2 inline-flex items-center px-2 py-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>

              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  @click="onSubmit"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckIcon class="h-5 w-5 mr-2" />
                  Submit Requisition
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

import { useactionrequestorstore } from "../../../stores/action.requestor.store";

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

const UnitOfMeasure = ref("");
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

const actionrequestorstore = useactionrequestorstore();
const actionrequestors = reactive([]);

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
const filteredCommodities = ref([]);
const commodityInput = ref("");
const user = ref(sessionStore.getUser);

const commodityInputs = ref([]);
const filteredCommoditiesList = ref([]);

//MOUNTED
onMounted(() => {
  getActionRequestors();
  getCommodityInventories();
  getActivities();
  getCommodities();
  getDistricts();
  getLoadingplan();
  getProjects();
  getTransporters();
  getWarehouses();
});

const selectedCommodityName = computed(() => {
  const selectedCommodity = commodities.find(
    (commodity) => commodity.id === reports.value.commodityId
  );
  return selectedCommodity;
});

const reports = ref({
  subject: "",
  description: "",
  warehouseId: "",
  actionrequestorsId: "",
  driverName: "",
  vehicleRegistration: "",
  items: [
    {
      commodity: "",
      quantity: null,
      priority: "",
    },
  ],
});

//FUNCTIONS

function addItem() {
  reports.value.items.push({
    commodity: "",
    quantity: null,
    priority: "",
  });
  unitOfMeasures.value.push(""); // Ensure unitOfMeasures stays in sync
}

function removeItem(index) {
  reports.value.items.splice(index, 1);
}

const onSubmit = () => {
  const hasMissingPriority = reports.value.items.some((item) => !item.priority);

  if (hasMissingPriority) {
    Swal.fire({
      icon: "warning",
      title: "Missing Priority",
      text: "Please select a priority for all requested items.",
    });
    return;
  }

  // Proceed with submission
  reports.value.referenceNumber = `REF/DODMA/CTS/Req/${Date.now()}`;
  reports.value.date = moment().format("YYYY-MM-DD");
  reports.value.toName = reports.value.warehouseId?.district?.Name;
  reports.value.signedBy = user.value.firstname + " " + user.value.lastname;
  reports.value.warehouseId = reports.value.warehouseId.id;
  reports.value.districtId = reports.value.warehouseId?.district?.id;
  reports.value.actionrequestorsId = reports.value.actionrequestorsId.id;

  emit("create", reports.value);
  reports.value = {}; // Reset form
  open.value = false;
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

const getActionRequestors = async () => {
  actionrequestorstore
    .get()
    .then((result) => {
      actionrequestors.length = 0; //empty array
      actionrequestors.push(...result);
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

      warehouses.push(
        ...result.filter(
          (item) =>
            item.organisation?.Name == "DODMA" &&
            item.district.Name == user.value.district
        )
      );
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

// Computed: Filter commodities by selected warehouse
const availableCommodities = computed(() => {
  const warehouseId = reports.value.warehouseId?.id; // Make sure warehouseId is set correctly
  if (!warehouseId) return [];

  return commodities.filter((commodity) =>
    commodity.commodityInventories?.some(
      (inventory) =>
        inventory.warehouseId === warehouseId && inventory.Quantity > 0
    )
  );
});

// Helper: Get available quantity in selected warehouse
const getAvailableQuantity = (commodity) => {
  const warehouseId = reports.value?.warehouseId?.id;

  // Guard clause for missing or invalid commodity or commodityInventories
  if (!commodity || !commodity.commodityInventories) return 0;

  // Find the inventory for the current warehouse
  const match = commodity.commodityInventories.find(
    (inv) => inv.warehouseId === 7
  );

  // If a match is found, return the Quantity, otherwise return 0
  return match && match.Quantity !== undefined ? match.Quantity : 0;
};

const skipNextFilter = ref(false);

watch(commodityInput, (newVal) => {
  if (skipNextFilter.value) {
    skipNextFilter.value = false;
    return;
  }
  filteredCommodities.value = commodities.filter((c) =>
    c.Name.toLowerCase().includes(newVal.toLowerCase())
  );
});

const unitOfMeasures = ref([]);

function getUnitOfMeasure(commodityId, index) {
  const commodity = commodities.find((item) => item.id === commodityId);
  unitOfMeasures.value[index] = commodity?.Container_type || "";
}

function filterCommodities(index) {
  const input = commodityInputs.value[index] || "";
  filteredCommoditiesList.value[index] = commodities.filter((c) =>
    c.Name.toLowerCase().includes(input.toLowerCase())
  );
}

function selectCommodity(commodity, index) {
  reports.value.items[index].commodity = commodity;
  getUnitOfMeasure(commodity.id, index); // <-- FIXED
  commodityInputs.value[index] = commodity.Name;
  filteredCommoditiesList.value[index] = [];
}
</script>
