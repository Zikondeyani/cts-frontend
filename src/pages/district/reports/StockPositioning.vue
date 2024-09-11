<template>
    <div class="w-full">
        <div class="flex justify-between items-center rounded-md">
            <!-- Title on the left -->
            <span class="text-white font-bold">DODMA Warehouse Stock Positioning</span>


        </div>

        <div class="overflow-x-auto relative bg-white p-6 rounded-lg shadow-lg mt-4">
            <div class="flex items-center space-x-4 mb-4">
                <div class="flex flex-col">
                    <label for="district" class="text-sm font-medium text-gray-700 mb-2">District</label>
                    <select id="district" v-model="selectedDistrict"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Districts</option>
                        <option v-for="district in districts" :key="district.id" :value="district.Name">
                            {{ district.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="warehouse" class="text-sm font-medium text-gray-700 mb-2">Warehouse</label>
                    <select id="warehouse" v-model="selectedWarehouse"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Warehouses</option>
                        <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.Name">
                            {{ warehouse.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col w-40">
                    <label for="commodity" class="text-sm font-medium text-gray-700 mb-2">Commodity</label>
                    <select id="commodity" v-model="selectedCommodity"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Commodities</option>
                        <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.Name">
                            {{ commodity.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="commodityType" class="text-sm font-medium text-gray-700 mb-2">Commodity Type</label>
                    <select id="commodityType" v-model="selectedCommodityType"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Commodity Types</option>
                        <option v-for="commodity in commodityTypes" :key="commodity.id" :value="commodity.Name">
                            {{ commodity.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="expiryDate" class="text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <select id="expiryDate" v-model="selectedExpiryDateRange"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All</option>
                        <option value="today">Today</option>
                        <option value="thisWeek">This Week</option>
                        <option value="nextMonth">Next 1 Month</option>
                        <option value="nextSixMonths">Next 6 Months</option>
                    </select>
                </div>

                <div class="flex items-end mt-4">
                    <button @click="resetFilters"
                        class="bg-gray-200 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded">
                        Reset
                    </button>

                    <!-- Export Dropdown Button on the right -->
                    <div class="relative inline-block text-left mx-4">
                        <button @click.prevent="exportToExcel"
                            class="inline-flex justify-center rounded-md border p-3 border-none shadow-sm px-2 py-1 bg-gray-500 text-white text-md font-medium hover:bg-gray-600 focus:outline-none"
                            id="menu-button" aria-expanded="true" aria-haspopup="true">
                            Export To Excel
                        </button>
                    </div>
                </div>
            </div>

            <table class="min-w-full divide-y divide-gray-200 mt-8">
                <thead class="bg-blue-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            District</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commodity</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commodity Type</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Warehouse</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch
                            Number</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expiry Date</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                            Available</th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                            Pending Dispatch</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, index) in filteredData" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodityType }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.warehouse }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.batchNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getBadgeClass(row.expiryDate)">
                                {{ row.expiryDate }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.stockAvailable }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodityType == "Food" ? "MT" : "# of Units" }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.stockPendingDispatch }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="flex justify-center mt-4" :class="{ 'hidden': screenshotMode }">
                <button @click="prevPage" :disabled="currentPage <= 1"
                    class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronLeftIcon class="w-5 h-5 mr-2" />
                    Prev
                </button>
                <span class="px-4 py-2 font-body font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronRightIcon class="w-5 h-5 mr-2" />
                    Next
                </button>

                <span class="mr-2 font-medium mt-2">Rows per page:</span>
                <select v-model="pageSize" class="border-gray-300 rounded-md">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import moment from 'moment'; // Include moment.js for date calculations
import { usedistrictstore } from "../../../stores/districts.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usecommoditytypestore } from "../../../stores/commodity-type.store";
import { usewarehousestore } from "../../../stores/warehouse.store";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const districtstore = usedistrictstore();
const commoditystore = usecommoditiestore();
const commoditytypestore = usecommoditytypestore();
const warehousestore = usewarehousestore();
const districts = reactive([]);
const commodities = reactive([]);
const commodityTypes = reactive([]);
const warehouses = reactive([]);

const props = defineProps({
    data: Array,
    screenshotMode: Boolean,
});

const opendropdown = ref(false);
const currentPage = ref(1);
const pageSize = ref(5);
const selectedDistrict = ref('');
const selectedCommodityType = ref('');
const selectedWarehouse = ref('');
const selectedCommodity = ref('');
const selectedExpiryDateRange = ref('');

const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));

const filteredData = computed(() => props.data.filter(item => {
    return (!selectedWarehouse.value || item.warehouse === selectedWarehouse.value) &&
        (!selectedDistrict.value || item.district === selectedDistrict.value) &&
        (!selectedCommodity.value || item.commodity === selectedCommodity.value) &&
        (!selectedCommodityType.value || item.commodityType === selectedCommodityType.value) &&
        (!selectedExpiryDateRange.value || filterByExpiryDate(item.expiryDate));
}).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));

function filterByExpiryDate(expiryDate) {
    const today = moment();
    const expiry = moment(expiryDate);
    switch (selectedExpiryDateRange.value) {
        case 'today':
            return expiry.isSame(today, 'day');
        case 'thisWeek':
            return expiry.isSame(today, 'week');
        case 'nextMonth':
            return expiry.isBetween(today, moment().add(1, 'month'), null, '[]');
        case 'nextSixMonths':
            return expiry.isBetween(today, moment().add(6, 'months'), null, '[]');
        default:
            return true;
    }
}

function getBadgeClass(expiryDate) {
    const today = moment();
    const expiry = moment(expiryDate);
    const monthsDiff = expiry.diff(today, 'months', true);

    if (monthsDiff <= 1) {
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800';
    } else if (monthsDiff <= 6) {
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
    } else {
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
    }
}


function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function resetFilters() {
    selectedDistrict.value = '';
    selectedWarehouse.value = '';
    selectedCommodity.value = '';
    selectedCommodityType.value = '';
    selectedExpiryDateRange.value = '';
}

onMounted(() => {
    getCommodities();
    getDistricts();
    getWarehouses();
    getCommodityTypes();
});

const getCommodities = async () => {
    let commoditydata = await commoditystore.get();
    commodities.length = 0;
    commodities.push(...commoditydata);
    return commodities;
}

const getCommodityTypes = async () => {
    let commoditytypedata = await commoditytypestore.get();
    commodityTypes.length = 0;
    commodityTypes.push(...commoditytypedata);
    return commodityTypes;
}

const getWarehouses = async () => {
    let warehousedata = await warehousestore.get();
    warehouses.length = 0;
    warehouses.push(...warehousedata.filter(item => item.organisationId == 2));
    return warehouses;
}

const getDistricts = async () => {
    let districtsdata = await districtstore.get();
    districts.length = 0;
    districts.push(...districtsdata);
    return districts;
}

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Stock Positioning');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'WarehouseStockPositioningReport.xlsx');
};
</script>

<style scoped>
.bg-gray-200 {
    background-color: #e5e7eb;
}

.bg-gray-300 {
    background-color: #d1d5db;
}

.bg-gray-500 {
    background-color: #6b7280;
}

.bg-gray-600 {
    background-color: #4b5563;
}


@media (min-width: 1024px) {
    .container {
      width: 60%;
    }
  }

  @media (min-width: 1024px) {
    .container {
      width: 100%;
    }
  }

</style>
