<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="mt-4">
        <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">Inventory Differences</h2>
        <p class="text-sm text-gray-400 mt-1">Select a count to view its differences.</p>
      </div>

      <div class="mt-4" v-if="countSummaries.length > 0">
        <input
          v-model="searchQuery"
          placeholder="Search by count number…"
          class="w-full p-2 border rounded bg-white"
        />
      </div>

      <div class="mt-6">
        <div class="space-y-4" v-if="filteredSummaries.length > 0">
          <div
            v-for="d in filteredSummaries"
            :key="d.id"
            class="inventory-card bg-white p-4 rounded shadow flex items-center justify-between"
          >
            <div>
              <div class="text-lg font-semibold text-gray-900">
                {{ d.countNumber }}
              </div>

              <div class="text-sm text-gray-500">
                Date: {{ d.countDate }}
              </div>

              <div class="text-sm text-gray-500" v-if="d.warehouseName">
                {{ d.warehouseName }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm mt-2">
                Differences:
                <span
                  :class="d.differenceCount > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'"
                >
                  {{ d.differenceCount }}
                </span>
              </div>

              <div class="mt-3">
                <router-link
                  :to="`${moduleBase}/differences/${d.id}${warehouseQuery}`"
                  class="inline-block text-sm text-blue-600 hover:underline"
                >
                  View details →
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredSummaries.length === 0"
          class="bg-white p-6 rounded shadow text-center text-gray-600"
        >
          {{
            countSummaries.length === 0
              ? 'No finalized counts with inventory items yet.'
              : 'No counts match your search.'
          }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import { dedupeCountItems } from "../../../utils/inventoryDifferences";

const isLoading = ref(false);

// Admins view this module under /admin/warehouse-management/..., warehouse
// officers under /warehouse/inventory-counts/... — derive the base from the
// current path so all internal links stay within the active role's area.
const route = useRoute();
const moduleBase = route.path.startsWith("/admin")
  ? "/admin/warehouse-management/inventory-counts"
  : "/warehouse/inventory-counts";

// Admin scoped to one warehouse via ?warehouseId= (Warehouse Management view).
const scopedWarehouseId = route.query.warehouseId ? Number(route.query.warehouseId) : null;
const warehouseQuery = scopedWarehouseId ? `?warehouseId=${scopedWarehouseId}` : "";

const breadcrumbs = [
  { name: "Home", href: route.path.startsWith("/admin") ? "/admin/dashboard" : "/warehouse/dashboard", current: false },
  { name: "Inventory Counts", href: moduleBase, current: false },
  { name: "Differences", href: "#", current: true },
];

const invStore = useinventorycountstore();
const whStore = usewarehousestore();
const session = useSessionStore();
const Swal = inject("Swal");
const user = session.getUser;

const countSummaries = reactive([]);
const searchQuery = ref("");

const filteredSummaries = computed(() => {
  const q = (searchQuery.value || "").trim().toLowerCase();
  if (!q) return countSummaries;
  return countSummaries.filter((c) =>
    String(c.countNumber).toLowerCase().includes(q)
  );
});

const load = async () => {
  isLoading.value = true;
  countSummaries.length = 0;
  try {
    const [counts, warehouses] = await Promise.all([
      invStore.get(),
      whStore.get(),
    ]);

    const assignedWarehouse = (warehouses || []).find(
      (w) => String(w.userId) === String(user?.id)
    );
    const allowedWarehouseIds = (warehouses || [])
      .filter((w) => {
        if (assignedWarehouse) return Number(w.id) === Number(assignedWarehouse.id);
        if (!user?.district) return true;
        return w?.district?.Name == user.district;
      })
      .map((w) => Number(w.id));

    const warehouseById = (warehouses || []).reduce((map, w) => {
      map[Number(w.id)] = w;
      return map;
    }, {});

    const countsList = Array.isArray(counts) ? counts : [];
    const summaries = [];

    for (const c of countsList) {
      const cWhId = Number(c.warehouseId || c.warehouse?.id);
      // Admin scoped to one warehouse sees only that warehouse's counts. The
      // scope bypasses the officer-permission filter — an admin has no
      // Warehouse.userId and their district check doesn't apply here, so
      // relying on allowedWarehouseIds would wrongly skip every count.
      if (scopedWarehouseId) {
        if (cWhId !== scopedWarehouseId) continue;
      } else if (!allowedWarehouseIds.includes(cWhId)) {
        continue;
      }

      // Only finalized counts carry persisted counted items.
      const finalized =
        String(c.state || "").toLowerCase() === "saved" ||
        String(c.remarks || "").trim().length > 0;
      if (!finalized) continue;

      const items = c.items || [];
      if (!items.length) continue;

      // One authoritative row per commodity-inventory (latest persisted row),
      // exactly matching what the differences detail page shows — so the
      // "Differences: X" total always equals the number of rows on the detail page.
      const diffCount = dedupeCountItems(items).filter((it) => {
        // Match the Count manage page's expected-quantity fallback (the backend
        // stores the reference under "Quantity"), so the badge matches what the
        // manage page displays.
        const expected = Number(it.expectedQuantity || it.Quantity || it.quantity || 0);
        const counted = Number(it.physicalCount || 0);
        return counted - expected !== 0;
      }).length;

      summaries.push({
        id: c.id,
        countNumber: c.countNumber || c.Notes || ("Inventory " + (c.id || "")),
        countDate: moment(c.CreatedOn || c.createdOn).format("YYYY-MM-DD"),
        createdOn: c.CreatedOn || c.createdOn,
        warehouseName: warehouseById[cWhId]?.Name || "",
        differenceCount: diffCount,
      });
    }

    // Sort newest first, matching the Inventory Counts list behaviour.
    summaries.sort((a, b) =>
      new Date(b.createdOn || 0) - new Date(a.createdOn || 0)
    );
    countSummaries.push(...summaries);
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

