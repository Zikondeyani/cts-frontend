<template>
  <div>
    <button type="button" style="background-color: #0a6eb4;"
      class="font-body inline-flex items-center px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-500 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true">
      <PlusIcon class="h-5 w-5 mr-2" />
      Create a loading plan
    </button>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false" static>
        <div class="flex min-h-screen text-center md:block md:px-2 lg:px-4" style="font-size: 0">
          <TransitionChild class=" " v-if="open" as="template" enter="ease-out duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <DialogOverlay
              class="hidden pointer-events-none fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">&#8203;</span>
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
            <div
              class="font-body flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-2xl">
              <div
                class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-white">
                <h5 class="font-body text-md font-medium leading-normal text-gray-800" id="formModalLabel">
                  Create Loading Plan
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"></button>
              </div>

              <form @submit="onSubmit">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">



                    <div class="col-span-6 sm:col-span-3">
                      <label for="transporter" class="block text-sm font-medium text-gray-700">
                        Select Transporter</label>
                      <select id="role" name="role" v-model="roleId" autocomplete="role-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>

                    </div>




                    <div class="col-span-6 sm:col-span-3">
                      <label for="transporter" class="block text-sm font-medium text-gray-700">
                        Select Commodity</label>
                      <select id="commodity" name="commodity" v-model="roleId" autocomplete="commodity-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>

                    </div>

                  </div>

                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label for="publication-date" class="block text-sm font-medium text-gray-700">Quantity</label>

                      <input type="number" name="reportFrom" v-model="reports.From" id="reportFrom"
                        autocomplete="quantity"
                        class="mt-2 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="publication-date" class="block text-sm font-medium text-gray-700">Warehouse</label>

                      <select id="warehouse" name="warehouse" v-model="roleId" autocomplete="warehouse-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>
                    </div>
                  </div>



                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label for="destination-district" class="block text-sm font-medium text-gray-700">Destination
                        District</label>

                      <select id="destination" name="destination" v-model="roleId" autocomplete="destination-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="project" class="block text-sm font-medium text-gray-700">Project</label>

                      <select id="project" name="project" v-model="roleId" autocomplete="project-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label for="destination-district" class="block text-sm font-medium text-gray-700">Activity</label>

                      <select id="activity" name="activity" v-model="roleId" autocomplete="activity-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>
                    </div>

                    <div class="col-span-3 sm:col-span-3">
                      <label for="project" class="block text-sm font-medium text-gray-700">Start Date</label>

                      <input type="date" name="Start Date" v-model="reports.From" id="Start Date"
                        autocomplete="Start Date"
                        class="mt-2 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                    </div>

                    <div class="col-span-3 sm:col-span-3">
                      <label for="End Date" class="block text-sm font-medium text-gray-700">End Date</label>

                      <select id="End Date" name="End Date" v-model="roleId" autocomplete="Start Date"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="role in ['roles']" :key="role" :value="role" class="uppercase">
                          {{ role }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="submit" style="background-color: #0a6eb4;"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
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
import { XIcon, PlusIcon } from "@heroicons/vue/outline";
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
const isPwd = ref(true);
const showModal = ref(false);
const roleStore = useRoleStore();

const userStore = useUserStore();
const roles = reactive([]);

const districts = reactive([]);
const sessionStore = useSessionStore();

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

//MOUNTED
onMounted(() => { });

const reports = ref({});
//FUNCTIONS
const onSubmit = () => {
  emit("create", reports.value);
};
</script>
