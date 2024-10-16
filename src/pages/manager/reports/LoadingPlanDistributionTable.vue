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
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.activity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ item.transporter }}</td>
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
    const filterDispatchData = (data) => {
        return data.map(item => ({
            'District': item.district || 'N/A',
            'Activity': item.activity || 'N/A',
            'Commodity': item.commodity || 'N/A',
            'Tonnage Allocation (Mt)': parseFloat(item.tonnageAllocation || 0).toFixed(2),
            'Cummulative Dispatched (Mt)': parseFloat(item.totalDispatched || 0).toFixed(2),
            'Cummulative Received (Mt)': parseFloat(item.totalReceived || 0).toFixed(2),
            'Dispatched Today (Mt)': parseFloat(item.dispatchedToday || 0).toFixed(2),
            'Remaining Tonnage (Mt)': parseFloat(item.remainingTonnage || 0).toFixed(2),
            'Dispatch Completion (%)': item.dispatchCompletion || '0',
            'Receipt Completion (%)': item.receiptCompletion || '0',
        }));
    };

    const todayData = filterDispatchData(props.dispatchdata.filter(item => {
        return item.dispatchedToday > 0; // Filter for dispatches today
    }));

    const dataForExport = filteredData.value.map(item => ({
        'Loading Plan': item.loadingPlan?.LoadingPlanNumber || 'N/A',
        'ATC Number': item.loadingPlan?.ATCNumber || 'N/A',
        'District': item.district || 'N/A',
        'Activity': item.activity || 'N/A',
        'Transporter': item.transporter || 'N/A',
        'Quantity (Mt)': parseFloat(item.loadingPlan?.Quantity || 0).toFixed(2),
        'Total Dispatched (Mt)': item.dispatches.reduce((sum, dispatch) => sum + parseFloat(dispatch?.totalDispatched || 0), 0).toFixed(2),
        'Total Received (Mt)': item.dispatches.reduce((sum, dispatch) => sum + parseFloat(dispatch?.receiptStats?.totalReceived || 0), 0).toFixed(2),
        'Balance (Mt)': parseFloat(item.loadingPlan?.Balance || 0).toFixed(2),
        'Delivery Notes': item.dispatches.map(dispatch => dispatch?.deliveryNote || 'N/A').join(', '),
    }));

    const workbook = XLSX.utils.book_new();

    const applyStyles = (worksheet, headers) => {
        const headerStyle = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: '096EB4' }, // Header background color
            },
            font: {
                bold: true,
                color: { rgb: 'FFFFFF' }, // White font color for headers
            },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const contentStyleEven = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: 'D9E7F1' }, // Light shade of blue for even rows
            },
            font: {
                color: { rgb: '000000' },
            },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const contentStyleOdd = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: 'FFFFFF' }, // White background for odd rows
            },
            font: {
                color: { rgb: '000000' },
            },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        // Apply styles to headers
        headers.forEach((header, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
            if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
            worksheet[cellAddress].s = headerStyle; // Apply header style
        });

        // Apply styles to content
        const rows = worksheet['!ref'].split(':');
        const startRow = parseInt(rows[0].replace(/[A-Z]/g, '')) + 1; // Start after headers
        const endRow = parseInt(rows[1].replace(/[A-Z]/g, ''));

        for (let r = startRow; r <= endRow; r++) {
            for (let c = 0; c < headers.length; c++) {
                const cellAddress = XLSX.utils.encode_cell({ r: r, c: c });
                if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
                
                // Apply striped styles
                worksheet[cellAddress].s = (r % 2 === 0) ? contentStyleEven : contentStyleOdd;
            }
        }
    };

    const mainWorksheet = XLSX.utils.json_to_sheet(dataForExport);
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, 'Loading Plans Report');
    applyStyles(mainWorksheet, Object.keys(dataForExport[0]));

    if (todayData.length > 0) {
        const todayWorksheet = XLSX.utils.json_to_sheet(todayData);
        XLSX.utils.book_append_sheet(workbook, todayWorksheet, 'Dispatches As of today');
        applyStyles(todayWorksheet, Object.keys(todayData[0]));
    }

    try {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, 'LoadingPlansReport.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
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
</style>
