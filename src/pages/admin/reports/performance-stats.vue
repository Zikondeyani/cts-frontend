<template>
    <main class="bg-transparent min-h-screen">
      <!-- Spinner -->
      <spinner-widget v-bind:open="isLoading" />
  
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb Widget -->
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
  
        <!-- Header Section with Title and Export Button -->
        <div class="flex items-center justify-between mt-6">
          <!-- Page Title -->
          <h2 class="text-2xl font-bold text-white">
            Dispatcher Performance Statistics
          </h2>
  
          <!-- Export Button -->
          <button
            type="button"
            class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-sm rounded shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out capitalize"
            @click="generateExcel"
          >
            <i class="fas fa-file-export mr-2"></i> Export Data
          </button>
        </div>
  
        <!-- Performance Chart Section -->
        <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      
          <dispatcher-performance :dispatchData="dispatches" />
        </div>
      </div>
    </main>
  </template>
  
  
  <script setup>
  // import the styles
  
  import { inject, ref, reactive, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import {
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon, TrashIcon, TruckIcon
  } from "@heroicons/vue/solid";
  //COMPONENTS
  import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
  import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
  import createListingForm from "../../../components/pages/catalogue/create.component.vue";
  //SCHEMA//AND//STORES
  import dispatcherPerformance from '../../../components/pages/charts/dispatcherPerformance.vue'; // Adjust path as needed


  import { useSessionStore } from "../../../stores/session.store";

  
  //INJENCTIONS
  const $router = useRouter();
  const moment = inject("moment");
  const Swal = inject("Swal");
  //VARIABLES
  const isLoading = ref(false);
  const breadcrumbs = [
    { name: "Home", href: "/admin/dashboard", current: false },
    { name: "Performance Statistics", href: "#", current: true },
  ];
  
  
  import { useDispatcherStore } from "../../../stores/dispatch.store";
  
  import * as XLSX from 'xlsx';
  
  
  const dispatchStore = useDispatcherStore();
  const dispatches = reactive([]);
  
  
  
  
  const sessionStore = useSessionStore();
  
  const user = ref(sessionStore.getUser);
 

  //MOUNTED
  onMounted(() => {
    getdispatches();
    // getLatest()
  });
  //FUNCTIONS
  

  const generateExcel = () => {

  const worksheet = XLSX.utils.json_to_sheet(dispatches);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Statistics");

  XLSX.writeFile(workbook, "dispatcher_performance.xlsx");


};

  const getdispatches = async () => {
 
    try {
      const result = await dispatchStore.getdispatchPerfomance();
  
      const reverseddispatches = result
  
      dispatches.length = 0;
      dispatches.push(...reverseddispatches); 

  
    } catch (error) {
      // Handle any errors that occur during the get or reverse
      console.error('Failed to fetch and reverse dispatches:', error);
    } finally {
      isLoading.value = false;
    }
  };
  


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
  </style>
  