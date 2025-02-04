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
            System Usage Statistics
          </h2>
  
          <!-- Export Button -->
         
        </div>
  
        <!-- Performance Chart Section -->
        <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      
          <usage :logsData="logs" />
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
  //SCHEMA//AND//STORES
  import usage from '../../../components/pages/charts/usage.vue'; // Adjust path as needed


  import { useSessionStore } from "../../../stores/session.store";
  //INJENCTIONS
  const $router = useRouter();
  const moment = inject("moment");
  const Swal = inject("Swal");
  //VARIABLES
  const isLoading = ref(false);
  const breadcrumbs = [
    { name: "Home", href: "/admin/dashboard", current: false },
    { name: "System Usage Statistics", href: "#", current: true },
  ];
  
  
  import { useLogStore } from "../../../stores/log.store";
  

  const logStore = useLogStore();
  const logs = reactive([]);
  
  
  
  
  const sessionStore = useSessionStore();
  
  const user = ref(sessionStore.getUser);
 

  //MOUNTED
  onMounted(() => {
    getlogs();
    // getLatest()
  });
  //FUNCTIONS
  


  const getlogs = async () => {
 
    try {
      const result = await logStore.get();
  
      const reversedlogs = result
  
      logs.length = 0;
      logs.push(...reversedlogs); 

      console.log(logs, ":smsms")
  
    } catch (error) {
      // Handle any errors that occur during the get or reverse
      console.error('Failed to fetch and reverse logs:', error);
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
  