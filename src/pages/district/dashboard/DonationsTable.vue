<template>
    <div class="overflow-x-auto relative">
      <div class="mb-4 mt-4">Donations Update</div>
      <div class="absolute top-0 right-0 p-4 flex items-center" :class="{'hidden': screenshotMode}">
        <!-- District Selector -->
        <span class="mr-3 font-medium">District:</span>
        <select v-model="selectedDistrict"
          class="mb-2 mr-2 focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
          <option value="">All Districts</option>
          <option v-for="district in districts" :key="district.id" :value="district.Name">
            {{ district.Name }}
          </option>
        </select>
        <!-- Reset Button -->
        <button @click="resetFilters"
          class="ml-2 mb-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
          Reset Filters
        </button>
      </div>
      <table class="min-w-full divide-y divide-gray-200 mt-8">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Goods Receive Note
            </th>
            
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              District
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Warehouse
            </th>
          
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Donor
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in filteredData" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">{{ row.GoodsReceiveNote }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ row.Date }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ row.district.Name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ row.warehouse.Name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ row.organisation.Name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="viewDetails(row)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div class="flex justify-center mt-4" :class="{'hidden': screenshotMode}">
        <button @click="prevPage" :disabled="currentPage <= 1"
          class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
          <ChevronLeftIcon class="w-5 h-5 mr-2" />
          Prev
        </button>
        <span class="px-4 py-2 font-body font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages"
          class="flex items-center px-4 py-2 mx-1 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">
          <ChevronRightIcon class="w-5 h-5 mr-2" />
          Next
        </button>
        <span class="mr-2 font-medium mt-2">Rows per page:</span>
        <select v-model="pageSize" class="border-gray-300 rounded-md">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="100">100</option>
        </select>
      </div>
      <!-- Details Modal -->
      <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Donation Details
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">Goods Receive Note: {{ selectedRow.GoodsReceiveNote }}</p>
                    <p class="text-sm text-gray-500">Truck Number: {{ selectedRow.TruckNumber }}</p>
                    <p class="text-sm text-gray-500">Date: {{ selectedRow.Date }}</p>
                    <p class="text-sm text-gray-500">District: {{ selectedRow.district.Name }}</p>
                    <p class="text-sm text-gray-500">Warehouse: {{ selectedRow.warehouse.Name }}</p>
                    <p class="text-sm text-gray-500">Donor: {{ selectedRow.organisation.Name }}</p>
                    <h4 class="text-md leading-6 font-medium text-gray-900 mt-4">Donated Commodities</h4>
                    <ul class="list-disc list-inside">
                       <li v-for="(commodity, index) in selectedRow.donatedCommodities" :key="index" class="text-sm text-gray-500">
                        {{ commodity.commodity.Name }} - {{ commodity.Quantity }}
                        <span v-if="commodity.commodity?.commodityType?.Name == 'Food'">MT</span>
                      <span v-else>Units</span>
                
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="showModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
  import { usedistrictstore } from "../../../stores/districts.store";
  import { usecommoditiestore } from "../../../stores/commodity.store";
  import { useRouter } from 'vue-router';
  
  const districtstore = usedistrictstore();
  const districts = reactive([]);
  
  const commoditystore = usecommoditiestore();
  const commodities = reactive([]);
  
  const props = defineProps({
    data: Array,
    screenshotMode: Boolean,
  });
  
  const currentPage = ref(1);
  const pageSize = ref(5);
  const selectedDistrict = ref('');
  const selectedCommodity = ref('');
  const showModal = ref(false);
  const selectedRow = ref({});
  const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value));
  
  const filteredData = computed(() => {
    return props.data.filter(item => {
      return (!selectedDistrict.value || item.district.Name === selectedDistrict.value) &&
        (!selectedCommodity.value || item.commodity.Name === selectedCommodity.value);
    }).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
  });
  
  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
  }
  
  function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
  }
  
  function resetFilters() {
    selectedDistrict.value = '';
    selectedCommodity.value = '';
  }
  
  function viewDetails(row) {
    selectedRow.value = row;
    showModal.value = true;
  }
  
  onMounted(() => {
    getCommodities();
    getDistricts();
  });
  
  const getCommodities = async () => {
    let commoditydata = await commoditystore.get();
    commodities.length = 0;
    commodities.push(...commoditydata);
    return commodities;
  }
  
  const getDistricts = async () => {
    let districtsdata = await districtstore.get();
    districts.length = 0;
    districts.push(...districtsdata);
    return districts;
  }
  
  const $router = useRouter();
  
 
  </script>
  