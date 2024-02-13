<template>
  <div>
    <button
      type="button"
      class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true"
    >
      new user
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed z-10 inset-0 overflow-y-auto"
        @close="open = false"
        static
      >
        <div
          class="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style="font-size: 0"
        >
          <TransitionChild
            class=" "
            v-if="open"
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block"
            />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span
            class="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl"
            >
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white"
              >
                <h5
                  class="text-md font-medium leading-normal text-gray-800"
                  id="formModalLabel"
                >
                  Create User
                </h5>
                <button
                  type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"
                >
                <XIcon class="h-4 w-4" /> <!-- Icon added here -->
 
              </button>

                
              </div>

              <div class="grid grid-cols-6 bg-white">
                <div class="col-span-6 sm:col-span-3 mx-6 my-3">
                  <label
                    for="user-role"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Select User Type</label
                  >
                  <select
                    id="role"
                    name="role"
                    v-model="roleId"
                    autocomplete="role-name"
                    class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                    <option
                      v-for="role in roles"
                      :key="role.id"
                      :value="role.id"
                      class="uppercase"
                    >
                      {{ role.name }}
                    </option>
                  </select>
                  <p class="text-red-500 text-xs italic pt-1">
                    {{ roleIdError }}
                  </p>
                </div>
              </div>

              <form
                @submit="onSubmit"
                :validation-schema="CreateUserSchema"
                v-if="roleId == 'ADMIN1' || roleId == 'ADMIN2'|| roleId == 'ADMIN3'|| roleId == 'ADMIN4'"
              >
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="first-name"
                        class="block text-sm font-medium text-gray-700"
                        >First name</label
                      >
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        v-model="firstName"
                        autocomplete="given-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ firstNameError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label
                        for="last-name"
                        class="block text-sm font-medium text-gray-700"
                        >Last name</label
                      >
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        v-model="lastName"
                        autocomplete="family-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ lastNameError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-5">
                      <label
                        for="email-address"
                        class="block text-sm font-medium text-gray-700"
                        >Email address</label
                      >
                      <input
                        type="text"
                        name="email-address"
                        id="email-address"
                        v-model="email"
                        autocomplete="email"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ emailError }}
                      </p>
                    </div>
                    <div class="col-span-6 sm:col-span-4">
                      <label
                        for="phone-number"
                        class="block text-sm font-medium text-gray-700"
                        >Phone</label
                      >
                      <input
                        type="text"
                        v-model="phone"
                        name="phone-number"
                        id="phone-number"
                        autocomplete="off"
                        placeholder="e.g. 0999123456"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ phoneError }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-6 gap-6 mt-3">
                    <div class="col-span-6 sm:col-span-4">
                      <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Password</label
                      >
                      <input
                        id="password"
                        name="password"
                        :type="isPwd ? 'text' : 'password'"
                        v-model="password"
                        autocomplete="off"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <div class="flex items-center w-full">
                        <input
                          id="hide-password"
                          name="show-password"
                          v-model="isPwd"
                          type="checkbox"
                          class="ml-2 h-4 w-4 border-gray-300 text-blue-400 focus:ring-blue-400 rounded"
                        />
                        <label
                          for="show-password"
                          class="block text-sm text-gray-900 p-2"
                        >
                        Show password
                        </label>
                      </div>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ passwordError }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    style="background-color: #096eb4;"
                    class="`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateUserSchema } from "../../../services/schema/user.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);
const isPwd = ref(false);
const showModal = ref(false);
const roleStore = useRoleStore();

const userStore = useUserStore();
const roles = reactive([]);

const districts = reactive([]);
const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);

//FORM
const { meta } = useForm({
  validationSchema: CreateUserSchema,
  initialValues: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    status: true,
    roleId: "",
    admin2Id: "National",
  },
});
///FIELDS
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmPassword");
const { value: status, errorMessage: statusError } = useField("status");
const { value: roleId, errorMessage: roleIdError } = useField("roleId");

const { value: nameOfOrg, errorMessage: nameOfOrgError } = useField("nameOfOrg");



//MOUNTED
onMounted(() => {
  getRoles();
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    status: status.value,
    roleId: roleId.value,
    nameOfOrg: nameOfOrg.value
  };
  emit("create", model);
  open.value = false;
  actions.resetForm();
});

const getRoles = async () => {
  isLoading.value = true;
  roleStore
    .get()
    .then((result) => {
      if (user.value.roleId == "ADMIN2") {
        roles.push(...result.filter((item) => item.id !== "ADMIN1"));
      } else {
        roles.push(...result);
      }
    })
    .catch((error) => {
      /* Swal.fire({
        title: "Failed",
        text: "failed to get roles error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      }); */
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>
