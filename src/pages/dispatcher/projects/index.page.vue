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
            Project & Donation Management
          </h2>
        </div>
      </div>

      <div class="flex flex-wrap justify-center md:justify-start -mx-2 mt-7">
        <div v-for="option in options" :key="option.label" class="p-2 md:w-1/3 lg:w-1/5 relative group">
          <div @mouseover="showDropdown(option.label)" @mouseleave="maybeHideDropdown(option.label)">
            <router-link :to="option.path" class="block">
              <div
                class="flex flex-col items-center justify-center bg-[#096eb4] rounded-lg p-4 text-white shadow-xl cursor-pointer hover:bg-blue-400 transition m-2">
                <component :is="option.icon" class="h-6 w-6 mb-2" />
                <span class="text-center p-2">{{ option.label }}</span>
              </div>
            </router-link>
          </div>
          <!-- Dropdown for Lean Season Response -->
          <div v-if="option.label === 'Lean Season Response'" v-show="option.showDropdown"
            @mouseover="keepDropdownVisible(option.label)" @mouseleave="maybeHideDropdown(option.label)"
            class="dropdown-menu">
            <router-link to="/dispatcher/loadingplans"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200">
              Loading Plans
            </router-link>
            <router-link to="/dispatcher/dispatches"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200">
              Dispatches
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { TruckIcon, MapIcon, UserIcon, HomeIcon, LocationMarkerIcon, TemplateIcon, HeartIcon, LightningBoltIcon } from "@heroicons/vue/outline";

const isLoading = ref(false); // Example reactive state
const breadcrumbs = [
  { name: "Home", href: "/dispatcher/dashboard", current: false },
  { name: "Project & Donation Management", href: "#", current: true },
];
const options = ref([
  { label: 'Lean Season Response', icon: TemplateIcon, path: '/dispatcher/dispatch-management', showDropdown: false },
  /* { label: 'Emergency Response', icon: LightningBoltIcon, path: '/activities' },
   */{ label: 'Donation Management', icon: HeartIcon, path: '/dispatcher/donations' },
  // ... other options as needed
]);

const showDropdown = (label) => {
  options.value.forEach(option => {
    if (option.label === label) {
      option.showDropdown = true;
    }
  });
};

const maybeHideDropdown = (label) => {
  setTimeout(() => {
    const hoveredDropdown = options.value.find(option => option.label === label && option.showDropdown);
    if (hoveredDropdown && !hoveredDropdown.hovered) {
      hideDropdown(label);
    }
  }, 100); // small delay to allow mouseover on dropdown
};

const hideDropdown = (label) => {
  options.value.forEach(option => {
    if (option.label === label) {
      option.showDropdown = false;
    }
  });
};

const keepDropdownVisible = (label) => {
  options.value.forEach(option => {
    if (option.label === label) {
      option.hovered = true;
    }
  });
};

const removeDropdownVisibility = (label) => {
  options.value.forEach(option => {
    if (option.label === label) {
      option.hovered = false;
      maybeHideDropdown(label);
    }
  });
};
</script>

<style scoped>
.dropdown-menu {
  position: absolute;
  left: 0;
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  transform-origin: top center;
  transform: scale(0.95);
  opacity: 0;
  z-index: 10;
  padding: 10px;
}

.group:hover .dropdown-menu,
.group:focus .dropdown-menu,
.dropdown-menu:hover {
  transform: scale(1);
  opacity: 1;
}

/* Custom shape based on the uploaded image */
.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 10px 10px 10px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}
</style>
