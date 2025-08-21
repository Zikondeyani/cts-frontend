<template>
  <main class="">
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <div class="align-middle inline-block min-w-full rounded-table">
      <!-- Breadcrumb -->
      <div class="mb-8">
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-4">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl sm:truncate">
            System Documents
          </h2>
        </div>
        <!-- Toggle View -->
        <div class="flex gap-2">
          <button
            @click="currentView = 'documents'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold',
              currentView === 'documents'
                ? '#fff text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Document View
          </button>
          <button
            @click="currentView = 'table'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold',
              currentView === 'table'
                ? '#fff text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Table View
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div
        class="align-middle inline-block min-w-full mt-5 shadow-xl rounded-lg bg-white p-6"
      >
        <!-- Document Cards -->
        <div v-if="currentView === 'documents'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="p-4 rounded-lg shadow hover:shadow-lg border flex flex-col justify-between"
          >
            <div>
              <h3 class="text-lg font-bold">{{ doc.name }}</h3>
              <p class="text-gray-500 text-sm">{{ doc.type }} • {{ doc.size }}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <a
                :href="doc.url"
                target="_blank"
                class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                View
              </a>
              <button
                class="px-3 py-1  text-red rounded-lg text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else>
          <vue-good-table
            :columns="columns"
            :rows="documents"
            :paginate="true"
            :search-options="{ enabled: true }"
          >
            <template #table-row="props">
              <span v-if="props.column.field === 'actions'">
                <a
                  :href="props.row.url"
                  target="_blank"
                  class="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-700"
                >
                  View
                </a>
                <button
                  class="ml-2 px-2 py-1 text-red rounded-lg text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, inject, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useLogStore } from "../../../stores/log.store";
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";

const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");

const props = defineProps({ id: String });
const { id } = toRefs(props);

const isLoading = ref(false);
const currentView = ref("documents"); // toggle between documents/table
const logStore = useLogStore();

// Sample documents (replace with API)
const documents = reactive([
  {
    id: 1,
    name: "Warehouse Policy",
    type: "PDF",
    size: "120 KB",
    url: "#"
  },
  {
    id: 2,
    name: "Distribution Plan",
    type: "Excel",
    size: "85 KB",
    url: "#"
  },
  {
    id: 3,
    name: "Monthly Report",
    type: "Word",
    size: "200 KB",
    url: "#"
  }
]);

// Table columns
const columns = [
  { label: "Document Name", field: "name" },
  { label: "Type", field: "type" },
  { label: "Size", field: "size" },
  { label: "Actions", field: "actions" }
];

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "System Documents", href: "#", current: true }
];
</script>

<style scoped>
.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}
</style>
