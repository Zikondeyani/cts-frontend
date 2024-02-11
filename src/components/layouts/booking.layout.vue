<template>
  <div class="relative bg-teal-50">
    <!--language-->

    <!-- Hero section -->
    <div class="bg-teal-600 sticky top-0 z-40">
      <!-- Decorative image and overlay -->

      <!-- Navigation -->
      <header class="relative z-10">
        <nav aria-label="Top">
          <!-- Top navigation -->
          <div class="bg-teal-600">
            <div class="font-body max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8">
              <!-- Currency selector -->
              <form>
                <div>
                  <label for="desktop-currency" class="sr-only"></label>
                </div>
              </form>

              <div class="flex items-center space-x-6">
                <label class="text-white font-medium text-sm font-body">
                  {{ user.firstName }} {{ user.lastName }}</label>

                <a href="#" @click="onSignout()" class="font-body text-sm font-medium text-white hover:text-teal-100">Sign
                  Out</a>
              </div>
            </div>
          </div>

          <!-- Secondary navigation -->
          <div class="font-body backdrop-blur-md backdrop-filter bg-opacity-10 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div>
                <div class="h-16 flex items-center justify-between">
                  <!-- Logo (lg+) -->

                  <div class="hidden lg:flex-1 lg:flex lg:items-center">
                    <router-link :to="{ path: '/home' }">
                      <a>
                        <span class="sr-only"></span>
                        <img class="h-16 w-auto" src="../../assets/logo34.png" alt="" />
                      </a>
                    </router-link>
                  </div>

                  <div class="font-body hidden h-full lg:flex">
                    <!-- Flyout menus -->
                    <PopoverGroup class="px-4 bottom-0 inset-x-0">
                      <div class="h-full flex justify-center space-x-8">
                        <Popover v-for="category in navigation.categories" :key="category.name" class="flex"
                          v-slot="{ open }">
                          <div class="relative flex">
                            <PopoverButton
                              class="font-body relative z-10 flex items-center justify-center transition-colors ease-out duration-200 text-sm font-medium text-white">
                              {{ category.name }}
                              <span :class="[
                                open ? 'bg-white' : '',
                                'absolute -bottom-px inset-x-0 h-0.5 transition ease-out duration-200',
                              ]" aria-hidden="true" />
                            </PopoverButton>
                          </div>

                          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
                            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
                            leave-from-class="opacity-100" leave-to-class="opacity-0">
                            <PopoverPanel class="absolute top-full inset-x-0 text-sm text-teal-500">
                              <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
                              <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                              <div class="relative bg-white">
                                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div class="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                    <div v-for="item in category.featured" :key="item.name" class="group relative">
                                      <div
                                        class="aspect-w-1 aspect-h-1 rounded-md bg-teal-100 overflow-hidden group-hover:opacity-75">
                                        <img :src="system.api +
                                          '/files/download/' +
                                          item.files[0].url
                                          " alt="No Photo Added" class="object-center object-cover" />
                                      </div>
                                      <a :href="item.href" class="mt-4 block font-medium text-teal-600">
                                        <span class="font-body absolute z-10 inset-0" aria-hidden="true" />
                                        {{ item.name }}
                                      </a>
                                      <p aria-hidden="true" class="mt-1">
                                        Book Now
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverPanel>
                          </transition>
                        </Popover>

                        <router-link v-for="page in resources()" :key="page.name" :to="{ path: page.href }" :style="[
                          page.current
                            ? 'color:#fff; font-weight:bold;'
                            : 'color:#fff;',
                        ]" :aria-current="page.current ? 'page' : undefined"
                          class="flex items-center text-sm font-semibold leading-6 text-white">
                          {{ page.name }}
                        </router-link>

                        <a href="#" @click="gotoHistory()"
                          class="flex items-center text-sm font-semibold leading-6 text-white router-link-exact-active"
                          v-if="sessionVal > 0">
                          My Enquires</a>
                      </div>
                    </PopoverGroup>
                  </div>

                  <div class="flex-1 flex items-center lg:hidden">
                    <button type="button" class="-ml-2 p-2 text-white flex items-center" @click="mobileMenuOpen = true">
                      <span class="sr-only font-body">Open menu</span>
                      <MenuIcon class="h-6 w-6" aria-hidden="true" />

                      <p class="ml-2 w-full text-white font-body">Machawi265</p>
                    </button>

                    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
                      <div class="fixed inset-0 z-50" />
                      <DialogPanel
                        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
                        <div class="flex items-center justify-between">
                          <a href="#" class="-m-1.5 p-1.5">
                            <span class="sr-only">Machawi265</span>
                            <img class="h-16 w-auto" src="../../assets/logo34.png" alt="" />
                          </a>
                          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700"
                            @click="mobileMenuOpen = false">
                            <span class="sr-only">Close menu</span>
                            <XIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div class="mt-6 flow-root">
                          <div class="-my-6 divide-y divide-gray-500/10">
                            <div class="space-y-2 py-6 flow-root" v-for="item in navigation" :key="item.name">
                              <router-link :to="item.href">
                                <a :key="item.name" :href="item.href"
                                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-teal-600 hover:bg-gray-50">{{
                                    item.name }}</a>
                              </router-link>
                            </div>
                            <div class="py-6">
                              <router-link :to="{ name: 'portal-signin' }">
                                <a
                                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-teal-600 hover:bg-gray-50">Log
                                  in</a>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </DialogPanel>
                    </Dialog>
                  </div>

                  <!-- Logo (lg-) -->

                  <a href="#" class="lg:hidden">
                    <span class="sr-only font-body font-body ">Bookings</span>
                    <img alt="" class="h-8 w-auto" />
                  </a>

                  <div class="flex-1 flex items-center justify-end">
                    <a href="#" class="hidden text-sm font-medium text-white lg:block font-body">
                    </a>
                    <div class="ml-4 flow-root lg:ml-8">
                      <a href="#" class="group -m-2 p-2 flex items-center">
                        <CalendarIcon class="font-body flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                        <span class="font-body ml-2 text-sm font-medium text-white font-body" v-if="sessionVal > 0">
                          {{ bookings.length }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>

    <transition enter-active-class="duration-500 ease-in" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="duration-500 ease-out"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <router-view />
    </transition>

    <footer aria-labelledby="footer-heading" class="bg-teal-600">
      <h2 id="footer-heading" class="sr-only font-body">Footer</h2>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
          <div class="grid grid-cols-2 gap-8 xl:col-span-2">
            <div class="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-medium text-white font-heading">Catalogue</h3>
                <ul role="list" class="mt-6 space-y-6">
                  <li v-for="item in footerNavigation.catalogueType" :key="item.name" class="text-sm">
                    <router-link :to="item.href">
                      <a class="text-teal-300 hover:text-white font-body">
                        {{ item.name }}
                      </a></router-link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="text-sm font-medium text-white font-heading">Company</h3>
                <ul role="list" class="mt-6 space-y-6">
                  <li v-for="item in footerNavigation.company" :key="item.name" class="text-sm">
                    <router-link :to="item.href">
                      <a class="text-teal-300 hover:text-white font-body">
                        {{ item.name }}
                      </a></router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-medium text-white font-heading">Account</h3>
                <ul role="list" class="mt-6 space-y-6">
                  <li v-for="item in footerNavigation.account" :key="item.name" class="text-sm">
                    <router-link :to="{ path: item.href }">
                      <a class="text-teal-300 hover:text-white">
                        {{ item.name }}
                      </a>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="text-sm font-medium text-white font-heading">Connect</h3>
                <ul role="list" class="mt-6 space-y-6">
                  <li v-for="item in footerNavigation.connect" :key="item.name" class="text-sm">
                    <a :href="item.href" class="text-teal-300 hover:text-white">
                      {{ item.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-12 md:mt-16 xl:mt-0">
            <h3 class="text-sm font-medium text-white font-heading">
              Sign up for our newsletter
            </h3>
            <p class="mt-6 text-sm text-teal-300 font-body">
              The latest Machawi265 catalogue, sent to your inbox.
            </p>
            <form class="mt-2 flex sm:max-w-md" @submit="onSubmit" :validation-schema="UpdateListingSchema">
              <label for="email-address" class="sr-only font-body">Email address</label>
              <input id="email" type="text" name="email" autocomplete="email" v-model="email" required=""
                class="appearance-none min-w-0 w-full bg-white border border-white rounded-md shadow-sm py-2 px-4 text-base text-teal-900 placeholder-teal-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-900 focus:ring-white" />
              <div class="ml-4 flex-shrink-0">
                <button type="submit"
                  class="font-body w-full bg-teal-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-900 focus:ring-teal-500">
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="border-t border-teal-500 py-10">
          <p class="text-sm text-white font-body">
            Copyright &copy; 2023 Machawi265 | Developed By
            <a href="https://apalis.io"> Apalis Limited</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useListingStore } from "../../stores/catalogue.store";
import { useListingTypeStore } from "../../stores/catalogue-type.store";
import { UpdateListingSchema } from "../../services/schema/catalogue.schema";

import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
import { useSessionStore } from "../../stores/session.store";
import spinnerWidget from "../widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../widgets/breadcrumbs/admin.breadcrumb.vue";
import createListingForm from "../pages/catalogue/create.component.vue";

import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  MenuIcon,
  QuestionMarkCircleIcon,
  SearchIcon,
  ShoppingBagIcon,
  CalendarIcon,
  XIcon,
} from "@heroicons/vue/outline";

import { usebookingstore } from "../../stores/booking.store";

import { usesubscriptionstore } from "../../stores/subscription.store";
const bookingStore = usebookingstore();

const subscriptionStore = usesubscriptionstore();

const bookings = ref([]);
//DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
  api: process.env.VUE_APP_ROOT_API,
});
const $router = useRouter();
const isLoading = ref(false);
const moment = inject("moment");
const Swal = inject("Swal");

const catalogueStore = useListingStore();
const catalogueTypeStore = useListingTypeStore();
const catalogue = reactive([]);
const catalogueTypes = reactive([]);

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const current = ref(true);
const role = ref(sessionStore.getRole);

const sessionVal = sessionStorage.length;

const { meta } = useForm({
  email: "",
});

const { value: email, errorMessage: emailerror } = useField("email");

const navigation = [
  { name: "Home", href: "/home", current: false },

  {
    name: "Providers",
    href: "/pages/catalogue/providers",
    current: false,
  },
  {
    name: "Services",
    href: "/pages/catalogue/search",
    current: false,
  },

  { name: "About Machawi", href: "/pages/who", current: false },

  /*  {
      name: 'Amenities',
      href: '/catalogue/amenities',
      current: false
    }, */
];
onMounted(() => {
  if (sessionVal > 0) {
    getBookings();
  }

  getcatalogue();
  getcatalogueTypes();
});

const getcatalogue = async () => {
  isLoading.value = true;
  catalogueStore
    .getCatalogueClean()
    .then((result) => {
      catalogue.length = 0; //empty array
      catalogue.push(...result);
    })
    .catch((error) => {
      /* Swal.fire({
        title: "Failed",
        text: "failed to get catalogue error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      }); */
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getcatalogueTypes = async () => {
  isLoading.value = true;
  catalogueTypeStore
    .get()
    .then((result) => {
      catalogueTypes.length = 0; //empty array
      catalogueTypes.push(...result);
    })
    .catch((error) => {
      /*  Swal.fire({
        title: "Failed",
        text: "failed to get catalogue error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      }); */
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getBookings = async () => {
  isLoading.value = true;
  bookingStore
    .get()
    .then((result) => {
      bookings.value.length = 0; //empty array
      bookings.value = result.filter((item) => item.userId == user.value.id);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get bookings error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const footerNavigation = {
  catalogueType: [
    { name: "Providers", href: "/pages/catalogue/providers" },
    { name: "Promotions", href: "/pages/catalogue/promotions" },

  ],
  company: [
    { name: "Who we are", href: "/pages/who" },
    { name: "Terms & Conditions", href: "/pages/terms" },
    { name: "Privacy", href: "/pages/privacy" },
  ],
  account: [
    { name: "Login", href: "/portal/signin" },
    { name: "Sign Up", href: "/portal/signup" },
  ],
  connect: [
    { name: "Contact Us", href: "/pages/who" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },

    { name: "Facebook", href: "#" },
  ],
};

function resources() {
  let pages = [
    { name: "Home", href: "/home", current: false },

    {
      name: "Providers",
      href: "/pages/catalogue/providers",
      current: false,
    },
    {
      name: "Search",
      href: "/pages/catalogue/search",
      current: false,
    },

    { name: "About Machawi", href: "/pages/who", current: false },

    /*  {
      name: 'Amenities',
      href: '/catalogue/amenities',
      current: false
    }, */
  ];

  for (let nav of pages)
    if (
      nav.href.split("/")[1] + nav.href.split("/")[2] ==
      $router.currentRoute.value.fullPath.split("/")[1] +
      $router.currentRoute.value.fullPath.split("/")[2]
    )
      nav.current = true;
  return pages;
}

const mobileMenuOpen = ref(false);

const onSignout = async () => {
  try {
    await sessionStore.signOut();
    sessionStore.$reset();

    Swal.fire({
      text: "Securely signed out",
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    await $router.push({ path: "/portal/signin" });
  } catch (error) {
    console.error("Sign out error:", error);
  }
};


const gotoHistory = () => {
  if (sessionVal > 0) {
    $router.push({ path: "/user/bookings/" + user.value.id });
  } else {
    $router.push({ path: "/portal/signin" });
  }
};

const onSubmit = useSubmitForm((values, actions) => {
  isLoading.value = true;

  let model = {
    email: email.value,
  };

  subscriptionStore
    .create(model)
    .then((result) => {
      Swal.fire({
        title: "Subscription successful",
        text: "You will now get emails on new catalogue",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Subscription failed",
        text: "Email already subscribed",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style scoped>
.router-link-exact-active {
  background-color: white;
  color: #134e4a;
  /* teal-600 */
  margin: 13px;
  /* Adjust padding values as needed */
  padding: 9px;
  border-radius: 0.5rem;
  /* Adjust border radius as needed */
}
</style>
