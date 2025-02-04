<template>
  <main class="space-y-6">
    <!-- Mailing Group Details -->
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Mailing Group Name</label>
            <input type="text" v-model="name" id="name" autocomplete="given-name"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md" />
          </div>
        </div>
        <div class="text-right mt-4">
          <button type="submit" class="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Update
          </button>
        </div>
      </form>
    </div>

    <!-- Mailing Group Members -->
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Mailing Group Members</h3>
      <p class="mt-1 text-sm text-gray-500">Manage the members of this mailing group.</p>

      <div class="mt-4 flex items-center justify-between">
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Select User Role</label>
          <select v-model="selectedRole" id="role"
            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md">
            <option value="" disabled>Select a role</option>
            <option value="ADMIN1">Admins</option>
            <option value="ADMIN3">Managers</option>
            <option value="ADMIN2">Commissioners</option>
            <option value="ADMIN5">Dispatchers</option>
            <option value="ADMIN4">Planners</option>
            <option value="ADMIN6">Recipients</option>
            <option value="ADMIN7">District Council</option>
            <option value="ADMIN8">Warehouse Officers</option>
          </select>
        </div>
        <button class="flex items-center space-x-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          @click="importMailingList">
          <span>Import Members</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <p v-if="importError" class="text-red-500 text-sm mt-2">{{ importError }}</p>

      <div class="mt-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input type="checkbox" @change="toggleSelectAll" />
              </th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">District</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in paginatedMailingList" :key="member.id"
              :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
              <td class="px-6 py-4 text-sm text-gray-900">
                <input type="checkbox" v-model="selectedMembers" :value="member.id" />
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ member.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ member.district || "National" }}</td>
              <td class="px-6 py-4">
                <button class="flex items-center space-x-2 text-red-600 hover:text-red-800"
                  @click="removeEmail(member.id)">
                  <span>Delete</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="paginatedMailingList.length === 0" class="text-center font-medium text-gray-500 mt-4">
          No members found for this mailing group.
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4">
          <button @click="goToPreviousPage" :disabled="currentPage === 1"
            class="text-gray-500 disabled:opacity-50 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="goToNextPage" :disabled="currentPage === totalPages"
            class="text-gray-500 disabled:opacity-50 flex items-center space-x-2">
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Bulk Delete -->
        <div class="flex justify-end mt-4">
          <button
            class="bg-white py-2 px-4 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="bulkDelete">
            <span>Deleted All Selected</span>

          </button>
        </div>

        <!-- Add Email with District -->
        <div class="mt-6">
          <h4 class="text-md font-semibold text-gray-700 mb-2">Add New Member</h4>
          <div class="flex space-x-2">
            <input type="email" v-model="newEmail" id="newEmail" placeholder="Enter email"
              class="flex-1 block rounded-md shadow-sm border-gray-400" />
            <select v-model="selectedDistrict" id="district" class="block w-1/3 rounded-md shadow-sm border-gray-400">
              <option value="" disabled>Select District</option>
              <option v-for="district in districts" :key="district.id" :value="district.Name">{{ district.Name }}
              </option>
              <option value="National">National</option>
            </select>
            <button class="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm" @click="addEmail">
              Add Email
            </button>
          </div>
          <p v-if="emailError" class="text-red-500 text-sm mt-2">{{ emailError }}</p>
        </div>
      </div>
    </div>

    <!-- Delete Mailing Group -->
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Delete Mailing Group
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Delete user account and all associated data
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="px-4 py-3 text-right sm:px-6">
            <button type="button"
              class="bg-white py-2 px-4 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="deleteMailinglistStore()">
              Delete Mailing Group

            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, reactive, onMounted, toRefs, inject, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usemailinglistStore } from "../../../stores/mailinglists.store";
import { usemailinggrouptore } from "../../../stores/mailinggroups.store";
import { usedistrictstore } from "../../../stores/districts.store";
import { useUserStore } from "../../../stores/user.store";

const Swal = inject("Swal");

const $router = useRouter();
const $route = useRoute();
const isLoading = ref(false);
const mailinglist = reactive([]);
const districts = reactive([]);
const mailinglistStore = usemailinglistStore();
const mailinggroupStore = usemailinggrouptore();
const districtStore = usedistrictstore();

const userStore = useUserStore();

const newEmail = ref("");
const emailError = ref("");
const selectedRole = ref("");
const importError = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedDistrict = ref("National"); // Default to "National"
const selectedMembers = ref([]);

const props = defineProps({
  model: {
    type: Object,
  },
});

const { model } = toRefs(props);
const groupId = ref(Number($route.params.id) || 0);
const name = ref(model?.name || "");

onMounted(() => {
  if (model && model.value) {
    name.value = model.value.name || "";
  }
  getMailingList();
  getDistricts();
});

const getMailingList = async () => {
  isLoading.value = true;
  try {
    const result = await mailinglistStore.get();
    mailinglist.splice(0, mailinglist.length, ...result);
  } catch (error) {
    alert("Failed to fetch mailing list.");
  } finally {
    isLoading.value = false;
  }
};

const getDistricts = async () => {
  isLoading.value = true;
  try {
    const result = await districtStore.get();
    districts.splice(0, districts.length, ...result);
  } catch (error) {
    alert("Failed to fetch districts.");
  } finally {
    isLoading.value = false;
  }
};

const filteredMailingList = computed(() =>
  mailinglist.filter((member) => member.mailinggroupsId === groupId.value)
);

const addEmail = async () => {
  if (!newEmail.value || !/\S+@\S+\.\S+/.test(newEmail.value)) {
    emailError.value = "Please enter a valid email address.";
    return;
  }
  if (filteredMailingList.value.some((member) => member.email === newEmail.value)) {
    emailError.value = "This email is already added.";
    return;
  }
  emailError.value = "";

  const district = selectedDistrict.value || "National";

  try {
    await mailinglistStore.create({
      email: newEmail.value,
      district,
      mailinggroupsId: groupId.value,
    });
    newEmail.value = "";
    selectedDistrict.value = "National";
    getMailingList(); // Refresh the list
  } catch {
    alert("Failed to add email.");
  }
};

const onSubmit = async (event) => {
  event.preventDefault(); // Prevent the form's default submission behavior
  if (!name.value.trim()) {
    Swal.fire({
      title: "Error",
      text: "Mailing group name cannot be empty.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }
  isLoading.value = true;

  try {
    await mailinggroupStore.update({
      id: groupId.value,
      name: name.value,
    });
    Swal.fire({
      title: "Success",
      text: "Mailing group updated successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });
    getMailingList(); // Optionally refresh mailing group details
  } catch (error) {
    Swal.fire({
      title: "Failed",
      text: "Failed to update the mailing group: " + error.message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    isLoading.value = false;
  }
};


const removeEmail = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This email will be permanently removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (result.isConfirmed) {
    try {
      await mailinglistStore.remove(id);
      Swal.fire("Deleted!", "The email has been removed.", "success");
      getMailingList(); // Refresh the list
    } catch {
      alert("Failed to delete email.");
    }
  }
};

const deleteMailinglistStore = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the mailing group and cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (result.isConfirmed) {
    try {
      await mailinggroupStore.remove(groupId.value);
      Swal.fire("Deleted!", "The mailing group has been deleted.", "success");
      $router.push({ path: "/admin/mailinggroups" });
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Failed to remove the mailing group: " + error.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }
};

const importMailingList = async () => {
  if (!selectedRole.value) {
    importError.value = "Please select a user role to import.";
    return;
  }
  importError.value = ""; // Clear any previous errors

  try {
    // Fetch all users and filter by the selected role
    const allUsers = await userStore.get(); // Assuming this fetches all users
    const users = allUsers.filter((user) => user.roleId === selectedRole.value);

    if (users.length === 0) {
      importError.value = "No users found for the selected role.";
      return;
    }

    // Prepare bulk insert data
    const bulkInsertData = users.map((user) => ({
      email: user.email,
      district: user.district || "National",
      mailinggroupsId: groupId.value,
    }));

    // Perform bulk insert
    await Promise.all(
      bulkInsertData.map((entry) => mailinglistStore.create(entry))
    );

    Swal.fire({
      title: "Success",
      text: "Mailing list imported successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    getMailingList(); // Refresh the mailing list
  } catch (error) {
    importError.value = "Failed to import mailing list: " + error;
  }
};

// Pagination logic
const totalPages = computed(() => Math.ceil(filteredMailingList.value.length / itemsPerPage));

const paginatedMailingList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMailingList.value.slice(start, start + itemsPerPage);
});

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedMembers.value = paginatedMailingList.value.map((member) => member.id);
  } else {
    selectedMembers.value = [];
  }
};

const bulkDelete = async () => {
  if (selectedMembers.value.length === 0) {
    alert("No members selected for deletion.");
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "These members will be permanently removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete them!",
  });

  if (result.isConfirmed) {
    try {
      await Promise.all(selectedMembers.value.map(id => mailinglistStore.remove(id)));
      Swal.fire("Deleted!", "The selected members have been removed.", "success");
      selectedMembers.value = [];  // Clear selected members
      getMailingList(); // Refresh the list
    } catch {
      alert("Failed to delete selected members.");
    }
  }
};


</script>
