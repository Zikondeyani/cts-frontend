<template>
    <div class="overflow-x-auto relative">
        <!-- Filters section with proper padding and positioning -->
        <div class="flex justify-between items-center space-x-4 mb-4" :class="{ 'hidden': screenshotMode }">
            <!-- Left-aligned content: Commodity Distribution Update -->
            <div class="mb-4 mt-4 text-left">
                <span class="font-bold text-sm"> Distribution Update</span>
            </div>
            <!-- Right-aligned filters -->
            <div class="flex space-x-4">
                <!-- Activity Selector -->
                <div>
                    <span class="mr-2 font-bold">Activity:</span>
                    <select v-model="selectedActivity"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Activities</option>
                        <option v-for="activity in activities" :key="activity.Name" :value="activity.Name">
                            {{ activity.Name }}
                        </option>
                    </select>
                </div>

              <!--   <div>
                    <span class="mr-2 font-bold">Handled By:</span>
                    <select v-model="selectedHandleBy"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Organisations</option>
                        <option v-for="item in ['WFP', 'DoDMA']" :key="item" :value="item">
                            {{ item }}
                        </option>
                    </select>
                </div> -->

                <!-- District Selector -->
                <div>
                    <span class="mr-2 font-bold">District:</span>
                    <select v-model="selectedDistrict"
                        class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Districts</option>
                        <option v-for="district in districts" :key="district.Name" :value="district.Name">
                            {{ district.Name }}
                        </option>
                    </select>
                </div>

                <!-- Commodity Selector -->
                <div>
                    <span class="mr-2 font-bold">Commodity:</span>
                    <select v-model="selectedCommodity"
                        class="w-40 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="">All Commodities</option>
                        <option v-for="commodity in commodities" :key="commodity.Name" :value="commodity.Name">
                            {{ commodity.Name }}
                        </option>
                    </select>
                </div>

                <div class="flex space-x-4">
                   
                    
                    <button @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded">
                        Reset
                      </button>

                      <button @click="exportToExcel"
                        class="bg-green-500 mt-5 hover:bg-green-300 text-white font-medium py-1 px-2 text-sm rounded">
                        Export to Excel
                      </button>
                  
                </div>
            </div>
        </div>

        <!-- Table -->
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
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
                        Allocation (Mt)
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handled By
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dispatched (Mt)
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received (Mt)
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % dispatch
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % receipt
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in filteredData" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.commodity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.tonnageAllocation.toFixed(2) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.handledby }}</td>
                  
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.totalDispatched.toFixed(2) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.totalReceived.toFixed(2) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.dispatchCompletion?.toFixed(2) }}%</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span v-if="row.receiptCompletion > 100.001"
                            class="relative inline-block cursor-pointer group">
                            <!-- Red badge with percentage -->
                            <span class="px-2 py-1 bg-red-500 text-white font-bold text-xs rounded"
                                aria-label="Possible excess receipt">
                                {{ Number(row.receiptCompletion).toFixed(2) }}%
                            </span>

                            <!-- Tooltip -->
                            <span
                                class="absolute right-0 bottom-6 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Possible excess receipt
                            </span>
                        </span>
                        <span v-else>{{ Number(row.receiptCompletion).toFixed(2) }}%</span>
                     
                    </td>
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

            <span class="ml-4 font-medium">Rows per page:</span>
            <select v-model="pageSize" class="ml-2 border-gray-300 rounded-md">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import { usedistrictstore } from "../../../stores/districts.store";

import { useactivitiestore } from "../../../stores/activity.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { boolean } from 'yup';
import * as XLSX from 'xlsx';

const districtstore = usedistrictstore();
const districts = reactive([])

const activitystore = useactivitiestore();
const activities = reactive([])


const commoditystore = usecommoditiestore();
const commodities = reactive([])

const props = defineProps({
    data: Object,
    screenshotMode: Boolean,
});

const currentPage = ref(1);
const pageSize = ref(5);
const selectedDistrict = ref('');
const selectedCommodity = ref('');
const selectedActivity = ref('');

const selectedHandleBy = ref('');

const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));

const flattenedData = computed(() => {
    if (!props.data || props.data.length === 0) {
        return []; // Return an empty array if data is not available
    }

    // Assume props.data is an array with a single object containing numerically indexed keys
    const [dataObj] = props.data; // Extract the first object (your data)
    return Object.values(dataObj); // Convert the object into an array of values
});


const filteredData = computed(() => {
    const data = props.data; // Use the flattened data array

    if (!data || data.length === 0) {
        return []; // Return an empty array if no data is available
    }

    const filtered = data.filter(item => {


        return (!selectedDistrict.value || item.district === selectedDistrict.value) &&
            (!selectedCommodity.value || item.commodity === selectedCommodity.value) &&
            (!selectedActivity.value || item.activity === selectedActivity.value)&&
            (!selectedHandleBy.value || item.HandledBy === selectedHandleBy.value);
    });

    // Apply pagination after filtering
    return filtered.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});


function exportToExcel() {
    const dataToExport = filteredData.value.map(row => ({
        District: row.district,
        Commodity: row.commodity,
        'Allocation (Mt)': row.tonnageAllocation,
        'Dispatched (Mt)': row.totalDispatched,
        'Received (Mt)': row.totalReceived,
        '% Dispatch': row.dispatchCompletion,
        '% Receipt': row.receiptCompletion,    
        'Handled By': "WFP",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Commodity Distribution (WFP)');

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, 'Commodity_Distribution_Update_wfp.xlsx');
}



function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}
onMounted(() => {
    getCommodities();
    getDistricts();
    getActivities();
})

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function resetFilters() {
    selectedActivity.value = ''
    selectedDistrict.value = '';
    selectedCommodity.value = '';
}

const getActivities = async () => {
    let activitydata = await activitystore.get();
    activities.length = 0;
    activities.push(
        ...activitydata.filter(activity => !activity.Name.toLowerCase().includes("emergency"))
    );
    return activities;
};


const getCommodities = async () => {
    let commoditydata = await commoditystore.get()
    commodities.length = 0
    commodities.push(...commoditydata)
    return commodities
}

const getDistricts = async () => {
    let districtsdata = await districtstore.get()
    districts.length = 0
    districts.push(...districtsdata.slice().sort((a, b) => a.Name.localeCompare(b.Name)))
    return districts
}
</script>

<style scoped>
tbody tr:nth-child(even) {
    background-color: #b3e0f2;
}

tbody tr:nth-child(odd) {
    background-color: #d0eff8;
}
</style>
