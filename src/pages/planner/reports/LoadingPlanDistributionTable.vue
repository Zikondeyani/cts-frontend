<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-4 p-4 bg-transparent rounded-md">
            <span class="text-white font-bold text-lg">Loading Plans and Dispatch Summary Report</span>

            <!-- Search bar -->
            <div class="relative flex-grow max-w-lg">
                <input v-model="searchQuery" placeholder="Search by ATC Number, District, Delivery Note, or Physical Delivery Note"
                    class="block w-full py-2 pl-3 pr-10 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300" />
            </div>

            <!-- Export Button -->
            <button @click="exportToExcel"
                class="ml-4 px-4 py-2 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600">
                Export
            </button>
        </div>

        <div class="overflow-x-auto relative bg-white p-6 rounded-lg shadow-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-blue-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loading Plan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATC Number</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (Mt)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dispatched (Mt)</th>
                     <!--    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Received (Mt)</th>
                      -->   <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Notes</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received per Physical Delivery Note</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in filteredData" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.loadingPlan.LoadingPlanNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.loadingPlan.ATCNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.district }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.activity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.loadingPlan.Quantity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.dispatches.reduce((sum, dispatch) => sum + dispatch.totalDispatched, 0) }}</td>
                     <!--    <td class="px-6 py-4 whitespace-nowrap">{{ item.dispatches.reduce((sum, dispatch) => sum + (dispatch?.receiptStats?.totalReceived || 0), 0) }}</td>
                      -->   <td class="px-6 py-4 whitespace-nowrap">
                            <ul>
                                <li v-for="dispatch in item.dispatches" :key="dispatch.id">{{ dispatch.deliveryNote }}</li>
                            </ul>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <ul>
                                <li v-for="dispatch in item.dispatches" :key="dispatch.id">
                                    <ul>
                                        <li v-for="note in dispatch?.receiptStats?.physicalDeliveryNotes" :key="note.physicalDeliveryNote">
                                            <span class="font-bold">{{ note.physicalDeliveryNote }}</span>: {{ note.totalReceived || 0 }} MT
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-center mt-4">
                <button @click="prevPage" :disabled="currentPage <= 1"
                    class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
                    Prev
                </button>
                <span class="px-4 py-2 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Sample data
const props = defineProps({
    data: Array,
    screenshotMode: Boolean,
});

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
    return props.data
        .filter(item => {
            const searchLower = searchQuery.value.toLowerCase();
            return (
                item.loadingPlan.ATCNumber.toLowerCase().includes(searchLower) ||
                item.district.toLowerCase().includes(searchLower) ||
                item.dispatches.some(dispatch =>
                    dispatch.deliveryNote.toLowerCase().includes(searchLower) ||
                    dispatch?.receiptStats?.physicalDeliveryNotes.some(note =>
                        note.physicalDeliveryNote.toLowerCase().includes(searchLower)
                    )
                )
            );
        })
        .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value));

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

const exportToExcel = () => {
    const dataForExport = filteredData.value.map(item => ({
        'Loading Plan': item.loadingPlan.LoadingPlanNumber,
        'ATC Number': item.loadingPlan.ATCNumber,
        District: item.district,
        Activity: item.activity,
        'Quantity (Mt)': item.loadingPlan.Quantity,
        'Total Dispatched (Mt)': item.dispatches.reduce((sum, dispatch) => sum + dispatch.totalDispatched, 0),
        'Total Received (Mt)': item.dispatches.reduce((sum, dispatch) => sum + (dispatch?.receiptStats?.totalReceived || 0), 0),
        'Balance (Mt)': item.loadingPlan.Balance,
        'Delivery Notes': item.dispatches.map(dispatch => dispatch.deliveryNote).join(', '),
        'Physical Delivery Notes': item.dispatches
            .flatMap(dispatch =>
                dispatch?.receiptStats?.physicalDeliveryNotes.map(note => ({
                    'Physical Delivery Note': note.physicalDeliveryNote,
                    'Total Received (Mt)': note.totalReceived || 0
                }))
            )
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Loading Plans Report');

    // Create a sheet for Physical Delivery Notes
    const notesData = filteredData.value.flatMap(item =>
        item.dispatches.flatMap(dispatch =>
            dispatch?.receiptStats?.physicalDeliveryNotes.map(note => ({
                'Delivery Note': dispatch.deliveryNote,
                'Physical Delivery Note': note.physicalDeliveryNote,
                'Total Received (Mt)': note.totalReceived || 0
            }))
        )
    );
    const notesWorksheet = XLSX.utils.json_to_sheet(notesData);
    XLSX.utils.book_append_sheet(workbook, notesWorksheet, 'Physical Delivery Notes Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'LoadingPlansReport.xlsx');
};
</script>

<style scoped>
/* Additional styling to ensure fit and spacing */
input {
    width: 100%;
    box-sizing: border-box;
}
button {
    transition: background-color 0.3s;
}
button:hover {
    background-color: #2b6cb0;
}
</style>
