<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Enquiry Status
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Enquiry status (Accept or decline customer enquiry)
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form class="" @submit="onSubmit" :validation-schema="UpdateBookingSchema">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <p class="text-indigo-500 text-sm italic pt-1">
                      Current Enquiry status : <strong>{{ model.status }}</strong>
                    </p>
                    <label for="status" class="block text-sm font-medium text-gray-700">
                      Change Status
                    </label>
                    <select id="status" name="status" v-model="model.status" autocomplete="status-name"
                      class="mt-1 focus:ring-gray-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <option value="accepted">Accepted</option>
                      <option value="already booked">Not Available</option>
                    </select>
                    <p class="text-red-500 text-xs italic pt-1">
                      {{ statusError }}
                    </p>




                    <label for="datepicker" class="block text-sm font-medium text-gray-700">Available on:</label>
                    <input type="date" id="datepicker" name="datepicker" v-model="model.availableday"
                      class="mt-1 focus:ring-gray-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                    <div class="col-span-6 sm:col-span-3">
                      <div class="grid grid-cols-2 gap-4">
                        <!-- First TimePicker -->
                        <div>
                          <label for="timepicker1" class="block text-sm font-medium text-gray-700 mt-3">Available
                            from:</label>
                          <div
                            class="mt-4 focus:ring-gray-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            <VueTimePicker :format="timeFormat" v-model="model.availabletimefrom" id="timepicker1">
                            </VueTimePicker>
                          </div>
                        </div>

                        <!-- Second TimePicker -->
                        <div>
                          <label for="timepicker2" class="block text-sm font-medium text-gray-700 mt-3">Available
                            to:</label>
                          <div
                            class="mt-4 focus:ring-gray-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            <VueTimePicker :format="timeFormat" v-model="model.availabletimeto" id="timepicker2">
                            </VueTimePicker>
                          </div>
                        </div>
                      </div>
                    </div>


                    <!-- Comment Box -->
                    <div class="mt-4">
                      <textarea rows="4" v-model="model.comment" placeholder="Add comment to enquirer"
                        class="w-full border-gray-300 rounded-md focus:ring-gray-500 focus:border-teal-500"></textarea>
                    </div>
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

import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";

//COMPONENTS
//SCHEMA AND STORES
import { UpdateBookingSchema } from "../../../services/schema/booking.schema";

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
const open = ref(false);
const isPwd = ref(true);
const showModal = ref(false);
const roles = reactive([]);
const { model } = toRefs(props);


const timeFormat = "hh:mm a"
const timeData = {
  hh: "00",
  mm: "00",
  a: "am",
}


//VALUES
//FORM
const { meta } = useForm({
  initialValues: {
    status: "unapproved",
    comment: "",
    availableday: "",
    availabletimeto: "",
    availabletimefrom: ""
  },
});
///FIELDS
const { value: status, errorMessage: statusError } = useField("status");
const { value: comment, errorMessage: commentError } = useField("comment");
const { value: availableday, errorMessage: availabledayError } = useField("availableday");
const { value: availabletimefrom, errorMessage: availabletimefromError } = useField("availabletimefrom");
const { value: availabletimeto, errorMessage: availabletimetoError } = useField("availabletimeto");

//FUNCTIONS
const onSubmit = useSubmitForm((values, actions) => {
  let newValues = {
    id: model.value.id,
    status: model.value.status,
    comment: model.value.comment,
    availableday: model.value.availableday,
    availabletimefrom: model.value.availabletimefrom,
    availabletimeto: model.value.availabletimeto,
  };
  emit("update", newValues);
});

//MOUNTED
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datepicker').min = today;
});




</script>
