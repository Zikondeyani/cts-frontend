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
            Loading Plan Management
          </h2>
        </div>
      </div>

      <div class="flex flex-wrap justify-center md:justify-start -mx-2 mt-7">
        <div v-for="option in options" :key="option.label" class="p-2 md:w-1/3 lg:w-1/5">
          <router-link :to="option.path" class="block">
            <div
              class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-400 transition m-2">
              <component :is="option.icon" class="h-6 w-6 mb-2" />
              <span class="text-center p-2">{{ option.label }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { TruckIcon, MapIcon, UserIcon, HomeIcon, LocationMarkerIcon } from "@heroicons/vue/outline";

const isLoading = ref(false); // Example reactive state
const breadcrumbs = [
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Loading Plan Management", href: "#", current: true },
];
const options = ref([
  { label: 'Loading Plans', icon: MapIcon, path: '/dispatcher/loadingplans' },

  { label: 'Dispatches', icon: LocationMarkerIcon, path: '/dispatcher/dispatches' },
 /*  { label: 'Truck Drivers', icon: UserIcon, path: '/truck-drivers' },
  { label: 'Transporters', icon: TruckIcon, path: '/transporters' },
  { label: 'Warehouses', icon: HomeIcon, path: '/warehouses' },
 */  // ... other options as needed
]);
</script>

<style>
/* Additional styles if needed */
</style>
