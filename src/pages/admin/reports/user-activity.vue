<template>
  <main class="min-h-screen">
    <!-- Spinner -->
    <spinner-widget :open="isLoading" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <div class="flex items-center justify-between mt-6">
        <h2 class="text-2xl font-bold text-white">
          System User Activity
        </h2>

        <!-- Live Badge (White Background) -->
        <div class="flex items-center space-x-2 bg-white text-indigo-700 px-4 py-1.5 rounded-full shadow-sm">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
          </span>
          <span class="text-sm font-medium">Live</span>
        </div>
      </div>

      <!-- Active Users Section -->
      <div class="mt-8">

        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">
            Active Users
          </h3>

          <!-- Online Counter (White Background) -->
          <div class="bg-white text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            {{ activeusers.length }} Online
          </div>
        </div>

        <!-- Users Container (Scrollable if many users) -->
        <div v-if="activeusers.length" class="max-h-[550px] overflow-y-auto pr-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div v-for="user in activeusers" :key="user.id"
              class="bg-white rounded-xl border border-slate-200 p-5 flex items-center space-x-4 hover:shadow-md transition duration-200">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                  {{ getInitials(user.username) }}
                </div>

                <!-- Online Dot -->
                <span class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">
                  {{ user.username }}
                </p>

                <p class="text-sm text-gray-500 truncate">
                  {{ user.email }}
                </p>

                <div class="flex items-center justify-between mt-2">
                  <span class="px-2 py-1 text-xs rounded-full font-medium capitalize"
                    :class="roleBadgeClass(user.roleId)">
                    {{ user.role?.name }}
                  </span>

                  <span class="text-xs text-gray-400  whitespace-nowrap">
                    {{ formatDate(user.lastLoginAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p class="text-gray-500 text-sm">
            No active users currently online.
          </p>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted, onUnmounted } from "vue";

import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import usage from "../../../components/pages/charts/usage.vue";

import { useSessionStore } from "../../../stores/session.store";
import { useLogStore } from "../../../stores/log.store";

const moment = inject("moment");

const isLoading = ref(false);

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "System Usage Statistics", href: "#", current: true },
];

const sessionStore = useSessionStore();
const logStore = useLogStore();

const logs = reactive([]);
const activeusers = reactive([]);

let interval = null;



const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (date) => {
  return moment(date).fromNow();
};

/* Dynamic ADMIN1–ADMIN10 badge coloring */
const roleBadgeClass = (role) => {
  if (!role) return "bg-gray-100 text-gray-700";

  const level = parseInt(role.replace("ADMIN", ""), 10);

  if (isNaN(level)) return "bg-gray-100 text-gray-700";

  if (level <= 2) return "bg-red-100 text-red-700";       // Highest privilege
  if (level <= 4) return "bg-orange-100 text-orange-700";
  if (level <= 6) return "bg-yellow-100 text-yellow-700";
  if (level <= 8) return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";                   // Lower privilege
};

/* --------------------------
   DATA FETCHING
-------------------------- */

const getActiveUsers = async () => {
  try {
    const result = await sessionStore.activeusers();
    activeusers.length = 0;
    activeusers.push(...result);
  } catch (error) {
    console.error("Failed to fetch active users:", error);
  }
};

const getlogs = async () => {
  try {
    const result = await logStore.get();
    logs.length = 0;
    logs.push(...result);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
  }
};


onMounted(async () => {
  window.scrollTo({ top: 0, behavior: "instant" });

  await Promise.all([getlogs(), getActiveUsers()]);

  interval = setInterval(getActiveUsers, 30000);
});
onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>