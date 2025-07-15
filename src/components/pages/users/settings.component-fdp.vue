<template>
  <main class="space-y-2">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900 capitalize">
            Profile
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            The details provided will be stored for internal use. Please verify
            before saving.
          </p>
        </div>

        <div class="mt-5 md:mt-0 md:col-span-2 space-y-4">
          <!-- FDP Name -->
          <div class="col-span-6 sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">
              FDP name
            </label>
            <input
              type="text"
              v-model="location_name"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md focus:ring-gray-500 focus:border-gray-500"
            />
            <p class="text-red-500 text-xs italic pt-1">{{ firstnameError }}</p>
          </div>

          <!-- Accessible by MT Truck -->
          <div class="col-span-6 sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">
              Accessible by MT Truck
            </label>
            <select
              v-model="accessible_by_mt_truck"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Select capacity</option>
              <option>10MT</option>
              <option>15MT</option>
              <option>20MT</option>
              <option>30MT</option>
              <option>7 (4X4 only) MT</option>
            </select>
          </div>

          <!-- Hard to Reach Dry Season -->
          <div class="col-span-6 sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">
              Hard to Reach (Dry Season)
            </label>
            <select
              v-model="hard_to_reach_dry_season"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Select</option>
              <option :value="'True'">Yes</option>
              <option :value="'False'">No</option>
            </select>
          </div>

          <!-- Hard to Reach Rainy Season -->
          <div class="col-span-6 sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">
              Hard to Reach (Rainy Season)
            </label>
            <select
              v-model="hard_to_reach_rainy_season"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Select</option>
              <option :value="'True'">Yes</option>
              <option :value="'False'">No</option>
            </select>
          </div>

          <!-- Auto-generated LTI Access Description -->
          <div class="col-span-6 sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">
              Access Notes
            </label>
            <textarea
              v-model="input_for_distribution_plan_and_lti_annex"
              readonly
              rows="4"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-gray-100"
            ></textarea>
          </div>

          <!-- Update Button -->
          <div class="pt-4">
            <button
              @click="onSubmit"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Update
            </button>
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
//COMPONENTS
//SCHEMA AND STORES
import { UpdateUserSchema } from "../../../services/schema/user.schema";
import { useRoleStore } from "../../../stores/role.store";

import { usedistrictstore } from "../../../stores/districts.store";
import { useFDPstore } from "../../../stores/fdps.store";

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
const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "Users", href: "/admin/users", current: false },
  { name: "Edit", href: "/admin/users/edit", current: true },
];
const roleStore = useRoleStore();
const userStore = useFDPstore();

const districtStore = usedistrictstore();

const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);

const roles = reactive([]);

const districts = reactive([]);
const { model } = toRefs(props);
///FORM

const delegations = ref([]); // Delegations receipient
const newDelegate = ref("");
const DelegateError = ref("");

const { meta } = useForm({
  validationSchema: UpdateUserSchema,
  // initialValues: {
  //   id: model.value.id,
  //   firstName: model.value.firstName,
  //   lastname:  model.value.lastname,
  //   phone:  model.value.phone,
  //   email:  model.value.email,
  //   status:  model.value.status,
  //   roleId:  model.value.roleId,
  // },
});
///FIELDS
const { value: location_name, errorMessage: locationnameError } =
  useField("location_name");

const {
  value: hard_to_reach_dry_season,
  errorMessage: hard_to_reach_dry_seasonError,
} = useField("hard_to_reach_dry_season");

const {
  value: hard_to_reach_rainy_season,
  errorMessage: hard_to_reach_rainy_seasonError,
} = useField("hard_to_reach_rainy_season");

const {
  value: accessible_by_mt_truck,
  errorMessage: accessible_by_mt_truckError,
} = useField("accessible_by_mt_truck");

const {
  value: input_for_distribution_plan_and_lti_annex,
  errorMessage: input_for_distribution_plan_and_lti_annexError,
} = useField("input_for_distribution_plan_and_lti_annex");

const { value: lastname, errorMessage: lastnameError } = useField("lastname");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");
const { value: status, errorMessage: statusError } = useField("status");
const { value: roleId, errorMessage: roleIdError } = useField("roleId");
const { value: districtId, errorMessage: districtIdError } =
  useField("districtId");

const { value: nameOfOrg, errorMessage: nameOfOrgError } =
  useField("nameOfOrg");
const { value: password, errorMessage: passwordError } = useField("password");

const { value: OrgDescription, errorMessage: OrgDescriptionError } =
  useField("OrgDescription");

const toggle = ref(false);

watch(
  [
    hard_to_reach_dry_season,
    hard_to_reach_rainy_season,
    accessible_by_mt_truck,
  ],
  ([dry, rainy, truck]) => {
    if (!truck) {
      input_for_distribution_plan_and_lti_annex.value = "";
      return;
    }

    if (dry === 'True' && rainy === 'True') {
      input_for_distribution_plan_and_lti_annex.value = `This FDP is hard to reach during both dry and rainy seasons. It requires a truck with a capacity of ${truck}.`;
    } else if (dry == 'Null' && rainy === 'True') {
      input_for_distribution_plan_and_lti_annex.value = `This FDP is accessible by a 30 MT truck during dry conditions, but is known to be hard to reach during the rainy season. During that period, it can be accessed with a ${truck} truck.`;
    } else if (dry == 'Null' && rainy == 'Null') {
      input_for_distribution_plan_and_lti_annex.value =
        "This FDP can be reached year-round by a 30 MT truck under both dry and rainy conditions.";
    } else if (dry === 'True') {
      input_for_distribution_plan_and_lti_annex.value = `This FDP is hard to reach during the dry season and requires a ${truck} truck.`;
    } else if (rainy === 'True') {
      input_for_distribution_plan_and_lti_annex.value = `This FDP is hard to reach during the rainy season and requires a ${truck} truck.`;
    }
  },
  { immediate: true }
);

//MOUNTED

onMounted(() => {
  //Assign
  location_name.value = model.value.location_name;
  hard_to_reach_dry_season.value = model.value.hard_to_reach_dry_season;
  hard_to_reach_rainy_season.value = model.value.hard_to_reach_rainy_season;
  accessible_by_mt_truck.value = model.value.accessible_by_mt_truck;
  input_for_distribution_plan_and_lti_annex.value =
    model.value.input_for_distribution_plan_and_lti_annex;
  getRoles();

  getDistricts();
});
//FUNCTIONS
const onSubmit = () => {

  let newValues = {
    id: model.value.id,
    location_name: location_name.value,
    hard_to_reach_dry_season: hard_to_reach_dry_season.value?.toString() || "",
    hard_to_reach_rainy_season:
      hard_to_reach_rainy_season.value?.toString() || "",
    accessible_by_mt_truck: accessible_by_mt_truck.value?.toString() || "",
    input_for_distribution_plan_and_lti_annex:
      input_for_distribution_plan_and_lti_annex.value?.toString() || "",
  };
  emit("update", newValues);
};

const getDistricts = async () => {
  isLoading.value = true;
  districtStore
    .get()
    .then((result) => {
      districts.push(...result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to get districts error (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

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

const deleteAcc = async () => {
  let id = model.value.id;
  isLoading.value = true;
  userStore
    .remove(id)
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
          Swal.fire("Deleted!", "Deleted user succesfully.", "success");
          isLoading.value = false;
          let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
          $router.push({ path: "/" + role + "/users" });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "failed to remove theme  (" + error + ")",
        icon: "error",
        confirmButtonText: "Ok",
      });
    });
};

const changepassword = async () => {
  let data = { userId: model.value.id, password: password.value };
  isLoading.value = true;
  userStore
    .changepass(data)
    .then((result) => {
      Swal.fire({
        title: "Success",
        text: "Succesfully changed password",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed",
        text: "Failed to change password (Invalid Password length)",
        icon: "error",
        confirmButtonText: "Ok",
      });
    })
    .finally(() => {
      isLoading.value = false;
      let role = user.value.roleId == "ADMIN1" ? "admin" : "manager";
      $router.push({ path: "/" + role + "/users" });
    });
};

const addTag = () => {
  const delegate = newDelegate.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    delegate &&
    emailPattern.test(delegate) &&
    !delegations.value.includes(delegate)
  ) {
    delegations.value.push(delegate);
    newDelegate.value = "";
    DelegateError.value = "";
  } else {
    DelegateError.value =
      "Please enter a valid email address or the email already exists in the delegations!";
  }
};

// Function to remove a delegate
const removeTag = (index) => {
  delegations.value.splice(index, 1);
};
</script>
