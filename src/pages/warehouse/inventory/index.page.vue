<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div>
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">Inventory Counts</h2>
        </div>
        <div>
          <button @click="createNewCount" class="btn">+ Create New Count</button>
        </div>
      </div>

      <div class="mt-6">
        <div class="space-y-4">
          <div v-for="c in counts" :key="c.id" class="inventory-card bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div class="text-lg font-semibold text-gray-900">{{ c.Notes || c.countNumber || ('Inventory ' + (c.id || '')) }}</div>
              <div class="text-sm text-gray-500">Date: {{ formatDate(c.CreatedOn || c.createdOn) }}</div>
            </div>

            <div class="text-right">
              <div class="text-sm mt-2">Status: <span class="text-green-600 font-semibold">{{ c.state || c.status || 'Draft' }}</span></div>
              <div class="mt-3">
                <router-link :to="`/warehouse/inventory-counts/${c.id}`" class="inline-block text-sm text-blue-600 hover:underline">View details →</router-link>
              </div>
            </div>
          </div>

          <div v-if="counts.length === 0" class="bg-white p-6 rounded shadow text-center text-gray-600">No inventories yet — click Create Inventory to start.</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import moment from "moment";

const isLoading = ref(false);
const breadcrumbs = [{ name: "Home", href: "/warehouse/dashboard", current: false }, { name: "Inventory Counts", href: "#", current: true }];

const session = useSessionStore();
const user = session.getUser;
const warehouseStore = usewarehousestore();

const store = useinventorycountstore();
const counts = reactive([]);

const load = async () => {
  isLoading.value = true;
  try {
    const [result, warehouses] = await Promise.all([
      store.get(),
      warehouseStore.get(),
    ]);
    counts.length = 0;

    if (result && Array.isArray(result)) {
      const allowedWarehouseIds = (warehouses || [])
        .filter((w) => {
          if (!user?.district) return true;
          return w?.district?.Name == user.district;
        })
        .map((w) => Number(w.id));

      const filteredCounts = result.filter((r) => {
        if (!user?.district) return true;
        return allowedWarehouseIds.includes(Number(r.warehouseId || r.warehouse?.id));
      });

      counts.push(...filteredCounts.sort((a, b) => {
        return new Date(b.CreatedOn || b.createdOn || 0) - new Date(a.CreatedOn || a.createdOn || 0);
      }));
    }
  } catch (err) {
    console.error(err);
  }
  isLoading.value = false;
};

onMounted(load);

const formatDate = (d) => (d ? moment(d).format("YYYY-MM-DD") : "");

const createNewCount = async () => {
  isLoading.value = true;
  try {
    if (!user?.id) {
      alert("Your session is not active. Please sign in again.");
      isLoading.value = false;
      return;
    }

    const wh = await warehouseStore.get();
    const availableWarehouses = (wh || []).filter((w) => {
      if (!user?.district) return true;
      return w?.district?.Name == user.district;
    });

    if (!availableWarehouses.length) {
      alert("Please create a warehouse before creating an inventory count.");
      isLoading.value = false;
      return;
    }

    const payload = {
      CreatedOn: new Date().toISOString(),
      UpdatedOn: new Date().toISOString(),
      Notes: `CNT-${Date.now()}`,
      countedById: String(user.id),
      warehouseId: Number(availableWarehouses[0].id),
      state: "Draft",
    };

    const res = await store.create(payload);
    if (res && res.id) {
      await load();
    } else {
      await load();
    }
  } catch (err) {
    console.error(err);
    alert("Error creating count");
  }
  isLoading.value = false;
};
</script>

<style scoped>
.btn { padding: 8px 12px; background: #096eb4; color: white; border-radius: 6px; }
</style>
