<template>
  <div>
    <button
      type="button"
      class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      new commodity stock
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
                  class="text-md font-medium leading-normal text-gray-800"
                  id="formModalLabel"
                >
                  Create Stock
                </h5>
                <button
                  type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"
                >
                  <XIcon class="h-4 w-4" />
                  <!-- Icon added here -->
                </button>
              </div>

              <form
                @submit="onSubmit"
                :validation-schema="CreateInventorySchema"
              >
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="commodity"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Select Commodity
                        <span
                          v-if="UnitOfMeasure"
                          class="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full"
                        >
                          {{ UnitOfMeasure }}
                        </span>
                      </label>
                      <input
                        type="text"
                        id="commodity"
                        v-model="commodityInput"
                        placeholder="Search and select a commodity"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      />
                      <ul
                        v-if="filteredCommodities.length"
                        class="border border-gray-300 rounded-md mt-2 max-h-48 overflow-y-auto bg-white z-10 relative"
                      >
                        <li
                          v-for="commodity in filteredCommodities"
                          :key="commodity.id"
                          @click="selectCommodity(commodity)"
                          class="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {{ commodity.Name }}
                        </li>
                      </ul>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ commodityError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="user-district"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Select Warehouse</label
                      >
                      <select
                        id="warehouse"
                        name="warehouse"
                        v-model="warehouseId"
                        autocomplete="warehouse-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      >
                        <option
                          v-for="warehouse in warehouses"
                          :key="warehouse.id"
                          :value="warehouse.id"
                          class="uppercase"
                        >
                          {{ warehouse.Name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ warehouseIdError }}
                      </p>
                    </div>

                    <!-- Add this inside the <div class="grid grid-cols-6 gap-2"> block -->
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="stock-type"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Type
                      </label>
                      <select
                        id="stock-type"
                        name="type"
                        v-model="stockType"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      >
                        <option value="" disabled selected>Select type</option>
                        <option value="Donation">Donation</option>
                        <option value="New Stock">New Stock</option>
                        <option value="Third Party Stock">
                          Third Party Stock
                        </option>
                      </select>
                    </div>

                    <!-- Optional Batch Number -->
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="batch-number"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Batch Number (optional)
                      </label>
                      <input
                        type="text"
                        id="batch-number"
                        v-model="BatchNumber"
                        placeholder="Enter batch number"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ BatchNumberError }}
                      </p>
                    </div>

                    <!-- Optional Expiry Date -->
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="expiry-date"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        id="expiry-date"
                        v-model="ExpiryDate"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ ExpiryDateError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="from-who-search"
                        class="block text-sm font-medium text-gray-700"
                      >
                        From Who
                      </label>
                      <input
                        type="text"
                        id="from-who-search"
                        v-model="fromWhoInput"
                        placeholder="Type or select source"
                        @input="filterFromWhoOptions"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <ul
                        v-if="filteredFromWho.length"
                        class="border border-gray-300 rounded-md mt-2 max-h-48 overflow-y-auto bg-white z-10 relative"
                      >
                        <li
                          v-for="(source, index) in filteredFromWho"
                          :key="index"
                          @click="selectFromWho(source)"
                          class="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {{ source }}
                        </li>
                      </ul>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ fromWhoError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="quantity"
                        class="block text-sm font-medium text-gray-700"
                        >Quantity
                        <span
                          v-if="UnitOfMeasure"
                          class="text-gray-400 italic text-sm"
                        >
                          ({{ UnitOfMeasure }})
                        </span></label
                      >
                      <input
                        type="number"
                        v-model="Quantity"
                        Name="quantity"
                        id="quantity"
                        autocomplete="off"
                        placeholder="Quantity"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ quantityError }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    style="background-color: #096eb4"
                    class="`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  >
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
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateInventorySchema } from "../../../services/schema/commodity-inventory.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { usedistrictstore } from "../../../stores/districts.store";

import { usecommoditiestore } from "../../../stores/commodity.store";

import { usewarehousestore } from "../../../stores/warehouse.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
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
const districts = reactive([]);

const commodityStore = usecommoditiestore();
const commodities = reactive([]);

const warehouseStore = usewarehousestore();
const warehouses = reactive([]);

const sessionStore = useSessionStore();

const filteredCommodities = ref([]);
const commodityInput = ref("");
const user = ref(sessionStore.getUser);

//FORM
const { meta } = useForm({
  validationSchema: CreateInventorySchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    commodityId: "",
    warehouseId: "",
    ExpiryDate: "",
    BatchNumber: "",
    userId: "",
  },
});
///FIELDS
const { value: commodityId, errorMessage: commodityError } =
  useField("commodityId");
const { value: warehouseId, errorMessage: warehouseIdError } =
  useField("warehouseId");
const { value: Quantity, errorMessage: quantityError } = useField("Quantity");
const { value: ExpiryDate, errorMessage: ExpiryDateError } =
  useField("ExpiryDate");
const { value: BatchNumber, errorMessage: BatchNumberError } =
  useField("BatchNumber");

const stockType = ref("");
const fromWhoInput = ref("");
const fromWho = ref("");
const fromWhoError = ref("");
const UnitOfMeasure = ref("");
const skipNextFilter = ref(false);

//MOUNTED
onMounted(async () => {
  await getCommodities();
  await getWarehouses();
});
//FUNCTIONS

const getUnitOfMeasure = (commodityId) => {
  const commodity = commodities.find((item) => item.id === commodityId);
  UnitOfMeasure.value = commodity?.Container_type || "";
  return UnitOfMeasure.value;
};

const getWarehouses = async () => {
  warehouseStore
    .get()
    .then((result) => {
      warehouses.length = 0; //empty array
      warehouses.push(
        ...result.filter((item) => item.district.Name == user.value.district)
      );
    })
    .catch((error) => {})
    .finally(() => {});
};

const getCommodities = async () => {
  commodityStore
    .get()
    .then((result) => {
      commodities.length = 0; //empty array
      commodities.push(...result);
    })
    .catch((error) => {})
    .finally(() => {});
};

const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    Quantity: Quantity.value,
    commodityId: commodityId.value,
    warehouseId: warehouseId.value,
    StockFrom: fromWhoInput.value,

    ExpiryDate: ExpiryDate.value,
    BatchNumber: BatchNumber.value,
    type: stockType.value,
    userId: user.value.id,
  };

  emit("create", model);
  actions.resetForm();
  open.value = false;
  resetFormFields();
});

const fromWhoOptions = [
  "UNICEF",
  "UNDP",
  "ADMARC",
  "UNFPA",
  "GOVERNMENT",
  "WFP",
  "NFRA",
  "FIND YOUR FEET",
  "REDCROSS",
  "DODMA",
];

const filteredFromWho = ref([]);

const filterFromWhoOptions = () => {
  const search = fromWhoInput.value.toLowerCase();
  filteredFromWho.value = fromWhoOptions.filter((option) =>
    option.toLowerCase().includes(search)
  );
};

const selectFromWho = (source) => {
  fromWhoInput.value = source;
  fromWho.value = source;
  filteredFromWho.value = [];
};

watch(commodityInput, (newVal) => {
  if (skipNextFilter.value) {
    skipNextFilter.value = false;
    return;
  }
  filteredCommodities.value = commodities.filter((c) =>
    c.Name.toLowerCase().includes(newVal.toLowerCase())
  );
});

// Select and update
const selectCommodity = (commodity) => {
  skipNextFilter.value = true;
  commodityInput.value = commodity.Name;
  commodityId.value = commodity.id;
  UnitOfMeasure.value = commodity.Container_type;
  filteredCommodities.value = [];

  // blur the input if needed
  setTimeout(() => {
    const input = document.getElementById("commodity");
    input?.blur();
  }, 100);
};

const resetFormFields = () => {
  commodityInput.value = "";
  commodityId.value = "";
  warehouseId.value = "";
  Quantity.value = "";
  stockType.value = "";
  fromWhoInput.value = "";
  fromWho.value = "";
  UnitOfMeasure.value = "";
  filteredCommodities.value = [];
  filteredFromWho.value = [];
};
</script>
