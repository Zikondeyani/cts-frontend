<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="mt-4 bg-white p-4 rounded shadow">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">{{ countNumber || ('Inventory ' + (recordId || '')) }}</h2>
            <div class="text-sm text-gray-500 mt-1">{{ warehouses.find(w => w.id === selectedWarehouseId)?.Name || 'No warehouse selected' }}</div>
            <div class="mt-2 text-sm">
              <span class="mr-4">Active: <svg v-if="true" xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 10-1.414-1.414L8 11.172 5.707 8.879A1 1 0 104.293 10.293l3.5 3.5a1 1 0 001.414 0l7.5-7.5z" clip-rule="evenodd"/></svg></span>
              <span class="mr-4">Status: <span class="text-orange-600">{{ countState }}</span></span>
              <span>Date: {{ formatDate(countCreatedOn) }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="px-3 py-1 bg-blue-100 text-blue-800 rounded">Activate</button>
            <button class="px-3 py-1 bg-blue-600 text-white rounded">Deactivate</button>
            <button class="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>

        <div class="mt-4">
          <input placeholder="Search" class="w-full p-2 border rounded" />
        </div>

        <div class="mt-4">
          <div class="flex gap-6 items-center">
            <div class="tab inline-flex items-center gap-2">
              <div class="icon bg-blue-50 p-2 rounded-full">📦</div>
              <div class="text-sm">Commodities <span class="text-gray-500">{{ items.length }}</span></div>
            </div>
            <div class="tab inline-flex items-center gap-2">
              <div class="icon bg-yellow-50 p-2 rounded-full">⚠️</div>
              <div class="text-sm">Not Counted <span class="text-gray-500">{{ items.filter(i => !i.counted).length }}</span></div>
            </div>
            <div class="tab inline-flex items-center gap-2">
              <div class="icon bg-green-50 p-2 rounded-full">✅</div>
              <div class="text-sm">Counted <span class="text-gray-500">{{ items.filter(i => i.counted).length }}</span></div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <table class="min-w-full">
            <thead>
              <tr class="text-left text-sm text-gray-600"><th>Commodity</th><th>Status</th><th>Activity</th><th>BBD</th><th>Difference</th><th class="text-right">Counted Q.ty</th></tr>
            </thead>
            <tbody>
              <tr
                v-for="it in items"
                :key="it.id"
                class="border-t cursor-pointer hover:bg-blue-50"
                @click="openCountModal(it)"
              >
                <td class="py-4">
                  <div class="font-semibold">{{ it.commodity?.Name || it.commodityName || 'Unknown commodity' }}</div>
                  <div class="text-xs text-gray-500">Batch: {{ it.BatchNumber }}</div>
                </td>
                <td class="py-4 text-sm" :class="it.counted ? 'text-green-600' : 'text-orange-600'">{{ it.counted ? 'Counted' : 'Not counted' }}</td>
                <td class="py-4 text-sm">{{ it.activity?.Name || it.activityId || '' }}</td>
                <td class="py-4 text-sm">{{ it.BBD || '' }}</td>
                <td class="py-4 text-sm">{{ it.counted ? variance(it) : '-' }}</td>
                <td class="py-4 text-right" :class="it.counted ? 'text-green-600' : 'text-orange-600'">{{ formatQuantity(it.physicalCount) }} {{ it.commodity?.Container_type || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-end">
          <button @click="submit" class="btn">Recap</button>
        </div>
      </div>
    </div>

    <div
      v-if="isCountModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      @click.self="closeCountModal"
    >
      <div class="w-full max-w-md rounded bg-white shadow-xl">
        <div class="border-b px-5 py-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedItemName }}</h3>
          <p class="mt-1 text-sm text-gray-500">Batch: {{ selectedItem?.BatchNumber || 'N/A' }}</p>
        </div>

        <div class="space-y-4 px-5 py-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-500">Expected quantity</div>
              <div class="font-semibold text-gray-900">{{ formatQuantity(selectedItem?.Quantity) }} {{ selectedItemUnit }}</div>
            </div>
            <div>
              <div class="text-gray-500">Best before</div>
              <div class="font-semibold text-gray-900">{{ selectedItem?.BBD || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Activity</div>
              <div class="font-semibold text-gray-900">{{ selectedItem?.activity?.Name || selectedItem?.activityId || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Stock state</div>
              <div class="font-semibold text-gray-900">{{ selectedItem?.state || 'N/A' }}</div>
            </div>
          </div>

          <div>
            <label for="physical-count" class="block text-sm font-medium text-gray-700">Counted quantity</label>
            <div class="mt-1 flex rounded border border-gray-300">
              <input
                id="physical-count"
                v-model="countedQuantityInput"
                type="number"
                min="0"
                step="0.001"
                class="w-full border-0 p-2 focus:outline-none"
                @keyup.enter="confirmCount"
              />
              <span class="border-l bg-gray-50 px-3 py-2 text-sm text-gray-600">{{ selectedItemUnit }}</span>
            </div>
          </div>

          <div class="rounded bg-gray-50 p-3">
            <div class="text-sm text-gray-500">Difference preview</div>
            <div class="mt-1 text-xl font-semibold" :class="countDifference >= 0 ? 'text-green-700' : 'text-red-700'">
              {{ countDifference.toFixed(3) }} {{ selectedItemUnit }}
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t px-5 py-4">
          <button type="button" class="px-3 py-2 text-sm text-gray-700" @click="closeCountModal">Cancel</button>
          <button type="button" class="btn" @click="confirmCount">OK</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const breadcrumbs = [{ name: "Home", href: "/warehouse/dashboard", current: false }, { name: "Inventory Counts", href: "/warehouse/inventory-counts", current: false }, { name: 'Manage', href: '#', current: true }];

const invStore = useinventorycountstore();
const whStore = usewarehousestore();
const session = useSessionStore();
const user = session.getUser;

const warehouses = reactive([]);
const selectedWarehouseId = ref("");
const items = reactive([]);
const countNumber = ref("");
const countCreatedOn = ref(new Date().toISOString());
const countState = ref("Draft");
const recordId = ref(route.params.id || null);
const isCountModalOpen = ref(false);
const selectedItem = ref(null);
const countedQuantityInput = ref("");

const mapInventoryItem = (i) => ({
  id: i.id,
  commodity: i.commodity || null,
  commodityName: i.commodity?.Name || "",
  activity: i.activity || null,
  activityId: i.activityId || "",
  BatchNumber: i.BatchNumber || "",
  BBD: i.BBD || i.ExpiryDate || "",
  state: i.state || "",
  Quantity: i.Quantity || i.quantity || 0,
  physicalCount: 0,
  counted: false,
  commodityInventoryId: i.id,
});

const loadWarehouseStock = async () => {
  if (!selectedWarehouseId.value) return;

  const stock = await whStore.getInventory(selectedWarehouseId.value);
  items.length = 0;
  items.push(...((stock || []).map(mapInventoryItem)));
};

const formatDate = (d) => (d ? moment(d).format("YYYY-MM-DD") : "");
const formatQuantity = (value) => Number(value || 0).toFixed(3);

const selectedItemName = computed(() => {
  return selectedItem.value?.commodity?.Name || selectedItem.value?.commodityName || "Unknown commodity";
});

const selectedItemUnit = computed(() => {
  return selectedItem.value?.commodity?.Container_type || "";
});

const countDifference = computed(() => {
  return Number(countedQuantityInput.value || 0) - Number(selectedItem.value?.Quantity || 0);
});

const openCountModal = (item) => {
  selectedItem.value = item;
  countedQuantityInput.value = item.counted ? String(item.physicalCount || 0) : "";
  isCountModalOpen.value = true;
};

const closeCountModal = () => {
  isCountModalOpen.value = false;
  selectedItem.value = null;
  countedQuantityInput.value = "";
};

const confirmCount = () => {
  if (!selectedItem.value) return;

  const value = Number(countedQuantityInput.value);
  if (Number.isNaN(value) || value < 0) {
    alert("Please enter a valid counted quantity.");
    return;
  }

  selectedItem.value.physicalCount = value;
  selectedItem.value.counted = true;
  closeCountModal();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    // load warehouses but restrict to user's district
    const wh = await whStore.get();
    warehouses.length = 0;
    warehouses.push(...((wh || []).filter((w) => {
      if (!user?.district) return true;
      return w?.district?.Name == user.district;
    })));

    if (recordId.value) {
      // load existing record
      const rec = await invStore.getOne(recordId.value);
      if (rec) {
        countNumber.value = rec.Notes || rec.countNumber || `CNT-${Date.now()}`;
        countCreatedOn.value = rec.CreatedOn || rec.createdOn || new Date().toISOString();
        countState.value = rec.state || rec.status || "Draft";
        selectedWarehouseId.value = rec.warehouseId || rec.warehouse?.id || "";

        // if record has saved items, map them
        const savedItems = rec.items || [];
        if (savedItems.length > 0) {
          items.length = 0;
          savedItems.forEach((si) => {
            items.push({
              id: si.id || si.commodityInventoryId,
              commodity: si.commodity || si.commodityName || null,
              commodityName: si.commodityName || si.commodity?.Name || "",
              BatchNumber: si.BatchNumber || si.batchNumber || "",
              Quantity: si.expectedQuantity || si.expectedQuantity || si.Quantity || 0,
              physicalCount: typeof si.physicalCount !== 'undefined' ? si.physicalCount : 0,
              counted: true,
              commodityInventoryId: si.commodityInventoryId || si.commodityInventoryId,
            });
          });
        } else {
          await loadWarehouseStock();
        }
      }
    } else {
      // if no recordId (shouldn't happen often), pre-generate number
      countNumber.value = `CNT-${Date.now()}`;
    }
  } catch (err) {
    console.error(err);
  }
  isLoading.value = false;
});

const onWarehouseChange = async () => {
  if (!selectedWarehouseId.value) return;
  isLoading.value = true;
  try {
    await loadWarehouseStock();
  } catch (err) {
    console.error(err);
  }
  isLoading.value = false;
};

const variance = (it) => {
  return (Number(it.physicalCount || 0) - Number(it.Quantity || 0)).toFixed(2);
};

const submit = async () => {
  // ensure record exists: if recordId not set, create base record first
  try {
    isLoading.value = true;
    let rec = null;
    if (!recordId.value) {
      if (!user?.id) {
        throw new Error("User session missing");
      }
      if (!selectedWarehouseId.value) {
        throw new Error("Please select a warehouse before creating a count");
      }
      const base = {
        CreatedOn: new Date().toISOString(),
        UpdatedOn: new Date().toISOString(),
        Notes: countNumber.value,
        countedById: String(user.id),
        warehouseId: Number(selectedWarehouseId.value),
        state: "Draft",
      };
      rec = await invStore.create(base);
      recordId.value = rec.id;
    }

    // prepare items payload: include only items marked counted
    const payloadItems = items.filter((it) => it.counted).map((it) => ({ commodityInventoryId: it.commodityInventoryId, expectedQuantity: it.Quantity, physicalCount: it.physicalCount, BatchNumber: it.BatchNumber }));

    const payload = {
      id: recordId.value,
      Notes: countNumber.value,
      warehouseId: Number(selectedWarehouseId.value),
      UpdatedOn: new Date().toISOString(),
      countedById: user?.id ? String(user.id) : null,
      state: "Draft",
    };

    await Promise.all(
      payloadItems.map((item) =>
        invStore.createItem(recordId.value, item)
      )
    );

    await invStore.update(payload);
    isLoading.value = false;
    router.push({ path: "/warehouse/inventory-counts" });
  } catch (err) {
    isLoading.value = false;
    console.error(err);
    alert("Error saving count");
  }
};
</script>

<style scoped>
.input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
.btn { padding: 8px 12px; background: #096eb4; color: white; border-radius: 6px; }
</style>
