<template>
  <div class="min-h-full flex" style="height: 100vh">
    <spinner-widget v-bind:open="isLoading" />




<div class="hidden lg:block relative w-0 flex-1 flex flex-col col-span-6"  style="display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #096eb4; text-align: center; padding: 20px;">
    <div style="display: flex; justify-content: center; align-items: center;">
        <img class="img-fluid" style="height: 100px; margin-right: 10px;" src="../../assets/images/images.png" alt="MW-Govt" />
        <img class="img-fluid" style="height: 100px;" src="../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
    </div>
    <h2 class="mt-6 text-3xl font-extrabold text-white">
        DoDMA Commodity Tracking System
    </h2>
</div>





    <div class="flex-1 flex flex-col col-span-6 justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
       
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
       
        </div>

        <div class="mt-8">
          <div>
            <div class="mt-6 relative">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500"> </span>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <form @submit="onSubmit" :validation-schema="schema" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input id="email" name="email" type="email" v-model="email" autocomplete="email"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm" />
                  <p class="text-red-500 text-xs italic pt-1">
                    {{ emailError }}
                  </p>
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input id="password" name="password" :type="isPwd ? 'text'  : 'password' " autocomplete="current-password"
                    v-model="password"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm" />
                  <p class="text-red-500 text-xs italic pt-1">
                    {{ passwordError }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="hide-password" name="hide-password" v-model="isPwd" type="checkbox" style="color: #096eb4"
                    class="h-4 w-4 focus:ring-blue-400 border-gray-300 rounded" />
                  <label for="show-password" class="ml-2 block text-sm text-gray-900">
                    Show password
                  </label>
                </div>

                <div class="text-sm">
                  <router-link :to="{ name: 'portal-forgot-password' }">
                    <a style="color: #096eb4" class="font-medium hover:text-blue-400">
                      Forgot your password?
                    </a>
                  </router-link>
                </div>
              </div>

              <div>
                <button type="submit" style="background-color: #096eb4"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                  Sign in
                </button>
              </div>
            </form>
         
            <div class="mt-10">
              <p class="text-sm text-gray-600 text-re">
                &copy; {{ moment().format('YYYY') }} {{ system.name }} . All
                rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/solid';
import { useField, useForm, useSubmitForm } from 'vee-validate';
import { inject, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSessionStore } from '../../stores/session.store';

//DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
const $router = useRouter();
//COMPONENTS
import spinnerWidget from '../../components/widgets/spinners/roller.spinner.vue';
//INJENCTIONS
const moment = inject('moment');
const Swal = inject('Swal');
//VARIABLES
const sessionStore = useSessionStore();
const isPwd = ref(false);
const isLoading = ref(false);
//FORM
///SCHEMA
const schema = yup.object({
  email: yup.string().required('filed is required').email('enter valid email'),
  password: yup.string().required('filed is required'),
});
///FORM
const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
});
///FIELDS
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
//MOUNTED
//Mounted
onMounted(() => {
  //checkSession();
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  isLoading.value = true;
  let model = {
    email: email.value,
    password: password.value,
  };
  sessionStore
    .signIn(model)
    .then(result => {
      if (result == 'admin') {
        Swal.fire({
          text: 'Succesfully signed in',
          icon: 'success',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        // redirect

        $router.push({ path: '/' + result.role });
      } else {
        Swal.fire({
          text: 'Succesfully signed in',
          icon: 'success',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        // changed
        //  const myresult = "user"

        //   console.log("route",  $router.push({ path: "/" + myresult}))
        // redirect
        $router.push({ path: '/' + result.role });
      }
    })
    .catch(error => {
      Swal.fire({
        text: 'Failed to login (' + error + ')',
        icon: 'error',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
      actions.resetForm();
    });
});

function checkSession() {
  sessionStore.check().then(result => {
    Swal.fire({
      text: 'Welcome back ',
      icon: 'success',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    // redirect
    $router.push({ path: '/' + result });
  });
}
</script>
