<template>
  <div>
    <button type="button" style="background-color: #248cd6;"
      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true">
      <PlusIcon class="h-5 w-5 mr-2" />
      Add Donation
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false" static>
        <div class="flex min-h-screen text-center md:block md:px-2 lg:px-4" style="font-size: 0">
          <TransitionChild class=" " v-if="open" as="template" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">&#8203;</span>
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="font-body text-md font-bold leading-normal text-blue-400" id="formModalLabel">
                  Add Donation
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"></button>
              </div>

              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-6 sm:col-span-3">
                    <label for="goodsreceivenote" class="block text-sm font-bold text-gray-700">
                      Goods Receive Note</label>
                    <input type="text" name="goodsreceivenote" v-model="donation.GoodsReceiveNote" id="goodsreceivenote"
                      autocomplete="goodsreceivenote" readonly
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="trucknumber" class="block text-sm font-bold text-gray-700">
                      Truck Number</label>
                    <input type="text" name="TruckNumber" v-model="donation.TruckNumber" id="TruckNumber"
                      autocomplete="trucknumber"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="date" class="block text-sm font-bold text-gray-700">
                      Date</label>
                    <input type="date" name="Date" v-model="donation.Date" id="date" autocomplete="date"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="remarks" class="block text-sm font-bold text-gray-700">
                      Remarks</label>
                    <input type="text" name="Remarks" v-model="donation.Remarks" id="remarks" autocomplete="remarks"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="districtid" class="block text-sm font-bold text-gray-700">
                      District</label>
                    <select id="districtid" name="districtid" v-model="donation.districtId" autocomplete="district-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="district in districts" :key="district.id" :value="district.id">
                        {{ district.Name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="warehouseid" class="block text-sm font-bold text-gray-700">
                      Warehouse</label>
                    <select id="warehouseid" name="warehouseid" v-model="donation.warehouseId" autocomplete="warehouse-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                        {{ warehouse.Name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="Donorid" class="block text-sm font-bold text-gray-700">
                      Donor</label>
                    <select id="Donorid" name="Donorid" v-model="donation.DonorId" autocomplete="Donor-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="donor in donors" :key="donor.id" :value="donor.id">
                        {{ donor.Name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3 relative">
                    <label for="DriverName" class="block text-sm font-bold text-gray-700">
                      Driver Name</label>
                    <input type="text" name="DriverName" v-model="donation.DriverName" id="DriverName"
                      autocomplete="drivername" @input="handleDriverInput" @focus="showSuggestions = true"
                      @blur="hideSuggestions"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <ul v-if="showSuggestions && filteredDrivers.length > 0"
                      class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-28 overflow-y-auto">
                      <li v-for="driver in filteredDrivers.slice(0, 3)" :key="driver.id"
                        @mousedown.prevent="selectDriver(driver)" class="px-2 py-1 cursor-pointer hover:bg-blue-100">
                        {{ driver.Name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 class="text-lg font-semibold mt-6 mb-4">Donated Commodities</h3>
                <div v-for="(item, index) in donatedCommodities" :key="index" class="grid grid-cols-6 gap-2 mb-4">
                  <div class="col-span-3 sm:col-span-3">
                    <label for="commodity" class="block text-sm font-bold text-gray-700">
                      Commodity</label>
                    <select :id="'commodity-' + index" v-model="item.commodityid" autocomplete="commodity-name"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">
                        {{ commodity.Name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-3 sm:col-span-3">
                    <label for="quantity" class="block text-sm font-bold text-gray-700">
                      Quantity</label>
                    <input type="number" :id="'quantity-' + index" v-model="item.quantity" autocomplete="quantity"
                      class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <div class="col-span-6 text-right">
                    <button @click="removeCommodity(index)"
                      class="mt-1 px-2 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200">Remove</button>
                  </div>
                </div>
                <div class="col-span-6 text-right">
                  <button @click="addCommodity"
                    class="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200">Add
                    Commodity</button>
                </div>
              </div>

              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button @click="onSubmit" style="background-color: #329ce7;"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Save
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup>
import { Dialog, DialogOverlay, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { PlusIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, defineEmits, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { usedriverstore } from "../../../stores/driver.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import { usetransporterstore } from "../../../stores/transporter.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { useSessionStore } from "../../../stores/session.store";
import { usedonationstore } from "../../../stores/donation.store";
import { usedonatedCommoditiesStore } from "../../../stores/donatedCommodities.store";

const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
const emit = defineEmits(['create', 'close']);

const open = ref(false);
const districts = reactive([]);
const warehouses = reactive([]);
const drivers = reactive([]);
const donors = reactive([]);
const commodities = reactive([]);
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const donationStore = usedonationstore();
const donatedCommoditiesStore = usedonatedCommoditiesStore();
const showSuggestions = ref(false);

const donation = reactive({
  GoodsReceiveNote: '',
  TruckNumber: '',
  Date: '',
  Remarks: '',
  districtId: null,
  warehouseId: null,
  DonorId: null,
  DriverName: '',
  RecipientId: user.value.id,
});

const donatedCommodities = reactive([]);

const addCommodity = () => {
  donatedCommodities.push({ commodityid: null, quantity: 0 });
};

const removeCommodity = (index) => {
  donatedCommodities.splice(index, 1);
};

const fetchInitialData = async () => {
  districts.push(...await usedistrictstore().get());
  warehouses.push(...await usewarehousestore().get());
  drivers.push(...await usedriverstore().get());
  donors.push(...await usetransporterstore().get()); // Assuming donors are stored similarly
  commodities.push(...await usecommoditiestore().get());
  generateGoodsReceiveNote();
};

const generateGoodsReceiveNote = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  donation.GoodsReceiveNote = `DODMA-${timestamp}`;
};

onMounted(fetchInitialData);

const onSubmit = async () => {
  if (donatedCommodities.length === 0) {
    Swal.fire({
      title: "No Commodities Added",
      text: "Please add at least one donated commodity before saving.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    const result = await donationStore.create(donation);
    const donationId = result.id;

    for (const item of donatedCommodities) {
      await donatedCommoditiesStore.create({
        donationId: donationId,
        commodityId: item.commodityid,
        Quantity: item.quantity,
      });
    }

    Swal.fire({
      title: "Success",
      text: "Donation created successfully",
      icon: "success",
      confirmButtonText: "OK",
    });
    open.value = false;
    emit('create');
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "There was an error creating the donation",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

// Driver field suggestions and handling new driver names
const filteredDrivers = computed(() => {
  return drivers.filter(driver =>
    driver.Name.toLowerCase().includes(donation.DriverName.toLowerCase())
  );
});

const handleDriverInput = (event) => {
  donation.DriverName = event.target.value;
  showSuggestions.value = true; // Show suggestions when typing
};

const selectDriver = (driver) => {
  donation.DriverName = driver.Name;
  showSuggestions.value = false; // Hide suggestions after selection
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>
