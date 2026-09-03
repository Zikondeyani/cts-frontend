<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-4xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="mt-4 md:flex md:items-center md:justify-between">
        <div>
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">{{ countNumber || 'Count' }} — Differences</h2>
          <p class="text-sm text-white mt-1" v-if="warehouseName">
            Warehouse: <span class="font-semibold">{{ warehouseName }}</span>
          </p>
          <p class="text-sm text-white mt-1">
            Expected quantities are compared against {{ baselineText }}.
            Showing {{ differences.length }} of {{ totalItems }} counted item(s).
          </p>
        </div>

        <button v-if="differences.length > 0" type="button"
          class="font-body mt-3 md:mt-0 inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
          @click="exportDifferences()">
          <i class="fas fa-file-export mr-2"></i>
          Export
        </button>
      </div>

      <div class="mt-4 flex justify-start">
        <router-link
          :to="moduleBase + '/differences' + warehouseQuery"
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

                  <!-- No remark yet: it can be added directly. -->
                  <button
                    v-if="!d.remark"
                    type="button"
                    @click="openRemarkModal(d)"
                    class="add-remark-btn"
                  >
                    + Add Remarks
                  </button>

                  <template v-else>
                    <!-- Pending officer edit request: badge shown to everyone. -->
                    <span
                      v-if="d.editRequest"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 mb-1"
                    >
                      <span>edit requested</span>
                    </span>

                    <!-- Admin: Edit always; View Request / Approve appear only
                         when an officer has submitted an edit request. -->
                    <template v-if="isAdmin">
                      <template v-if="d.editRequest">
                        <button
                          type="button"
                          @click="viewRequest(d)"
                          class="text-blue-500 hover:text-blue-400 transition duration-300 mr-3"
                        >
                          <EyeIcon class="h-5 w-5 inline-block mr-1" />
                          View Request
                        </button>
                        <button
                          type="button"
                          @click="approveRequest(d)"
                          class="text-green-600 hover:text-green-700 transition duration-300 mr-3"
                        >
                          <CheckIcon class="h-5 w-5 inline-block mr-1" />
                          Approve
                        </button>
                      </template>
                      <button
                        type="button"
                        @click="openEditModal(d)"
                        class="text-orange-500 hover:text-orange-700 transition duration-300"
                      >
                        <PencilIcon class="h-5 w-5 inline-block" />
                        Edit
                      </button>
                    </template>

                    <!-- Officer with no pending request: request an edit. -->
                    <button
                      v-else-if="!d.editRequest"
                      type="button"
                      @click="requestEdit(d)"
                      class="text-orange-500 hover:text-orange-700 transition duration-300"
                    >
                      <PencilIcon class="h-5 w-5 inline-block" />
                      Request Edit
                    </button>
                  </template>
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
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isRequestMode ? 'Request Edit' : (selectedRow?.remark ? 'Edit Remark' : 'Add Remark') }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ selectedRow?.commodity }}</p>
          <p class="mt-1 text-xs text-gray-500" v-if="isRequestMode && selectedRow?.remark">
            Current remark: {{ selectedRow.remark }}
          </p>
        </div>

        <div class="space-y-4 px-5 py-4">
          <div>
            <label for="remark" class="block text-sm font-medium text-gray-700">
              {{ isRequestMode ? 'Proposed new remark' : 'Reason for the difference' }}
            </label>
            <textarea
              id="remark"
              v-model="remarkInput"
              rows="3"
              :placeholder="isRequestMode
                ? 'Enter the new remark you are requesting...'
                : 'Reason for the difference on ' + (selectedRow?.commodity || 'this commodity')"
              class="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500" v-if="isRequestMode">
              Your request will be reviewed by an administrator before the remark is updated.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t px-5 py-4">
          <button type="button" class="px-3 py-2 text-sm text-gray-700" @click="closeRemarkModal">Cancel</button>
          <button type="button" class="btn" :disabled="isLoading" @click="saveRemark">
            {{ isRequestMode ? 'Submit Request' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import {
  ChevronLeftIcon,
  PencilIcon,
  EyeIcon,
  CheckIcon,
} from "@heroicons/vue/solid";
import moment from "moment";
import * as XLSX from "xlsx";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import eventBus from "../../../services/events/eventbus";
import { useinventorycountstore } from "../../../stores/inventorycounts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { useSessionStore } from "@/stores/session.store";
import { dedupeCountItems } from "../../../utils/inventoryDifferences";

const route = useRoute();
const isLoading = ref(false);

// Admins view this module under /admin/warehouse-management/..., warehouse
// officers under /warehouse/inventory-counts/... — derive the base from the
// current path so all internal links stay within the active role's area.
const moduleBase = route.path.startsWith("/admin")
  ? "/admin/warehouse-management/inventory-counts"
  : "/warehouse/inventory-counts";

// Preserve the ?warehouseId= scope (admin Warehouse Management view) when
// navigating back to the differences list.
const warehouseQuery = route.query.warehouseId
  ? `?warehouseId=${route.query.warehouseId}`
  : "";

const breadcrumbs = [
  { name: "Home", href: route.path.startsWith("/admin") ? "/admin/dashboard" : "/warehouse/dashboard", current: false },
  { name: "Inventory Counts", href: moduleBase, current: false },
  { name: "Differences", href: moduleBase + "/differences", current: false },
  { name: "Details", href: "#", current: true },
];

const invStore = useinventorycountstore();
const whStore = usewarehousestore();
const session = useSessionStore();
const Swal = inject("Swal");
const user = session.getUser;
// Warehouse name shown in the header (admin Warehouse Management view).
const warehouseName = ref("");

const countNumber = ref("");
const baselineText = ref("");
const totalItems = ref(0);
const differences = reactive([]);
const searchQuery = ref("");
const recordId = ref(route.params.id || "");
const isRemarkModalOpen = ref(false);
const selectedRow = ref(null);
const remarkInput = ref("");
// When true, the open modal is an officer's edit REQUEST (proposed remark that
// needs admin approval) rather than a direct remark edit.
const isRequestMode = ref(false);

// Admins can view/approve edit requests and edit remarks directly; warehouse
// officers can only add remarks and request edits.
const isAdmin = computed(
  () =>
    route.path.startsWith("/admin") ||
    String(user?.value?.roleId || "") === "ADMIN1"
);

// Same name shown on the dashboard: the username with dots turned into spaces.
// NOTE: `user` here is the plain session object (not a ref), matching how the
// rest of this page and the warehouse dashboard read it.
const displayName = (
  user?.username ||
  user?.userName ||
  user?.name ||
  user?.Name ||
  "a warehouse officer"
).replace(/\./g, " ");

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
  isRequestMode.value = false;
  remarkInput.value = "";
  isRemarkModalOpen.value = true;
};

// Officer requests an edit of an existing remark: they propose a new remark
// which an administrator must approve before it takes effect.
const openRequestModal = (d) => {
  selectedRow.value = d;
  isRequestMode.value = true;
  remarkInput.value = "";
  isRemarkModalOpen.value = true;
};

// Admin edits the remark directly (ignoring any pending request).
const openEditModal = (d) => {
  selectedRow.value = d;
  isRequestMode.value = false;
  remarkInput.value = "";
  isRemarkModalOpen.value = true;
};

const closeRemarkModal = () => {
  isRemarkModalOpen.value = false;
  selectedRow.value = null;
  remarkInput.value = "";
  isRequestMode.value = false;
};

// Officers cannot edit an existing remark directly. Following the same
// pattern as "Request Reversal" on receipts, they submit an edit request with
// their proposed remark, which an administrator reviews and approves.
const requestEdit = (d) => openRequestModal(d);

// Admin reviews the pending edit request (current remark vs proposed remark).
const viewRequest = (d) => {
  if (!d.editRequest) {
    Swal.fire({
      text: "There is no pending edit request for this remark.",
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#096eb4",
    });
    return;
  }
  Swal.fire({
    title: "Edit Request",
    html:
      `<div style="text-align:left">` +
      `<p><strong>Commodity:</strong> ${d.commodity}</p>` +
      `<p><strong>Requested by:</strong> ${d.editRequest?.by || "Unknown"}</p>` +
      `<p><strong>Current remark:</strong></p>` +
      `<p style="background:#f9fafb;padding:8px;border-radius:6px;">${d.remark || "—"}</p>` +
      `<p><strong>Proposed remark:</strong></p>` +
      `<p style="background:#fff7ed;padding:8px;border-radius:6px;">${d.editRequest?.proposed || "—"}</p>` +
      `</div>`,
    icon: "info",
    confirmButtonText: "Close",
    confirmButtonColor: "#096eb4",
  });
};

// Admin approves the request: the proposed remark becomes the remark and the
// pending request is cleared. The officer sees the new remark with no request.
const approveRequest = async (d) => {
  const result = await Swal.fire({
    title: "Approve edit request?",
    text: `The remark for ${d.commodity} will be updated to the proposed remark.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Approve",
    confirmButtonColor: "#096eb4",
    cancelButtonText: "Cancel",
  });
  if (!result.isConfirmed) return;

  isLoading.value = true;
  try {
    d.remark = (d.editRequest?.proposed || "").trim();
    d.editRequest = null;
    await persistRemarks();
    Swal.fire({
      text: "Edit request approved. The remark has been updated.",
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
      text: "Error approving edit request",
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

const saveRemark = async () => {
  const row = selectedRow.value;
  const remark = (remarkInput.value || "").trim();
  if (!row) return;
  if (!remark) {
    Swal.fire({
      text: isRequestMode.value
        ? "Please provide the proposed remark before submitting the request."
        : "Please provide a remark before saving.",
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
    if (isRequestMode.value) {
      // Officer's edit request: keep the current remark but record the
      // proposed one for the administrator to approve.
      row.editRequest = { by: displayName, proposed: remark };
    } else {
      // Direct save (new remark by anyone, or admin editing an existing one).
      row.remark = remark;
      row.editRequest = null;
    }

    await persistRemarks();
    eventBus.emit("inventoryDifferencesUpdated");
    closeRemarkModal();
    Swal.fire({
      text: isRequestMode.value
        ? "Edit request submitted. An administrator will review the remark."
        : "Remark saved successfully.",
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

// Persists the remarks of all difference rows on this count via the existing
// PATCH /inventorycounts/{id} endpoint (no dedicated endpoint needed). A row
// with a pending edit request is stored as:
//   "Commodity: current remark | [EDIT_REQUEST by John] proposed remark"
const buildRemarksString = () =>
  differences
    .filter((d) => (d.remark || "").trim() || d.editRequest)
    .map((d) => {
      const base = (d.remark || "").trim();
      if (d.editRequest) {
        return `${d.commodity}: ${base} | [EDIT_REQUEST by ${d.editRequest.by || ""}] ${d.editRequest.proposed}`;
      }
      return `${d.commodity}: ${base}`;
    })
    .join("\n");

const persistRemarks = async () => {
  await invStore.update({
    id: Number(recordId.value),
    remarks: buildRemarksString(),
    UpdatedOn: new Date().toISOString(),
    state: "Saved",
  });
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

// The remark store keeps one line per difference: "CommodityName: remark".
// A pending officer edit request is stored on the same line as:
//   "CommodityName: remark | [EDIT_REQUEST by John] proposed remark"
const parseRemarks = (remarks) => {
  const map = {};
  String(remarks || "")
    .split("\n")
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx < 1) return;
      const name = line.slice(0, idx).trim();
      let rest = line.slice(idx + 1).trim();
      let request = null;
      const m = rest.match(
        /^(.*?)\s*\|\s*\[EDIT_REQUEST(?:\s+by\s+([^\]]+))?\]\s*([\s\S]*)$/
      );
      if (m) {
        rest = m[1].trim();
        request = { by: (m[2] || "").trim(), proposed: m[3].trim() };
      }
      if (name) map[name] = { remark: rest, request };
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

    const cWhId = Number(rec.warehouseId || rec.warehouse?.id);
    // Warehouse name for the header (visible to the admin in the
    // Warehouse Management view).
    try {
      const warehouses = (await whStore.get()) || [];
      warehouseName.value =
        warehouses.find((w) => Number(w.id) === cWhId)?.Name || "";
    } catch (e) {
      warehouseName.value = "";
    }

    const items = dedupeCountItems(rec.items || []);
    totalItems.value = items.length;
    if (!items.length) return;

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

      const stored = remarkMap[name];
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
        remark: String(it.remark || "").trim() || stored?.remark || "",
        // Pending officer edit request parsed from the remarks string.
        editRequest: stored?.request || null,
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

// Exports the differences of THIS count to an Excel file, following the same
// XLSX pattern used by the other export buttons in the app.
const exportDifferences = () => {
  if (differences.length === 0) {
    Swal.fire({
      text: "There are no differences to export for this count.",
      icon: "info",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    return;
  }

  const wb = XLSX.utils.book_new();
  const data = (filteredDifferences.value || differences).map((d) => ({
    "Count Number": d.countNumber,
    Date: d.countDate,
    Commodity: d.commodity,
    Container: d.container || "",
    "Batch Number": d.BatchNumber || "",
    "Expected Quantity": Number(d.expected || 0).toFixed(3),
    "Counted Quantity": Number(d.counted || 0).toFixed(3),
    Difference: Number(d.difference || 0).toFixed(3),
    Remark: d.remark || "",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Count Differences");
  XLSX.writeFile(wb, `${countNumber.value || "Count"}_Differences.xlsx`);
};
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