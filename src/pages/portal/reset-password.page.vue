<template>
  <div class="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <div style="background-color: #096eb4;" class="flex justify-center items-center mb-4 rounded-md p-4">
          <img class="h-24 mr-4" src="../../assets/images/images.png" alt="MW-Govt" />
          <img class="h-24" src="../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
        </div>
        <h2 class="mt-6 text-md font-extrabold text-gray-700 text-center">
          DoDMA Commodity Tracking System
          <span class="text-sm font-normal">(v{{ versiondata.version }})</span>
        </h2>
      </div>
    </div>
    <div class="relative max-w-xl mx-auto">
      <!-- Background SVG patterns -->
      <div class="text-center">
        <h2 class="font-body text-3xl mt-3 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Reset Your Password
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-500 font-body">
          Please enter your reset code and new password below.
        </p>
      </div>

      <div class="mt-12 max-w-md mx-auto">
        <form @submit.prevent="resetPassword">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              A reset code has been sent to your email. Please enter the code below to reset your password.
            </p>
            <label for="token" class="block text-sm font-medium text-gray-700">Reset Code</label>
            <input type="text" id="token" v-model="token" required
              class="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your reset code" />
          </div>

          <div class="mb-4 relative">
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <input :type="showPassword ? 'text' : 'password'" id="new-password" v-model="newPassword" required
              class="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your new password" />
            <button @click="togglePasswordVisibility" type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-4 mt-6">
              <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-500" />
              <EyeOffIcon v-if="showPassword" class="h-5 w-5 text-gray-500" />
            </button>
            <p v-if="passwordError" class="text-red-500 text-xs mt-2">{{ passwordError }}</p>
          </div>
          <div class="mb-6">
            <button type="submit" style="background-color: #096eb4"
              class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Reset Password
            </button>
          </div>
        </form>
        <p class="text-sm text-gray-500">
          If you keep encountering issues, please contact the system administrator.
        </p>
        <div class="mt-6 text-center">
          <router-link :to="{ name: 'portal-signin' }">
            <a class="text-base font-medium text-blue-400 hover:text-gray-500 font-body">
              Go back to sign in page<span aria-hidden="true"> &rarr;</span>
            </a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user.store';
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline';

import versiondata from "../../../public/version.json"
const Swal = inject('Swal');

const route = useRoute();
const $router = useRouter();
const token = ref('');
const newPassword = ref('');
const showPassword = ref(false);
const passwordError = ref('');
const userStore = useUserStore();
const email = ref(route.params.email || ''); // Get email from route parameters

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const resetPassword = async () => {
  if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long.';
    return;
  }

  try {
    await userStore.resetpassword({ email: email.value, token: token.value, password: newPassword.value });
    Swal.fire({
      text: 'Your password has been successfully reset.',
      icon: 'success',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    $router.push({ path: '/portal/signin' });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Assume a 400 status indicates an invalid token
      Swal.fire({
        text: 'Invalid reset token. Please check the token and try again.',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        text: 'Failed to reset password. Please try again. If the problem persists, contact the system administrator.',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }
};
</script>
