<template>
  <main class="font-bold">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="mt-2 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate mb-3">
            Manage user account
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>

      <!-- tabs -->
      <div class="align-middle inline-block min-w-full">
        <ul class="nav nav-tabs flex flex-col md:flex-row flex-wrap pl-0 mb-4 border-b border-blue-300">
          <!-- Settings -->
          <li class="nav-item mr-1">
            <a href="#" @click.prevent="activeTab = 'settings'" :class="[
              'nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 px-6 py-3 my-1 rounded-t-lg transition',
              activeTab === 'settings'
                ? 'border-blue-500 bg-blue-100 text-black'
                : 'border-transparent hover:border-blue-500 hover:bg-blue-100 text-gray-600'
            ]">
              Settings
            </a>
          </li>

          <!-- Logs -->
          <li class="nav-item">
            <a href="#" @click.prevent="activeTab = 'logs'" :class="[
              'nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 px-6 py-3 my-1 rounded-t-lg transition',
              activeTab === 'logs'
                ? 'border-blue-500 bg-blue-100 text-black'
                : 'border-transparent hover:border-blue-500 hover:bg-blue-100 text-gray-600'
            ]">
              Logs
            </a>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="mt-3">
          <!-- Settings -->
          <div v-show="activeTab === 'settings'">
            <user-settings :model="model" @update="updateUser" :key="model.id + 'settings'" />
          </div>

          <!-- Logs -->
          <div v-show="activeTab === 'logs'">
            <user-logs :id="id" :key="model.id + 'logs'" />
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
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import UserProfile from "../../../components/pages/users/profile.component.vue";
import UserLogs from "../../../components/pages/users/logs.component.vue";
import UserSettings from "../../../components/pages/users/settings.component.vue";
//SCHEMA//AND//STORES
import { UpdateUserSchema } from "../../../services/schema/user.schema";
import { useUserStore } from "../../../stores/user.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const id = ref(null);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Users", href: "/admin/users", current: false },
  { name: "Manage", href: "/admin/users/Manage", current: true },
];
const userStore = useUserStore();
const activeTab = ref("settings");
const model = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  status: "",
  roleId: "",
  nameOfOrg: "",
  OrgDescription: ""
});
//MOUNTED
onMounted(() => {
  id.value = $route.params.id;
  getUser();
});
///FORM

///FIELDS

//FUNCTIONS
const getUser = async () => {
  isLoading.value = true;
  userStore
    .getOne(id.value)
    .then((result) => {
      model.value = result;
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get user error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const updateUser = async (newValues) => {
  isLoading.value = true;
  userStore
    .update(newValues)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "updated user details",
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to update user (" + error + ")",
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
.nav-link {
  background-color: #FFF;
  /* Gray color for inactive links, adjust as needed */
  /* ... other styles ... */
}

/* Optional: Add a hover effect for nav links */
.nav-link:hover {
  color: #000;
  /* Light grey for hover, adjust as needed */
  /* ... other styles ... */
}

.nav-tabs .nav-link.active {
  color: #000;
  border-color: #d3d3d3;

  background-color: #d3d3d3;
}

.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>
