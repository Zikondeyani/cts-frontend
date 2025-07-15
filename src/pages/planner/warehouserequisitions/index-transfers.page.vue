<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-white text-2xl">
            Warehouse Stock Transfers
          </h2>
        </div>

        <div class="mt-5 flex ml-4 sm:mt-0">
          <button
            @click="exportToExcel"
            class="font-body inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          >
            Export to Excel
          </button>
        </div>
      </div>

         <TransitionRoot appear :show="showViewModal" as="template">
          <Dialog as="div" class="relative z-10" @close="showViewModal = false">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in duration-200"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      Stock Transfer Details
                    </DialogTitle>

                    <div class="mt-4 space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Action Requestor:</strong>
                        {{ selectedTransfer?.actionrequestors?.name || "N/A" }}
                      
                      </p>
                      <p>
                        <strong>Quantity:</strong>
                        {{ selectedTransfer?.quantity }}
                        {{
                          selectedTransfer?.commodityInventory?.commodity
                            ?.Container_type
                        }}
                      </p>
                      <p>
                        <strong>Commodity:</strong>
                        {{
                          selectedTransfer?.commodityInventory?.commodity?.Name
                        }}
                      </p>
                      <p>
                        <strong>From:</strong>
                        {{ selectedTransfer?.fromwarehouse?.Name }}
                      </p>
                      <p>
                        <strong>To:</strong>
                        {{ selectedTransfer?.towarehouse?.Name }}
                      </p>
                      <p>
                        <strong>Comments:</strong>
                        {{ selectedTransfer?.comments || "N/A" }}
                      </p>
                      <p>
                        <strong>Approved:</strong>
                        {{ selectedTransfer?.IsApproved ? "Yes" : "No" }}
                      </p>
                      <p>
                        <strong>Received:</strong>
                        {{ selectedTransfer?.IsReceived ? "Yes" : "No" }}
                      </p>
                    </div>

                    <div class="mt-6 flex justify-end">
                      <button
                        type="button"
                        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                        @click="showViewModal = false"
                      >
                        Close
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>


      <section class="bg-transparent mt-6 rounded-table">
     
        <div class="container mx-auto min-w-full shadow-xl rounded-table">
          <div class="overflow-x-auto">
            <vue-good-table
              :columns="columns"
              :rows="stocktransfers"
              :search-options="{ enabled: true }"
              :pagination-options="{ enabled: true }"
              style="font-weight: bold; color: #096eb4"
              theme="polar-bear"
              styleClass="vgt-table striped"
              compactMode
            >
              <template #table-row="props">
                <div
                  v-if="props.column.label === 'Options'"
                  class="flex gap-2 flex-wrap"
                >
                  <!-- View -->

                  <!-- View Button -->
                  <button
                    @click="openViewTransfer(props.row)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-green-500 text-green-500 font-semibold text-xs rounded-md hover:bg-green-500 hover:text-white"
                  >
                    <DocumentIcon class="h-4 w-4 mr-1" />
                    View
                  </button>

                  <button
                    v-if="!props.row.IsApproved"
                    @click="approveTransfer(props.row)"
                    class="font-heading inline-flex items-center px-2 py-1 border border-yellow-500 text-yellow-500 font-semibold text-xs rounded-md hover:bg-yellow-500 hover:text-white"
                  >
                    <CheckCircleIcon class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                </div>
              </template>
            </vue-good-table>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { DocumentIcon, TrashIcon, CheckCircleIcon } from "@heroicons/vue/solid";
import * as XLSX from "xlsx";

import spinnerWidget from "@/components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "@/components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { usecommoditytransfersservice } from "@/stores/commoditytransfters.store";
import { useSessionStore } from "@/stores/session.store";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";


const Swal = inject("Swal");
const stocktransfersStore = usecommoditytransfersservice();
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const isLoading = ref(false);
const router = useRouter();

const stocktransfers = reactive([]);
const breadcrumbs = [
  { name: "Home", href: "/planner/dashboard", current: false },
  { name: "Warehouse", href: "#", current: true },
  { name: "Stock Transfers", href: "#", current: true },
];

const columns = ref([
  { label: "#", field: (row) => row.originalIndex + 1 },
  {
    label: "Quantity",
    field: (row) =>
      row.quantity + " " + row.commodityInventory?.commodity?.Container_type ||
      "N/A",
  },
  { label: "From Warehouse", field: (row) => row.fromwarehouse?.Name || "N/A" },
  { label: "To Warehouse", field: (row) => row.towarehouse?.Name || "N/A" },
  {
    label: "Commodity",
    field: (row) => row.commodityInventory?.commodity?.Name || "N/A",
  },
  { label: "Approved", field: (row) => (row.IsApproved ? "Yes" : "No") },
  { label: "Received", field: (row) => (row.IsReceived ? "Yes" : "No") },
  { label: "Options", field: (row) => row },
]);

onMounted(async () => {
  await getstocktransfers();
});

const showViewModal = ref(false);
const selectedTransfer = ref(null);

const openViewTransfer = (row) => {
  selectedTransfer.value = row;
  showViewModal.value = true;


};

const getstocktransfers = async () => {
  isLoading.value = true;
  try {
    const data = await stocktransfersStore.get();
    stocktransfers.splice(0, stocktransfers.length, ...data);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const exportToExcel = () => {
  const formattedData = stocktransfers.map((row, index) => ({
    "#": index + 1,
    Quantity: row.quantity || 0,
    "From Warehouse": row.fromwarehouse?.Name || "N/A",
    "To Warehouse": row.towarehouse?.Name || "N/A",
    Commodity: row.commodityInventory?.commodity?.Name || "N/A",
    Comments: row.comments || "",
    Approved: row.IsApproved ? "Yes" : "No",
    Received: row.IsReceived ? "Yes" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Transfers");

  XLSX.writeFile(workbook, "Warehouse_Stock_Transfers.xlsx");
};

const approveTransfer = async (row) => {
  const confirmed = await Swal.fire({
    title: "Approve Transfer?",
    text: "Are you sure you want to approve this stock transfer?",
    icon: "question",
    showCancelButton: true,
  });

  if (confirmed.isConfirmed) {
    try {
      await stocktransfersStore.update({ id: row.id, IsApproved: true });
      await getstocktransfers();
      Swal.fire("Approved!", "", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Approval failed", "error");
    }
  }
};

const deleteTransfer = async (id) => {
  const confirmed = await Swal.fire({
    title: "Delete Transfer?",
    text: "Are you sure you want to delete this record?",
    icon: "warning",
    showCancelButton: true,
  });

  if (confirmed.isConfirmed) {
    try {
      await stocktransfersStore.remove(id);
      await getstocktransfers();
      Swal.fire("Deleted!", "", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Deletion failed", "error");
    }
  }
};
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
.btn {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50;
}
</style>
