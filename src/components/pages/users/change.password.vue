<template>
  <main class="space-y-6">
    <!-- Breadcrumb Component -->
    <breadcrumb-widget :breadcrumbs="breadcrumbs" />

    <div class="bg-white shadow-md px-6 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Password and Security</h3>
          <p class="mt-1 text-sm text-gray-500">Change your account password securely.</p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit.prevent="changepassword">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <!-- Old Password Field -->
                  <div class="col-span-6 sm:col-span-3 relative">
                    <label for="old-password" class="block text-sm font-medium text-gray-700">Old Password</label>
                    <input :type="showOldPassword ? 'text' : 'password'" v-model="oldPassword" name="old-password"
                      id="old-password" autocomplete="new-password"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <span @click="showOldPassword = !showOldPassword"
                      class="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      <svg v-if="showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-4"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <EyeOffIcon />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500  mt-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <EyeIcon />
                      </svg>
                    </span>
                    <p class="text-red-500 text-xs italic pt-1">{{ oldPasswordError }}</p>
                  </div>

                  <!-- New Password Field -->
                  <div class="col-span-6 sm:col-span-3 relative">
                    <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" name="new-password"
                      id="new-password" autocomplete="new-password"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <span @click="showNewPassword = !showNewPassword"
                      class="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-4"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <EyeOffIcon />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <EyeIcon />
                      </svg>
                    </span>
                    <p class="text-red-500 text-xs italic pt-1">{{ passwordError }}</p>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue"; // Adjust the path if necessary

import { useRouter } from 'vue-router';
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/outline";
import { useSessionStore } from "../../../stores/session.store";
import { useUserStore } from "../../../stores/user.store";

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const userStore = useUserStore();

const $router = useRouter();
// Reactive data
const oldPassword = ref('');
const newPassword = ref('');
const passwordError = ref(''); // For handling password error messages
const oldPasswordError = ref(''); // For handling old password error messages

// Show password functionality
const showOldPassword = ref(false);
const showNewPassword = ref(false);

// Breadcrumb data
const breadcrumbs = [
  { name: "Home", href: "#", current: false },
  { name: "Change Password", href: "#", current: true },
];

// Submit function for changing password
const changepassword = async () => {
  // Simple validation for old password and new password
  if (!oldPassword.value) {
    oldPasswordError.value = 'Old password is required.';
    return;
  } else {
    oldPasswordError.value = '';
  }

  if (!newPassword.value) {
    passwordError.value = 'New password is required.';
    return;
  } else {
    passwordError.value = '';
  }

  // Prepare the data to send to the API
  const data = {
    email: user.value.email,
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  };

  try {
    // Call the API to change the password
    await userStore.changepassnew(data);

    // Show success toast notification with warning
    secureLogout()

  } catch (error) {
    // Handle errors (e.g., invalid old password or other issues)
    Swal.fire({
      title: 'Failed',
      text: error.message || 'Failed to change password. Invalid old password!',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

};


const secureLogout = async () => {
  try {
    await sessionStore.signOut();
    sessionStore.$reset();

    await $router.push({ path: "/portal/signin" }).then((res) => {
      if (res === undefined) {
        Swal.fire({
          text: "Successfully changed password. You will now be securely logged out!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
