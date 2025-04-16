<template>
  <main>
    <spinner-widget :open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <div class="md:flex md:items-center md:justify-between mt-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-white text-2xl">
            Warehouse Requisitions Dispatches
          </h2>
        </div>

        <!-- <div class="mt-5 flex ml-4 sm:mt-0">
          <create-report-form @create="createReport" />
        </div> -->
      </div>

      <section class="bg-transparent mt-6 rounded-table">
        <div class="container mx-auto min-w-full shadow-xl rounded-table">
          <div class="overflow-x-auto">
            <vue-good-table
              :columns="columns"
              :rows="dispatches"
              :search-options="{ enabled: true }"
              :pagination-options="{ enabled: true }"
              style="font-weight: bold; color: #096eb4"
              theme="polar-bear"
              styleClass="vgt-table striped"
              compactMode
            >
            </vue-good-table>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch, inject, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  DocumentIcon,
  TrashIcon,
  TruckIcon,
  CheckCircleIcon,
} from "@heroicons/vue/solid";

import spinnerWidget from "@/components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "@/components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createReportForm from "@/components/pages/reports/create.component-warehousereq.vue";
import { useWarehouseRequisitionsStore } from "@/stores/warehouserequisition.store";
import { useWarehouseDispatchesStore } from "@/stores/warehousedispatches.store";

import { usedistrictstore } from "@/stores/districts.store";

const Swal = inject("Swal");
import { useSessionStore } from "@/stores/session.store";
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
import html2pdf from "html2pdf.js";
const WarehouseRequisitionStore = useWarehouseRequisitionsStore();

const WarehouseDispathcesStore = useWarehouseDispatchesStore();

const districtstore = usedistrictstore();
const districts = reactive([]);

const dispatches = reactive([]);
const router = useRouter();
const selectedLetter = ref(null);

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/planner/dashboard", current: false },
  { name: "Requisitions", href: "#", current: true },
  { name: "Warehouse", href: "#", current: true },
];
const columns = ref([
  { label: "#", field: (row) => row.originalIndex + 1 },
  {
    label: "Document Ref #",
    field: (row) => row.warehouserequisitions?.referenceNumber,
  },
  { label: "Commodity", field: (row) => row.commodity?.Name },
  { label: "FDP", field: (row) => row.FinalDestinationPoint },
  {
    label: "Quantity",
    field: (row) => `${row.Quantity} ${row.commodity?.Container_type}`,
    sortable: true,
    firstSortType: "asc",
  },
]);
const loadingplans = reactive([]);
// Props
const props = defineProps({
  showLetterModal: Boolean,
  selectedLetter: Object,
});

// Emits
const emit = defineEmits(["update:showLetterModal"]);

// Function to close modal
const showLetterModal = ref(props.showLetterModal);
watch(
  () => props.showLetterModal,
  (val) => (showLetterModal.value = val)
);
watch(showLetterModal, (val) => emit("update:showLetterModal", val));

// PDF Download
const downloadPDF = () => {
  const element = document.getElementById("letterContent");
  html2pdf()
    .set({
      margin: 1,
      filename: "Warehouse_Requisition_Letter.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(element)
    .save();
};

onMounted(async () => {
  await getDispatches();
  await getLoadingplans();
  await getDistricts();
});

const getDistricts = async () => {
  isLoading.value = true;
  try {
    const data = await districtstore.get();
    districts.splice(0, districts.length, ...data);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const getDispatches = async () => {
  isLoading.value = true;
  try {
    const data = await WarehouseDispathcesStore.get();
    dispatches.splice(
      0,
      dispatches.length,
      ...data.reverse() // to prevent mutating the original array
    );

    console.log(dispatches, "ddddd");
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const getLoadingplans = async () => {
  isLoading.value = true;
  try {
    const data = await WarehouseRequisitionStore.get();
    loadingplans.splice(
      0,
      loadingplans.length,
      ...data
        .filter(
          ({ warehouse, isClosed }) =>
            warehouse?.district?.Name === user.value.district && !isClosed
        )
        .slice()
        .reverse() // to prevent mutating the original array
    );
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const createReport = async (reportData) => {
  isLoading.value = true;
  try {
    await WarehouseRequisitionStore.create(reportData);
    await getLoadingplans();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async (id) => {
  const confirm = window.confirm("Delete this requisition?");
  if (!confirm) return;
  try {
    await WarehouseRequisitionStore.remove(id);
    await getLoadingplans();
  } catch (e) {
    console.error(e);
  }
};

const openViewLetterModal = (row) => {
  selectedLetter.value = row;
  showLetterModal.value = true;
};

const showDispatchModal = ref(false);
const selectedRequisition = ref(null);

const openDispatchDialog = (row) => {
  selectedRequisition.value = row;
  showDispatchModal.value = true;
};

const closeDispatchDialog = () => {
  showDispatchModal.value = false;
};
const getRemainingBalance = (commodityId) => {
  const reqItem = selectedRequisition.value.items.find(
    (item) => item.commodity.id === commodityId
  );
  return reqItem?.balance ?? 0;
};

const dispatchForm = reactive({
  DeliveryNote: "",
  DriverName: "",
  DriverLicense: "",
  FinalDestinationPoint: "",
  TruckNumber: "",
  PhoneNumber: "",
  Date: "",
  districtId: "",
  items: [],
});

const addItem = () => {
  dispatchForm.items.push({ commodityId: null, quantity: null });
};

const removeItem = (index) => {
  dispatchForm.items.splice(index, 1);
};

const submitDispatch = async () => {
  // Check if at least one item exists
  if (!dispatchForm.items || dispatchForm.items.length === 0) {
    Swal.fire({
      title: "No Items",
      text: "Please add at least one item to dispatch.",
      icon: "warning",
    });
    return;
  }

  // Check for duplicates
  const commodityIds = dispatchForm.items.map((item) => item.commodityId);
  const uniqueIds = new Set(commodityIds);
  if (commodityIds.length !== uniqueIds.size) {
    Swal.fire({
      title: "Duplicate Commodities",
      text: "Each item must have a unique commodity.",
      icon: "warning",
    });
    return;
  }

  // Check if all required base fields are filled
  const requiredFields = [
    "DeliveryNote",
    "FinalDestinationPoint",
    "Date",
    "DriverName",
    "DriverLicense",
    "PhoneNumber",
    "TruckNumber",
    "districtId",
  ];
  const missingField = requiredFields.find((field) => !dispatchForm[field]);
  if (missingField) {
    Swal.fire({
      title: "Missing Info",
      text: "Please complete all dispatch details before submitting.",
      icon: "warning",
    });
    return;
  }

  // Validate each item
  const invalidItem = dispatchForm.items.find(
    (item) => !item.commodityId || !item.quantity || item.quantity <= 0
  );
  if (invalidItem) {
    Swal.fire({
      title: "Invalid Item",
      text: "All items must have a selected commodity and a quantity greater than 0.",
      icon: "warning",
    });
    return;
  }

  // ✅ Check if any quantity exceeds the item's balance
  const overLimitItem = dispatchForm.items.find((item) => {
    const remaining = getRemainingBalance(item.commodityId);
    return item.quantity > remaining;
  });
  if (overLimitItem) {
    Swal.fire({
      title: "Quantity Exceeded",
      text: "One or more items exceed the allowed remaining balance.",
      icon: "warning",
    });
    return;
  }

  // Proceed with dispatch creation
  const baseDispatchDetails = {
    DeliveryNote: dispatchForm.DeliveryNote,
    FinalDestinationPoint: dispatchForm.FinalDestinationPoint,
    Date: dispatchForm.Date,
    DriverName: dispatchForm.DriverName,
    DriverLicense: dispatchForm.DriverLicense,
    PhoneNumber: dispatchForm.PhoneNumber,
    TruckNumber: dispatchForm.TruckNumber,
    districtId: dispatchForm.districtId,
    warehouserequisitionsId: selectedRequisition.value.id,
  };

  try {
    const dispatchPromises = dispatchForm.items.map((item) => {
      const payload = {
        ...baseDispatchDetails,
        commodityId: item.commodityId,
        Quantity: item.quantity,
      };
      return WarehouseDispathcesStore.create(payload);
    });

    await Promise.all(dispatchPromises);

    Swal.fire({
      title: "Success",
      text: "Dispatches created for all items successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    showDispatchModal.value = false;

    getLoadingplans();
  } catch (error) {
    console.error("Dispatch submission failed", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong while submitting dispatches.",
      icon: "error",
    });
  }

  console.log("Dispatch Submitted", dispatchForm);
};

const selectedCommodityIds = computed(() => {
  return dispatchForm.items.map((item) => item.commodityId).filter(Boolean);
});
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
}
.btn {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50;
}
</style>
