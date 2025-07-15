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
          <span class="text-sm font-normal">(v3.0)</span>
        </h2>
      </div>
    </div>
    <div class="relative max-w-xl mx-auto">
      <svg class="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none"
        viewBox="0 0 404 404" aria-hidden="true">
        <defs>
          <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20"
            patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
      </svg>
      <svg class="absolute right-full bottom-0 transform -translate-x-1/2" width="404" height="404" fill="none"
        viewBox="0 0 404 404" aria-hidden="true">
        <defs>
          <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20"
            patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
      </svg>

      <div class="text-center">
        <h2 class="font-body text-3xl mt-3 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Account Recovery
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-500 font-body">
          Please fill out the form below to reset your password. If you encounter issues, please contact the system
          administrator.
        </p>
      </div>

      <div class="mt-12 max-w-md mx-auto">
        <form @submit.prevent="handleResetPassword">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" v-model="email" required
              class="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email address" />
          </div>
          <div class="mb-6">
            <button type="submit" style="background-color: #096eb4"
              class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Reset Password
            </button>
          </div>
        </form>
        <p class="text-sm text-gray-500">
          If you keep failing to reset your password, please contact the system administrator.
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
import { inject, onMounted, reactive, ref, nextTick } from 'vue';
import { useUserStore } from '../../stores/user.store';
import { useRouter, useRoute } from 'vue-router';

const $router = useRouter();
const Swal = inject('Swal');
const email = ref('');


const route = useRoute();
const userStore = useUserStore()

const handleResetPassword = () => {
  // Handle password reset logic here

  userStore
    .forgotpassword({ "email": email.value })
    .then(async result => {
      // Display success toast
      Swal.fire({
        text: 'A password reset request has been sent to your email address.',
        icon: 'info',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
      });

      $router.push({ name: 'portal-reset-password', params: { email: email.value } });
   
    })
    .catch(error => {
      Swal.fire({
        text: 'Failed to reset password. Please check your network connection. If the problem persists, contact the system administrator.',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
      });

    })

};
</script>
