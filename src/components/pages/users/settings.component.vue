<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Profile
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form
            class=""
            @submit="onSubmit"
            :validation-schema="UpdateUserSchema"
          >


          
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  
                  <div class="col-span-6 sm:col-span-3" v-if="roleId !== 'PROVIDER1'">
                    <label
                      for="first-name"
                      class="block text-sm font-medium text-gray-700"
                      >First name</label
                    >
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      v-model="firstname"
                      autocomplete="given-name"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ firstnameError }}
                    </p>
                  </div>

                  <div class="col-span-6 sm:col-span-3" >
                    <label
                      for="last-name"
                      class="block text-sm font-medium text-gray-700"
                      >Last name</label
                    >
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      v-model="lastname"
                      autocomplete="family-name"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ lastnameError }}
                    </p>
                  </div>


                


                  <div class="col-span-6 sm:col-span-4">
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
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ emailError }}
                    </p>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
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
                      placeholder=" +26599123456"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ phoneError }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Account status and access type
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            change user access type and account status
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form
            class=""
            @submit="onSubmit"
            :validation-schema="UpdateUserSchema"
          >
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="user-role"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Role</label
                    >
                    <select
                      id="role"
                      name="role"
                      disabled
                      v-model="roleId"
                      autocomplete="role-name"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.id"
                      >
                        <span 
                        >{{ role.name.toUpperCase() }}</span>
                      </option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ roleIdError }}
                    </p>
                  </div>
                  

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="status"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Status</label
                    >
                    <select
                      id="status"
                      name="status"
                      v-model="status"
                      disabled
                      autocomplete="status-name"
                      class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option :value="true">Active</option>
                      <option :value="false">Inactive</option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ statusError }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Password and security
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Recover user account password .
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="toggle = true"
              v-if="toggle == false"
            >
              Change password
            </button>

            <button
              type="button"
              v-if="toggle == true"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="toggle = false"
            >
              Close
            </button>
          </div>
        </div>

        <div class="md:col-span-1" v-if="toggle == true">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            New Password
          </h3>
          <div class="col-span-6 sm:col-span-3">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              type="text"
              v-model="password"
              name="password"
              id="password"
              autocomplete="off"
              class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 mt-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="changepassword()"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
      v-if="user.roleId == 'ADMIN1'"
    >
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Delete account
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Delete user account and all associated data
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="deleteAcc()"
            >
              Delete user
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
//SCHEMA AND STORES
import { UpdateUserSchema } from "../../../services/schema/user.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");
const props = defineProps({
  model: Object,
});
//VARIABLES
const emit = defineEmits(["update"]);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Users", href: "/admin/users", current: false },
  { name: "Edit", href: "/admin/users/edit", current: true },
];
const roleStore = useRoleStore();
const userStore = useUserStore();

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const roles = reactive([]);
const { model } = toRefs(props);
///FORM
const { meta } = useForm({
  validationSchema: UpdateUserSchema,
  // initialValues: {
  //   id: model.value.id,
  //   firstName: model.value.firstName,
  //   lastname:  model.value.lastname,
  //   phone:  model.value.phone,
  //   email:  model.value.email,
  //   status:  model.value.status,
  //   roleId:  model.value.roleId,
  // },
});
///FIELDS
const { value: firstname, errorMessage: firstnameError } =
  useField("firstname");
const { value: lastname, errorMessage: lastnameError } = useField("lastname");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: status, errorMessage: statusError } = useField("status");
const { value: roleId, errorMessage: roleIdError } = useField("roleId");


const { value: nameOfOrg, errorMessage: nameOfOrgError } = useField("nameOfOrg");
const { value: password, errorMessage: passwordError } = useField("password");

const { value: OrgDescription, errorMessage: OrgDescriptionError } = useField("OrgDescription");


//WATCH
// watch(model, (currentValue, oldValue) => {

// });

const toggle = ref(false);
//MOUNTED
onMounted(() => {
  //Assign
  firstname.value = model.value.firstname;
  lastname.value = model.value.lastname;
  phone.value = model.value.phone;
  email.value = model.value.email;
  status.value = model.value.status;
  roleId.value = model.value.roleId;
  nameOfOrg.value = model.value.nameOfOrg;
  OrgDescription.value = model.value.OrgDescription;
  getRoles();
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    id: model.value.id,
    firstname: firstname.value,
    lastname: lastname.value,
    phone: phone.value,
    email: email.value,
    status: status.value,
    roleId: roleId.value,
    nameOfOrg: nameOfOrg.value,
    OrgDescription: OrgDescription.value
  };
  emit("update", newValues);
});

const getRoles = async () => {
  isLoading.value = true;
  roleStore
    .get()
    .then((result) => {
      roles.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get roles error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const deleteAcc = async () => {
  let id = model.value.id;
  isLoading.value = true;
  userStore
    .remove(id)
    .then((result) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Deleted user succesfully.", "success");
           isLoading.value = false;
      let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
      $router.push({ path: "/" + role + "/users" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove theme  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
};

const changepassword = async () => {
  let data = { userId: model.value.id, password: password.value };
  isLoading.value = true;
  userStore
    .changepass(data)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Succesfully changed password",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "Failed to change password (Invalid Password length)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
      $router.push({ path: "/" + role + "/users" });
    });
};
</script>
