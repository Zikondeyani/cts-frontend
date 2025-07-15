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
            Manage Mailing Group
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
      <!-- tabs -->
      <div class="align-middle inline-block min-w-full">
        <ul class="nav nav-tabs flex flex-col md:flex-row flex-wrap pl-0 mb-4 border-b border-blue-300" id="tabs-menu"
          role="tablist">
          <li class="nav-item mr-1" role="presentation">
            <a href="#mailing-groups"
              class="nav-link block font-bold text-xs rounded-t-lg leading-tight bg-white capitalize border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-1 hover:border-transparent hover:bg-blue-100 focus:border-transparent active"
             
              id="mailing-groups" data-bs-toggle="pill" data-bs-target="#mailing-groups" role="tab"
              aria-controls="mailing-groups" aria-selected="false">Mailing Group Information</a>
          </li>
        </ul>
        <div class="tab-content" id="tabs-mailing list-options">
          <div class="tab-pane fade show active" id="mailing-groups" role="tabpanel"
            aria-labelledby="tabs-mailing-groups">
            <mailing-groups v-bind:model="model" v-on:update="updateMailingList" :key="model.id + 'mailing-groups'" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
// COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import MailingGroups from "../../../components/pages/mailinggroups/mailinglist.component.vue";
// STORES
import { usemailinggrouptore } from "../../../stores/mailinggroups.store";
// INJECTIONS
const $router = useRouter();
const $route = useRoute();
const Swal = inject("Swal");
// VARIABLES
const id = ref(null);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Mailing Groups", href: "/admin/mailinggroups", current: false },
  { name: "Manage", href: "#", current: true },
];
const mailinggroupStore = usemailinggrouptore();
const model = ref({
  name: "",
});
// MOUNTED
onMounted(() => {
  id.value = $route.params.id;
  getMailingGroup();
});
// FUNCTIONS

const getMailingGroup = async () => {
  isLoading.value = true;
  mailinggroupStore
    .getOne(id.value)
    .then((result) => {
      model.value = result;
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get mailing group error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const updateMailingList = async (newValues) => {
  isLoading.value = true;
  mailinggroupStore
    .update(newValues)
    .then(() => {
      Swal.fire({
        title: "Success",
        text: "Updated mailing list details",
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: `Failed to update mailing list (${error})`,
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
}

.nav-link:hover {
  color: #000;
}

.nav-tabs .nav-link.active {
  color: #000;
  border-color: #d3d3d3;
  background-color: #d3d3d3;
}

.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
</style>
