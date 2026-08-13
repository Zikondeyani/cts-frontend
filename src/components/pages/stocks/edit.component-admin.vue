<template>
  <main class="space-y-6">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Stock</h3>
          <p class="mt-1 text-sm text-gray-500">
            Update the same stock fields used when the record was created.
          </p>
        </div>

        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit="onSubmit" :validation-schema="UpdateInventorySchema">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-6 sm:col-span-3">
                    <label for="commodity" class="block text-sm font-medium text-gray-700">
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
                    <label for="warehouse" class="block text-sm font-medium text-gray-700">
                      Select Warehouse
                    </label>
                    <select
                      id="warehouse"
                      name="warehouse"
                      v-model="warehouseId"
                      autocomplete="warehouse-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    >
                      <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" class="uppercase">
                        {{ warehouse.Name }}
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ warehouseIdError }}
                    </p>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="stock-type" class="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      id="stock-type"
                      name="type"
                      v-model="stockType"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                    >
                      <option value="" disabled>Select type</option>
                      <option value="Donation">Donation</option>
                      <option value="New Stock">New Stock</option>
                      <option value="Third Party Stock">Third Party Stock</option>
                      <option value="Obsolete Stock">Obsolete Stock</option>
                    </select>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="from-who-search" class="block text-sm font-medium text-gray-700">
                      Source
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
                    <label for="batch-number" class="block text-sm font-medium text-gray-700">
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

                  <div class="col-span-6 sm:col-span-3">
                    <label for="expiry-date" class="block text-sm font-medium text-gray-700">
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
                    <label for="quantity" class="block text-sm font-medium text-gray-700">
                      Quantity
                      <span v-if="UnitOfMeasure" class="text-gray-400 italic text-sm">
                        ({{ UnitOfMeasure }})
                      </span>
                    </label>
                    <input
                      type="number"
                      v-model="Quantity"
                      name="quantity"
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
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end gap-2">
                <button
                  type="button"
                  class="bg-white py-2 px-4 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  @click="deleteAcc"
                >
                  Delete stock
                </button>
                <button
                  type="submit"
                  style="background-color: #096eb4"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm } from "vee-validate";
import { UpdateInventorySchema } from "../../../services/schema/commodity-inventory.schema";
import { isStockExpired } from "../../../constants/stockStates";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import { useSessionStore } from "../../../stores/session.store";

const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update"]);
const InventoryStore = usecommodityinventoriestore();
const commodityStore = usecommoditiestore();
const warehouseStore = usewarehousestore();
const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const commodities = reactive([]);
const warehouses = reactive([]);
const filteredCommodities = ref([]);
const commodityInput = ref("");
const stockType = ref("");
const fromWhoInput = ref("");
const fromWho = ref("");
const fromWhoError = ref("");
const UnitOfMeasure = ref("");
const skipNextFilter = ref(false);

const { value: commodityId, errorMessage: commodityError } = useField("commodityId");
const { value: warehouseId, errorMessage: warehouseIdError } = useField("warehouseId");
const { value: Quantity, errorMessage: quantityError } = useField("Quantity");
const { value: ExpiryDate, errorMessage: ExpiryDateError } = useField("ExpiryDate");
const { value: BatchNumber, errorMessage: BatchNumberError } = useField("BatchNumber");

useForm({
  validationSchema: UpdateInventorySchema,
  initialValues: {
    Quantity: "",
    ExpiryDate: "",
    BatchNumber: "",
    commodityId: "",
    warehouseId: "",
    userId: "",
  },
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

const isEditMode = computed(() => Boolean(props.model?.id));
const submitLabel = computed(() => (isEditMode.value ? "Update" : "Save"));

const getUnitOfMeasure = (id) => {
  const commodity = commodities.find((item) => item.id === id);
  UnitOfMeasure.value = commodity?.Container_type || "";
  return UnitOfMeasure.value;
};

const getCommodities = async () => {
  const result = await commodityStore.get();
  commodities.length = 0;
  commodities.push(...result);
};

const getWarehouses = async () => {
  const result = await warehouseStore.get();
  warehouses.length = 0;
  warehouses.push(...result);
};

const populateFromModel = (model) => {
  if (!model || !model.id) return;
  commodityId.value = model.commodityId || model.commodity?.id || "";
  warehouseId.value = model.warehouseId || model.warehouse?.id || "";
  Quantity.value = model.Quantity ?? "";
  ExpiryDate.value = model.ExpiryDate ? moment(model.ExpiryDate).format("YYYY-MM-DD") : "";
  BatchNumber.value = model.BatchNumber || "";
  stockType.value = model.type || "";
  fromWhoInput.value = model.StockFrom || "";
  fromWho.value = model.StockFrom || "";
  commodityInput.value = model.commodity?.Name || "";
  UnitOfMeasure.value = model.commodity?.Container_type || "";
};

watch(
  () => props.model,
  (current) => {
    populateFromModel(current);
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await getCommodities();
  await getWarehouses();
  populateFromModel(props.model);
});

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
  filteredCommodities.value = commodities.filter((commodity) =>
    commodity.Name.toLowerCase().includes(newVal.toLowerCase())
  );
});

const selectCommodity = (commodity) => {
  skipNextFilter.value = true;
  commodityInput.value = commodity.Name;
  commodityId.value = commodity.id;
  UnitOfMeasure.value = commodity.Container_type;
  filteredCommodities.value = [];
};

const onSubmit = useSubmitForm(() => {
  emit("update", {
    id: props.model.id,
    Quantity: Quantity.value,
    commodityId: commodityId.value,
    warehouseId: warehouseId.value,
    StockFrom: fromWhoInput.value,
    ExpiryDate: ExpiryDate.value,
    BatchNumber: BatchNumber.value,
    type: stockType.value,
    state: isStockExpired({ ExpiryDate: ExpiryDate.value })
      ? "Expired"
      : props.model.state || "Ready",
    userId: user.value?.id,
  });
});

const deleteAcc = async () => {
  const result = await Swal.fire({
    title: "Delete stock?",
    text: "You won't be able to revert this.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await InventoryStore.remove(props.model.id);
    Swal.fire("Deleted!", "Deleted commodity inventory successfully.", "success");
    $router.push({ path: "/admin/stock-management" });
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: "failed to remove commodity inventory (" + error + ")",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};
</script>