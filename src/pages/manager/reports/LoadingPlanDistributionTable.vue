<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-2 p-2 bg-transparent rounded-md">
            <span class="text-white font-bold text-lg">Loading Plans and Dispatch Summary Report</span>

            <!-- Search bar -->
            <div class="relative flex-grow max-w-lg">
                <input v-model="searchQuery"
                    placeholder="Search by ATC Number, District, Handled By, Transporter, Delivery Note ...etc"
                    class="block w-full py-1.5 pl-3 pr-8 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300" />
            </div>

            <!-- Export Button -->
            <button @click="exportToExcel"
                class="ml-2 px-3 py-1.5 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600">
                Export
            </button>


        </div>

        <div class="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-blue-50">
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATC
                            Number</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            District</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Handled By</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Activity</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transporter</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity (Mt)</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total
                            Dispatched (Mt)</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Received per Delivery Note</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in paginatedData" :key="index"
                        :class="index % 2 === 0 ? 'bg-gray-50' : ''">
                        <td
                            class="font-bold inline-flex items-center px-2.5 py-0.5 mt-4 rounded-full text-md bg-orange-100 text-orange-800">
                            {{ item.loadingPlan.ATCNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.district }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.loadingPlan?.HandledBy }}</td>
                        <td class="px-6 py-4 whitespace-nowrap wrap-text fixed-width">{{ item.activity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap wrap-text fixed-width">{{ item.transporter }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ parseFloat(item.loadingPlan.Quantity).toFixed(2) }}
                            MT</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.dispatches.reduce((sum, dispatch) => sum +
                            parseFloat(dispatch.totalDispatched || 0), 0).toFixed(2) }} MT</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <ul>
                                <li v-for="dispatch in item.dispatches" :key="dispatch.id">
                                    <ul>
                                        <li v-for="note in dispatch?.receiptStats?.physicalDeliveryNotes"
                                            :key="note.physicalDeliveryNote">
                                            <span
                                                class="font-bold inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                DN: {{ note.physicalDeliveryNote }}
                                            </span>: {{ parseFloat(note.totalReceived || 0).toFixed(2) }} MT
                                            <span
                                                class="font-bold inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                Received By: {{ dispatch?.recipientName }}
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-center mt-4 space-x-2">
                <button @click="prevPage" :disabled="currentPage <= 1"
                    class="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
                    Prev
                </button>
                <span class="px-3 py-1.5 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
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
import moment from 'moment'; // Import Moment.js

// Props
const props = defineProps({
    data: Array,
    dispatchdata: Array,
    screenshotMode: Boolean,
    dispatchesdataSummary: Array
});

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Filtered and sorted data
const filteredData = computed(() => {
    const searchLower = searchQuery.value.toLowerCase();
    return props.data
        .filter(item => {
            return (
                item.loadingPlan.ATCNumber.toLowerCase().includes(searchLower) ||
                item.loadingPlan.HandledBy.toLowerCase().includes(searchLower) ||
                item.district.toLowerCase().includes(searchLower) ||
                item.transporter.toLowerCase().includes(searchLower) ||
                item.activity.toLowerCase().includes(searchLower) ||
                item.dispatches.some(dispatch =>
                    dispatch.deliveryNote.toLowerCase().includes(searchLower) ||
                    dispatch?.receiptStats?.physicalDeliveryNotes.some(note =>
                        note.physicalDeliveryNote.toLowerCase().includes(searchLower)
                    )
                )
            );
        })
        .sort((a, b) => {
            const aHasDeliveryNote = a.dispatches.some(dispatch => dispatch?.receiptStats?.physicalDeliveryNotes.length > 0);
            const bHasDeliveryNote = b.dispatches.some(dispatch => dispatch?.receiptStats?.physicalDeliveryNotes.length > 0);
            return bHasDeliveryNote - aHasDeliveryNote; // Sort so that items with delivery notes come first
        });
});

// Total pages based on filtered data
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value));

// Paginated data
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

const exportToExcel = () => {

    const dataForExport = filteredData.value.map(item => ({
        'ATC Number': item.loadingPlan?.ATCNumber || 'N/A',
        'District': item.district || 'N/A',
        'Activity': item.activity || 'N/A',
        'Transporter': item.transporter || 'N/A',
        'Quantity (Mt)': parseFloat(item.loadingPlan?.Quantity || 0).toFixed(2),
        'Total Dispatched (Mt)': item.dispatches.reduce((sum, dispatch) => sum + parseFloat(dispatch?.totalDispatched || 0), 0).toFixed(2),
        'Total Received (Mt)': item.dispatches.reduce((sum, dispatch) => sum + parseFloat(dispatch?.receiptStats?.totalReceived || 0), 0).toFixed(2),
        'Balance (Mt)': parseFloat(item.loadingPlan?.Balance || 0).toFixed(2),
        'Delivery Notes': item.dispatches.flatMap(dispatch => dispatch?.receiptStats?.physicalDeliveryNotes || []).map(note => note.physicalDeliveryNote || 'N/A').join(', '),
        'Transported By': item.loadingPlan?.HandledBy || 'N/A'
    }));

    // Additional datasets for other sheets (Receipt by FDP, Dispatched per Transporter, etc.)
    const receiptByFDPData = filteredData.value.flatMap(item =>
        item.dispatches.flatMap(dispatch =>
            (dispatch.receiptStats?.physicalDeliveryNotes || []).map(note => ({
                'District': item.district || 'N/A',
                'ATC Number': item.loadingPlan?.ATCNumber || 'N/A',
                'Received (Mt)': dispatch.receiptStats?.totalReceived || 0,
                'FDP': note.finalDestination || 'N/A',
                'Physical Delivery Note': note.physicalDeliveryNote || 'N/A',
                'Recipient Name': dispatch.recipientName || 'N/A',
                'Recieved On': note.receivedOn || 'N/A',
            }))
        )
    );

    const dispatchedPerTransporterData = filteredData.value.map(item => ({
        'District': item.district || 'N/A',
        'ATC Number': item.loadingPlan?.ATCNumber || 'N/A',
        'Transporter': item.transporter || 'N/A',
        'Total Transported (Mt)': item.dispatches.reduce((sum, dispatch) => sum + (dispatch.totalDispatched || 0), 0).toFixed(2) || 0,
    }));

    const dispatchedPerWarehouseData = filteredData.value
        .map(item => ({
            'Warehouse Name': item.warehouse || 'N/A',
            'Tonnage Drawn (Mt)': item.dispatches.reduce((sum, dispatch) => sum + (dispatch.totalDispatched || 0), 0).toFixed(2) || 0,
            'District Distributed': item.district || 'N/A',
            'ATC Number': item.loadingPlan?.ATCNumber || 'N/A',
        }))
        .filter(item => parseFloat(item['Tonnage Drawn (Mt)']) > 0);

    // Dispatches by Date Sheet
    const dispatchesByDateData = props.dispatchesdataSummary.map(item => ({
        'Date': moment(item.dispatchdate).format('YYYY-MM-DD') || 'N/A',
        'District': item.district || 'N/A',
        'Transporter': item.transporter || 'N/A',
        'Commodity': item.commodity || 'N/A',
        'Total Dispatched (Mt)': item.quantity || 0,
        'FDP': item.fdp,
        'ATC #': item.atcnumber,
        'Handled By': item.handledby,
    }));

    // Create a new workbook and add sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataForExport), 'Summary');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(receiptByFDPData), 'Receipt by FDP');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dispatchedPerTransporterData), 'Dispatched per Transporter');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dispatchedPerWarehouseData), 'Dispatched per Warehouse');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dispatchesByDateData), 'Dispatches by Date'); // New sheet

    // Export workbook
    XLSX.writeFile(workbook, `Loading_Plans_and_Dispatch_Summary_Report_${moment().format('YYYY-MM-DD')}.xlsx`);
};



</script>

<style scoped>
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

/* Add striped table styling */
tbody tr:nth-child(even) {
    background-color: #eff6ff;
    /* light gray for even rows */
}

tbody tr:nth-child(odd) {
    background-color: white;
    /* white for odd rows */
}

/* Ensure text wrapping in specific columns */
.wrap-text {
    white-space: normal;
    word-break: break-word;
}

.fixed-width {
    width: 190px;
    /* Adjust width as needed */
}
</style>
