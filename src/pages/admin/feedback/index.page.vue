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
            Feedback
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-feedback' }">
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
              new feedback
            </button>
          </router-link> -->
          <create-feedback-form v-on:create="createUser" :feedback="feedback" />
          
        </div>
      </div>
      <!-- table  -->


      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table">
        <vue-good-table :columns="columns" :rows="feedback" :search-options="{ enabled: true }"
          style="font-weight: bold; color: #096eb4;" :pagination-options="{ enabled: true }" theme="polar-bear"
          styleClass="vgt-table striped" compactMode>
          <template #table-actions> </template>
       
   
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


//SCHEMA//AND//STORES
import { usefeedbackstore } from "../../../stores/feedback.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");



//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Feedback", href: "#", current: true }
];
const feedbackStore = usefeedbackstore();
const feedback = reactive([]);
const columns = ref([

  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 
 

  {
    label: "District",
    field: row => row.district,
    sortable: true,
    firstSortType: "asc"
  },
  {
    label: "User",
    field: row => row.user,
    sortable: true,
    firstSortType: "asc"
  },

  {
    label: "Feedback",
    field: row => row.feedback,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
 
]);
//MOUNTED
onMounted(() => {
  getFeedback();
});




//FUNCTIONS
const getFeedback = async () => {
  isLoading.value = true;
  try {
    const result = await feedbackStore.get();

    if (Array.isArray(result) && result.length > 0) {
      feedback.length = 0; // Clear existing data
      feedback.push(...result);
      feedback.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else {
      feedback.length = 0; // Ensure feedback is cleared if result is empty
      console.warn("No feedback data found.");
    }
  } catch (error) {
    Swal.fire({
      title: "Feedback Retrieval Failed",
      text: "Failed to get feedback (Please refresh to try again)",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};

const createUser = async model => {
  isLoading.value = true;
  feedbackStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new feedback successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });
    })
    .catch(error => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create feedback (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getFeedback();
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
