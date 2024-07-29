<template>
    <div class="overflow-x-auto relative">
        <div class="mb-4 mt-4">Commodity Distribution Update</div>
        <div class="absolute top-0 right-0 p-4 flex items-center" :class="{ 'hidden': screenshotMode }">
            <!-- District Selector -->
            <span class="mr-3 font-bold">District:</span>
            <select v-model="selectedDistrict"
                class="mb-2 mr-2 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                <option value="">All Districts</option>
                <option v-for="district in districts" :key="district.Name" :value="district.Name">
                    {{ district.Name }}
                </option>
            </select>
            <!-- Commodity Selector -->
            <span class="mr-3 font-bold">Commodity:</span>
            <select v-model="selectedCommodity"
                class="mb-2 focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                <option value="">All Commodities</option>
                <option v-for="commodity in commodities" :key="commodity.Name" :value="commodity.Name">
                    {{ commodity.Name }}
                </option>
            </select>
            <!-- Reset Button -->
            <button @click="resetFilters"
                class="ml-2 mb-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Reset Filters
            </button>

        </div>
        <table class="min-w-full divide-y divide-gray-200 mt-8">
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
        <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ row.commodity }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ row.required }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ row.distributed }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ row.balance }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span v-if="row.percentage > 100" class="relative group">
                100%
                <span style="color: red;">&#9650;</span>
                <span
                    class="absolute left-0 ml-8 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                    Exceeded allocation
                </span>
            </span>
            <span v-else-if="row.percentage === 100" class="relative group">
                100%
                <span style="color: green;">&#9679;</span>
            </span>
            <span v-else>
                {{ row.percentage }}%
            </span>
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
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import { usedistrictstore } from "../../../stores/districts.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { boolean } from 'yup';

const districtstore = usedistrictstore();
const districts = reactive([])

const commoditystore = usecommoditiestore();
const commodities = reactive([])

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
onMounted(() => {
    getCommodities();
    getDistricts();
})

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function resetFilters() {
    selectedDistrict.value = '';
    selectedCommodity.value = '';
}


const getCommodities = async () => {
    let commoditydata = await commoditystore.get()
    commodities.length = 0
    commodities.push(...commoditydata)
    return commodities
}

const getDistricts = async () => {
    let districtsdata = await districtstore.get()
    districts.length = 0
    districts.push(...districtsdata)
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
