<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="mt-4 md:flex md:items-center md:justify-between">
        <div>
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">{{ countNumber || 'Count' }} — Differences</h2>
          <p class="text-sm text-white mt-1">
            Expected quantities are compared against {{ baselineText }}.
            Showing {{ differences.length }} of {{ totalItems }} counted item(s).
          </p>
        </div>
      </div>

      <div class="mt-4 flex justify-start">
        <router-link
          to="/warehouse/inventory-counts/differences"
          class="inline-flex items-center text-sm font-medium text-white hover:text-blue-700"
        >
          <ChevronLeftIcon
            class="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
          Back to all counts
        </router-link>
      </div>

      <div class="mt-4" v-if="differences.length > 0">
        <input
          v-model="searchQuery"
          placeholder="Search by commodity or batch no…"
          class="w-full p-2 border rounded bg-white"
        />
      </div>

      <div class="mt-6 bg-white rounded shadow overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left text-xs text-gray-600 uppercase">
            <tr>
              <th class="px-4 py-3">Commodity</th>
              <th class="px-4 py-3">Batch</th>
              <th class="px-4 py-3 text-right">Expected</th>
              <th class="px-4 py-3 text-right">Counted</th>
              <th class="px-4 py-3 text-right">Difference</th>
              <th class="px-4 py-3">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in filteredDifferences" :key="i" class="border-t">
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
              <td class="px-4 py-3 text-sm text-gray-700">
                  <div v-if="d.remark" class="mb-1">{{ d.remark }}</div>

                  <!-- No remark yet: the officer can add one directly. -->
                  <button
                    v-if="!d.remark"
                    type="button"
                    @click="openRemarkModal(d)"
                    class="add-remark-btn"
                  >
                    + Add Remarks
                  </button>

                  <!-- Remark exists: officers cannot edit; they can only request an edit. -->
                  <button
                    v-else-if="!d.editRequested"
                    type="button"
                    @click="requestEdit(d)"
                    class="text-orange-500 hover:text-orange-700 transition duration-300"
                  >
                    <PencilIcon class="h-5 w-5 inline-block" />
                    Request Edit
                  </button>

                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"
                  >
                    <span>edit requested</span>
                  </span>
                </td>
            </tr>
            <tr v-if="filteredDifferences.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                {{
                  differences.length === 0
                    ? 'No differences found for this count.'
                    : 'No items match your search.'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="isRemarkModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      @click.self="closeRemarkModal"
    >
      <div class="w-full max-w-2xl rounded bg-white shadow-xl">
        <div class="border-b px-5 py-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedRow?.remark ? 'Edit Remark' : 'Add Remark' }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ selectedRow?.commodity }}</p>
        </div>

        <div class="space-y-4 px-5 py-4">
          <div>
            <label for="remark" class="block text-sm font-medium text-gray-700">
              Reason for the difference
            </label>
            <textarea
              id="remark"
              v-model="remarkInput"
              rows="3"
              :placeholder="'Reason for the difference on ' + (selectedRow?.commodity || 'this commodity')"
              class="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t px-5 py-4">
          <button type="button" class="px-3 py-2 text-sm text-gray-700" @click="closeRemarkModal">Cancel</button>
          <button type="button" class="btn" :disabled="isLoading" @click="saveRemark">Save</button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { ChevronLeftIcon, PencilIcon } from "@heroicons/vue/solid";
import moment from "moment";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import eventBus from "../../../services/events/eventbus";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import { dedupeCountItems } from "../../../utils/inventoryDifferences";

const route = useRoute();
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/warehouse/dashboard", current: false },
  { name: "Inventory Counts", href: "/warehouse/inventory-counts", current: false },
  { name: "Differences", href: "/warehouse/inventory-counts/differences", current: false },
  { name: "Details", href: "#", current: true },
];

const invStore = useinventorycountstore();
const whStore = usewarehousestore();
const session = useSessionStore();
const Swal = inject("Swal");
const user = session.getUser;

const countNumber = ref("");
const baselineText = ref("");
const totalItems = ref(0);
const differences = reactive([]);
const searchQuery = ref("");
const recordId = ref(route.params.id || "");
const isRemarkModalOpen = ref(false);
const selectedRow = ref(null);
const remarkInput = ref("");

const filteredDifferences = computed(() => {
  const q = (searchQuery.value || "").trim().toLowerCase();
  if (!q) return differences;
  return differences.filter(
    (d) =>
      String(d.commodity).toLowerCase().includes(q) ||
      String(d.BatchNumber || "").toLowerCase().includes(q)
  );
});

const parseCountNumber = (str) => {
  const m = String(str || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
};

const openRemarkModal = (d) => {
  selectedRow.value = d;
  remarkInput.value = d.remark || "";
  isRemarkModalOpen.value = true;
};

const closeRemarkModal = () => {
  isRemarkModalOpen.value = false;
  selectedRow.value = null;
  remarkInput.value = "";
};

// Officers cannot edit an existing remark directly. Following the same
// pattern as "Request Reversal" on receipts, they can only flag the remark
// for an administrator to review and edit it.
const requestEdit = async (d) => {
  const result = await Swal.fire({
    title: "Request Edit",
    text: `Submit a request to edit the remark for ${d.commodity}? An administrator will review it.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Send Request",
    confirmButtonColor: "#096eb4",
    cancelButtonText: "Cancel",
  });
  if (!result.isConfirmed) return;

  d.editRequested = true;

  Swal.fire({
    text: "Edit request submitted. An administrator will review the remark.",
    icon: "success",
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

const saveRemark = async () => {
  const row = selectedRow.value;
  const remark = (remarkInput.value || "").trim();
  if (!row) return;
  if (!remark) {
    Swal.fire({
      text: "Please provide a remark before saving.",
      icon: "warning",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    return;
  }

  isLoading.value = true;
  try {
    row.remark = remark;

    // Persist remarks on the count record using the existing endpoint. The
    // combined remarks string is keyed by commodity name, so changing any
    // difference's remark rebuilds it from all the rows currently shown.
    const remarks = differences
      .filter((d) => (d.remark || "").trim())
      .map((d) => `${d.commodity}: ${d.remark.trim()}`)
      .join("\n");

    await invStore.update({
      id: Number(recordId.value),
      remarks,
      UpdatedOn: new Date().toISOString(),
      state: "Saved",
    });

    // Notify the layout so the header notification badge and the index page
    // Differences counter re-compute (this remark no longer counts as pending).
    eventBus.emit("inventoryDifferencesUpdated");
    closeRemarkModal();
    Swal.fire({
      text: "Remark saved successfully.",
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      text: "Error saving remark",
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
    const rec = await invStore.getOne(route.params.id);
    if (!rec) return;

    countNumber.value = rec.countNumber || rec.Notes || ("Inventory " + (rec.id || ""));
    const bNum = parseCountNumber(countNumber.value);
    baselineText.value =
      bNum > 1
        ? `previous count physical quantities (COUNT ${bNum - 1})`
        : "initial warehouse stock (COUNT 0)";

    const items = dedupeCountItems(rec.items || []);
    totalItems.value = items.length;
    if (!items.length) return;

    const cWhId = Number(rec.warehouseId || rec.warehouse?.id);
    const inventories = await getWarehouseInventories(cWhId);
    const inventoryById = (inventories || []).reduce((map, inv) => {
      map[String(inv.id)] = inv;
      return map;
    }, {});

    const remarkMap = parseRemarks(rec.remarks);
    const countDate = moment(rec.CreatedOn || rec.createdOn).format("YYYY-MM-DD");
    const rows = [];

    items.forEach((it) => {
      // The backend stores the expected/reference quantity under "Quantity"
      // (LoopBack field), so match the Count manage page's fallback logic:
      // expectedQuantity OR Quantity. Otherwise a saved item with no
      // expectedQuantity field would be read as 0 and create phantom differences.
      const expected = Number(it.expectedQuantity || it.Quantity || it.quantity || 0);
      const counted = Number(it.physicalCount || 0);
      const difference = Number((counted - expected).toFixed(3));
      if (difference === 0) return;

      const inventory = inventoryById[String(it.commodityInventoryId)];
      const commodity = inventory?.commodity || null;
      const name = commodity?.Name || it.commodityName || "Unknown commodity";

      rows.push({
        itemId: it.id || null,
        countNumber: countNumber.value,
        countDate,
        commodity: name,
        container: commodity?.Container_type || "",
        BatchNumber: it.BatchNumber || "",
        expected,
        counted,
        difference,
        // Per-item remark is the source of truth; fall back to the legacy
        // combined remarks string for counts created before item remarks existed.
        remark: String(it.remark || "").trim() || remarkMap[name] || "",
      });
    });

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
.btn { padding: 8px 12px; background: #096eb4; color: white; border-radius: 6px; }
.add-remark-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: #096eb4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.add-remark-btn:hover { background: #086aa6; }
</style>