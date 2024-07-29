<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-2xl mx-auto px-2 sm:px-6 lg:max-w-5xl lg:px-2">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class=" md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="
              font-bold
              leading-7
              text-white
              sm:text-2xl sm:truncate
            ">
            Disaster Management
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-disasters' }">
            <button
              type="button"
              class="
                ml-3
                inline-flex
                items-center
                px-4
                py-2
                border border-transparent
                rounded
                shadow-sm
                text-sm
                font-medium
                text-white
                bg-blue-500
                hover:bg-blue-400
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-blue-500
                capitalize
              "
            >
              new disaster
            </button>
          </router-link> -->
          <create-disaster-form v-on:create="createDisaster" />
          
        </div>
      </div>
      <!-- table  -->


      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table lg:w-full sm:w-60">
        <vue-good-table :columns="columns" :rows="disasters" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
       
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link :to="{ path: '/field/emergency-management/manage/' + props.row.id }">
                <a href="#" class="text-blue-400 text-sm hover:text-green-900">Manage </a>
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
import createDisasterForm from "../../../components/pages/disaster/create.component.vue";

import { useSessionStore } from "../../../stores/session.store";

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
//SCHEMA//AND//STORES
import { useDisasterstore } from "../../../stores/disaster.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");



//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/field/dashboard", current: false },
  { name: "Disaster Management", href: "#", current: true }
];
const disaterStore = useDisasterstore();
const disasters = reactive([]);
const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Disaster Name",
    field: row => row.name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 

  {
    label: "Disaster Type",
    field: row => row.type,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "Disaster District",
    hidden: false,
    field: row => row.district,
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
  getDisasters();
});




//FUNCTIONS
const getDisasters = async () => {
  isLoading.value = true;
  disaterStore
    .get()
    .then(result => {
      // for (let i = 0; i < 100; i++) {
      //   disasters.push(...result);
      // }
      disasters.length = 0; //empty array
      disasters.push(...result.filter(item => item.district == user.value.district));

   
    })
    .catch(error => {
      Swal.fire({
        title: "Disaster Retrieval Failed",
        text: "failed to get disasters (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok"
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createDisaster = async model => {
  isLoading.value = true;
  disaterStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new disaster successfully",
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
      getDisasters();
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
