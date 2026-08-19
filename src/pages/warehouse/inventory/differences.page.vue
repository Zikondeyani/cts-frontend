<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="mt-4">
        <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">Inventory Differences &amp; Remarks</h2>
      </div>

      <div class="mt-6 bg-white rounded shadow overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left text-xs text-gray-600 uppercase">
            <tr>
              <th class="px-4 py-3">Count</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Commodity</th>
              <th class="px-4 py-3">Batch</th>
              <th class="px-4 py-3 text-right">Expected</th>
              <th class="px-4 py-3 text-right">Counted</th>
              <th class="px-4 py-3 text-right">Difference</th>
              <th class="px-4 py-3">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in differences" :key="i" class="border-t">
              <td class="px-4 py-3 font-semibold text-gray-900">{{ d.countNumber }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ d.countDate }}</td>
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900">{{ d.commodity }}</div>
                <div class="text-xs text-gray-500" v-if="d.container">{{ d.container }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ d.BatchNumber || '-' }}</td>
              <td class="px-4 py-3 text-right text-sm">{{ d.expected }}</td>
              <td class="px-4 py-3 text-right text-sm">{{ d.counted }}</td>
              <td class="px-4 py-3 text-right font-semibold" :class="d.difference < 0 ? 'text-red-600' : 'text-green-600'">
                {{ d.difference }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ d.remark || '-' }}</td>
            </tr>
            <tr v-if="differences.length === 0">
              <td colspan="8" class="px-4 py-6 text-center text-sm text-gray-500">
                No differences found for your counts yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import moment from "moment";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/warehouse/dashboard", current: false },
  { name: "Inventory Counts", href: "/warehouse/inventory-counts", current: false },
  { name: "Differences", href: "#", current: true },
];

const invStore = useinventorycountstore();
const whStore = usewarehousestore();
const session = useSessionStore();
const Swal = inject("Swal");
const user = session.getUser;

const differences = reactive([]);

// Cache of commodity-inventories per warehouse (used to resolve commodity names).
const inventoryCache = {};

const getWarehouseInventories = async (warehouseId) => {
  const key = String(warehouseId || "");
  if (!key) return [];
  if (!inventoryCache[key]) {
    inventoryCache[key] = (await whStore.getInventory(warehouseId)) || [];
  }
  return inventoryCache[key];
};

// The recap feature stores one line per difference: "CommodityName: remark".
const parseRemarks = (remarks) => {
  const map = {};
  String(remarks || "")
    .split("\n")
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) {
        const name = line.slice(0, idx).trim();
        const text = line.slice(idx + 1).trim();
        if (name) map[name] = text;
      }
    });
  return map;
};

const load = async () => {
  isLoading.value = true;
  differences.length = 0;
  try {
    const [counts, warehouses] = await Promise.all([
      invStore.get(),
      whStore.get(),
    ]);

    // A warehouse officer is attached to one warehouse (Warehouse.userId);
    // everyone else falls back to district-level scoping.
    const assignedWarehouse = (warehouses || []).find((w) => String(w.userId) === String(user?.id));
    const allowedWarehouseIds = (warehouses || [])
      .filter((w) => {
        if (assignedWarehouse) return Number(w.id) === Number(assignedWarehouse.id);
        if (!user?.district) return true;
        return w?.district?.Name == user.district;
      })
      .map((w) => Number(w.id));

    const rows = [];
    const countsList = Array.isArray(counts) ? counts : [];

    for (const c of countsList) {
      const cWhId = Number(c.warehouseId || c.warehouse?.id);
      if (!allowedWarehouseIds.includes(cWhId)) continue;

      // Only finalized counts have captured difference remarks.
      const finalized =
        String(c.state || "").toLowerCase() === "saved" ||
        String(c.remarks || "").trim().length > 0;
      if (!finalized) continue;

      const items = c.items || [];
      if (!items.length) continue;

      const remarkMap = parseRemarks(c.remarks);
      const inventories = await getWarehouseInventories(cWhId);
      const inventoryById = (inventories || []).reduce((map, inv) => {
        map[String(inv.id)] = inv;
        return map;
      }, {});

      const countNumber = c.Notes || c.countNumber || ("Inventory " + (c.id || ""));
      const countDate = moment(c.CreatedOn || c.createdOn).format("YYYY-MM-DD");

      items.forEach((it) => {
        const expected = Number(it.expectedQuantity || 0);
        const counted = Number(it.physicalCount || 0);
        const difference = Number((counted - expected).toFixed(3));
        if (difference === 0) return;

        const inventory = inventoryById[String(it.commodityInventoryId)];
        const commodity = inventory?.commodity || null;
        const name = commodity?.Name || it.commodityName || "Unknown commodity";

        rows.push({
          countNumber,
          countDate,
          commodity: name,
          container: commodity?.Container_type || "",
          BatchNumber: it.BatchNumber || "",
          expected,
          counted,
          difference,
          remark: remarkMap[name] || "",
        });
      });
    }

    rows.sort((a, b) =>
      a.countDate < b.countDate ? 1 : a.countDate > b.countDate ? -1 : 0
    );
    differences.push(...rows);
  } catch (err) {
    console.error(err);
    Swal.fire({
      text: "Error loading differences",
      icon: "error",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
  isLoading.value = false;
};

onMounted(load);
</script>

<style scoped>
</style>

