<template>
  <main>
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            About System
          </h2>
        </div>
      </div>

      <!-- Grouped Tiles -->
      <div class="py-4">
      <div class="max-w-3xl mx-auto sm:px-1 lg:max-w-7xl lg:px-1 lg:grid lg:grid-cols-12 lg:gap-5">
        <!-- Page Content -->
        <div class="lg:col-span-12 xl:col-span-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">About the System</h2>
          <p class="text-gray-700 mb-4">The Commodity Tracking System (CTS) was developed by the WFP Malawi Supply Chain Unit for the Department of Disaster Management Affairs (DoDMA). This system is designed to assist in the efficient tracking and management of commodities during emergencies and lean seasons.</p>
          <p class="text-gray-700 mb-4">The CTS aims to enhance the visibility and traceability of commodity movements, ensuring timely and accurate delivery to intended recipients. By leveraging technology, the system improves the overall coordination and response efforts during critical times.</p>
          <p class="text-gray-700">For more information, please contact the WFP Malawi Supply Chain Unit or the Department of Disaster Management Affairs.</p>
          <div class="flex justify-center mt-8">
              <img class="img-fluid mx-2" style="height: 100px;" src="../../assets/images/images.png" alt="Image 1" />
              <img class="img-fluid mx-2" style="height: 100px;" src="../../assets/images/wfp-logo.png" alt="Image 2" />
            </div>
        </div>

      
      </div>
      
    </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import breadcrumbWidget from "../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { 
  OfficeBuildingIcon, 
  UserGroupIcon, 
  UserIcon, 
  KeyIcon, 
  ArchiveIcon, 
  FolderIcon, 
  MailIcon, 
  MapIcon, 
  ScaleIcon
} from "@heroicons/vue/outline";

const isLoading = ref(false); // Example reactive state
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "CTS v2.0", href: "#", current: true },
];
const optionGroups = ref([
  {
    title: 'Organizational Management',
    options: [
    /*   { label: 'Organisations', icon: OfficeBuildingIcon, path: '/organisations' },
      { label: 'User Roles', icon: UserGroupIcon, path: '/roles' },
    */   { label: 'Users', icon: UserIcon, path: '/admin/users' },
    ],
  },
 /*  {
    title: 'Reporting and Logs',
    options: [
      { label: 'Logs', icon: ArchiveIcon, path: '/logs' },
     ],
  },
  {
    title: 'Geographical and Unit Management',
    options: [
      { label: 'Districts', icon: MapIcon, path: '/districts' },
      { label: 'Units', icon: ScaleIcon, path: '/units' },
    ],
  }, */
  // Add more groups and options as needed
]);
</script>

<style>
/* Additional styles if needed */
</style>
