<template>
  <main class="">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <!-- table  -->
    <div class="align-middle inline-block min-w-full rounded-table">

      <div class="mb-8">
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>


      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            User Logs
          </h2>
        </div>

        <!-- Export Data Button -->
        <button type="button"
          class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
          @click="generateExcel()">
          <i class="fas fa-file-export mr-2"></i> <!-- Icon (Font Awesome used as an example) -->
          Export Logs
        </button>

      </div>



      <div class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-lg bg-white font-bold rounded-table">

        <vue-good-table :columns="columns" :rows="logs" @on-row-dblclick="showMetadata"
          :search-options="{ enabled: true }" :pagination-options="{
      enabled: true,
    }" theme="polar-bear" styleClass=" vgt-table striped condensed" compactMode />
      </div>
    </div>
  </main>
</template>
<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { useLogStore } from "../../../stores/log.store";
//INJENCTIONS

import * as XLSX from 'xlsx';

import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";

const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
const props = defineProps({
  id: String,
});
//VARIABLES
const isLoading = ref(false);
const logs = reactive([]);
const { id } = toRefs(props);
const logStore = useLogStore();

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Logs", href: "#", current: true }
];

const columns = ref([
  {
    label: "Action",
    field: (row) => row.action,
    sortable: true,
    firstSortType: "asc",
    tdClass: "uppercase",
  },
  {
    label: "User",
    field: (row) => row.user.name + "(" + row.user.email + ")",
    sortable: true,
    firstSortType: "asc",
  },
  {
    label: "Status",
    field: (row) => (row.status == true ? "Success" : "Fail"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "metadata",
    field: (row) => row.metadata,
    sortable: true,
    hidden: true,
    firstSortType: "asc",
  },
  {
    label: "Created",
    hidden: false,
    field: (row) => moment(row.created),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
]);
//WATCH
// watch(model, (currentValue, oldValue) => {

// });
//MOUNTED
onMounted(() => {
  getLogs(props.id);
});
//FUNCTIONS
const getLogs = async (id) => {

  isLoading.value = true;
  logStore
    .get(id)
    .then((result) => {
      logs.push(...result.reverse());
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get logs error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const generateExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsName = 'Logs';

  // Transform the logs data to include user name and email as one string
  const dataToExport = logs.map(log => ({
    ...log,
    user: log.user ? `${log.user.name} (${log.user.email})` : 'N/A', // Concatenate name and email
    metadata: log?.metadata ? JSON.stringify(log.metadata): 'N/A'
  }));

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Export the workbook
  XLSX.writeFile(wb, 'UserLogs.xlsx');
};


function showMetadata(params) {
  Swal.fire({
    title: "Details",
    text: params.row.metadata,
    confirmButtonText: "Ok",
  });
}
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  /* Adjust the radius as needed */
  overflow: hidden;
  /* This is important to apply rounded corners to child elements */
}
</style>