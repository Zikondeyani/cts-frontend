<template>
  <main>
    <!-- Spinner -->
    <spinner-widget v-bind:open="isLoading" />

    <!-- Breadcrumb Navigation -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-6xl lg:px-8 mt-5">
      <breadcrumb-widget :breadcrumbs="breadcrumbs" />

      <!-- Header with Stats and Button -->
      <div class="md:flex md:items-center md:justify-between mt-8">
        <div class="flex-1 space-y-2">
          <h2 class="text-3xl font-extrabold text-white tracking-wide">
            Lean Season Dispatch Reminders
          </h2>
          <p class="text-lg text-white opacity-90">
            Send reminders to the commissioner, dispatchers, and recipients to ensure timely actions.
          </p>
        </div>


        <button style="background-color: #248cd6;"
          class="mt-4 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-500 transition"
          @click="sendAllReminders">
          Send Reminders
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <StatCard title="Unapproved Loading Plans" :value="reminderStats[0]?.unapprovedPlansCount" color="bg-white" />
        <StatCard title="Loading Plans Pending Dispatch" :value="reminderStats[0]?.loadingPlansWithoutDispatchesCount"
          color="bg-white" />
        <StatCard title="Dispatches Pending Receiving" :value="reminderStats[0]?.dispatchesWithoutReceiptsCount" color="bg-white" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, inject, reactive, onMounted } from "vue";
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import StatCard from "./statscard.vue"; // Reusable StatCard component

import { useloadingplanstore } from "../../../stores/loadingplans.store";

// Reactive state variables
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Lean Season Reminders", href: "#", current: true },
];
const Swal = inject("Swal");


const reminderStore = useloadingplanstore();
const reminders = reactive([]);
const reminderStats = reactive([]);


// Fetch reminders and calculate stats on mount
onMounted(() => {
  //fetchReminders();
  fetchReminderStats();
});

const fetchReminderStats = async () => {
  try {
    const result = await reminderStore.getloadingplansDispatchesStats();

    reminderStats.length = 0;


    reminderStats.push(result);


  } finally {
    //  isLoading.value = false;
  }

}


// Actions for reminders
const sendAllReminders = async () => {
  try {
    await reminderStore.getloadingplansDispatchesReminders();

    Swal.fire({
      title: 'Success!',
      text: 'All reminders were sent successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      timer: 3000, // Auto close after 3 seconds
      timerProgressBar: true,
    });
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to send reminders. Please try again.',
      icon: 'error',
      confirmButtonText: 'Retry',
      confirmButtonColor: '#d33',
    });
  }
};

</script>

<style>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
