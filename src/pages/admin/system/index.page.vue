<template>
  <main>
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-full mx-auto px-4 sm:px-6 lg:max-w-5xl lg:px-8">
      <!-- Breadcrumb -->
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <!-- Header Section -->
      <div class="md:flex md:items-center md:justify-between mt-6">
        <div class="flex-1 min-w-0 text-center sm:text-left">
          <h2 class="font-bold leading-7 text-white text-lg sm:text-2xl sm:truncate">
            System Management Panel
          </h2>
        </div>
      </div>

      <!-- Grouped Tiles -->
      <div v-for="group in optionGroups" :key="group.title" class="mt-10">
        <!-- Group Title -->
        <h3 class="text-lg text-white font-bold text-center sm:text-left">
          {{ group.title }}
        </h3>

        <!-- Tiles -->
        <div class="flex flex-wrap justify-center md:justify-start -mx-2 mt-4">
          <div
            v-for="option in group.options"
            :key="option.label"
            class="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 relative"
            @mouseenter="showDropdown(option.label)"
            @mouseleave="hideDropdown(option.label)"
          >
            <!-- Normal tile without dropdown -->
            <router-link
              v-if="option.label !== 'Stock Register'"
              :to="option.path"
              class="block"
            >
              <div
                class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-500 transition-all duration-300"
              >
                <component :is="option.icon" class="h-6 w-6 mb-2" />
                <span class="text-center text-sm sm:text-base">
                  {{ option.label }}
                </span>
              </div>
            </router-link>

            <!-- Stock Register tile with dropdown -->
            <div v-else class="relative">
              <div
                class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-500 transition-all duration-300"
              >
                <component :is="option.icon" class="h-6 w-6 mb-2" />
                <span class="text-center text-sm sm:text-base">
                  {{ option.label }}
                </span>
              </div>
              <!-- Hover Dropdown -->
              <div
                v-if="dropdownVisible['Stock Register']"
                class="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg text-black z-50"
              >
                <router-link
                  to="/admin/stock-management/warehouses"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  Warehouse View
                </router-link>
                <router-link
                  to="/admin/stock-management"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  Stock View
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import {
  OfficeBuildingIcon,
  UserGroupIcon,
  ClipboardListIcon,
  UserIcon,
  KeyIcon,
  ArchiveIcon,
  FolderIcon,
  ChatIcon,
  LocationMarkerIcon,
  TrendingUpIcon,
  TruckIcon,
  MailIcon,
  BellIcon,
  ChartBarIcon,
  MapIcon,
  ScaleIcon,
} from "@heroicons/vue/outline";
import { DocumentIcon, DocumentTextIcon } from "@heroicons/vue/solid";

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "System Management Panel", href: "#", current: true },
];

const optionGroups = ref([
  {
    title: "Organizational Management",
    options: [
      { label: "Organisations", icon: OfficeBuildingIcon, path: "/admin/organisations" },
      { label: "User Roles", icon: UserGroupIcon, path: "/admin/userroles" },
      { label: "Users", icon: UserIcon, path: "/admin/users" },
      { label: "Performance Stats", icon: ChartBarIcon, path: "/admin/performance-stats" },
      { label: "Reminders", icon: BellIcon, path: "/admin/reminders" },
      { label: "Mailing Groups", icon: MailIcon, path: "/admin/mailinggroups" },
      { label: "Action Requestors", icon: DocumentTextIcon, path: "/admin/requestors" },
      { label: "Feedback", icon: ChatIcon, path: "/admin/feedback" },
    ],
  },
  {
    title: "Commodity Management",
    options: [
      { label: "Activities", icon: KeyIcon, path: "/admin/activity-management" },
      { label: "User Dispatches", icon: TruckIcon, path: "/admin/user-dispatches" },
      { label: "Stock Register", icon: ClipboardListIcon, path: "/admin/stock-management" },
      { label: "Warehouses", icon: OfficeBuildingIcon, path: "/admin/warehouse-management" },
      { label: "Transporters", icon: TruckIcon, path: "/admin/transporter-management" },
      { label: "Commodities", icon: MapIcon, path: "/admin/commodity-management" },
      { label: "Commodity Types", icon: ScaleIcon, path: "/admin/commodity-types" },
      { label: "Receipts", icon: DocumentTextIcon, path: "/admin/receipts" },
    ],
  },
  {
    title: "Geographical Data Management",
    options: [
      { label: "Districts", icon: MapIcon, path: "/admin/districts" },
      { label: "FDPs", icon: LocationMarkerIcon, path: "/admin/fdps" },
    ],
  },
  {
    title: "Reporting and Logs",
    options: [
      { label: "Logs", icon: ArchiveIcon, path: "/admin/logs" },
      { label: "Usage Stats", icon: TrendingUpIcon, path: "/admin/usage-stats" },
    ],
  },
]);

const dropdownVisible = ref({});

function showDropdown(label) {
  dropdownVisible.value[label] = true;
}
function hideDropdown(label) {
  dropdownVisible.value[label] = false;
}
</script>

<style>
/* Add any custom dropdown styling overrides here */
</style>
