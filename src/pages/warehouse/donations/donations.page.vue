<template>
  <main class="">
    <!--spinner-->

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Donation Management
          </h2>
        </div>
        <button type="button"
          class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
          @click="generateExcel">
          Export Data
        </button>

        <div class="mt-5 flex ml-4 justify-center sm:mt-0">
          <create-donation-form v-on:create="createReport" />
        </div>
      </div>

      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="donations" :search-options="{ enabled: true }"
          style="font-weight: bold; color: blue;" :pagination-options="{
          enabled: true,
        }" theme="polar-bear" styleClass=" vgt-table striped " compactMode>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <button @click="showMoreInfo(props.row)"
                class="text-blue-400 text-sm hover:text-green-900 inline-flex items-center">
                <EyeIcon class="h-5 w-5 mr-1" /> View Details
              </button>
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>

    <TransitionRoot as="template" :show="isInfoDialogOpen">
      <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeInfoDialog" static>
        <div class="flex items-center justify-center min-h-screen text-center">
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-30" />
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <div
              class="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Donation Details
                </h3>
                <div class="mt-2">
                  <p><strong>Goods Receive Note:</strong> {{ currentDonation.GoodsReceiveNote }}</p>
                  <p><strong>Truck Number:</strong> {{ currentDonation.TruckNumber }}</p>
                  <p><strong>Date:</strong> {{ currentDonation.Date }}</p>
                  <p><strong>Driver Name:</strong> {{ currentDonation.DriverName }}</p>
                  <p><strong>Remarks:</strong> {{ currentDonation.Remarks }}</p>
                </div>
                <h4 class="mt-4 font-semibold">Donated Commodities:</h4>
                <div class="mt-2">
                  <ul class="list-disc pl-5 space-y-1">
                    <li v-for="item in currentDonatedCommodities" :key="item.id">
                      {{ getCommodityName(item.commodityId) }} - Quantity: 
                      {{ item.Quantity }} 
                      <span v-if="item.commodity.commodityType.Name === 'Food'">MT</span>
                      <span v-else>Units</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button @click="closeInfoDialog"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </main>
</template>

<script setup>
import { Dialog, DialogOverlay, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { inject, ref, reactive, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  EyeIcon,
} from "@heroicons/vue/solid";
import { usedriverstore } from "../../../stores/driver.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { useSessionStore } from "../../../stores/session.store";
import { usedonationstore } from "../../../stores/donation.store";
import { usedonatedCommoditiesStore } from "../../../stores/donatedCommodities.store";
import * as XLSX from 'xlsx';
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import CreateDonationForm from "../../../components/pages/reports/create.donation.component.vue"
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
const emit = defineEmits(['create', 'close']);

const open = ref(false);
const isInfoDialogOpen = ref(false);
const districts = reactive([]);
const warehouses = reactive([]);
const drivers = reactive([]);
const donors = reactive([]);
const commodities = reactive([]);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const donationStore = usedonationstore();
const donatedCommoditiesStore = usedonatedCommoditiesStore();
const donations = reactive([]);
const currentDonatedCommodities = ref([]);
const currentDonation = reactive({});

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Donation Management", href: "#", current: true },

];


const columns = ref([
  { label: "#", field: "id", sortable: true },
  { label: "Goods Receive Note", field: "GoodsReceiveNote", sortable: true },
  { label: "Truck Number", field: "TruckNumber", sortable: true },
  { label: "Date", field: "Date", sortable: true },
  { label: "Driver Name", field: "DriverName", sortable: true },
  { label: "Options", field: "options", sortable: false, html: true }
]);

const fetchInitialData = async () => {
  districts.push(...await usedistrictstore().get());
  warehouses.push(...await usewarehousestore().get());
  drivers.push(...await usedriverstore().get());
  donors.push(...await usetransporterstore().get());
  commodities.push(...await usecommoditiestore().get());
  fetchDonations();
};

const fetchDonations = async () => {
  try {
    const result = await donationStore.get();
    donations.length = 0;
    donations.push(...result);
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "Failed to fetch donations",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const showMoreInfo = async (row) => {
  try {
    const result = await donatedCommoditiesStore.get(row.id);
    currentDonatedCommodities.value = result;
    Object.assign(currentDonation, row);
    isInfoDialogOpen.value = true;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "Failed to fetch donated commodities",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const closeInfoDialog = () => {
  isInfoDialogOpen.value = false;
  currentDonatedCommodities.value = [];
  Object.keys(currentDonation).forEach(key => currentDonation[key] = '');
};

const getCommodityName = (id) => {
  const commodity = commodities.find(c => c.id === id);
  return commodity ? commodity.Name : 'Unknown';
};

const generateExcel = async () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Donations';

  const dataToExport = await Promise.all(donations.map(async (donation) => {
    const donatedCommodities = await donatedCommoditiesStore.get(donation.id);
    return {
      "Goods Receive Note": donation.GoodsReceiveNote,
      "Truck Number": donation.TruckNumber,
      "Date": donation.Date,
      "Remarks": donation.Remarks,
      "District": donation.district?.Name,
      "Warehouse": donation.warehouse?.Name,
      "Donor": donation.organisation?.Name,
      "Driver Name": donation.DriverName,
      "Commodities": donatedCommodities.map(dc => {
        const quantity = dc.Quantity;
        const unit = dc.commodity?.commodityType?.Name === 'Food' ? 'MT' : 'Units';
        return `${getCommodityName(dc.commodityId)} - Quantity: ${quantity} ${unit}`;
      }).join(', ')
    };
  }));

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);
  XLSX.writeFile(wb, 'Donations.xlsx');
};

onMounted(fetchInitialData);
</script>
<style>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.from-color {
  color: #096eb4;
}

.to-color {
  color: gray;
}
</style>
