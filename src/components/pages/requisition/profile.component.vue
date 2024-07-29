<template>
  <main class="">
    <div class="max-w-2xl mx-auto">
      <form
        class="shadow-xl space-y-8 mt-2 bg-white"
        @submit="onSubmit"
        :validation-schema="UpdateUserSchema"
      >
        <div class="overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-6 gap-6">
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
                  class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                  class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p class="text-red-500 text-xs italic pt-1">
                  {{ lastNameError }}
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
            <!-- <div class="grid grid-cols-6 gap-6 mt-3">
              <div class="col-span-6 sm:col-span-2">
                <label
                  for="user-role"
                  class="block text-sm font-medium text-gray-700"
                >
                  User role</label
                >
                <select
                  id="role"
                  name="role"
                  v-model="roleId"
                  autocomplete="role-name"
                  class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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

            <div class="grid grid-cols-6 gap-6 mt-3">
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="status"
                  class="block text-sm font-medium text-gray-700"
                >
                  Account Status</label
                >
                <select
                  id="status"
                  name="status"
                  v-model="status"
                  autocomplete="status-name"
                  class="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
                <p class="text-red-500 text-xs italic pt-1">
                  {{ roleIdError }}
                </p>
              </div>
            </div> -->
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
const roleStore = useRoleStore();
const userStore = useUserStore();
const roles = reactive([]);
const { model } = toRefs(props);
///FORM
const { meta } = useForm({
  validationSchema: UpdateUserSchema,
  // initialValues: {
  //   id: model.value.id,
  //   firstName: model.value.firstName,
  //   lastName:  model.value.lastName,
  //   phone:  model.value.phone,
  //   email:  model.value.email,
  //   status:  model.value.status,
  //   roleId:  model.value.roleId,
  // },
});
///FIELDS
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: status, errorMessage: statusError } = useField("status");
const { value: roleId, errorMessage: roleIdError } = useField("roleId");
//WATCH
// watch(model, (currentValue, oldValue) => {

// });
//MOUNTED
onMounted(() => {
  //Assign
  firstName.value = model.value.firstName;
  lastName.value = model.value.lastName;
  phone.value = model.value.phone;
  email.value = model.value.email;
  status.value = model.value.status;
  roleId.value = model.value.roleId;
  getRoles();
});
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    id: model.value.id,
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
    status: status.value,
    roleId: roleId.value,
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
</script>