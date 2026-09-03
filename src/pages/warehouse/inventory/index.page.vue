<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div>
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Inventory Counts
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            :to="moduleBase + '/differences' + warehouseQuery"
            style="background-color: #248cd6"
            class="font-body relative inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#096eb4] active:shadow-lg transition duration-100 ease-in-out capitalize"
          >
            Differences
            <span
              v-if="unremarkedDifferences > 0"
              class="absolute -top-2 -right-2 flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full"
            >
              {{ unremarkedDifferences }}
            </span>
          </router-link>

          <button
            @click="createNewCount"
            style="background-color: #248cd6"
            class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#096eb4] active:shadow-lg transition duration-100 ease-in-out capitalize"
          >
            + Create New Count
          </button>
        </div>
      </div>

      <div class="mt-6">
        <div class="space-y-4">
          <div
            v-for="c in counts"
            :key="c.id"
            class="inventory-card bg-white p-4 rounded shadow flex items-center justify-between"
          >
            <div>
              <div class="text-lg font-semibold text-gray-900">
                {{ c.countNumber || c.Notes || ('Inventory ' + (c.id || '')) }}
              </div>

              <div class="text-sm text-gray-500">
                Date: {{ formatDate(c.CreatedOn || c.createdOn) }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm mt-2">
                Status:
                <span class="text-green-600 font-semibold">
                  {{ c.state || c.status || 'Draft' }}
                </span>
              </div>

              <div class="mt-3">
                <router-link
                  :to="`${moduleBase}/${c.id}`"
                  class="inline-block text-sm text-blue-600 hover:underline"
                >
                  View details →
                </router-link>
              </div>
            </div>
          </div>

          <div
            v-if="counts.length === 0"
            class="bg-white p-6 rounded shadow text-center text-gray-600"
          >
            No inventories yet — click Create Inventory to start.
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import moment from "moment";
import { fetchUnremarkedDifferencesCount } from "../../../utils/inventoryDifferences";

const isLoading = ref(false);

// Admins view this module under /admin/warehouse-management/..., warehouse
// officers under /warehouse/inventory-counts/... — derive the base from the
// current path so all internal links stay within the active role's area.
const route = useRoute();
const moduleBase = route.path.startsWith("/admin")
  ? "/admin/warehouse-management/inventory-counts"
  : "/warehouse/inventory-counts";

// When an admin opens the module for a specific warehouse, the warehouse is
// passed as ?warehouseId= — scope everything to that warehouse.
const scopedWarehouseId = route.query.warehouseId ? Number(route.query.warehouseId) : null;
const warehouseQuery = scopedWarehouseId ? `?warehouseId=${scopedWarehouseId}` : "";

const breadcrumbs = [
  {
    name: "Home",
    href: route.path.startsWith("/admin") ? "/admin/dashboard" : "/warehouse/dashboard",
    current: false,
  },
  {
    name: "Inventory Counts",
    href: "#",
    current: true,
  },
];

const session = useSessionStore();
const Swal = inject("Swal");
const user = session.getUser;

const warehouseStore = usewarehousestore();
const store = useinventorycountstore();

const counts = reactive([]);
const unremarkedDifferences = ref(0);

const load = async () => {
  isLoading.value = true;

  try {
    const [result, warehouses] = await Promise.all([
      store.get(),
      warehouseStore.get(),
    ]);

    counts.length = 0;

    if (result && Array.isArray(result)) {
      /*
       * A warehouse officer is attached to one warehouse
       * through Warehouse.userId.
       *
       * Therefore, only counts belonging to the officer's
       * assigned warehouse should be displayed.
       */
      const assignedWarehouse = (warehouses || []).find(
        (w) => String(w.userId) === String(user?.id)
      );

      const allowedWarehouseIds = (warehouses || [])
        .filter((w) => {
          if (assignedWarehouse) {
            return Number(w.id) === Number(assignedWarehouse.id);
          }

          if (!user?.district) {
            return true;
          }

          return w?.district?.Name == user.district;
        })
        .map((w) => Number(w.id));

      const filteredCounts = result.filter((r) => {
        // Admin opening the module for one specific warehouse (via the
        // Warehouse Management landing page) sees only that warehouse.
        if (scopedWarehouseId) {
          return Number(r.warehouseId || r.warehouse?.id) === scopedWarehouseId;
        }
        if (!user?.district) {
          return true;
        }

        return allowedWarehouseIds.includes(
          Number(r.warehouseId || r.warehouse?.id)
        );
      });

      counts.push(
        ...filteredCounts.sort((a, b) => {
          return (
            new Date(b.CreatedOn || b.createdOn || 0) -
            new Date(a.CreatedOn || a.createdOn || 0)
          );
        })
      );

      unremarkedDifferences.value = await fetchUnremarkedDifferencesCount(user, scopedWarehouseId);
    }
  } catch (err) {
    console.error(err);
  }

  isLoading.value = false;
};

onMounted(load);

const formatDate = (d) => {
  return d ? moment(d).format("YYYY-MM-DD") : "";
};

const createNewCount = async () => {
  isLoading.value = true;

  try {
    if (!user?.id) {
      Swal.fire({
        text: "Your session is not active. Please sign in again.",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      isLoading.value = false;
      return;
    }

    const wh = await warehouseStore.get();

    const assignedWarehouse = (wh || []).find(
      (w) => String(w.userId) === String(user?.id)
    );

    const availableWarehouses = (wh || []).filter((w) => {
      if (assignedWarehouse) {
        return Number(w.id) === Number(assignedWarehouse.id);
      }

      if (!user?.district) {
        return true;
      }

      return w?.district?.Name == user.district;
    });

    if (!availableWarehouses.length) {
      Swal.fire({
        text: "Please create a warehouse before creating an inventory count.",
        icon: "warning",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      isLoading.value = false;
      return;
    }

    /*
     * Do NOT generate countNumber here.
     *
     * The backend repository generates it based on
     * the selected warehouse.
     *
     * Example:
     * Warehouse 1 -> COUNT 1, COUNT 2, COUNT 3
     * Warehouse 2 -> COUNT 1, COUNT 2
     */
    const payload = {
      CreatedOn: new Date().toISOString(),
      UpdatedOn: new Date().toISOString(),
      countedById: String(user.id),
      // Admin scoped to a specific warehouse creates the count for it.
      warehouseId: Number(scopedWarehouseId || availableWarehouses[0].id),
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

    Swal.fire({
      text: "Error creating count",
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
</script>

<style scoped>
.btn {
  padding: 8px 12px;
  background: #096eb4;
  color: white;
  border-radius: 6px;
}
</style>