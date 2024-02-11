<template>
  <main class="">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Details
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Document basic details (this information will be displayed
            publicly).
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form class=" " @submit="onSubmit" :validation-schema="UpdateListingSchema">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-6">
                    <label for="question" class="block text-sm font-medium text-gray-700">Question</label>
                    <input type="text" name="question" id="question" v-model="question" autocomplete="question"
                      class="mt-1 focus:ring-gray-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ nameError }}
                    </p>
                  </div>



                  <div class="col-span-6 sm:col-span-6">
                    <label for="description" class="block text-sm font-medium text-gray-700">
                      Response
                    </label>
                    <div class="mt-1">
                      <textarea id="response" name="response" v-model="response" rows="3"
                        class="shadow-sm focus:ring-gray-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="" />
                    </div>

                    <p class="text-red-500 text-xs italic pt-1">
                      {{ descriptionError }}
                    </p>
                  </div>


                </div>
              </div>
              <div class="px-4 py-3 text-right sm:px-6">
                <button type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Update
                </button>
              </div>
            </div>
          </form>
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
import { UpdateListingSchema } from "../../../services/schema/catalogue.schema";
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

const isFeatured = ref(false);
const open = ref(false);
const isPwd = ref(true);
const showModal = ref(false);
const roles = reactive([]);
const { model } = toRefs(props);

const sessionStore = useSessionStore();

const user = ref(sessionStore.getUser);
//FORM

const { meta } = useForm({
  validationSchema: UpdateListingSchema,
});
///FIELDS
const { value: question, errorMessage: nameError } = useField("question");
const { value: response, errorMessage: descriptionError } =
  useField("response");


//MOUNTED
onMounted(() => {

  //Assign
  question.value = model.value.question;
  response.value = model.value.response;

});
//WATCH
//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    id: model.value.id,
    question: question.value,
    response: response.value,

  };
  emit("update", newValues);
});




</script>
