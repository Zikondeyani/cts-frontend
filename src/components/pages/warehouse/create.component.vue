<template>
  <div>
    <button type="button"
      class="font-body inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-400 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true">
      new warehouse
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
                <h5 class="text-md font-medium leading-normal text-gray-800" id="formModalLabel">
                  Create Warehouse
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false">
                  <XIcon class="h-4 w-4" /> <!-- Icon added here -->

                </button>


              </div>


              <form @submit="onSubmit" :validation-schema="CreateWarehouseSchema">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-3">
                      <label for="organisation-Name" class="block text-sm font-medium text-gray-700">
                        Warehouse Name</label>
                      <input type="text" Name="warehouse-Name" id="warehouse-Name" v-model="Name"
                        autocomplete="given-Name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ NameError }}
                      </p>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="MaxStorage (MT)" class="block text-sm font-medium text-gray-700">Max Storage (MT)</label>
                      <input type="number" Name="MaxStorage" id="MaxStorage" v-model="MaxStorage"
                        autocomplete="MaxStorage"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ MaxStorageError }}
                      </p>
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="user-district" class="block text-sm font-medium text-gray-700">
                        Select District</label>
                      <select id="district" name="district" v-model="districtId" autocomplete="role-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="district in districts" :key="district.id" :value="district.id" class="uppercase">
                          {{ district.Name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ districtError }}
                      </p>
                    </div>


                    <div class="col-span-6 sm:col-span-3">
                      <label for="user-district" class="block text-sm font-medium text-gray-700">
                        Select Organisation</label>
                      <select id="organisation" name="organisation" v-model="organisationId" autocomplete="role-name"
                        class="mt-1 focus:ring-gray-500 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option v-for="organisation in organisations" :key="organisation.id" :value="organisation.id"
                          class="uppercase">
                          {{ organisation.Name }}
                        </option>
                      </select>
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ organisationError }}
                      </p>
                    </div>


                  </div>

                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="submit" style="background-color: #096eb4;"
                    class="`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
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
import { CreateWarehouseSchema } from "../../../services/schema/warehouse.schema";
import { useRoleStore } from "../../../stores/role.store";
import { useUserStore } from "../../../stores/user.store";

import { usedistrictstore } from "../../../stores/districts.store";

import { useorganisationstore } from "../../../stores/organisations.store";
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

const districtstore = usedistrictstore();
const districts = reactive([])

const sessionStore = useSessionStore();


const organisationStore = useorganisationstore();
const organisations = reactive([])

const user = ref(sessionStore.getUser);

//FORM
const { meta } = useForm({
  validationSchema: CreateWarehouseSchema,
  initialValues: {
    Name: "",
    MaxStorage: "",
    districtId: "",
    organisationId: "",
    userId: ""

  },
});
///FIELDS
const { value: Name, errorMessage: NameError } =
  useField("Name");
const { value: MaxStorage, errorMessage: MaxStorageError } = useField("MaxStorage");
const { value: districtId, errorMessage: districtError } = useField("districtId");
const { value: organisationId, errorMessage: organisationError } = useField("organisationId");



//MOUNTED
onMounted(() => {

  getDistricts()
  getOrganisation()
});
//FUNCTIONS

const getOrganisation = async () => {
  organisationStore
    .get()
    .then(result => {

      organisations.length = 0; //empty array
      organisations.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {

      districts.length = 0; //empty array
      districts.push(...result);

    })
    .catch(error => {

    })
    .finally(() => {
    });
};


const onSubmit = useSubmitForm((values, actions) => {
  let model = {
    Name: Name.value,
    MaxStorage: MaxStorage.value,
    organisationId: organisationId.value,
    districtId: districtId.value,
    userId: user.value.id
  };


  emit("create", model);
  open.value = false;
  actions.resetForm();
});


</script>
