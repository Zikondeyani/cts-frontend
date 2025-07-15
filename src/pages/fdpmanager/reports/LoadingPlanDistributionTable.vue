<template>
    <div class="w-full">
      <div
        class="flex justify-between items-center mb-2 p-2 bg-transparent rounded-md"
      >
        <span class="text-white font-bold text-lg"
          >Loading Plans and Dispatch Summary Report</span
        >
  
        <!-- Search bar -->
  
        <!-- Export Button -->
        <button
          @click="exportToExcel"
          class="ml-2 px-3 py-1.5 bg-gray-500 text-white font-medium rounded-md shadow-md hover:bg-gray-600"
        >
          Export
        </button>
      </div>
  
      <div class="relative overflow-x-auto rounded-table">
        <vue-good-table
          :columns="columns"
          :rows="paginatedData"
          :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
        >
          <!-- Table slots -->
        </vue-good-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { saveAs } from "file-saver";
  import * as XLSX from "xlsx";
  import moment from "moment"; // Import Moment.js
  
  // Props
  const props = defineProps({
    data: Array,
    dispatchdata: Array,
    screenshotMode: Boolean,
    dispatchesdataSummary: Array,
  });
  
  const searchQuery = ref("");
  const currentPage = ref(1);
  const pageSize = ref(10);
  
  // Columns for VueGoodTable
  const columns = [
    { label: "ATC", field: "loadingPlan.ATCNumber", sortable: true },
    { label: "District", field: "district", sortable: true },
    { label: "By", field: "loadingPlan.HandledBy", sortable: true },
    { label: "Activity", field: "activity", sortable: true },
    { label: "Transporter", field: "transporter", sortable: true },
    {
      label: "Qty",
      field: "loadingPlan.Quantity",
      sortable: true,
      format: (val) => parseFloat(val).toFixed(2),
    },
    {
      label: "Dispatched",
      field: (row) => {
        // Calculate total dispatched from all dispatches
        if (Array.isArray(row.dispatches)) {
          return row.dispatches
            .reduce(
              (total, dispatch) => total + (dispatch.totalDispatched || 0),
              0
            )
            .toFixed(2);
        }
        return 0;
      },
      sortable: true,
      format: (val) => parseFloat(val).toFixed(2), // Format as 2 decimal places
    },
    {
      label: "Received/DN",
      field: (row) => {
        if (Array.isArray(row.dispatches)) {
          return row.dispatches
            .map((dispatch) => {
              // Check and map only if receiptStats and physicalDeliveryNotes exist
              return (
                dispatch?.receiptStats?.physicalDeliveryNotes
                  ?.filter(
                    (note) => note.physicalDeliveryNote && note.totalReceived
                  ) // Filter out empty notes
                  .map(
                    (note) =>
                      `DN: ${note.physicalDeliveryNote} ${parseFloat(
                        note.totalReceived || 0
                      ).toFixed(2)} MT`
                  )
                  .join(", ") || "" // Avoid joining undefined or null values
              );
            })
            .filter((entry) => entry) // Filter out empty strings
            .join(", ");
        }
        return ""; // Return empty string if dispatches is not an array
      },
      sortable: false,
    },
  ];
  
  // Filtered and sorted data
  const filteredData = computed(() => {
    const searchLower = searchQuery.value.toLowerCase();
    return props.data
      .filter((item) => {
        return (
          item.loadingPlan.ATCNumber.toLowerCase().includes(searchLower) ||
          item.loadingPlan.HandledBy.toLowerCase().includes(searchLower) ||
          item.district.toLowerCase().includes(searchLower) ||
          item.transporter.toLowerCase().includes(searchLower) ||
          item.activity.toLowerCase().includes(searchLower) ||
          item.dispatches.some(
            (dispatch) =>
              dispatch.deliveryNote.toLowerCase().includes(searchLower) ||
              dispatch?.receiptStats?.physicalDeliveryNotes.some((note) =>
                note.physicalDeliveryNote.toLowerCase().includes(searchLower)
              )
          )
        );
      })
      .sort((a, b) => {
        const aHasDeliveryNote = a.dispatches.some(
          (dispatch) => dispatch?.receiptStats?.physicalDeliveryNotes.length > 0
        );
        const bHasDeliveryNote = b.dispatches.some(
          (dispatch) => dispatch?.receiptStats?.physicalDeliveryNotes.length > 0
        );
        return bHasDeliveryNote - aHasDeliveryNote; // Sort so that items with delivery notes come first
      });
  });
  
  // Total pages based on filtered data
  const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / pageSize.value)
  );
  
  // Paginated data
  const paginatedData = computed(() => {
    return filteredData.value;
  });
  
  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
  }
  
  function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
  }
  
  const exportToExcel = () => {
    const dataForExport = filteredData.value.map((item) => ({
      "ATC Number": item.loadingPlan?.ATCNumber || "N/A",
      District: item.district || "N/A",
      Activity: item.activity || "N/A",
      Transporter: item.transporter || "N/A",
      "Quantity (Mt)": parseFloat(item.loadingPlan?.Quantity || 0).toFixed(2),
      "Total Dispatched (Mt)": item.dispatches
        .reduce(
          (sum, dispatch) => sum + parseFloat(dispatch?.totalDispatched || 0),
          0
        )
        .toFixed(2),
      "Total Received (Mt)": item.dispatches
        .reduce(
          (sum, dispatch) =>
            sum + parseFloat(dispatch?.receiptStats?.totalReceived || 0),
          0
        )
        .toFixed(2),
      "Balance (Mt)": parseFloat(item.loadingPlan?.Balance || 0).toFixed(2),
      "Delivery Notes": item.dispatches
        .flatMap(
          (dispatch) => dispatch?.receiptStats?.physicalDeliveryNotes || []
        )
        .map((note) => note.physicalDeliveryNote || "N/A")
        .join(", "),
      "Transported By": item.loadingPlan?.HandledBy || "N/A",
    }));
  
    // Summary Per Delivery Note Data
    const summaryPerDeliveryNoteData = filteredData.value.flatMap((item) =>
      item.dispatches.flatMap((dispatch) =>
        (dispatch?.receiptStats?.physicalDeliveryNotes || []).map((note) => ({
          "ATC Number": item.loadingPlan?.ATCNumber || "N/A",
          District: item.district || "N/A",
          "Quantity (Mt)": parseFloat(dispatch?.totalDispatched || 0).toFixed(2),
          "Delivery Note": note.physicalDeliveryNote || "N/A",
          "Recipient Name": dispatch.recipientName || "N/A",
          "Received On": note.receivedOn
            ? moment(note.receivedOn).format("YYYY-MM-DD")
            : "N/A",
          FDP: note.finalDestination || "N/A",
        }))
      )
    );
  
    // Additional datasets for other sheets (Receipt by FDP, Dispatched per Transporter, etc.)
    const receiptByFDPData = filteredData.value.flatMap((item) =>
      item.dispatches.flatMap((dispatch) =>
        (dispatch.receiptStats?.physicalDeliveryNotes || []).map((note) => ({
          District: item.district || "N/A",
          "ATC Number": item.loadingPlan?.ATCNumber || "N/A",
          "Received (Mt)": dispatch.receiptStats?.totalReceived || 0,
          FDP: note.finalDestination || "N/A",
          "Physical Delivery Note": note.physicalDeliveryNote || "N/A",
          "Recipient Name": dispatch.recipientName || "N/A",
          "Received On": note.receivedOn || "N/A",
        }))
      )
    );
  
    const dispatchedPerTransporterData = filteredData.value.map((item) => ({
      District: item.district || "N/A",
      "ATC Number": item.loadingPlan?.ATCNumber || "N/A",
      Transporter: item.transporter || "N/A",
      "Total Transported (Mt)":
        item.dispatches
          .reduce((sum, dispatch) => sum + (dispatch.totalDispatched || 0), 0)
          .toFixed(2) || 0,
    }));
  
    const dispatchedPerWarehouseData = filteredData.value
      .map((item) => ({
        "Warehouse Name": item.warehouse || "N/A",
        "Tonnage Drawn (Mt)":
          item.dispatches
            .reduce((sum, dispatch) => sum + (dispatch.totalDispatched || 0), 0)
            .toFixed(2) || 0,
        "District Distributed": item.district || "N/A",
        "ATC Number": item.loadingPlan?.ATCNumber || "N/A",
      }))
      .filter((item) => parseFloat(item["Tonnage Drawn (Mt)"]) > 0);
  
    const dispatchesByDateData = props.dispatchesdataSummary.map((item) => ({
      Date: moment(item.dispatchdate).format("YYYY-MM-DD") || "N/A",
      District: item.district || "N/A",
      Transporter: item.transporter || "N/A",
      Commodity: item.commodity || "N/A",
      "Total Dispatched (Mt)": item.quantity || 0,
      FDP: item.fdp,
      "ATC #": item.atcnumber,
      "Handled By": item.handledby,
    }));
  
    // Create a new workbook and add sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dataForExport),
      "Summary"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(receiptByFDPData),
      "Receipt by FDP"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dispatchedPerTransporterData),
      "Dispatched per Transporter"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dispatchedPerWarehouseData),
      "Dispatched per Warehouse"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dispatchesByDateData),
      "Dispatches by Date"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryPerDeliveryNoteData),
      "Summary per Delivery Note"
    ); // New sheet
  
    // Export workbook
    XLSX.writeFile(
      workbook,
      `Loading_Plans_and_Dispatch_Summary_Report_${moment().format(
        "YYYY-MM-DD"
      )}.xlsx`
    );
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
    width: 100px; /* Fixed width for specific columns */
  }
  
  .text-center {
    text-align: center;
  }
  </style>
  