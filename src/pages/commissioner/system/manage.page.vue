<template>
  <main class="font-bold">
    <!--spinner-->
    <spinner-widget v-bind:open="isLoading" />
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>
      <div class="mt-2 mb-2 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate">
            Manage Enquiry
          </h2>
        </div>
        <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
      <!-- tabs -->
      <div class="align-middle inline-block min-w-full space-y-2">
        <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Enquiry Info
              </h3>
              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Enquiry:</span>
                {{ booking }}
              </p>
              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Enquirer Email:</span>
                {{ model.email }}
              </p>

              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Enquirer Phone #:</span>
                {{ model.phone }}
              </p>
              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Enquired From:</span>
                {{ moment(model.enquiryFrom).format("DD/MM/YYYY") }}
              </p>
              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Enquired To:</span>
                {{ moment(model.enquiryTo).format("DD/MM/YYYY") }}
              </p>

              <p class="mt-1 text-sm text-blue-500">
                <span class="text-gray-500 font-bold">Service Type:</span>
                {{ model.servicetype }}
              </p>
            </div>
          </div>
        </div>
        <Booking-details
          v-bind:model="model"
          v-on:update="updateBooking"
          :key="refresh + 'Details'"
          v-on:refresh="getBooking()"
        />
        <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Delete Enquiry
              </h3>
              <p class="mt-1 text-sm text-gray-500">Delete Enquiry</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  @click="deleteBooking()"
                >
                  Delete Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
//COMPONENTS

import BookingDetails from "../../../components/pages/bookings/details.component.vue";

import spinnerWidget from "../../../components/widgets/spinners/default.spinner.vue";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useSessionStore } from "../../../stores/session.store";

import { useMailStore } from "../../../stores/mail.store";

import { usebookingstore } from "../../../stores/booking.store";
//INJENCTIONS
const $router = useRouter();
const $route = useRoute();
const moment = inject("moment");
const Swal = inject("Swal");

const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
//VARIABLES
const id = ref(null);
const refresh = ref(0);
const isLoading = ref(false);
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Enquiries", href: "/admin/Bookings", current: false },
  { name: "Manage", href: "/admin/Bookings/Manage", current: true },
];
/* const BookingStore = useBookingStore(); */
const sessionStore = useSessionStore();
const bookingStore = usebookingstore();

const booking = ref("");
const mailStore = useMailStore();
const user = ref(sessionStore.getUser);

const model = ref({
  status: "",
  id: id.value,
});
//MOUNTED
onMounted(() => {
  id.value = $route.params.id;
  getBooking();
});
///FORM

///FIELDS

//FUNCTIONS
const getBooking = async () => {
  isLoading.value = true;
  bookingStore
    .getOne(id.value)
    .then((result) => {
      model.value = result;
      booking.value = model.value.listings.name;
    })
    .catch((error) => {
      Swal.fire({
        title: "Enquiry Retrieval Failed",
        text: "Failed to retrive enquiry info (Please refresh page to retry)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      refresh.value = Math.random();
      isLoading.value = false;
    });
};

const updateBooking = async (newValues) => {
  isLoading.value = true;
  bookingStore
    .update(newValues)
    .then((result) => {
      Swal.fire({
        text: "Updated enquiry details",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      sendEmail(newValues);
    })
    .catch((error) => {
      Swal.fire({
        title: "Enquiry Update Failed",
        text: "Failed to update enquiry (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      getBooking();
    });
};

const deleteBooking = async () => {
  isLoading.value = true;
  bookingStore
    .remove(id.value)
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
          Swal.fire("Deleted!", "Deleted enquiry succesfully.", "success");
          isLoading.value = false;
          let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
          $router.push({ path: "/" + role + "/Bookings" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Enquiry Deletion Failed",
        text: "Failed to remove enquiry  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    });
};

const sendEmail = (data) => {
  console.log(model.value);

  if (model.value.userId == undefined) {
    let modelval = {
      from: system.name,
      to: model.value.email,
      subject: "Machawi265 enquiry status",
      text:
        "The status of the enquiry you made for \b" +
        model.value.listings.name +
        " is as follows:\n\bStatus of enquiry:\b" +
        data.status.toUpperCase(),

      html: {
        name: model.value.firstname,
        message:
          "The enquiry you made for " +
          model.value.listings.name +
           +
          " is " +
          model.value.status.toUpperCase().bold(),
        otherinfo: data.comment,
      },
    };

    mailStore
      .send_mail(modelval)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    let modelval = {
      from: system.name,
      to: model.value.email,
      subject: "Machawi265 enquiry status",
      text:
        "The status of the enquiry you made for \b" +
        model.value.listings.name +
        " is as follows:\n\bStatus of enquiry:\b" +
        data.status.toUpperCase() +
        "\n",

      html: {
        name: model.value.user.firstName,
        message:
          "The enquiry you made for " +
          model.value.listings.name +
          " " +
          " is " +
          model.value.status.toUpperCase().bold(),
        otherinfo: data.comment,
      },
    };

    mailStore
      .send_mail(modelval)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>
