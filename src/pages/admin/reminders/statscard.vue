<template>
  <div :class="['p-4 rounded-lg custom-shadow tab-button', color]">
    <h3 class="text-lg font-bold">{{ title }}</h3>
    <p class="mt-2 text-2xl">{{ value }}</p>

    <!-- Conditionally render reminder button if 'reminder' prop is provided -->
    <button
      v-if="reminder"
      @click="sendReminder"
      class="mt-4 send-reminder-btn"
    >
      Send Reminder
    </button>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { useloadingplanstore } from "../../../stores/loadingplans.store";

// Define props
const props = defineProps({
  title: String,
  value: String,
  color: String,
  reminder: String, // 'reminder' should be a string prop like 'noDispatches', 'noReceipts', 'unapproved'
});

const reminderStore = useloadingplanstore();
const Swal = inject("Swal");

// Function to handle sending reminders based on the 'reminder' prop
const sendReminder = async () => {
  console.log(props.reminder, "ssjj")
  try {
    if (props.reminder === 'noDispatches') {
      await reminderStore.getloadingplansNoDispatches();
      showSuccessMessage('Dispatch reminders were sent successfully.');
    } else if (props.reminder === 'noReceipts') {
      await reminderStore.getloadingplansNoReceipts();
      showSuccessMessage('Receipt reminders were sent successfully.');
    } else if (props.reminder === 'unapproved') {
      await reminderStore.getloadingplansUnapproved();
      showSuccessMessage('Loading Plan approval reminders were sent successfully.');
    } else {
      throw new Error('Invalid reminder type');
    }
  } catch (error) {
    showErrorMessage('Failed to send reminders. Please try again.'+ JSON.stringify(error));
  }
};

// Helper functions for success and error notifications
const showSuccessMessage = (message) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#248cd6',
    timer: 3000, // Auto close after 3 seconds
    timerProgressBar: true,
  });
};

const showErrorMessage = (message) => {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    confirmButtonText: 'Retry',
    confirmButtonColor: '#d33',
  });
};
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.tab-button {
  background-color: white;
  color: black;
  border: none;
}

.send-reminder-btn {
  background-color: #248cd6;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-reminder-btn:hover {
  background-color: #1a6fa9;
}

button {
  outline: none;
}
</style>
