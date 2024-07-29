<template>
    <div class="overflow-x-auto">
        <div class="mb-4">Commodity Distribution Update</div>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maize required (Mt)
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual Tonnage Distributed
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tonnage balance
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % of Tonnage Distributed
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in paginatedData" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.district }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.required }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.distributed }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.balance }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ row.percentage }}</td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination Controls -->
        <div class="flex justify-center mt-4">
            <button @click="prevPage" :disabled="currentPage <= 1" class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                <ChevronLeftIcon class="w-5 h-5 mr-2" />
                Prev
            </button>
            <span class="px-4 py-2 font-body font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages" class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
                <ChevronRightIcon class="w-5 h-5 mr-2" />
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';

const props = defineProps({
    data: Array
});

const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return props.data.slice(start, start + pageSize.value);
});

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}
</script>

<style scoped>
/* Very light shades of blue for a subtle striped effect */
tbody tr:nth-child(even) {
    background-color: #b3e0f2;  /* Very light blue */
}
tbody tr:nth-child(odd) {
    background-color: #d0eff8;  /* Even lighter blue */
}
</style>
