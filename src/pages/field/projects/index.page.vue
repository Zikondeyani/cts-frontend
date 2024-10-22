<template>
  <main>
    <spinner-widget v-bind:open="isLoading" />

    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Dispatch Management
          </h2>
        </div>
      </div>

      <div class="flex flex-wrap justify-center md:justify-start -mx-2 mt-7">
        <div
          v-for="option in options"
          :key="option.label"
          class="tile-container p-2 md:w-1/3 lg:w-1/5 relative group"
        >
          <div @mouseover="showDropdown(option.label)" @mouseleave="maybeHideDropdown(option.label)">
            <router-link :to="option.path" class="block">
              <div class="tile-content">
                <component :is="option.icon" class="h-6 w-6 mb-2" />
                <span class="text-center p-2">{{ option.label }}</span>
              </div>
            </router-link>
          </div>

          <div
            v-if="option.label.includes('Lean Season Response')"
            v-show="option.showDropdown"
            @mouseover="keepDropdownVisible(option.label)"
            @mouseleave="maybeHideDropdown(option.label)"
            class="dropdown-menu"
          >
            <router-link to="/field/dispatch-management" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">
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
import {
  TruckIcon,
  MapIcon,
  UserIcon,
  HomeIcon,
  LocationMarkerIcon,
  TemplateIcon,
  HeartIcon,
  LightningBoltIcon,
} from "@heroicons/vue/outline";

const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Dispatch Management", href: "#", current: true },
];

const options = ref([
  {
    label: "Lean Season Response & Emergency Assistance",
    icon: TemplateIcon,
    path: "/field/dispatch-management",
    showDropdown: false,
  },
  { label: "Emergency Response", icon: LightningBoltIcon, path: "/field/dispatches/emergency" },
]);

const showDropdown = (label) => {
  options.value.forEach((option) => {
    if (option.label === label) {
      option.showDropdown = true;
    }
  });
};

const maybeHideDropdown = (label) => {
  setTimeout(() => {
    const hoveredDropdown = options.value.find(
      (option) => option.label === label && option.showDropdown
    );
    if (hoveredDropdown && !hoveredDropdown.hovered) {
      hideDropdown(label);
    }
  }, 100);
};

const hideDropdown = (label) => {
  options.value.forEach((option) => {
    if (option.label === label) {
      option.showDropdown = false;
    }
  });
};

const keepDropdownVisible = (label) => {
  options.value.forEach((option) => {
    if (option.label === label) {
      option.hovered = true;
    }
  });
};
</script>

<style scoped>
.tile-container {
  display: flex;
  align-items: stretch;
}

.tile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px; /* Set fixed height for consistent tile size */
  background-color: #096eb4;
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.tile-content:hover {
  background-color: #4299e1;
}

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
