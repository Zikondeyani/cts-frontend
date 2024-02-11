<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Booking Details
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Booking status (Accept or decline customer checklist)
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form class="" @submit="onSubmit" :validation-schema="UpdateBookingSchema">
            <div class="overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <p class="text-indigo-500 text-sm italic pt-1">
                      Current Booking status : <strong>{{ model.status }}</strong>
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

        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Booking Checklist
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Booking Checklist (Manage Booking Checklist)
          </p>
        </div>
        <div class=" md:col-span-2">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h2 class="text-1xl font-semibold mb-4">Checklist</h2>
            <div class="space-y-2">
              <div v-for="(item, index) in checklistItems" :key="index" class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-teal-500 focus:ring-teal-400 h-4 w-4"
                  v-model="item.completed" @change="updateChecklistItem(item)" />
                <span class="ml-2 text-gray-700">{{ item.title }}</span>
                <button @click="deleteItem(index)" class="ml-2 text-red-500">❌</button>
              </div>
            </div>
            <div class="mt-4">
              <input v-model="newItem" @keyup.enter="addItem"
                class="rounded border-gray-300 text-gray-700 focus:ring-teal-400 py-2 px-4" placeholder="Add a new checklist item"
                @change="updateChecklistItem(item)" />
              <button @click="addItem" class="ml-2 rounded bg-teal-500 text-white px-4 py-2">Add</button>
            </div>

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

import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
import { usecheckliststore } from "../../../stores/checklist.store";
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


const checklistStore = usecheckliststore();
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


let isFirstTime = true;

const createChecklist = async () => {
  const itemsWithoutId = checklistItems.value.map(({ id, ...item }) => item); // Exclude 'id' property

  for (let item of itemsWithoutId) {
    item.bookingsId = $route.params.id;
    const cleanChecklists = await checklistStore.getchecklistsClean();
    const existingItem = cleanChecklists.find((checklist) => {
      return (
        checklist.bookingsId === item.bookingsId &&
        checklist.title === item.title // Check other properties to ensure uniqueness
      );
    });

    if (!existingItem) {
      await checklistStore.create(item);
    } else {
      // Item already exists
      console.log("Item already exists:", item);
      // You can display an error message here, or handle it accordingly
    }
  }

  if (isFirstTime && checklistItems.value.length > 0) {
    Swal.fire({
      text: "Checklist created",
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    isFirstTime = false;
  }

  isLoading.value = false;
};


//MOUNTED
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datepicker').min = today;

  getChecklist()
});


const checklistItems = ref([

  // Add more items as needed
]);


const getChecklist = async () => {
  isLoading.value = true;
  checklistStore
    .getchecklistsClean()
    .then((result) => {
      checklistItems.value.length = 0; // Empty the array

      checklistItems.value.push(...result.filter(item => item.bookingsId == $route.params.id));

    })
    .catch((error) => {


      console.log("faw", error)
      Swal.fire({
        title: "Checklist Retrieval Failed",
        text: "Failed to get faqs (Please refresh to try again)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const newItem = ref('');

const addItem = () => {
  if (newItem.value.trim() !== '') {
    const title = newItem.value.trim();

    // Check if the new item title is unique in the checklist
    const isUnique = !checklistItems.value.some(item => item.title === title);

    if (isUnique) {
      checklistItems.value.push({ title, completed: false });
      createChecklist(); // Invoke the createChecklist method to commit the unique items
    } else {
      // Notify the user that the item is not unique
      Swal.fire({
        title: 'Not Unique',
        text: 'This checklist item already exists.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    newItem.value = '';
  }
};


const deleteItem = async (index) => {
  isLoading.value = true;

  if (checklistItems.value[index].id) {
    await remove(checklistItems.value[index].id);
  }

  checklistItems.value.splice(index, 1);
  isLoading.value = false;
};



const remove = async (id) => {
  isLoading.value = true;
  checklistStore
    .remove(id)
    .then((result) => {

    })
    .catch((error) => {

      Swal.fire({
        text: "Failed to remove checklist",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
      getChecklist();
    });
};

const updateChecklistItem = async (newValues) => {
  isLoading.value = true;
  checklistStore
    .update(newValues)
    .then((result) => {

    })

};
</script>
