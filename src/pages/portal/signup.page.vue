<template>
  <div class="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">


    <spinner-widget v-bind:open="isLoading" />
    <div class="relative max-w-xl mx-auto">
      <svg class="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404"
        aria-hidden="true">
        <defs>
          <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20"
            patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" class="text-blue-700" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
      </svg>
      <svg class="absolute right-full bottom-0 transform -translate-x-1/2" width="404" height="404" fill="none"
        viewBox="0 0 404 404" aria-hidden="true">
        <defs>
          <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20"
            patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" class="text-blue-700" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
      </svg>
      <div class="text-center">
        <img class="mx-auto h-28 w-auto" src="../../assets/logo2.jpg" alt="app logo" />
        <h2 class="font-body text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Create an account with us
        </h2>
      </div>
      <hr />
      <div class="mt-12">
        <div class="border border-gray-300 rounded p-4 mb-3">
          <div>
            <h2 class="font-body text-base font-semibold leading-7 text-gray-900">
              User Account Type
            </h2>
            <p class="font-body mt-1 text-sm leading-6 text-gray-600">
              Select the Account type you would like to create.
            </p>
          </div>

          <div class="sm:col-span-6 my-5">
            <label for="useracc" class="font-body block text-sm font-medium leading-6 text-gray-900">Account Type</label>
            <div class="mt-2">
              <select id="useracc" v-model="useracc" autocomplete="useracc"
                class="font-body block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6">
                <option>Service Provider</option>
                <option>Customer</option>
              </select>
            </div>
          </div>
        </div>

        <form @submit="onSubmit" :validation-schema="schema" class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          v-if="useracc == 'Customer'">
          <div>
            <label for="first-name" class="font-body block text-sm font-medium text-gray-700">First name</label>
            <div class="mt-1">
              <input type="text" v-model="firstName" name="first-name" id="first-name" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ firstNameError }}
              </p>
            </div>
          </div>
          <div>
            <label for="last-name" class="block text-sm font-medium text-gray-700 font-body">Last name</label>
            <div class="mt-1">
              <input type="text" v-model="lastName" name="last-name" autocomplete="off" id="last-name"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ lastNameError }}
              </p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-medium text-gray-700 font-body">Email</label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" autocomplete="off" type="email"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">{{ emailError }}</p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="phone-number" class="block text-sm font-medium text-gray-700 font-body">Phone Number</label>
            <div class="mt-1">
              <input type="text" v-model="phone" name="phone-number" id="phone-number" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md"
                placeholder=" +265888000000" />
              <p class="text-red-500 text-xs italic pt-1 font-body">{{ phoneError }}</p>
            </div>
          </div>
          <!-- <div class="sm:col-span-2">
            <label for="country" class="block text-sm font-medium text-gray-700"
              >Country</label
            >
            <select
              id="country"
              name="country"
              v-model="country"
              autocomplete="country"
              class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            >
              <option
                v-for="country in countries"
                :key="country"
                :value="country"
                class="uppercase"
              >
                {{ country }}
              </option>
            </select>
            <p class="text-red-500 text-xs italic pt-1">
              {{ countryError }}
            </p>
          </div> -->
          <div class="sm:col-span-2">
            <label for="password" class="font-body block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" v-model="password" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ passwordError }}
              </p>
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700 font-body">Confirm Password</label>
            <div class="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" v-model="confirmPassword"
                autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />

              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ confirmPasswordError }}
              </p>
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Switch v-model="iAcceptTerms" :class="[
                  iAcceptTerms ? 'bg-blue-700' : 'bg-blue-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                ]">
                  <span class="sr-only font-body">Agree to policies</span>
                  <span aria-hidden="true" :class="[
                    iAcceptTerms ? 'translate-x-5' : 'translate-x-0',
                    'inline-block h-5 w-5 rounded-full font-body bg-white shadow transform ring-0 transition ease-in-out duration-200',
                  ]" />
                </Switch>
              </div>
              <div class="ml-3">
                <p class="text-base text-gray-500 font-body">
                  By selecting this, you agree to the
                  {{ " " }}
                  <a href="#" class="font-medium text-gray-700 underline font-body">Privacy Policy</a>
                  {{ " " }}
                  and
                  {{ " " }}
                  <a href="#" class="font-medium text-gray-700 underline font-body">Cookie Policy</a>.
                </p>
                <p class="text-red-500 text-xs italic pt-1 font-body">
                  {{ iAcceptTermsError }}
                </p>
              </div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <button type="submit"
              class="font-body w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Submit
            </button>
          </div>
        </form>

        <form @submit="onSubmit" :validation-schema="schema" v-if="useracc == 'Service Provider'"
          class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div class="col-span-full">
            <label for="business-name" class="block text-sm font-medium text-gray-700 font-body">Service Provider
              Name</label>
            <div class="mt-1">
              <input type="text" v-model="nameOfOrg" name="nameOfOrg" id="nameOfOrg" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ nameOfOrgError }}
              </p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-medium text-gray-700 font-body">Service Provider Email</label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" autocomplete="off" type="email"
                class="py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md font-body" />
              <p class="text-red-500 text-xs italic pt-1 font-body">{{ emailError }}</p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="phone-number" class="block text-sm font-medium text-gray-700 font-body">Service Provider
              Number</label>
            <div class="mt-1">
              <input type="text" v-model="phone" name="phone-number" id="phone-number" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md"
                placeholder=" +265888000000" />
              <p class="text-red-500 text-xs italic pt-1 font-body">{{ phoneError }}</p>
            </div>
          </div>


          <div class="sm:col-span-2">
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <select id="location" name="location" v-model="location" autocomplete="location"
              class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <option v-for="location in malawiDistricts" :key="location" :value="location" class="uppercase">
                {{ location }}
              </option>
            </select>
            <p class="text-red-500 text-xs italic pt-1">
              {{ locationError }}
            </p>
          </div>


          <div class="sm:col-span-2">
            <label for="providertypes" class="block text-sm font-medium text-gray-700">Service Provider Type</label>
            <select id="providertypes" name="providertypes" v-model="providertypesId" autocomplete="providertypes"
              class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <option v-for="item in providertypes" :key="item.id" :value="item.id" class="uppercase">
                {{ item.name }}
              </option>
            </select>
            <p class="text-red-500 text-xs italic pt-1">
              {{ providertypesError }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="providertypes" class="block text-sm font-medium text-gray-700">Service Provider SubType</label>

            <div class="col-span-6 sm:col-span-6" v-if="filteredSubTypes.length > 0">
              <div class="flex items-center">
                <select v-model="selectedTag" @change="addTag"
                  class="p-2 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white">
                  <option value="" disabled>Select a subtype</option>
                  <option v-for="tag in filteredSubTypes" :key="tag.id" :value="tag">{{ tag.name }}</option>
                </select>
              </div>
              <div class="flex flex-wrap">
                <span v-for="(tag, index) in tags" :key="index"
                  class="bg-gray-200 text-gray-700 rounded-full py-1 px-2 m-1 flex items-center">
                  {{ tag.name }}
                  <button @click="removeTag(index)" class="ml-1 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <p v-if="attachmentError" class="text-red-500 text-xs italic pt-1">
                {{ attachmentError }}
              </p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700 font-body">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" v-model="password" autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />
              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ passwordError }}
              </p>
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700 font-body">Confirm Password</label>
            <div class="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" v-model="confirmPassword"
                autocomplete="off"
                class="font-body py-3 px-4 block w-full shadow-sm focus:ring-gray-500 focus:border-blue-500 border-gray-300 rounded-md" />

              <p class="text-red-500 text-xs italic pt-1 font-body">
                {{ confirmPasswordError }}
              </p>
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Switch v-model="iAcceptTerms" :class="[
                  iAcceptTerms ? 'bg-blue-700' : 'bg-blue-200',
                  'font-body relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                ]">
                  <span class="sr-only font-body">Agree to policies</span>
                  <span aria-hidden="true" :class="[
                    iAcceptTerms ? 'translate-x-5' : 'translate-x-0',
                    'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                  ]" />
                </Switch>
              </div>
              <div class="ml-3">
                <p class="text-base text-gray-500 font-body">
                  By selecting this, you agree to the
                  {{ " " }}
                  <a href="#" class="font-medium text-gray-700 underline font-body">Privacy Policy</a>
                  {{ " " }}
                  and
                  {{ " " }}
                  <a href="#" class="font-medium text-gray-700 underline font-body">Cookie Policy</a>.
                </p>
                <p class="text-red-500 text-xs italic pt-1 font-body">
                  {{ iAcceptTermsError }}
                </p>
              </div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <button type="submit"
              class="font-body w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Submit
            </button>
          </div>
        </form>
        <div class="mt-6">
          <router-link :to="{ name: 'portal-signin' }">
            <a class="text-base font-medium text-gray-500 hover:text-gray-500 font-body">Go back to sign in page<span
                aria-hidden="true"> &rarr;</span></a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Switch } from "@headlessui/vue";
import { inject, reactive, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
import * as yup from "yup";
import { useSessionStore } from "../../stores/session.store";





import { useProvidertypesubcategoriesStore } from "../../stores/providersubtype.store";

import { useProviderTypeStore } from "../../stores/providertype.store";


import { useMailStore } from "../../stores/mail.store";

import spinnerWidget from "../../components/widgets/spinners/roller.spinner.vue";
//DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
const $router = useRouter();
//COMPONENTS
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
//const countries = [{ name: "malawi", code: "+265", short: "MWI" }];


const malawiDistricts = [
  "Balaka",
  "Blantyre",
  "Chikwawa",
  "Chiradzulu",
  "Chitipa",
  "Dedza",
  "Dowa",
  "Karonga",
  "Kasungu",
  "Likoma",
  "Lilongwe",
  "Machinga",
  "Mangochi",
  "Mchinji",
  "Mulanje",
  "Mwanza",
  "Mzimba",
  "Neno",
  "Nkhata Bay",
  "Nkhotakota",
  "Nsanje",
  "Ntcheu",
  "Ntchisi",
  "Phalombe",
  "Rumphi",
  "Salima",
  "Thyolo",
  "Zomba"
];


const tagList = ref([]); // Predefined list of tags
const selectedTag = ref('');
const tags = ref([]);
const attachmentError = ref('');

const addTag = () => {
  if (selectedTag.value && !tags.value.includes(selectedTag.value)) {
    tags.value.push(selectedTag.value);
  } else {
    attachmentError.value = 'Subtype already added';
  }
  selectedTag.value = '';
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
  attachmentError.value = '';
};


const sessionStore = useSessionStore();


const providertypesStore = useProviderTypeStore();


const providertypesubcategories = useProvidertypesubcategoriesStore();


const mailStore = useMailStore();

const useracc = ref("");

const isPwd = ref(true);
const isLoading = ref(false);
//FORM
///SCHEMA
const schema = yup.object({
  firstName: yup
    .string(),

  nameOfOrg: yup.string(),
  lastName: yup
    .string(),
  phone: yup
    .string()
    // regexr.com/6anqd
    .matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      {
        message: "invalid phone number",
        excludeEmptyString: false,
      }
    )
    .required(),
  email: yup.string().required("field is required").email("enter valid email"),
  password: yup.string().required("filed is required").min(8),
  confirmPassword: yup
    .string()
    .required("field is required")
    .oneOf([yup.ref("password")], "passwords do not match"),
  iAcceptTerms: yup.bool().oneOf([true], "field must be checked"),
});


///FORM
const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    nameOfOrg: "",
    iAcceptTerms: true,
  },
});

const countries = ref([
  "Malawi",
  "Kenya",
  "South Africa",
  "Zambia",
  "United Kingdom",
  "USA",
]);

const providertypes = ref([])
///FIELDS
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");

const { value: nameOfOrg, errorMessage: nameOfOrgError } =
  useField("nameOfOrg");

const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const { value: location, errorMessage: locationError } = useField("location");


const { value: providertypesId, errorMessage: providertypesIdError } = useField("providertypesId");

const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmPassword");
const { value: iAcceptTerms, errorMessage: iAcceptTermsError } =
  useField("iAcceptTerms");
//MOUNTED

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  isLoading.value = true;

  let userrole = useracc.value == "Customer" ? "USER1" : "PROVIDER1";

  const tagNames = tags.value.map(tag => tag.name);



  let model = {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
    nameOfOrg: nameOfOrg.value,
    password: password.value,
    location: location.value,
    providertypesId: providertypesId.value,
    providertypeSubcategory: tagNames,
    roleId: userrole,
    status: true,
  };


  sessionStore
    .signUp(model)
    .then((result) => {
      if (result) {
        Swal.fire({
          text: "Succesfully created an account .",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        sendEmail(email.value);
        // redirect
        $router.push({ name: "portal-signin" });
      }
    })
    .catch((error) => {
      Swal.fire({
        text: "Failed to create account .",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
      actions.resetForm();
    });
});

const sendEmail = (mail) => {
  let model = {
    from: system.name,
    to: mail,
    subject: "Machawi265 Platform Registration",
    text: "Thank you for registering to our platform,\n\n You can easily keep track of your bookings through the platform\n\n\Machawi265",
    html: {
      name: firstName.value,
      message: "Thank you for registering to Machawi265 Web Platform.",
      otherinfo: "You can easily track and manage your enquiries conveniently.",
    },
  };

  mailStore
    .send_mail(model)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};


onMounted(async () => {

  providertypesStore
    .get()
    .then((result) => {
      providertypes.value.length = 0; //empty array
      providertypes.value = result

    })
    .catch((error) => {

    })

  getProviderTypeSubTypes()

})


const getProviderTypeSubTypes = () => {

  providertypesubcategories
    .get()
    .then((result) => {
      tagList.value.length = 0; //empty array
      tagList.value = result

    })
    .catch((error) => {

    })

}

const filteredSubTypes = ref([]);
const providertypesError = ref('');
const newTag = ref('');

const filterSubTypes = () => {
  if (providertypesId.value) {
    filteredSubTypes.value = tagList.value.filter(subType => subType.providertypesId === providertypesId.value);
    providertypesError.value = '';
  } else {
    filteredSubTypes.value = [];
    providertypesError.value = 'Please select a Service Provider Type';
  }
};

watch(providertypesId, filterSubTypes);
</script>
