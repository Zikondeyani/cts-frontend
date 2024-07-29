<template>
  <div>
    <button type="button"
      class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true">
      new commodity stock
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
            leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:scale-95">
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="text-md font-medium leading-normal text-gray-800" id="formModalLabel">
                  Create Stock
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" /> <!-- Icon added here -->

                </button>


              </div>


              <form @submit="onSubmit" :validation-schema="CreateInventorySchema">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">

                    <div class="col-span-6 sm:col-span-3">
                      <label for="commodity-search" class="block text-sm font-medium text-gray-700">
                        Select Commodity
                      </label>
                      <input type="text" id="commodity-search" v-model="commoditySearch" placeholder="Search commodity"
                        @input="filterCommodities"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <ul v-if="filteredCommodities.length"
                        class="border border-gray-300 rounded-md mt-2 max-h-48 overflow-y-auto">
                        <li v-for="commodity in filteredCommodities" :key="commodity.id"
                          @click="selectCommodity(commodity)" class="cursor-pointer p-2 hover:bg-gray-200">{{
        commodity.Name }}
                        </li>
                      </ul>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ commodityError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="warehouse-search" class="block text-sm font-medium text-gray-700">
                        Select Warehouse
                      </label>
                      <input type="text" id="warehouse-search" v-model="warehouseSearch" placeholder="Search warehouse"
                        @input="filterWarehouses"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <ul v-if="filteredWarehouses.length"
                        class="border border-gray-300 rounded-md mt-2 max-h-48 overflow-y-auto">
                        <li v-for="warehouse in filteredWarehouses" :key="warehouse.id"
                          @click="selectWarehouse(warehouse)" class="cursor-pointer p-2 hover:bg-gray-200">{{
        warehouse.Name }}
                        </li>
                      </ul>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ warehouseIdError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="batch" class="block text-sm font-medium text-gray-700">Batch #</label>
                      <input type="text" v-model="BatchNumber" Name="BatchNumber" id="BatchNumber" autocomplete="off"
                        placeholder="BatchNumber"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ BatchNumberError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                      <input type="number" v-model="Quantity" Name="quantity" id="quantity" autocomplete="off"
                        placeholder="Quantity"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ quantityError }}
                      </p>
                      <p class="text-red-500 text-xs italic pt-1">
                        Unit is Metric Tonnes (MT) for Food Items and Amount for NFIs.
                      </p>
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="ExpiryDate" class="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input type="date" v-model="ExpiryDate" name="ExpiryDate" id="ExpiryDate" autocomplete="off"
                        placeholder="Expiry Date"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ ExpiryDateError }}
                      </p>
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
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm } from "vee-validate";

// COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
// SCHEMA AND STORES
import { CreateInventorySchema } from "../../../services/schema/commodity-inventory.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "../../../stores/session.store";

// INJECTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);

// VARIABLES
const isLoading = ref(false);
const open = ref(false);
const roleStore = useRoleStore();
const userStore = useUserStore();
const districtstore = usedistrictstore();
const commodityStore = usecommoditiestore();
const warehouseStore = usewarehousestore();
const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const commodities = reactive([]);
const warehouses = reactive([]);

// SEARCH
const commoditySearch = ref("");
const filteredCommodities = ref([]);
const selectedCommodity = ref(null);

const warehouseSearch = ref("");
const filteredWarehouses = ref([]);
const selectedWarehouse = ref(null);

// FORM
const { meta } = useForm({
  validationSchema: CreateInventorySchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    commodityId: "",
    warehouseId: "",
    userId: ""
  },
});

// FIELDS
const { value: commodityId, errorMessage: commodityError } = useField("commodityId");
const { value: warehouseId, errorMessage: warehouseIdError } = useField("warehouseId");
const { value: Quantity, errorMessage: quantityError } = useField("Quantity");
const { value: ExpiryDate, errorMessage: ExpiryDateError } = useField("ExpiryDate");
const { value: BatchNumber, errorMessage: BatchNumberError } = useField("BatchNumber");

// MOUNTED
onMounted(() => {
  getCommodities();
  getWarehouses();
});

// FUNCTIONS
const getWarehouses = async () => {
  warehouseStore.get()
    .then(result => {
      warehouses.length = 0; // Empty array
      warehouses.push(...result);
    })
    .catch(error => {
      console.error("Error fetching warehouses:", error);
    });
};

const getCommodities = async () => {
  commodityStore.get()
    .then(result => {
      commodities.length = 0; // Empty array
      commodities.push(...result);
    })
    .catch(error => {
      console.error("Error fetching commodities:", error);
    });
};

const filterCommodities = () => {
  const search = commoditySearch.value.toLowerCase();
  filteredCommodities.value = commodities.filter(commodity =>
    commodity.Name.toLowerCase().includes(search)
  );
};

const selectCommodity = (commodity) => {
  selectedCommodity.value = commodity;
  commodityId.value = commodity.id;
  commoditySearch.value = commodity.Name;
  filteredCommodities.value = [];
};

const filterWarehouses = () => {
  const search = warehouseSearch.value.toLowerCase();
  filteredWarehouses.value = warehouses.filter(warehouse =>
    warehouse.Name.toLowerCase().includes(search)
  );
};

const selectWarehouse = (warehouse) => {
  selectedWarehouse.value = warehouse;
  warehouseId.value = warehouse.id;
  warehouseSearch.value = warehouse.Name;
  filteredWarehouses.value = [];
};

const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    Quantity: Quantity.value,
    ExpiryDate: ExpiryDate.value,
    commodityId: commodityId.value,
    warehouseId: warehouseId.value,
    BatchNumber: BatchNumber.value,
    userId: user.value.id
  };
  emit("create", model);
  open.value = false;
  actions.resetForm();
});

</script>

<style scoped>
.max-h-48 {
  max-height: 12rem;
  /* 48 divided by 4 (for 4 units of 4 units each) */
}
</style>
