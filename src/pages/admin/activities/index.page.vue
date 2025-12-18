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
            Activities
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <!-- <router-link :to="{ name: 'admin-create-users' }">
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
              new user
            </button>
          </router-link> -->
          <create-user-form v-on:create="createUser" />
        </div>
      </div>
      <!-- table  -->

      <div
        class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-table font-semibold"
      >
        <vue-good-table
          :columns="columns"
          :rows="users"
          :search-options="{ enabled: true }"
          :pagination-options="{ enabled: true }"
          theme="polar-bear"
          styleClass="vgt-table striped"
          compactMode
        >
          <template v-slot:table-row="props">
            <span v-if="props.column.field === 'actions'">
              <button
                class="px-2 py-1 rounded text-xs text-white"
                :class="props.row.IsClosed ? 'bg-green-600' : 'bg-red-600'"
                @click="toggleClosed(props.row)"
              >
                {{ props.row.IsClosed ? "Reopen" : "Close" }}
              </button>
            </span>

            <span v-else>
              {{ props.formattedRow[props.column.field] }}
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
import createUserForm from "../../../components/pages/activities/create.component.vue";

//SCHEMA//AND//STORES
import { useactivitiestore } from "../../../stores/activity.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const Swal = inject("Swal");

//VARIABLES
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Activities", href: "#", current: true },
];
const userStore = useactivitiestore();
const users = reactive([]);

const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Name",
    field: (row) => row.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Closed?",
    field: "IsClosed",
    type: "boolean",
    tdClass: "capitalize",
    formatFn: (value) => (value ? "Yes" : "No"),
  },
  {
    label: "Actions",
    field: "actions",
    sortable: false,
  },
]);

//MOUNTED
onMounted(() => {
  getUsersRoles();
});

const toggleClosed = async (row) => {
  isLoading.value = true;

  // construct clean object without vue-good-table props
  const updated = {
    id: row.id,
    Name: row.Name,
    IsClosed: !row.IsClosed,
  };

  userStore
    .update(updated) // pass only clean fields
    .then(() => {
      Swal.fire({
        title: "Success",
        text: `Activity has been ${
          updated.IsClosed ? "closed" : "reopened"
        } successfully`,
        icon: "success",
        confirmButtonText: "Ok",
      });
      getUsersRoles();
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "Unable to update status (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

//FUNCTIONS
const getUsersRoles = async () => {
  isLoading.value = true;
  userStore
    .get()
    .then((result) => {
      // for (let i = 0; i < 100; i++) {
      //   users.push(...result);
      // }
      users.length = 0; //empty array
      users.push(...result);

      users.reverse();
    })
    .catch((error) => {
      Swal.fire({
        title: "District Retrieval Failed",
        text: "failed to get users (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const createUser = async (model) => {
  isLoading.value = true;
  userStore
    .create(model)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Created a new activity successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      /*  Swal.fire({
         title: "Failed",
         text: "failed to get create user (" + error + ")",
         icon: "error",
         confirmButtonText: "Ok"
       }); */
    })
    .finally(() => {
      isLoading.value = false;
      getUsersRoles();
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
