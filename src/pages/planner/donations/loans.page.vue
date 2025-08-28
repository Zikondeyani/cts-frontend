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
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            Commodity Loans
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-loadingPlans' }">
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
                bg-[#096eb4]
                hover:bg-blue-400
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-blue-500
                capitalize
              "
            >
              new warehouse
            </button>
          </router-link> -->
         </div>
      </div>
      <!-- table  -->

      <!-- Key Stats Row -->
  

      <div
        class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table"
      >
        <vue-good-table
          :columns="columns"
          :rows="loadingPlans"
          :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
          <template #table-actions> </template>


        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script setup>
// import the styles

import { inject, ref, reactive, onMounted, computed  } from "vue";
import { useRouter } from "vue-router";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import createWarehouseForm from "../../../components/pages/warehouse/create.component.vue";

//SCHEMA//AND//STORES
import { useloadingplanstore } from "../../../stores/loadingplans.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/planner/dashboard", current: false },
  { name: "Commodity Loans", href: "#", current: true },
];
const loadingPlanStore = useloadingplanstore();
const loadingPlans = reactive([]);
const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Loaned Commodity",
    field: (row) => row.commodity.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Loaned Quantity (MT)",
    field: (row) => row.Quantity,
    sortable: true,
    firstSortType: "asc",
  },

  {
    label: "Loaned By",
    hidden: false,
    field: (row) => row.LoanTo,
    sortable: true,
    firstSortType: "asc",
  },


   {
    label: "Loan Date",
    hidden: false,
    field: (row) => row.LoanStart,
    sortable: true,
    firstSortType: "asc",
  },

  
   {
    label: "Loan Description",
    hidden: false,
    field: (row) => row.LoanDescription,
    sortable: true,
    firstSortType: "asc",
  },

 
]);
//MOUNTED
onMounted(() => {
  getLoadingPlans();
});



//FUNCTIONS
const getLoadingPlans = async () => {
  isLoading.value = true;
  loadingPlanStore
    .get()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   loadingPlans.push(...result);
      // }

      loadingPlans.length = 0; //empty array

       loadingPlans.push(...result.filter((plan) => plan.activity?.Name == "Partner Commodity Loan"));

    
    })
    .catch((error) => {
      Swal.fire({
        title: "LoadingPlan Retrieval Failed",
        text: "failed to get loadingPlans (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
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
