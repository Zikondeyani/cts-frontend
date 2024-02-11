<template>
  <div>
    <button type="button"
      class="inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-100 ease-in-out capitalize"
      @click="open = true">
      new FAQ
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
                  Create FAQ
                </h5>
                <button type="button"
                  class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  @click="open = false"></button>
              </div>
              <form @submit="onSubmit" :validation-schema="CreateListingSchema">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-6">
                      <label for="name" class="block text-sm font-medium text-gray-700">Question</label>
                      <input type="text" name="response" id="name" v-model="question" autocomplete="question-name"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                      <p class="text-red-500 text-xs italic pt-1">
                        {{ nameError }}
                      </p>
                    </div>



                    <div class="col-span-6 sm:col-span-6">
                      <label for="response" class="block text-sm font-medium text-gray-700">
                        Response</label>
                      <input type="text" name="response" id="response" v-model="response" autocomplete="response"
                        class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>


                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="submit"
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
import { XIcon } from "@heroicons/vue/outline";
import { inject, ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField, useSubmitForm, useIsFormValid } from "vee-validate";
//COMPONENTS
import spinnerWidget from "../../widgets/spinners/default.spinner.vue";
//SCHEMA AND STORES
import { CreateListingSchema } from "../../../services/schema/catalogue.schema";

import { useListingTypeStore } from "../../../stores/catalogue-type.store";

import { useListingTypeCategoryStore } from "../../../stores/catalogue-type-category.store";
import { useListingStore } from "../../../stores/catalogue.store";

import { useSessionStore } from "../../../stores/session.store";
//INJENCTIONS
const $router = useRouter();
const moment = inject("moment");
const emit = defineEmits(["create"]);
//VARIABLES
const isLoading = ref(false);
const open = ref(false);

const sessionStore = useSessionStore();

const catalogueStore = useListingStore();

const user = ref(sessionStore.getUser);

///FIELDS
const { value: question, errorMessage: nameError } = useField("question");

const { value: response, errorMessage: locationError } = useField("response");

const Swal = inject("Swal");

//MOUNTED
onMounted(() => {
});
//WATCH


const { meta } = useForm({
  initialValues: {
    question: "",
    response: "",

  },
});

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {

  let model = {
    response: response.value,
    question: question.value,
    userId: user.value.id
  };

  emit("create", model);
  open.value = false;
  actions.resetForm();
});


</script>
