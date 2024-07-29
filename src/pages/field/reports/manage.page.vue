<template>
  <main class="font-bold">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="mt-2 mb-2 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate">
            Manage Catalogue
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
      <!-- tabs -->

      <div class="align-middle inline-block min-w-full space-y-2">
        <listing-details
          v-bind:model="model"
          v-on:update="updateListing"
          :key="refresh + 'Details'" 
          v-on:refresh="getcatalogue()"
        />



        <listing-file v-bind:model="model" :key="refresh + 'File'" 
          v-on:refresh="getcatalogue()" />
 
        <listing-bookings
          v-bind:model="model"
          :key="refresh + 'Bookings'"
          v-on:refresh="getcatalogue()"
          v-if="model.catalogueTypesId !== 'TYPE3'"
        /> 
      
           <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Delete catalogue
          </h3>
          <p class="mt-1 text-sm text-gray-500">Delete catalogue</p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="deletecatalogue()"
            >
              Delete catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
//COMPONENTS

import { useListingStore } from "../../../stores/catalogue.store";

import ListingFile from "../../../components/pages/catalogue/file.component.vue"; 


import ListingDetails from "../../../components/pages/catalogue/details.component.vue"; 
import ListingBookings from "../../../components/pages/catalogue/bookings.component.vue"; 

import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const id = ref(null);
const refresh = ref(0);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Catalogue", href: "/admin/catalogue", current: false },
  { name: "Manage", href: "/admin/catalogue/Manage", current: true },
];

const catalogueStore = useListingStore();
const sessionStore = useSessionStore();


const user = ref(sessionStore.getUser);
const model = ref({
  name: "",
  description: "",
  location: "",
  location_details: "",
  price: "",
  status: false,
  files:[],
  bookings:[],
  id:id.value
  
});
//MOUNTED
onMounted(() => {
  id.value = $route.params.id;

  getcatalogue();
});
///FORM

///FIELDS

//FUNCTIONS
const getcatalogue = async () => {
  isLoading.value = true;
  catalogueStore
    .getOne(id.value)
    .then((result) => {
      model.value = result;

    console.log(model.value)
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get catalogue error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      refresh.value = Math.random();
      isLoading.value = false;
    });
};

const updateListing = async (newValues) => {
  isLoading.value = true;
  catalogueStore
    .update(newValues)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "updated catalogue details",
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to update catalogue (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getcatalogue();
    });
};

const deletecatalogue = async() =>{
  isLoading.value = true;
  catalogueStore
    .remove(id.value)
    .then((result) => {

       Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "gray",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Deleted catalogue succesfully.", "success");
          isLoading.value = false;
          let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
          $router.push({ path: "/" + role + "/catalogue" });
        }
      });

    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove catalogue  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
}

</script>
