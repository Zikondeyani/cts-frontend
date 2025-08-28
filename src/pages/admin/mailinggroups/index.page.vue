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
            Mailing Groups
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-mailinggroups' }">
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
              new mailing group
            </button>
          </router-link> -->
          <create-mailing-group-form group-form v-on:create="createMailingGroup" :mailinggroups="mailinggroups" />
          
        </div>
      </div>
      <!-- table  -->


      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold">
        <vue-good-table :columns="columns" :rows="mailinggroups" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
       
          <template #table-row="props">
            <span v-if="props.column.label == 'Options'">
              <router-link :to="{ path: '/admin/mailinggroups/manage/' + props.row.id }">
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