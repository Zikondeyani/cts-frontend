<template>
    <main class="min-h-screen">
        <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
            <breadcrumb-widget :breadcrumbs="breadcrumbs" />

            <div class="md:flex md:items-center md:justify-between mt-4">
                <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-white text-2xl mb-1">
                        Expiring Commodities
                    </h2>
                </div>

                <div class="mt-5 flex ml-4 sm:mt-0 mb-1">
                    <button type="button"
                        class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
                        @click="exportToExcel()">
                        <i class="fas fa-file-export mr-2"></i>
                        <!-- Icon (Font Awesome used as an example) -->
                        Export Data
                    </button>
                </div>
            </div>

            <!-- Vue Good Table -->

            <div class="align-middle inline-block w-full rounded-table mx-0 overflow-x-auto font-semibold">

                <vue-good-table :columns="columns" :rows="processedRows" :search-options="{ enabled: true }"
                    :pagination-options="{ enabled: true, perPage: 10 }" theme="polar-bear"
                    styleClass="vgt-table striped" compactMode>

                    <!-- Custom column rendering -->
                    <template #table-row="props">

                        <!-- STATUS COLUMN -->
                        <span v-if="props.column.field === 'status'">
                            <span class="px-2 py-1 rounded text-white text-xs font-bold"
                                :class="statusClass(props.row.rawExpiry)">
                                {{ getStatus(props.row.rawExpiry) }}
                            </span>
                        </span>

                        <!-- DEFAULT COLUMNS -->
                        <span v-else v-html="props.formattedRow[props.column.field]"></span>

                    </template>

                </vue-good-table>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usecommodityinventoriestore } from "../../../stores/commodityinventories.store";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
/* ======================
   STORE
====================== */
const store = usecommodityinventoriestore();
const expiringItems = ref([]);


const breadcrumbs = [
    { name: "Home", href: "/warehouse/dashboard", current: false },
    { name: "Stock Management", href: "#", current: true },
    {
        name: "Expiries",
        href: "#",
        current: true,
    },
];
/* ======================
   EXPIRY LOGIC
====================== */
const getStatus = (date) => {
    if (!date) return "Safe";

    const today = new Date();
    const exp = new Date(date);

    const diffDays = (exp - today) / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) return "Critical";
    if (diffDays <= 90) return "Warning";
    return "Safe";
};

const statusClass = (date) => {
    const status = getStatus(date);

    return {
        Critical: "bg-red-600",
        Warning: "bg-orange-500",
        Safe: "bg-green-600",
    }[status];
};

/* ======================
   TABLE COLUMNS
====================== */
const columns = [
    {
        label: "Commodity",
        field: "commodityName",
    },
    {
        label: "Warehouse",
        field: "warehouseName",
    },
    {
        label: "Expiry Date",
        field: "expiryDate",
    },
    {
        label: "Status",
        field: "status",
    },
];

/* ======================
   TABLE ROWS (FORMAT DATA)
====================== */
const processedRows = computed(() => {
    return expiringItems.value.map((item) => ({
        id: item.id,

        commodityName: item.commodity?.Name || "-",
        warehouseName: item.warehouse?.Name || "-",

        // formatted display
        expiryDate: item.ExpiryDate
            ? new Date(item.ExpiryDate).toLocaleDateString()
            : "-",

        // raw date for logic (IMPORTANT)
        rawExpiry: item.ExpiryDate,
    }));
});

const exportToExcel = () => {

    const exportData = processedRows.value.map((item, index) => ({
        "#": index + 1,
        Commodity: item.commodityName,
        Warehouse: item.warehouseName,
        "Expiry Date": item.expiryDate,
        Status: getStatus(item.rawExpiry)
    }));


    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Expiring Commodities"
    );


    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });


    const blob = new Blob(
        [excelBuffer],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );


    saveAs(
        blob,
        `Expiring_Commodities_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
};
const load = async () => {
    const data = await store.get();



    expiringItems.value = data.filter(
        (item) => item.ExpiryDate !== "safe" // only items with expiry dates
    );
};

onMounted(load);
</script>

<style>
.rounded-table {
    border-radius: 10px;
    /* Adjust the radius as needed */
    overflow: hidden;
    /* This is important to apply rounded corners to child elements */
}

.from-color {
    color: #096eb4;
    /* or any color you prefer */
}

.to-color {
    color: green;
    /* or any color you prefer */
}

.by-color {
    color: gray;
    /* or any color you prefer */
}

.tab-button {
    background-color: #248cd6;
    color: white;
    border: none;
}

.active-tab {
    background-color: #0f6c97;
    color: white;
}
</style>