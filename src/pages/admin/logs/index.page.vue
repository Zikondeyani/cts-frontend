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
          class="font-body inline-flex items-center px-6 py-2.5 bg-gray-500 text-white mr-1 font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 transition duration-150 ease-in-out capitalize"
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
const logsAllLoaded = ref(false)
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

const logsAll = reactive([]);
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
    field: (row) => {
      const name = row.user?.name;
      const email = row.user?.email;
      return name ? `${name} (${email})` : email;
    },
    sortable: true,
    firstSortType: "asc",
  }
  ,
  {
    label: "Status",
    field: (row) => (row.status == true ? "Success" : "Fail"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Login IP Address",
    field: (row) => row.metadata?.ipAddress,
    sortable: true,
    hidden: false,
    firstSortType: "asc",
  },

  {
    label: "Login Location",
    field: (row) => row.metadata?.location,
    sortable: true,
    hidden: false,
    firstSortType: "asc",
  },
  {
    label: "Device",
    field: (row) => row.metadata?.deviceType,
    sortable: true,
    hidden: false,
    firstSortType: "asc",
  },
  {
    label: "Action Time",
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

  getLogsAll(props.id);
});
//FUNCTIONS


const getLogsAll = async (id) => {
  try {

    isLoading.value = true
    logsAllLoaded.value = false

    const result = await logStore.getAll(id)

    logsAll.splice(0)
    logsAll.push(...(result?.data || []))

    logsAllLoaded.value = true

  } catch (error) {

    Swal.fire({
      title: "Failed",
      text: "failed to get all logs error (" + error + ")",
      icon: "error",
      confirmButtonText: "Ok",
    });

  } finally {
    isLoading.value = false
  }
}
const getLogs = async (id) => {

  isLoading.value = true;
  logStore
    .get(id)
    .then((result) => {
      logs.push(...result?.data);
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


const generateExcel = async () => {

  if (!logsAllLoaded.value || logsAll.length === 0) {

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Logs are still loading...",
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  const wb = XLSX.utils.book_new();
  const wsName = 'All Logs';

  const dataToExport = logsAll.map(log => ({
    ...log,
    user: log.user
      ? log.user.name
        ? `${log.user.name} (${log.user.email})`
        : log.user.email
      : 'N/A',
    metadata: log?.metadata ? JSON.stringify(log.metadata) : 'N/A'
  }));

  const ws = XLSX.utils.json_to_sheet(dataToExport);

  XLSX.utils.book_append_sheet(wb, ws, wsName);

  XLSX.writeFile(wb, 'UserLogs.xlsx');
};


const showMetadata = (params) => {
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