<template>
  <div class="min-h-full flex flex-col lg:flex-row" style="height: 100vh">
    <spinner-widget :open="isLoading" />

    <!-- Left Section (Hidden on mobile) -->
    <div class="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:w-1/2" style="background-color: #096eb4; text-align: center; padding: 20px;">
      <div class="flex justify-center items-center mb-4">
        <img class="h-24 mr-4" src="../../assets/images/images.png" alt="MW-Govt" />
        <img class="h-24" src="../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
      </div>
      <h2 class="mt-6 text-3xl font-extrabold text-white">
        DoDMA Commodity Tracking System
        <span class="text-sm font-normal">(v2.0)</span>
      </h2>
    </div>

    <!-- Right Section (Sign In Form) -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24" style="background-color: #ffffff;">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div style="background-color: #096eb4;" class="flex justify-center items-center mb-4 lg:hidden rounded-md p-4" >
        <img class="h-24 mr-4" src="../../assets/images/images.png" alt="MW-Govt" />
        <img class="h-24" src="../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
      </div>
      <h2 class="mt-6 text-md font-extrabold text-gray-700 text-center lg:hidden">
        DoDMA Commodity Tracking System
        <span class="text-sm font-normal">(v2.0)</span>
      </h2>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div class="mt-8">
          <div class="mt-6 relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500"></span>
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
                  <input id="password" name="password" :type="isPwd ? 'text' : 'password'"
                    autocomplete="current-password" v-model="password"
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
              <p class="text-sm text-gray-600 text-center">
                &copy; {{ moment().format('YYYY') }} {{ system.name }}
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
import { inject, onMounted, reactive, ref, nextTick  } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSessionStore } from '../../stores/session.store';

import { useDisasterstore } from "../../stores/disaster.store";

import { usecommoditiestore } from "../../stores/commodity.store";

import { usecommoditytypestore } from "../../stores/commodity-type.store";

import { usedistrictstore } from "../../stores/districts.store";

import { useorganisationstore } from "../../stores/organisations.store";
import { useprojectstore } from "../../stores/project.store";

import { usewarehousestore } from "../../stores/warehouse.store";

import { usetransporterstore } from "../../stores/transporter.store";

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
const disasterStore = useDisasterstore();
const commodityStore = usecommoditiestore();
const commoditytypeStore = usecommoditytypestore();
const districtStore = usedistrictstore();
const organisationStore = useorganisationstore();
const projectStore = useprojectstore();
const warehouseStore = usewarehousestore();
const transporterStore = usetransporterstore();
const sessionStore = useSessionStore()
import { saveDataOffline, getDataOffline } from '@/services/localbase';

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
import { checkOnlineStatus } from '@/services/utils/network';

const storedRole = sessionStorage.getItem('RLE');
//MOUNTED
//Mounted
onMounted(async () => {
  await nextTick();
  checkSession();
  try {
    const isOnline = await checkOnlineStatus();
    if (isOnline) {
      // Fetch offline data to check
      const offlineTransporters = await getDataOffline('transporters');
      const offlineDistricts = await getDataOffline('districts');
      const offlineCommodities = await getDataOffline('commodity');
      const offlineCommodityTypes = await getDataOffline('commoditytypes');
      const offlineOrganisations = await getDataOffline('organisations');
      const offlineProjects = await getDataOffline('projects');
      const offlineWarehouses = await getDataOffline('warehouses');
      const offlineDisasters = await getDataOffline('disasters');

      // Fetch and save transporters if not already saved
      if (offlineTransporters.length === 0) {
        const transporters = await transporterStore.get();
        for (const transporter of transporters) {
          await saveDataOffline('transporters', transporter);
        }
        console.log('Transporters saved offline successfully');
      } else {
        console.log('Transporters already exist in the local database');
      }

      // Fetch and save districts if not already saved
      if (offlineDistricts.length === 0) {
        const districts = await districtStore.get();
        for (const district of districts) {
          await saveDataOffline('districts', district);
        }
        console.log('Districts saved offline successfully');
      } else {
        console.log('Districts already exist in the local database');
      }

      // Fetch and save commodities if not already saved
      if (offlineCommodities.length === 0) {
        const commodities = await commodityStore.get();
        for (const commodity of commodities) {
          await saveDataOffline('commodities', commodity);
        }
        console.log('Commodities saved offline successfully');
      } else {
        console.log('Commodities already exist in the local database');
      }

      // Fetch and save commodity types if not already saved
      if (offlineCommodityTypes.length === 0) {
        const commodityTypes = await commoditytypeStore.get();
        for (const commodityType of commodityTypes) {
          await saveDataOffline('commoditytypes', commodityType);
        }
        console.log('Commodity Types saved offline successfully');
      } else {
        console.log('Commodity Types already exist in the local database');
      }

      // Fetch and save organisations if not already saved
      if (offlineOrganisations.length === 0) {
        const organisations = await organisationStore.get();
        for (const organisation of organisations) {
          await saveDataOffline('organisations', organisation);
        }
        console.log('Organisations saved offline successfully');
      } else {
        console.log('Organisations already exist in the local database');
      }

      // Fetch and save projects if not already saved
      if (offlineProjects.length === 0) {
        const projects = await projectStore.get();
        for (const project of projects) {
          await saveDataOffline('projects', project);
        }
        console.log('Projects saved offline successfully');
      } else {
        console.log('Projects already exist in the local database');
      }

      // Fetch and save warehouses if not already saved
      if (offlineWarehouses.length === 0) {
        const warehouses = await warehouseStore.get();
        for (const warehouse of warehouses) {
          await saveDataOffline('warehouses', warehouse);
        }
        console.log('Warehouses saved offline successfully');
      } else {
        console.log('Warehouses already exist in the local database');
      }

      // Fetch and save disasters if not already saved
      if (offlineDisasters.length === 0) {
        const disasters = await disasterStore.get();
        for (const disaster of disasters) {
          await saveDataOffline('disasters', disaster);
        }
        console.log('Disasters saved offline successfully');
      } else {
        console.log('Disasters already exist in the local database');
      }

    } else {
      console.log('Application is offline, cannot fetch and save data');
    }
  } catch (error) {
    console.error('Error during onMounted execution', error);
  }

});
//FUNCTIONS

const sessionObject = ref(null)
const onSubmit = useSubmitForm((values, actions) => {
  isLoading.value = true;
  let model = {
    email: email.value,
    password: password.value,
  };
  sessionStore
    .signIn(model)
    .then(async result => {
      // Display success toast
      Swal.fire({
        text: 'Successfully signed in',
        icon: 'success',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    
      // Store session in localbase

     // console.log(result.session, "ETG")
      //await saveDataOffline('session', { email: email.value, role: result.role });
     // await saveDataOffline('user', JSON.parse(result.session?.USR));

      // Check the role and redirect accordingly
      if (result.role === 'dispatcher') {
        // Specific redirection for warehouse officer
        $router.push({ path: '/dispatcher' });
      }
      else if (result.role === 'planner') {
        // Specific redirection for warehouse officer
        $router.push({ path: '/dodma' });
      }
      else if (result.role === 'recipient') {
        // Specific redirection for warehouse officer
        $router.push({ path: '/field' });
      }

      else if (result.role === 'commissioner') {
        // Specific redirection for warehouse officer
        $router.push({ path: '/commissioner' });
      }
      else {
        // General redirection for other roles
        $router.push({ path: '/' + result.role });
      }
    })
    .catch(error => {
      Swal.fire({
        text: 'Failed to login (Check network connection!, If problem persists contact admin)',
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


const checkSession = async () => {
  const session = await getDataOffline('session');

  if (session.length > 0) {
    if (session[0].role === 'district officer') {
      await $router.push({ name: 'warehouse-dashboard' });
    } else if (session[0].role === 'central user (DoDMA)') {
      await $router.push({ name: 'dodma-dashboard' });
    } else if (session[0].role === 'field officer') {
      await $router.push({ name: 'field-dashboard' });
    } else if (session[0].role === 'Commissioner (DODMA)') {
      await $router.push({ name: 'commissioner-dashboard' });
    }
  }
};
</script>
