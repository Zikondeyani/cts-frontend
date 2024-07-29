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
          <span class="font-bold text-white mx-4 hidden lg:block">DODMA CTS | Admin
            <span class="text-xs font-normal">(v2.0)</span>
          </span>
        
        </div>
        <!-- Mobile Admin Text -->
        <span class="font-bold text-white mx-4 block lg:hidden">DODMA CTS | Admin
          <span class="text-xs font-normal">(v2.0)</span>
        </span>
        <!-- Navigation Items for Desktop -->
        <div class="flex flex-col lg:flex-row lg:space-x-4 mt-2 lg:mt-0 w-full lg:w-auto hidden lg:flex">
          <router-link v-for="item in firstFiveItems" :key="item.name" :to="item.href" class="block lg:inline-block mt-2 lg:mt-0">
            <a :class="itemClasses(item)" :aria-current="item.current ? 'page' : undefined">
              {{ item.name }}
            </a>
          </router-link>
          <!-- Dropdown for the rest of the items -->
          <div v-if="remainingItems.length > 0" class="relative block lg:inline-block mt-2 lg:mt-0">
            <button @click="toggleDropdown" @mouseenter="toggleDropdown" class="text-gray-50 hover:text-gray-50 hover:bg-blue-400 px-2 py-2 text-xs font-medium rounded-md">
              More...
            </button>
            <div v-if="isDropdownOpen" @mouseleave="closeDropdown" @focusout="closeDropdown" class="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg">
              <router-link v-for="item in remainingItems" :key="item.name" :to="item.href" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <!-- User Menu for Desktop -->
        <div class="relative ml-5 hidden lg:block">
          <Menu as="div" class="flex-shrink-0 relative">
            <div>
              <MenuButton class="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                <span class="sr-only">Open user menu</span>
                <span class="lowercase m-2 text-white"> {{ user?.username.replace(/\./g, ' ') }} </span>
                <span style="background-color:gray" class="inline-flex items-center px-3 rounded-full text-sm font-medium text-white uppercase">
                  {{ user?.username.match(/\b(\w)/g).join("") }}
                </span>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
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
          <router-link v-for="item in navItems"  @click="toggleMobileMenu()" :key="item.name" :to="item.href" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-400">
            {{ item.name }}
          </router-link>
        </div>
      </div>
      <!-- User Menu for Mobile -->
      <div class="relative mt-4 block lg:hidden w-full">
        <Menu as="div" class="flex-shrink-0 relative">
          <div class="flex justify-end">
            <MenuButton class="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
              <span class="sr-only">Open user menu</span>
              <span class="lowercase m-2 text-white"> {{ user?.username.replace(/\./g, ' ') }} </span>
              <span style="background-color:gray" class="inline-flex items-center px-3 rounded-full text-sm font-medium text-white uppercase">
                {{ user?.username.match(/\b(\w)/g).join("") }}
              </span>
            </MenuButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
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
        © WFP Malawi Supply Chain Unit | DoDMA
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
  MapIcon,
  XIcon,
  UserCircleIcon,
  AdjustmentsIcon,
  DocumentDuplicateIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  CollectionIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
} from "@heroicons/vue/outline";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  SearchIcon,
  SelectorIcon,
} from "@heroicons/vue/solid";

//DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const signOutTimeout = ref(null);

const isDropdownOpen = ref(false);
import { saveDataOffline, getDataOffline,clearDataOffline } from '@/services/localbase';


const onAbout = async () => {
   $router.push({ path: "/admin/about-system" })
  
};

const menuItemClasses = (active, isButton = false) => [
  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
  'block px-4 py-2 text-sm',
  isButton ? 'w-full text-left' : ''
];


const isMobileMenuOpen = ref(false)


// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}


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
  $router.push({ path: '/admin/system' });

}

//MOUNTED
onMounted(() => {
  
  startSignOutTimer();
  
  addEventListeners();
 });
//WAT
function navigation() {
  let navList = [
    { name: "Home", href: "/admin/dashboard", icon: HomeIcon, current: false },
  /*   { name: "Plan & Dispatch", href: "/admin/dispatch-management", icon: AdjustmentsIcon, current: false },
   */ /*  { name: "Commodities", href: "/admin/commodity-tracking", icon: CollectionIcon, current: false },
    { name: "Requisitions", href: "/admin/requisition-management", icon: IdentificationIcon, current: false },
    { name: "Project Management", href: "/admin/project-management", icon: IdentificationIcon, current: false },
  */  /*  { name: "Receipts", href: "/admin/receipt-management", icon: DocumentDuplicateIcon, current: false },
 */
    { name: "Reports", href: "/admin/report-management", icon: DocumentDuplicateIcon, current: false },
    { name: "System", href: "/admin/system", icon: AdjustmentsIcon, current: false },


  ];

  const currentRouteBase = $router.currentRoute.value.fullPath.split("/").slice(0, 3).join("/");
  navList.forEach(navItem => {
    const isMatched = currentRouteBase === navItem.href ||
      (navItem.name === "Plan & Dispatch" && (currentRouteBase.startsWith("/admin/loadingplans") || currentRouteBase.startsWith("/admin/dispatches")))
      ||
      (navItem.name === "Receipts" && currentRouteBase.startsWith("/admin/receipts"))
      ||
      (navItem.name === "System" && (currentRouteBase.startsWith("/admin/userroles") || currentRouteBase.startsWith("/admin/users") || currentRouteBase.startsWith("/admin/logs")
        || currentRouteBase.startsWith("/admin/districts")
        || currentRouteBase.startsWith("/admin/organisations")
        || currentRouteBase.startsWith("/admin/commodity-types")
        || currentRouteBase.startsWith("/admin/commodity-management")
      ));
    navItem.current = isMatched;
  });

  return navList;
}
// select active page the route must be the same as the full path
const userNavigation = [
  /* { name: "Profile", href: "#" },
  { name: "Settings", href: "#" }, */
];
const links = [
  {
    name: "CTS",
    href: process.env.VUE_APP_URL,
    target: "_blank",
  },
];

const open = ref(false);
//FUNCTIONS

const navItems = computed(() => navigation());
const firstFiveItems = computed(() => navItems.value.slice(0, 5));
const remainingItems = computed(() => navItems.value.slice(5));

const itemClasses = (item) => [
  item.current ? 'bg-white text-black' : 'text-gray-50 hover:text-gray-50 hover:bg-blue-400',
  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
];

const onSignout = async () => {
  try {
    await sessionStore.signOut();
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
  clearSignOutTimer();
  removeEventListeners();
});


</script>
