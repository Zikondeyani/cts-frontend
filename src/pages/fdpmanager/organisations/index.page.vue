<template>
  <main class="">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <!-- Content Wrapper -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-5xl lg:px-8">
      <!-- Breadcrumb -->
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <!-- Header Section -->
      <div class="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <!-- Title -->
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-bold leading-7 text-white text-2xl">
            Organisations
          </h2>
        </div>

        <!-- Create Organisation Button -->
        <div class="mt-4 flex-shrink-0 md:mt-0 md:ml-4">
          <create-org-form v-on:create="createOrg" />
        </div>
      </div>

      <!-- Table Section -->
      <div class="mt-5 overflow-x-auto bg-white shadow-xl rounded-lg">
        <vue-good-table
          :columns="columns"
          :rows="users"
          :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link :to="{ path: '/admin/organisations/manage/' + props.row.id }">
                <a href="#" class="text-blue-500 text-sm hover:text-green-600 transition duration-300">
                  Manage
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
  ChevronRightIcon
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createOrgForm from "../../../components/pages/organisations/create.component.vue";


//SCHEMA//AND//STORES
import { useorganisationstore } from "../../../stores/organisations.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");



//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Organisations", href: "#", current: true }
];
const OrganisationStore = useorganisationstore();
const users = reactive([]);
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
    field: row => row.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 

  {
    label: "Contact Person",
    field: row => row.ContactPerson,
    sortable: true,
    firstSortType: "asc"
  },

  {
    label: "Phone",
    hidden: true,
    field: row => row.PhoneNumber,
    sortable: true,
    firstSortType: "asc"
  },
 
  {
    label: "Options",
    field: row => row,
    sortable: false
  }
]);
//MOUNTED
onMounted(() => {
  getOrganisations();
});




//FUNCTIONS
const getOrganisations = async () => {
  isLoading.value = true;
  OrganisationStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }

      users.length = 0; //empty array
      users.push(...result);

      users.sort((a, b) => new Date(b.created) - new Date(a.created));

    })
    .catch(error => {
      Swal.fire({
        title: "Organisation Retrieval Failed",
        text: "failed to get organisations (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createOrg = async model => {
  isLoading.value = true;
  OrganisationStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new organisation successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });
    })
    .catch(error => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create user (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getOrganisations();
    });
};
</script>

<style>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
