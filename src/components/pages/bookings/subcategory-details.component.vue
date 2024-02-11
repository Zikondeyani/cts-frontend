<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">

        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Subcategories
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Catalogue subcategories (Add catalogue subcategories)
          </p>
        </div>
        <div class=" md:col-span-2">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h2 class="text-1xl font-semibold mb-4">Subcategories</h2>
            <div class="space-y-2">
              <div v-for="(item, index) in subcategoryItems" :key="index" class="flex items-center">

                <span class="ml-2 text-teal-700">{{ item.name }}</span>
                <button @click="deleteItem(index)" class="ml-2 text-red-500">❌</button>
              </div>
            </div>
            <div class="mt-4">
              <input v-model="newItem" @keyup.enter="addItem"
                class="rounded border-gray-300 text-gray-700 focus:ring-teal-400 py-2 px-4"
                placeholder="Add a new subcategory" @change="updatesubcategoryItem(item)" />
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
import { usesubcategory } from "../../../stores/subcategory.store";
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

const subcategoryItems = ref([

  // Add more items as needed
]);


const subcategoriesStore = usesubcategory();
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

const createsubcategoryItems = async () => {
  const itemsWithoutId = subcategoryItems.value.map(({ id, ...item }) => item); // Exclude 'id' property


  for (let item of itemsWithoutId) {
    item.listingsId = $route.params.id;
    const cleansubcategoryItems = await subcategoriesStore.getsubcategoryClean();
    const existingItem = cleansubcategoryItems.find((subcategoryItems) => {
      return (
        subcategoryItems.listingsId === item.listingsId &&
        subcategoryItems.name === item.name // Check other properties to ensure uniqueness
      );
    });

    //console.log(item, "tteee")
    if (!existingItem) {
      await subcategoriesStore.create(item);
    } else {
      // Item already exists
      console.log("Item already exists:", item);
      // You can display an error message here, or handle it accordingly
    }
  }

  if (isFirstTime && subcategoryItems.value.length > 0) {
    Swal.fire({
      text: "Subcategory created",
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

  getsubcategoryItems()
});




const getsubcategoryItems = async () => {
  isLoading.value = true;
  subcategoriesStore
    .getsubcategoryClean()
    .then((result) => {
      subcategoryItems.value.length = 0; // Empty the array


      
      subcategoryItems.value.push(...result.filter(item => item.listingsId == $route.params.id));

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
    const name = newItem.value.trim();

    // Check if the new item title is unique in the checklist
    const isUnique = !subcategoryItems.value.some(item => item.name === name);

    if (isUnique) {
      subcategoryItems.value.push({ name });
      createsubcategoryItems(); // Invoke the createsubcategoryItems method to commit the unique items
    } else {
      // Notify the user that the item is not unique
      Swal.fire({
        title: 'Not Unique',
        text: 'This subcategory item already exists.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    newItem.value = '';
  }
};


const deleteItem = async (index) => {
  isLoading.value = true;

  if (subcategoryItems.value[index].id) {
    await remove(subcategoryItems.value[index].id);
  }

  subcategoryItems.value.splice(index, 1);
  isLoading.value = false;
};



const remove = async (id) => {
  isLoading.value = true;
  subcategoriesStore
    .remove(id)
    .then((result) => {

    })
    .catch((error) => {

      Swal.fire({
        text: "Failed to remove subcategory",
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
      getsubcategoryItems();
    });
};

const updatesubcategoryItem = async (newValues) => {
  isLoading.value = true;
  subcategoriesStore
    .update(newValues)
    .then((result) => {

    })

};
</script>
