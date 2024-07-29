<template>
  <div class="min-h-full font-body" style="background-color: #096eb4;">
    <!-- Horizontal Navigation Bar for Desktop, Vertical for Mobile -->
    <nav aria-label="Sidebar" class="shadow-xl px-1 py-3 rounded-md" style="background-color: #096eb4;">
      <div class="max-w-7xl mx-auto flex justify-between items-center flex-wrap lg:flex-nowrap">
        <!-- Logo and Admin Info -->
        <div class="flex items-center justify-between w-full lg:w-auto">
          <div class="flex items-center">
            <a href="#" class="bg-transparent rounded-md shadow-0 px-0 flex items-center">
              <img class="block" src="../../assets/images/images.png" alt="govt" style="height: 50px;" />
            </a>
            <a href="#" class="bg-transparent rounded-md shadow-0 px-0 flex items-center">
              <img class="block" src="../../assets/images/wfp-logo-emblem-white.png" alt="wfp" style="height: 50px;" />
            </a>
          </div>
          <button @click="toggleMobileMenu" class="lg:hidden">
            <MenuIcon class="h-6 w-6 text-white" />
          </button>
          <!-- Admin Text and Location Info -->
          <span class="font-bold text-white mx-4 hidden lg:block">DODMA CTS | Planner
            <span class="text-xs font-normal">(v2.0)</span>
          </span>
          <div class="flex items-center ml-2 hidden lg:flex">
            <LocationMarkerIcon class="h-5 w-5 text-white mr-2" />
            <span class="text-white font-medium text-sm">
              {{ user?.district }}
            </span>
          </div>
        </div>
        <!-- Mobile Admin Text -->
        <span class="font-bold text-white mx-4 block lg:hidden">DODMA CTS | Planner
          <span class="text-xs font-normal">(v2.0)</span>
        </span>
        <!-- Navigation Items for Desktop -->
        <div class="flex flex-col lg:flex-row lg:space-x-4 mt-2 lg:mt-0 w-full lg:w-auto hidden lg:flex">
          <router-link v-for="item in firstFiveItems" :key="item.name" :to="item.href"
            class="block lg:inline-block mt-2 lg:mt-0">
            <a :class="itemClasses(item)" :aria-current="item.current ? 'page' : undefined">
              {{ item.name }}
            </a>
          </router-link>
          <!-- Dropdown for the rest of the items -->
          <div v-if="remainingItems.length > 0" class="relative block lg:inline-block mt-2 lg:mt-0">
            <button @click="toggleDropdown" @mouseenter="toggleDropdown"
              class="text-gray-50 hover:text-gray-50 hover:bg-blue-400 px-2 py-2 text-xs font-medium rounded-md">
              More...
            </button>
            <div v-if="isDropdownOpen" @mouseleave="closeDropdown" @focusout="closeDropdown"
              class="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg">
              <router-link v-for="item in remainingItems" :key="item.name" :to="item.href"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <!-- Notification Button -->
        <div class="relative hidden lg:block">
          <button @click="toggleNotifications"
            class="text-gray-50 hover:text-gray-50 hover:bg-blue-400 px-2 py-2 text-sm font-medium rounded-md">
            <BellIcon class="h-6 w-6 text-white" aria-hidden="true" />
            <span v-if="notificationsCount > 0"
              class="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
              {{ notificationsCount }}
            </span>
          </button>
          <div v-if="isNotificationsOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10"
            @mouseleave="toggleNotifications">
            <div class="py-2 px-4 text-xs text-gray-700" @mouseleave="toggleNotifications">
              <p v-if="notifications.length === 0">No new notifications</p>
              <ul v-else>
                <li v-for="(notification, index) in notifications" :key="index" class="py-1 border-b border-gray-200">
                  <router-link :to="notification.href" class="text-blue-500 hover:underline">
                    {{ notification.message }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- User Menu for Desktop -->
        <div class="relative ml-5 hidden lg:block">
          <Menu as="div" class="flex-shrink-0 relative">
            <div>
              <MenuButton
                class="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                <span class="sr-only">Open user menu</span>
                <span class="lowercase m-2 text-white"> {{ user?.username.replace(/\./g, ' ') }} </span>
                <span style="background-color:gray"
                  class="inline-flex items-center px-3 rounded-full text-sm font-medium text-white uppercase">
                  {{ user?.username.match(/\b(\w)/g).join("") }}
                </span>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                <a :href="item.href" :class="[active ? 'bg-white' : '', 'block py-2 px-4 text-sm text-gray-700']">
                  {{ item.name }}
                </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <button @click="onAbout()" :class="menuItemClasses(active, true)">
                  About System
                </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <button @click="onSignout" :class="menuItemClasses(active, true)">
                  Sign out
                </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="lg:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link v-for="item in navItems" :key="item.name" :to="item.href"
            class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-400">
            {{ item.name }}
          </router-link>
        </div>
        <!-- Notification Button -->
        <div class="relative px-2 pt-2 pb-3 sm:px-3">
          <button @click="toggleNotifications"
            class="text-gray-50 hover:text-gray-50 hover:bg-blue-400 px-2 py-2 text-sm font-medium rounded-md">
            <BellIcon class="h-6 w-6 text-white" aria-hidden="true" />
            <span v-if="notificationsCount > 0"
              class="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
              {{ notificationsCount }}
            </span>
          </button>
          <div v-if="isNotificationsOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
            <div class="py-2 px-4 text-xs text-gray-700">
              <p v-if="notifications.length === 0">No new notifications</p>
              <ul v-else>
                <li v-for="(notification, index) in notifications" :key="index" class="py-1 border-b border-gray-200">
                  <router-link :to="notification.href" class="text-blue-500 hover:underline">
                    {{ notification.message }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- User Menu for Mobile -->
      <div class="relative mt-4 block lg:hidden w-full">
        <Menu as="div" class="flex-shrink-0 relative">
          <div class="flex justify-end">
            <MenuButton
              class="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
              <span class="sr-only">Open user menu</span>
              <span class="lowercase m-2 text-white"> {{ user?.username.replace(/\./g, ' ') }} </span>
              <span style="background-color:gray"
                class="inline-flex items-center px-3 rounded-full text-sm font-medium text-white uppercase">
                {{ user?.username.match(/\b(\w)/g).join("") }}
              </span>
            </MenuButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems
              class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
              <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
              <a :href="item.href" :class="[active ? 'bg-white' : '', 'block py-2 px-4 text-sm text-gray-700']">
                {{ item.name }}
              </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <button @click="onAbout()" :class="menuItemClasses(active, true)">
                About System
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <button @click="onSignout" :class="menuItemClasses(active, true)">
                Sign out
              </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </nav>
    <!-- Main Content -->
    <div class="py-4">
      <div class="max-w-3xl mx-auto sm:px-1 lg:max-w-7xl lg:px-1 lg:grid lg:grid-cols-12 lg:gap-5">
        <!-- Page Content -->
        <div class="lg:col-span-12 xl:col-span-12">
          <router-view />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-white text-center p-4" style="background-color: #096eb4;">
      <span class="inline-block align-middle text-sm">
        © 2024 Designed by WFP Malawi Supply Chain Unit
      </span>
    </footer>
  </div>
</template>
<script setup>
import { inject, ref, watch, reactive, onMounted, computed, toRefs, onBeforeUnmount } from "vue";
import { useSessionStore } from "../../stores/session.store";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";
import {
  ClockIcon,
  HomeIcon,
  MenuIcon,
  MenuAlt1Icon,
  ViewListIcon,
  UsersIcon,
  XIcon,
  BellIcon,
  UserCircleIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  CollectionIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
  MapIcon,
  AdjustmentsIcon,
} from "@heroicons/vue/outline";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  SearchIcon,
  SelectorIcon,
} from "@heroicons/vue/solid";
import { saveDataOffline, getDataOffline, clearDataOffline } from '@/services/localbase';

import eventBus from '../../services/events/eventbus';
import { userequisitionstore } from "../../stores/requisition.store";
import { useinstructionstore } from "../../stores/instructions.store";
import { useloadingplanstore } from "../../stores/loadingplans.store";

const requisitionsStore = userequisitionstore();
const requisitions = reactive([]);
const instructionsStore = useinstructionstore();
const instructions = reactive([]);

const loadingplanStore = useloadingplanstore();
const loadingplans = reactive([]);

// DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
const $router = useRouter();

// INJECTIONS
const moment = inject("moment");
const Swal = inject("Swal");

// VARIABLES
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);
const notifications = ref([]);
const notificationsCount = computed(() => notifications.value.length);
const isNotificationsOpen = ref(false);

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

const newRequisitionsCount = ref(0);

const newRejectedInstructionsCount = ref(0);

const newRejectedLoadingPlanCount = ref(0);
const isDropdownOpen = ref(false);

const menuItemClasses = (active, isButton = false) => [
  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
  'block px-4 py-2 text-sm',
  isButton ? 'w-full text-left' : ''
];

const onAbout = async () => {
  $router.push({ path: "/dodma/about-system" });
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

function signOut() {
  userStore.signOut(); // Your sign-out logic
  isDropdownOpen.value = false;
}

function gotoSystemsettings() {
  $router.push({ path: '/warehouse/system' });
}

const isLoading = ref(false);

onMounted(() => {

  startSignOutTimer();
  getRequisitions();
  getInstructions();
  getLoadingPlans();
  eventBus.on('requisitionArchived', (requisitionId) => {
    // Update the notification count
    getRequisitions();
    getInstructions();
    getLoadingPlans();
    updateNotifications();
    addEventListeners();
  });
});


const isMobileMenuOpen = ref(false)


// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value

}
function navigation() {
  let navList = [
    { name: "Home", href: "/dodma/dashboard", icon: HomeIcon, current: false },
    { name: "Project Management", href: "/dodma/project-management", icon: IdentificationIcon, current: false },
    { name: "Requisitions", href: "/dodma/requisition-management", icon: ClipboardListIcon, current: false },
    { name: "Instructions", href: "/dodma/instruction-management", icon: CollectionIcon, current: false },
    { name: "Reports", href: "/dodma/report-management", icon: DocumentTextIcon, current: false },
  ];

  const currentRouteBase = $router.currentRoute.value.fullPath.split("/").slice(0, 3).join("/");

  navList.forEach(navItem => {
    const isMatched = currentRouteBase === navItem.href ||
      (navItem.name === "Project Management" && (currentRouteBase.startsWith("/dodma/dispatch-management") || currentRouteBase.startsWith("/dodma/loadingplans") || currentRouteBase.startsWith("/dodma/dispatches"))) ||
      (navItem.name === "Receipts" && (currentRouteBase.startsWith("/warehouse/receipts")));
    navItem.current = isMatched;
  });

  return navList;
}

// Select active page the route must be the same as the full path
const userNavigation = [
  // { name: "Profile", href: "#" },
  // { name: "Settings", href: "#" },
];
const links = [
  {
    name: "CTS",
    href: process.env.VUE_APP_URL,
    target: "_blank",
  },
];

const open = ref(false);

const navItems = computed(() => navigation());
const firstFiveItems = computed(() => navItems.value.slice(0, 3));
const remainingItems = computed(() => navItems.value.slice(3));
const signOutTimeout = ref(null);

const itemClasses = (item) => [
  item.current ? 'bg-white text-black' : 'text-gray-50 hover:text-gray-50 hover:bg-blue-400',
  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
];


const onSignout = async () => {
  try {
    await sessionStore.signOut();
    await clearDataOffline("session");
    clearSignOutTimer();
    sessionStore.$reset();
    await $router.push({ path: "/portal/signin" }).then((res) => {
      if (res === undefined) {
        Swal.fire({
          text: "Securely signed out",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

const updateNotifications = () => {
  notifications.value = [];
  if (newRequisitionsCount.value > 0) {
    notifications.value.push({
      message: `Pending Requisitions (${newRequisitionsCount.value})`,
      href: "/dodma/requisition-management"
    });
  }

  if (newRejectedInstructionsCount.value > 0) {
    notifications.value.push({
      message: `Rejected Instructions (${newRejectedInstructionsCount.value})`,
      href: "/dodma/rejected-instruction-management"
    });
  }

  if (newRejectedLoadingPlanCount.value > 0) {
    notifications.value.push({
      message: `Rejected Loading Plans (${newRejectedLoadingPlanCount.value})`,
      href: "/dodma/rejected-instruction-management"
    });
  }
};

const getInstructions = async () => {
  isLoading.value = true;
  instructionsStore
    .get()
    .then((result) => {
      instructions.length = 0;
      instructions.push(...result.filter(item => item.IsRejected == true));
      newRejectedInstructionsCount.value = instructions.length;
      updateNotifications();
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const getLoadingPlans = async () => {
  isLoading.value = true;
  loadingplanStore
    .get()
    .then((result) => {
      loadingplans.length = 0;
      loadingplans.push(...result.filter(item => item.IsRejected == true));
      newRejectedLoadingPlanCount.value = loadingplans.length;
      updateNotifications();
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const getRequisitions = async () => {
  isLoading.value = true;
  requisitionsStore
    .get()
    .then((result) => {
      requisitions.length = 0;
      requisitions.push(...result.filter(item => item.IsArchived == false || item.IsArchived == null));
      newRequisitionsCount.value = requisitions.length;
      updateNotifications();
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const startSignOutTimer = () => {
  clearSignOutTimer();
  signOutTimeout.value = setTimeout(() => {
    onSignout();
  }, 1800000);
};

const clearSignOutTimer = () => {
  if (signOutTimeout.value) {
    clearTimeout(signOutTimeout.value);
    signOutTimeout.value = null;
  }
};

const resetSignOutTimer = () => {
  startSignOutTimer();
};

const addEventListeners = () => {
  window.addEventListener('mousemove', resetSignOutTimer);
  window.addEventListener('keydown', resetSignOutTimer);
};

const removeEventListeners = () => {
  window.removeEventListener('mousemove', resetSignOutTimer);
  window.removeEventListener('keydown', resetSignOutTimer);
};

onBeforeUnmount(() => {
  eventBus.off('requisitionArchived');
  clearSignOutTimer();
  removeEventListeners();
});


</script>
