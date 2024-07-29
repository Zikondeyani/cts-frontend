<template>
  <main class="font-bold">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="mt-2 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate mb-3">
            Report Management
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
      <!-- tabs -->
      <div class="align-middle inline-block min-w-full">
        <ul class="nav nav-tabs flex flex-col md:flex-row flex-wrap pl-0 mb-4 border-b border-blue-300 lg:w-full md:w-40 sm:w-40" id="tabs-menu"
          role="tablist">
          <li class="nav-item md:mr-1" role="presentation">
            <a href="#user-relief"
              class="nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1 hover:border-transparent hover:bg-blue-100 focus:border-transparent active"
              id="tabs-user-relief" data-bs-toggle="pill" data-bs-target="#user-relief" role="tab"
              aria-controls="user-relief" aria-selected="true">Stock Position</a>
          </li>
          <li class="nav-item md:mr-1" role="presentation">
            <a href="#user-settings"
              class="nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1 hover:border-transparent hover:bg-blue-100 focus:border-transparent"
              id="tabs-user-settings" data-bs-toggle="pill" data-bs-target="#user-settings" role="tab"
              aria-controls="user-settings" aria-selected="false">Commodity Distribution Report</a>
          </li>
          <li class="nav-item md:mr-1" role="presentation">
            <a href="#user-lean"
              class="nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1 hover:border-transparent hover:bg-blue-100 focus:border-transparent"
              id="tabs-user-lean" data-bs-toggle="pill" data-bs-target="#user-lean" role="tab"
              aria-controls="user-settings" aria-selected="false">Lean Season Dispatch Reports</a>
          </li>
        </ul>
        <div class="tab-content" id="tabs-user-options">
          <div class="tab-pane fade show active mt-3" id="user-relief" role="tabpanel"
            aria-labelledby="tabs-user-relief">
            <user-relief :data="warehousesinventory" v-on:update="updateOrCreateReliefItems" />
          </div>
          <div class="tab-pane fade contain" id="user-settings" role="tabpanel" aria-labelledby="tabs-user-settings">
            <commodity-distribution-table :data="commodityDistributionData" :screenshotMode="screenshotMode" />
          </div>
          <div class="tab-pane fade" id="user-lean" role="tabpanel" aria-labelledby="tabs-user-lean">
            <user-lean :screenshotMode="screenshotMode" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import UserProfile from "../../../components/pages/users/profile.component.vue";
import UserLogs from "../../../components/pages/users/logs.component.vue";
import UserSettings from "../../../components/pages/instruction/settings.component.vue";
import CommodityDistributionTable from './CommodityDistributionTable.vue';

import UserRelief from "./StockPositioning.vue";


import UserLean from "./leanseason.page.vue";

//SCHEMA//AND//STORES


import { UpdateUserSchema } from "../../../services/schema/user.schema";
import { useInstructedCommoditiesStore } from "../../../stores/instructedCommodities.store";

import { useinstructionstore } from "../../../stores/instructions.store";
import { userequisitionstore } from "../../../stores/requisition.store";

import { usewarehousestore } from "../../../stores/warehouse.store";
const requisitionStore = userequisitionstore();
import { useSessionStore } from "../../../stores/session.store";

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



//VARIABLES
const id = ref(null);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Report Management", href: "#", current: false },
];

const InstructionStore = useinstructionstore();
const warehouseStore = usewarehousestore();


const InstructedCommoditiesStore = useInstructedCommoditiesStore()
const model = ref({
  Name: ""

});

// Instruction header and details

const instructedCommodities = reactive([]);
const warehousesinventory = reactive([])
const commodityDistributionData = ref([])


//MOUNTED
onMounted(async () => {
  id.value = $route.params.id;
  getInstruction();
  getWarehouseInventory()
  getInstructedCommodities();
  try {
    const data = await requisitionStore.getCommodityDistributionSummary();
    commodityDistributionData.value = [...data.filter(item => item.district == user.value.district)];
  } catch (error) {
    console.error("Failed to load commodity data:", error);
  } finally {
    isLoading.value = false;
  }
});
///FORM

///FIELDS

//FUNCTIONS

const getWarehouseInventory = async () => {
  isLoading.value = true;
  warehouseStore
    .inventorydetails()
    .then((result) => {
      warehousesinventory.push(...result.filter(item => item.warehouse.includes('DODMA')))
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get warehouses error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};



const getInstructedCommodities = async () => {
  isLoading.value = true;
  InstructedCommoditiesStore
    .get()
    .then((result) => {
      instructedCommodities.push(...result)
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get instructed commodities error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getInstruction = async () => {
  isLoading.value = true;
  InstructionStore
    .getOne(id.value)
    .then((result) => {
      model.value = result;
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get instruction error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const updateInstruction = async (newValues) => {
  isLoading.value = true;
  InstructionStore
    .update(newValues)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Successfully instruction",
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to update instruction (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};



const updateOrCreateReliefItems = async (items) => {
  isLoading.value = true;

  try {
    // Use `Promise.all` to update or create items concurrently
    await Promise.all(
      items.map(async (item) => {
        // Extract the `error` field and keep other fields for processing
        const { error, ...cleanedItem } = item;

        // Check if the item has an `id` field to determine if it's an existing item
        if (cleanedItem.id) {
          // Update the existing relief item (using the `id` for updates)


          return InstructedCommoditiesStore.update(cleanedItem);
        } else {
          // Create a new relief item if there's no `id` field
          return InstructedCommoditiesStore.create(cleanedItem);
        }
      })
    );

    // Notify the user of the successful operation
    Swal.fire({
      title: "Success",
      text: "Successfully updated/added the relief item list",
      icon: "success",
    });
  } catch (error) {
    // Notify the user in case of any errors during processing
    Swal.fire({
      title: "Failed",
      text: `Failed to update/create the relief item list (${error.message})`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    // Reset the loading state once processing is complete
    isLoading.value = false;
  }
};




const updateRelief = async (newValues) => {
  isLoading.value = true;

  try {
    // Loop through each object to clean and submit individually
    for (const item of newValues) {
      // Remove the `error` field using destructuring
      const { error, ...cleanedItem } = item;

      // Create the relief item individually
      await InstructedCommoditiesStore.create(cleanedItem);
    }

    Swal.fire({
      title: "Success",
      text: "Successfully submitted the relief item list",
      icon: "success",
    });
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: `Failed to create the relief item list (${error.message})`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};

const showPrintModal = ref(false);




// Function to print the instruction details
const printPDF = async () => {
  // Temporarily hide the buttons before taking the screenshot
  const noPrintElements = document.querySelectorAll('.no-print');
  noPrintElements.forEach(element => {
    element.style.display = 'none';
  });

  const contentElement = document.getElementById('content');

  // Set high-quality scale factor
  const scaleFactor = 2; // Adjust as needed to improve quality
  const canvas = await html2canvas(contentElement, {
    scale: scaleFactor, // High scale factor improves quality
    useCORS: true, // Allow cross-origin images if used
  });

  const imgData = canvas.toDataURL('image/png');

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: 'portrait', // or 'landscape' based on your content
    unit: 'mm',
    format: 'a4',
  });

  // Set the width and height for the image inside the PDF
  const imgWidth = 190; // Adjust as needed
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Add the image to the PDF
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

  // Add the footer text
  const currentDate = new Date().toLocaleString(); // Get the current date and time
  const footerText = `DODMA COMMODITY TRACKING SYSTEM - ${currentDate}`;
  const footerYPosition = 290; // Adjust this based on the page size
  pdf.setFontSize(10);
  pdf.text(footerText, 10, footerYPosition);

  // Save the PDF file
  pdf.save('GoodsReleaseInstruction.pdf');

  // Show the buttons again after the screenshot is taken
  noPrintElements.forEach(element => {
    element.style.display = 'block';
  });
};




// Function to close the modal
const closePrintModal = () => {
  showPrintModal.value = false;
};

const logoBase64 = " data:image/png;base64,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"


</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}

.nav-link {
  background-color: #FFF;
  /* Gray color for inactive links, adjust as needed */
  /* ... other styles ... */
}

/* Optional: Add a hover effect for nav links */
.nav-link:hover {
  color: #000;
  /* Light grey for hover, adjust as needed */
  /* ... other styles ... */
}

.nav-tabs .nav-link.active {
  color: #000;
  border-color: #d3d3d3;

  background-color: #d3d3d3;
}

.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}


</style>
