<template>
  <main>
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="mt-4">
        <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
          Warehouse Management
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Select a warehouse to view its Inventory Counts and Differences.
        </p>
      </div>

      <div class="mt-4" v-if="warehouses.length > 0">
        <input
          v-model="searchQuery"
          placeholder="Search by warehouse name…"
          class="w-full p-2 border rounded bg-white"
        />
      </div>

      <div class="mt-6">
        <div class="space-y-4" v-if="filteredWarehouses.length > 0">
          <div
            v-for="w in filteredWarehouses"
            :key="w.id"
            class="bg-white p-4 rounded shadow flex items-center justify-between"
          >
            <div>
              <div class="text-lg font-semibold text-gray-900">
                {{ w.Name || w.name || ('Warehouse ' + w.id) }}
              </div>
              <div class="text-sm text-gray-500" v-if="w.district?.Name">
                District: {{ w.district.Name }}
              </div>
            </div>

            <div class="text-right">
              <router-link
                :to="`/admin/warehouse-management/inventory-counts?warehouseId=${w.id}`"
                class="inline-block text-sm text-blue-600 hover:underline"
              >
                Inventory Counts →
              </router-link>
            </div>
          </div>
        </div>

        <div
          v-else
          class="bg-white p-6 rounded shadow text-center text-gray-600"
        >
          No warehouses found.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from "vue";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { usewarehousestore } from "../../../stores/warehouse.store";

const isLoading = ref(false);
const Swal = inject("Swal");
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Warehouse Management", href: "#", current: true },
];

const whStore = usewarehousestore();

const warehouses = reactive([]);
const searchQuery = ref("");

const filteredWarehouses = computed(() => {
  const q = (searchQuery.value || "").trim().toLowerCase();
  if (!q) return warehouses;
  return warehouses.filter((w) =>
    String(w.Name || w.name || "").toLowerCase().includes(q)
  );
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const result = await whStore.get();
    warehouses.push(...(Array.isArray(result) ? result : []));
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Warehouse Retrieval Failed",
      text: "Failed to get warehouses (Please refresh to try again)",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
  isLoading.value = false;
});
</script>
