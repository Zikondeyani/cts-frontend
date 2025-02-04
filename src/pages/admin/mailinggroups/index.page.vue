<template>
  <main class=" min-h-screen">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <!-- Breadcrumb Navigation -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-4 md:space-y-0">
        <!-- Title -->
        <div class="flex-1">
          <h2 class="text-2xl sm:text-3xl font-bold text-white leading-7">
            Mailing Groups
          </h2>
        </div>

        <!-- Create Mailing Group Form -->
        <div class="flex-shrink-0">
          <create-mailing-group-form 
            group-form 
            v-on:create="createMailingGroup" 
            :mailinggroups="mailinggroups" 
          />
        </div>
      </div>

      <!-- Table Section -->
      <div class="align-middle inline-block min-w-full mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
        <vue-good-table 
          :columns="columns" 
          :rows="mailinggroups" 
          :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }" 
          theme="polar-bear"
          styleClass="vgt-table striped" 
          compactMode
        >
          <!-- Table Actions -->
          <template #table-actions> </template>

          <!-- Table Row -->
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link :to="{ path: '/admin/mailinggroups/manage/' + props.row.id }">
                <a class="text-blue-500 text-sm hover:text-green-600 transition duration-150 ease-in-out">
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
import createMailingGroupForm from "../../../components/pages/mailinggroups/create.component.vue";


//SCHEMA//AND//STORES
import { usemailinggrouptore } from "../../../stores/mailinggroups.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");



//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Mailing Group", href: "#", current: false },
 ];
const mailinggroupStore = usemailinggrouptore();
const mailinggroups = reactive([]);
const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "name",
    field: row => row.name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 
  
  {
    label: "Options",
    field: row => row,
    sortable: false
  }
]);
//MOUNTED
onMounted(() => {
  getMailinggroups();
});




//FUNCTIONS
const getMailinggroups = async () => {
  isLoading.value = true;
  mailinggroupStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   mailinggroups.push(...result);
      // }
      mailinggroups.length = 0; //empty array
      mailinggroups.push(...result);

      mailinggroups.sort((a, b) => new Date(b.created) - new Date(a.created));

    })
    .catch(error => {
      Swal.fire({
        title: "Mailing Groups Retrieval Failed",
        text: "failed to get mailing groups (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createMailingGroup = async model => {
  isLoading.value = true;

  

  mailinggroupStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new mailing group successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });
    })
    .catch(error => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create mailing group (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getMailinggroups();
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
