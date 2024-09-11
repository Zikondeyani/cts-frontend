<template>
    <div class="w-full">
        <div class="flex justify-between items-center rounded-md">
            <!-- Title on the left -->
            <span class="text-white font-bold">Commodity Distribution Report (Emergency Response)</span>

            <!-- Export Dropdown Button on the right -->
           
        </div>

        <div class="overflow-x-auto relative bg-white p-6 rounded-lg shadow-lg mt-4">
            <div class="flex items-center space-x-4 mb-4" :class="{ 'hidden': screenshotMode }">
                <div class="flex flex-col">
                    <label for="district" class="text-sm font-medium text-gray-700 mb-2">District</label>
                    <select id="district" v-model="selectedDistrict"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Districts</option>
                        <option v-for="district in districts" :key="district.Name" :value="district.Name">
                            {{ district.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="commodity" class="text-sm font-medium text-gray-700 mb-2">Commodity</label>
                    <select id="commodity" v-model="selectedCommodity"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Commodities</option>
                        <option v-for="commodity in commodities" :key="commodity.Name" :value="commodity.Name">
                            {{ commodity.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex items-end mt-4">
                    <button @click="resetFilters"
                        class="bg-gray-200 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded">
                        Reset
                    </button>
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
                            Emergency/Disaster
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            District
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commodity
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Required (Mt)
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Distributed (Mt)
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance (Mt)
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % Distributed
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, index) in filteredData" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.disaster }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.required }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.distributed }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.balance }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ row.percentage }}%</td>
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
import { usedistrictstore } from "../../../stores/districts.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const districtstore = usedistrictstore();
const districts = reactive([]);
const commoditystore = usecommoditiestore();
const commodities = reactive([]);

const props = defineProps({
    data: Array,
    screenshotMode: Boolean,
});

const currentPage = ref(1);
const pageSize = ref(5);
const selectedDistrict = ref('');
const selectedCommodity = ref('');
const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));

const filteredData = computed(() => {
    return props.data.filter(item => {
        return (!selectedDistrict.value || item.district === selectedDistrict.value) &&
            (!selectedCommodity.value || item.commodity === selectedCommodity.value);
    }).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function resetFilters() {
    selectedDistrict.value = '';
    selectedCommodity.value = '';
}

onMounted(() => {
    getCommodities();
    getDistricts();
});

const getCommodities = async () => {
    let commoditydata = await commoditystore.get();
    commodities.length = 0;
    commodities.push(...commoditydata);
    return commodities;
};

const getDistricts = async () => {
    let districtsdata = await districtstore.get();
    districts.length = 0;
    districts.push(...districtsdata);
    return districts;
};

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(props.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Commodity Distribution Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'CommodityDistributionReport.xlsx');
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
</style>
