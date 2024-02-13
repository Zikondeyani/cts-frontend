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
          <h2 class="font-bold leading-7 text-teal-900 sm:text-2xl sm:truncate">
            Manage user account
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
      <!-- tabs -->
      <div class="align-middle inline-block min-w-full">
        <ul
          class="nav nav-tabs flex flex-col md:flex-row flex-wrap pl-0 mb-4 border-b border-teal-300"
          id="tabs-menu"
          role="tablist"
        >
          <!-- <li class="nav-item" role="presentation">
            <a
              href="#user-profile"
              class="nav-link block  font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1hover:border-transparent hover:bg-teal-100 focus:border-transparent active"
              id="tabs-user-profile"
              data-bs-toggle="pill"
              data-bs-target="#user-profile"
              role="tab"
              aria-controls="user-profile"
              aria-selected="true"
              >Profile</a
            >
          </li> -->
          <li class="nav-item" role="presentation">
            <a
              href="#user-settings"
              class="nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1hover:border-transparent hover:bg-teal-100 focus:border-transparent active"
              id="tabs-user-settings"
              data-bs-toggle="pill"
              data-bs-target="#user-settings"
              role="tab"
              aria-controls="user-settings"
              aria-selected="false"
              >Settings</a
            >
          </li>
          <li class="nav-item" role="presentation">
            <a
              href="#user-logs"
              class="nav-link block font-bold text-xs leading-tight capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1hover:border-transparent hover:bg-teal-100 focus:border-transparent"
              id="tabs-user-logs"
              data-bs-toggle="pill"
              data-bs-target="#user-logs"
              role="tab"
              aria-controls="user-logs"
              aria-selected="false"
              >Logs</a
            >
          </li>
        </ul>
        <div class="tab-content" id="tabs-user-options">
          <!-- <div
            class="tab-pane fade show active"
            id="user-profile"
            role="tabpanel"
            aria-labelledby="tabs-user-profile"
          >
            <user-profile v-bind:model="model" v-on:update="updateUser" :key="model.id+'profile'"/>
          </div> -->
          <div
             class="tab-pane fade show active"
            id="user-settings"
            role="tabpanel"
            aria-labelledby="tabs-user-settings"
          >
            <user-settings
              v-bind:model="model"
              v-on:update="updateUser"
              :key="model.id + 'settings'"
            />
          </div>

          <div
            class="tab-pane fade"
            id="user-logs"
            role="tabpanel"
            aria-labelledby="tabs-user-logs"
          >
            <user-logs v-bind:id="id" :key="model.id + 'logs'" />
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

