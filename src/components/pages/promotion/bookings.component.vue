<template>
  <main class="space-y-2 font-body ">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Enquiries</h3>
          <p class="mt-1 text-sm text-gray-500"> List of enquiries made on catalogue item</p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3">
            <table class="min-w-full">
              <thead class="border-b">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium font-bold text-gray-900 px-6 py-4 text-left"
                  >
                    Enquiry #
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium font-bold text-gray-900 px-6 py-4 text-left"
                  >
                    Client Name
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium font-bold text-gray-900 px-6 py-4 text-left"
                  >
                    Date Enquired
                  </th>
                  <!-- <th
                    scope="col"
                    class="text-sm font-medium font-bold text-gray-900 px-6 py-4 text-left"
                  >
                    Options
                  </th> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(booking, index) in bookings"
                  :key="booking.id"
                  class="border-b"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ index + 1 }}
                  </td>
                  
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap uppercase"
                  >
                    {{ booking.firstname + " " + booking.lastname }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ moment(booking.created).format("DD/MM/YYYY") }}
                  </td>
                 <!--  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                  <button
                      type="button"
                      @click="remove(booking.id)"
                      class="text-gray-500 hover:text-green-900 text-xs p-1"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      @click="remove(booking.id)"
                      class="text-gray-500 hover:text-green-900 text-xs p-1"
                    >
                      Delete
                    </button>
                  </td> -->
                </tr>
              </tbody>
            </table>
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
import * as bookingsaver from "file-saver";
//COMPONENTS
//SCHEMA AND STORES
import { usebookingstore } from "../../../stores/booking.store";

//DECLARATIONS
const system = reactive({
  api: process.env.VUE_APP_ROOT_API,
});
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
const bookingStore = usebookingstore();
const { model } = toRefs(props);
//VALUES
const bookings = reactive([]);

onMounted(() => {
  //Methods
  getBookings();
});
//WATCH

const getBookings = async () => {
  isLoading.value = true;
  bookingStore
    .getByReference({ id: model.value.id })
    .then((result) => {
      bookings.length = 0;
      bookings.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get bookings error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const create = async (data) => {
  isLoading.value = true;
  bookingstore
    .upload(data)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added file to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to add file  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getBookings();
      emit("refresh", {});
    });
};

const remove = async (id) => {
  isLoading.value = true;
  bookingstore
    .remove(id)
    .then((result) => {
      // Swal.fire({
      //   title: "Success",
      //   text: "added file to document",
      //   icon: "success",
      //   confirmButtonText: "Ok",
      // });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove file  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getBookings();
      emit("refresh", {});
    });
};
</script>
