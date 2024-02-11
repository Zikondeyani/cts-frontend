<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-teal-900 sm:text-2xl sm:truncate">
            Dispatch Management
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <create-listing-form v-on:create="createListing" />
        </div>
      </div>
      <!-- table  -->
      <div class="align-middle inline-block min-w-full mt-5 shadow-lg">
        <vue-good-table
          :columns="columns"
          :rows="catalogue"
          :search-options="{ enabled: true }"
          
          style="font-weight: bold; color: teal;"
          :pagination-options="{
            enabled: true,
          }"
          theme="polar-bear"
          styleClass=" vgt-table striped "
          compactMode
        >
          <template #table-actions> </template>
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link
                :to="{ path: '/admin/catalogue/manage/' + props.row.id }"
              >
                <a href="#" class="text-teal-500 text-sm hover:text-gray-900"
                  >Manage
                </a>
              </router-link>
            </span>
          </template>
        </vue-good-table>
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
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createListingForm from "../../../components/pages/catalogue/create.component.vue";
//SCHEMA//AND//STORES
import { useListingStore } from "../../../stores/catalogue.store";


import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Catalogue", href: "#", current: true },
];
const catalogueStore = useListingStore();
const catalogue = reactive([]);



const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
const columns = ref([
   {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Name",
    field: (row) => row.name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
 

   {
    label: "Type",
    field: (row) => row.listingTypes.name,
    sortable: true,
    hidden: false,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Status",
    field: (row) => (row.status == true ? "Available" : "Unavailable"),
    sortable: true,
    hidden: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Created",
    hidden: false,
    field: (row) => moment(row.created).fromNow(),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
 
  {
    label: "Options",
    field: (row) => row,
    sortable: false,
  },
]);
//MOUNTED
onMounted(() => {
  getcatalogue();
 // getLatest()
});
//FUNCTIONS



const getcatalogue = async () => {
  isLoading.value = true;
  catalogueStore
    .getCatalogue()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   catalogue.push(...result);
      // }
      catalogue.length = 0; //empty array
      catalogue.push(...result);
      catalogue.sort((a, b) => new Date(b.created) - new Date(a.created));

   //  console.log(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Catalogue Retrieval Failed",
        text: "Failed to get catalogue (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createListing = async (model) => {
  isLoading.value = true;
  catalogueStore
    .create(model)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "created a new catalogue",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        $router.push({ path: "/admin/catalogue/manage/" + result.id });
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Listing creation failed",
        text: "Failed to create catalogue (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getcatalogue();
    });
};
</script>
