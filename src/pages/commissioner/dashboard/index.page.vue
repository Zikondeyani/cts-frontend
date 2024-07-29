<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>

      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8 mt-4">
        <!-- Tabs -->
        <div class="lg:col-span-3">
          <div class="flex justify-center space-x-4 mb-4">
            <button @click="toggleView('dashboard')" type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'dashboard' }">
              <TemplateIcon class="h-5 w-5 mr-2" />
              Overall Dashboard
            </button>

            <button @click="toggleView('charts')" type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'charts' }">
              <ChartBarIcon class="h-5 w-5 mr-2" />
              Emergency Response Dashboard
            </button>

            <button @click="toggleView('leanSeasonDashboard')" type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'leanSeasonDashboard' }">
              <TemplateIcon class="h-5 w-5 mr-2" />
              Lean Season Response Dashboard
            </button>

            <button @click="toggleView('Donations')" type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'Donations' }">
              <HeartIcon class="h-5 w-5 mr-2" />
              Donations
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <div class="grid grid-cols-1 gap-4">
            <!-- Welcome panel -->
            <section aria-labelledby="profile-overview-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <h2 class="sr-only" id="profile-overview-title">Profile Overview</h2>
                <div class="bg-white p-6 shadow-2xl">
                  <div class="sm:flex sm:items-center sm:justify-between">
                    <div class="sm:flex sm:space-x-5">
                      <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                        <p class="text-md font-medium font-heading text-gray-600">Welcome back,</p>
                        <p class="text-xl font-bold text-gray-900 sm:text-2xl capitalize">
                          {{ user.username.replace(/\./g, ' ') }}
                        </p>
                        <p class="text-sm font-medium text-gray-600 md:text-1xl pt-2 uppercase">{{ role.name }}</p>
                      </div>
                    </div>

                    <div class="mt-1 flex justify-right gap-x-2 sm:mt-0">
                      <button @click="exportToExcel"
                        v-if="currentView !== 'dashboard' && currentView !== 'leanSeasonDashboard' && currentView !== 'Donations'"
                        type="button"
                        class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
                        :class="{ 'active-tab': false }">
                        <DocumentDownloadIcon class="h-5 w-5 mr-2" />
                        Export to Excel
                      </button>

                      <button @click="takeScreenshot" v-if="currentView !== 'dashboard' && currentView !== 'Donations'"
                        type="button"
                        class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
                        :class="{ 'active-tab': false }">
                        <CameraIcon class="h-5 w-5 mr-2" />
                        Take Screenshot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section ref="commodityTable">
              <!-- Chart and image container -->

              <div class="bg-gray-100 p-5" v-show="currentView === 'Donations'">

                <div class="bg-gray-100 p-5">
                  <!-- Commodity distribution table view -->
                  <donations-table :data="donations" :screenshotMode="screenshotMode" />
                  <!-- Other components for stats, etc... -->
                </div>
              </div>


              <div class="bg-gray-100 p-5" v-show="currentView === 'charts'">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Aligned images in the center -->
                  <div v-show="screenshotMode"
                    class="col-span-3 flex flex-col justify-center items-center bg-blue-500 text-white p-5">
                    <div class="flex justify-center items-center">
                      <img class="mr-4 h-20" src="../../../assets/images/images.png" alt="MW-Govt" />
                      <img class="h-20" src="../../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
                    </div>
                  </div>

                  <div class="col-span-3 flex flex-col justify-center items-center text-white">
                    <div class="text-center mt-1 ml-6">
                      <h1 class="text-lg font-bold text-black">Emergency Response Dashboard</h1>
                      <h1 class="text-sm font-bold text-black">(From DoDMA Warehouses)</h1>
                    </div>
                  </div>

                  <div class="col-span-3 flex flex-col justify-center items-center mt-2">
                    <div class="flex flex-wrap items-center space-x-4 mb-4" :class="{ 'hidden': screenshotMode }">
                      <div class="flex flex-col">
                        <label for="district" class="text-sm font-medium text-gray-700">District</label>
                       
                        <select id="district" v-model="selectedDistrict"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                          <option value="">All Districts</option>
                         
                          <option v-for="district in districts" :key="district.Name" :value="district.Name">
                            {{ district.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label for="commodity" class="text-sm font-medium text-gray-700">Commodity</label>
                        <select id="commodity" v-model="selectedCommodity"
                          class="focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                          <option value="">All Commodities</option>
                          <option v-for="commodity in commodities" :key="commodity.Name" :value="commodity.Name">
                            {{ commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label for="disaster" class="text-sm font-medium text-gray-700">Disaster/Emergency</label>
                        <select id="disaster" v-model="selectedDisaster"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                          <option value="">All Disasters</option>
                          <option v-for="disaster in disasters" :key="disaster.name" :value="disaster.name">
                            {{ disaster.name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label for="dateFrom" class="text-sm font-medium text-gray-700">Date of Emergency From</label>
                        <input type="date" id="dateFrom" v-model="selectedDateFrom"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                      </div>

                      <div class="flex flex-col">
                        <label for="dateTo" class="text-sm font-medium text-gray-700">Date of Emergency To</label>
                        <input type="date" id="dateTo" v-model="selectedDateTo"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                      </div>

                      <button @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded">
                        Reset
                      </button>
                    </div>
                  </div>
                  <!-- Instance of chart components -->
                  <div class="mx-3"> 
                    <distribution-by-commodity v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="filteredCommodityDistributionData" />

                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg mt-4">
                      No Data
                    </div>
                  </div>

                  <div class="mx-3">
                    <distribution-by-district v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="filteredCommodityDistributionData" />
                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <distribution-percentage v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="filteredCommodityDistributionData" />
                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
                      No Data
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lean Season Response Dashboard -->
              <div class="bg-gray-100 p-5" v-show="currentView === 'leanSeasonDashboard'">
                <!-- Content for Lean Season Response Dashboard -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Aligned images in the center -->
                  <div v-show="screenshotMode"
                    class="col-span-3 flex flex-col justify-center items-center bg-blue-500 text-white p-5">
                    <div class="flex justify-center items-center">
                      <img class="mr-4 h-20" src="../../../assets/images/images.png" alt="MW-Govt" />
                      <img class="h-20" src="../../../assets/images/wfp-logo-emblem-white.png" alt="WFP" />
                    </div>
                  </div>

                  <div class="col-span-3 flex flex-col justify-center items-center text-white">
                    <div class="text-center mt-1 ml-6">
                      <h1 class="text-lg font-bold text-black">Lean Season Response Dashboard</h1>
                    </div>
                  </div>

                  <div class="col-span-3 flex flex-col justify-center items-center mt-2">
                    <div class="flex flex-wrap items-center space-x-4 mb-4" :class="{ 'hidden': screenshotMode }">
                      <div class="flex flex-col">
                        <label for="district" class="text-sm font-medium text-gray-700">District</label>
                        <select id="district" v-model="selectedDistrict"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                          <option value="">All Districts</option>
                          <option v-for="district in districts" :key="district.Name" :value="district.Name">
                            {{ district.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label for="commodity" class="text-sm font-medium text-gray-700">Commodity</label>
                        <select id="commodity" v-model="selectedCommodity"
                          class="focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md">
                          <option value="">All Commodities</option>
                          <option v-for="commodity in commodities" :key="commodity.Name" :value="commodity.Name">
                            {{ commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <button @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded">
                        Reset
                      </button>
                    </div>
                  </div>

             
                  <div class="mx-3">
                    <damage-summary-lean v-if="filteredLeanCommodityDispatchData[0]?.commoditySummary?.length > 0"
                      :commodityDispatchData="filteredLeanCommodityDispatchData" />
                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    
                    <damage-summary-leans v-if="filteredLeanCommodityDispatchData.length >  0"
                      :commodityDispatchData="filteredLeanCommodityDispatchData" />
                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <stock-summary-lean v-if="filteredLeanStockSummary.length > 0"
                      :leanStockSummary="filteredLeanStockSummary" />
                    <div v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
                      No Data
                    </div>
                  </div>


                </div>
              </div>

              <!-- Emergency Response Dashboard -->
              <div class="bg-gray-100 p-5" v-show="currentView === 'charts'">
                <!-- Commodity distribution table view -->
                <commodity-distribution-table :data="filteredCommodityDistributionData"
                  :screenshotMode="screenshotMode" />
                <!-- Other components for stats, etc... -->
              </div>
            </section>

            <div class="bg-gray-100 p-5" v-show="currentView === 'dashboard'">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <!-- Stats Cards -->
                <div v-for="stat in stats2" :key="stat.label"
                  class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-semibold text-gray-800">{{ stat.value }}</span>
                      <component v-if="stat.label == 'Dispatch Status'"
                        :is="stat.progress >= 50 ? CheckCircleIcon : ExclamationCircleIcon"
                        :class="`h-6 w-6 text-${stat.progress >= 50 ? 'green-500' : 'red-500'}`" />
                      <component v-else :is="stat.icon" :class="`h-6 w-6 text-${stat.iconColor}`" />
                    </div>

                    <div class="text-sm font-medium text-gray-600 mt-2">{{ stat.label }}</div>
                    <div v-if="stat.moreInfo" class="text-sm text-gray-500 mt-4">
                      <router-link v-if="stat.label == 'Total Required Tonnage (Emergency Response)'"
                        to="/commissioner/required-leanseason" class="text-blue-500 hover:underline">
                        View Details
                      </router-link>
                      <router-link v-if="stat.label == 'Total Stocks Planned (Lean Season Response)'"
                        to="/commissioner/loadingplans" class="text-blue-500 hover:underline">
                        View Details
                      </router-link>
                      <router-link v-if="stat.label == 'Instructions Pending Approval (Emergency Response)'"
                        to="/commissioner/instruction-management" class="text-blue-500 hover:underline">
                        View Details
                      </router-link>

                      <div class="relative flex justify-left mt-3"
                        v-if="stat.label == 'Total Stocks Planned (Lean Season Response)'">
                        <!--   <span class="cursor-pointer text-blue-400 text-xs" @mouseover="showTooltip = true"
                          @mouseleave="showTooltip = false">
                          <InformationCircleIcon class="h-6 w-6 text-blue-500 inline-block align-middle mr-1" />
                          <span class="align-middle">More Info</span>
                        </span> -->

                        <div v-if="showTooltip"
                          class="absolute bottom-full mb-2 w-64 p-4 bg-white border border-gray-200 rounded shadow-lg z-10">


                          <div v-for="(summary, index) in loadingPlanSummary" :key="index" class="mb-4 last:mb-0">
                            <h5 class="font-bold text-lg text-capitalize flex text-gray-600 items-center">
                              {{ summary.commodityName }}
                            </h5>
                            <div class="font-medium text-sm mt-2">
                              <div>
                                <ClipboardListIcon class="h-4 w-4 text-green-500 inline-block mr-1 align-text-top" />
                                <b>Total Stock Planned:</b> <br> &nbsp; &nbsp; &nbsp; &nbsp;{{
          summary.totalStockPlanned.toLocaleString() }} MT
                              </div>
                              <div>
                                <ExclamationCircleIcon class="h-4 w-4 text-red-500 inline-block mr-1 align-text-top" />
                                <b> Total Balance: </b><br> &nbsp; &nbsp; &nbsp; &nbsp;{{
          summary.totalBalance.toLocaleString() }} MT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="stat.percentageText" class="mt-4">
                    <div class="flex items-center justify-between">
                      <span :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'">{{ stat.percentageText
                        }}</span>
                      <component :is="stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon" class="h-5 w-5"
                        :class="stat.progress >= 50 ? 'text-green-500' : 'text-red-500'" />
                    </div>

                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div :class="stat.progress >= 50 ? 'bg-green-500' : 'bg-red-500'" class="h-2 rounded-full"
                        :style="{ width: stat.progress + '%' }"></div>
                    </div>
                  </div>

                </div>
                <!-- Damaged Stock Stats -->
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                  <div class="text-xl font-bold text-gray-600 mb-1">Stock Loss Statistics</div>

                  <div class="text-sm font-bold text-gray-500 mb-1">Lean Season Response</div>
                  <div v-if="damagedStockStats.length === 0" class="text-gray-500 text-sm mb-3 font-medium">No Data
                  </div>
                  <div v-else>
                    <div v-for="(stat, index) in damagedStockStats" :key="index"
                      class="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div class="flex items-center">
                        <div :style="{ backgroundColor: stat.color }" class="w-4 h-4 rounded-full mr-2"></div>
                        <div>
                          <div class="text-lg font-medium text-gray-800">{{ stat.commodity }}</div>
                          <div class="text-sm text-gray-500">
                            <router-link to="/commissioner/Lean-season-losses" class="text-blue-500 hover:underline">
                              View Details
                            </router-link>
                          </div>
                        </div>
                      </div>
                      <div class="text-lg font-bold text-red-600" v-if="stat.percentage > 100">

                        100%
                        <span style="color: red;">&#9650;</span>
                        <span
                          class="absolute left-0 ml-8 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                          Exceeded allocation
                        </span>

                      </div>

                      <div class="text-lg font-bold text-red-600" v-else>


                        {{ stat.percentage }}%</div>

                    </div>
                  </div>

                  <div class="text-sm font-bold text-gray-500 mb-4">Emergency Response</div>
                  <div v-if="damagedStockStatsEmergency.length === 0" class="text-gray-500 text-sm mb-3 font-medium">No
                    Data</div>
                  <div v-else>
                    <div v-for="(stat, index) in damagedStockStatsEmergency" :key="index"
                      class="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div class="flex items-center">
                        <div :style="{ backgroundColor: stat.color }" class="w-4 h-4 rounded-full mr-2"></div>
                        <div>
                          <div class="text-lg font-medium text-gray-800">{{ stat.commodity }}</div>
                          <div class="text-sm text-gray-500">
                            <router-link to="/commissioner/Emergency-season-losses"
                              class="text-blue-500 hover:underline">
                              View Details
                            </router-link>
                          </div>
                        </div>
                      </div>


                      <div class="text-lg font-bold text-red-600" v-if="stat.percentage > 100">

                        100%
                        <span style="color: red;">&#9650;</span>
                        <span
                          class="absolute left-0 ml-8 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                          Exceeded allocation
                        </span>

                      </div>

                      <div class="text-lg font-bold text-red-600" v-else>


                        {{ stat.percentage }}%</div>



                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { inject, ref, watch, reactive, onMounted, toRefs, computed, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import "jspdf-autotable";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useUserStore } from "../../../stores/user.store";

import ChartComponent from '../../../components/pages/charts/dashboardcharts.vue'; // Adjust path as needed
import distributionByCommodity from '../../../components/pages/charts/distributionByCommodity.vue'; // Adjust path as needed
import distributionByDistrict from '../../../components/pages/charts/distributionByDistrict.vue'; // Adjust path as needed
import distributionPercentage from '../../../components/pages/charts/distributionPercentage.vue'; // Adjust path as needed
import damageSummaryLean from '../../../components/pages/charts/damageSummaryLean.vue'; // Adjust path as needed
import damageSummaryLeans from '../../../components/pages/charts/damageSummaryLeans.vue'; // Adjust path as needed

import stockSummaryLean from '../../../components/pages/charts/stocksummarylean.vue'; // Adjust path as needed

import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";
import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";

import DonationsTable from './DonationsTable.vue';

import { useloadingplanstore } from "../../../stores/loadingplans.store";
import html2canvas from 'html2canvas';
import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useinstructionstore } from "../../../stores/instructions.store";

import { usereceiptstore } from "../../../stores/receipt.store";
import { usedonationstore } from "../../../stores/donation.store";

import { usedistrictstore } from "../../../stores/districts.store";
import { useDisasterstore } from "../../../stores/disaster.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usecommoditytypestore } from "../../../stores/commodity-type.store";
import CommodityDistributionTable from './CommodityDistributionTable.vue';

import createReportForm from "../../../components/pages/reports/create.component.vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  AcademicCapIcon,
  TemplateIcon,
  HeartIcon,
  ChartBarIcon,
  BadgeCheckIcon,
  DocumentDownloadIcon,
  CameraIcon,
  BellIcon,
  CashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
  TruckIcon,
  DocumentDuplicateIcon,
  CollectionIcon,
  IdentificationIcon,
  DocumentTextIcon,
  OfficeBuildingIcon,
  DocumentIcon,
  ClipboardListIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/vue/outline";

const screenshotMode = ref(false);

// Example data structure for maize distribution
const commodityDistributionData = ref([]);
const commodityDispatchData = ref([]);
const commodityEmergencyDispatchData = ref([]);

const currentView = ref('dashboard'); // The initial view can be 'dashboard' or 'charts'

const toggleView = (view) => {
  currentView.value = view;
};

const showTooltip = ref(false);

const districtstore = usedistrictstore();
const commoditystore = usecommoditiestore();

const donationstore = usedonationstore();

const disasterStore = useDisasterstore();
const commoditytypestore = usecommoditytypestore();

const receivedcommoditiesstore = useReceivedCommoditiesStore();
const districts = reactive([]);
const disasters = reactive([]);
const commodities = reactive([]);
const commodityTypes = reactive([]);
const warehouses = reactive([]);

const commodityTable = ref(null);

const takeScreenshot = () => {
  screenshotMode.value = true;

  // Use a timeout to delay the screenshot taking
  setTimeout(() => {
    if (commodityTable.value) {
      html2canvas(commodityTable.value.$el || commodityTable.value).then(canvas => {
        const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const link = document.createElement('a');
        link.download = 'commodity-distribution.png';
        link.href = image;
        link.click();
        screenshotMode.value = false;
      }).catch(error => {
        console.error('Error taking screenshot:', error);
      });
    }
  }, 300);
};

const columns = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Origin Warehouse",
    field: row => row.instruction?.warehouse?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Destination District",
    field: row => row.instruction?.district?.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
  {
    label: "Date Created",
    field: row => moment(row.instruction?.CreatedOn).format("DD/MM/yyyy"),
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize"
  },
]);

import { userequisitionstore } from "../../../stores/requisition.store";
import { useDispatcherStore } from "../../../stores/dispatch.store";
const requisitionsStore = userequisitionstore();
const requisitions = reactive([]);
const dispatchesStore = useDispatcherStore();
const dispatches = reactive([]);
const loadingPlanStore = useloadingplanstore();
const loadingplans = reactive([]);
const instructionsStore = useinstructionstore();
const requisitionStore = userequisitionstore();
const recieptStore = usereceiptstore();
const receipts = reactive([]);

const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const userStore = useUserStore();
const dispatchStore = useInstructedDispatchesStore();
const catalogueStore = useListingStore();
const bookingStore = usebookingstore();
const bookings = reactive([]);
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);

const breadcrumbs = [
  { name: "Home", href: "/admin/dashboard", current: false },
  { name: "", href: "#", current: true },
];

let catalogueCount = ref(0);

const users = reactive([]);
const dispaches = reactive([]);

const donations = reactive([]);
const isLoading = ref(false);

const loadingPlanSummary = reactive([]);

const leanStockSummary = ref([]);

let userCount = ref(0);
let bookingCount = ref(0);
const newRequisitionsCount = ref(0);
const receiptcount = ref(0)
const dispatchcount = ref(0)

//MOUNTEDgetCatalogue
onMounted(async () => {
  try {
    const data = await requisitionStore.getCommodityDistributionSummary();
    const dispatchdata = await dispatchesStore.getdispatchDamageSummary();
    const dispatchEmergencydata = await receivedcommoditiesstore.getdispatchDamageSummary();
    const leanstocks = await loadingPlanStore.getloadingplansSummaryByCommodity();
    commodityDispatchData.value.length = 0
    commodityEmergencyDispatchData.value.length = 0
    leanStockSummary.value = [...leanstocks]
    commodityDispatchData.value.push({ ...dispatchdata })
    commodityEmergencyDispatchData.value.push({ ...dispatchEmergencydata })
    commodityDistributionData.value = [...data];
  } catch (error) {
    console.error("Failed to load commodity data:", error);
  } finally {
    isLoading.value = false;
  }
  
  getCommodities();
  getDisasters();
  getDistricts();
  getDonations();

  getUsers();
  getBookings();
  getDispatches();
  getReceipts();
  getDispatchesCount();
  getLoadingPlansPending();
  getloadingplansSummary();
  getdispatchSummary();
  getloadingplansSummaryByCommodity();
  getInstructions();
  getRequisitions();
});

const getCatalogue = async () => {
  catalogueStore.count().then((result) => {
    catalogueCount.value = result.count;
  });
};

const instructions = reactive([])
const newInstructionsCount = ref(0)

const getDisasters = async () => {
  disasterStore
    .get()
    .then(result => {
      disasters.length = 0; //empty array
      disasters.push(...result);
    })
    .catch(error => {
      console.error("Failed to load disasters:", error);
    })
    .finally(() => {
    });
};

const getDonations = async () => {
  donationstore
    .get()
    .then(result => {
      donations.length = 0; //empty array
      donations.push(...result);
    })
    .catch(error => {
      console.error("Failed to load donations:", error);
    })
    .finally(() => {
    });
};

const getCommodities = async () => {
  commoditystore
    .get()
    .then(result => {
      commodities.length = 0; //empty array
      commodities.push(...result);
    })
    .catch(error => {
      console.error("Failed to load commodities:", error);
    })
    .finally(() => {
    });
};

const getDistricts = async () => {
  districtstore
    .get()
    .then(result => {
      districts.length = 0; //empty array
      districts.push(...result);

    })
    .catch(error => {
      console.error("Failed to load districts:", error);
    })
    .finally(() => {
    });
};

const getInstructions = async () => {
  instructionsStore
    .get()
    .then((result) => {
      instructions.length = 0;
      instructions.push(...result.filter(item => !item.IsApproved));
      newInstructionsCount.value = instructions.length;
    })
    .catch(error => {
      console.error("Failed to load instructions:", error);
    });
};

const getRequisitions = async () => {
  isLoading.value = true;
  requisitionsStore
    .get()
    .then((result) => {
      requisitions.length = 0;
      requisitions.push(...result.filter(item => item.IsArchived == false || item.IsArchived == null));
      newRequisitionsCount.value = requisitions.length;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getReceipts = async () => {
  recieptStore.count().then((result) => {
    receiptcount.value = result.count;
  });
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(commodityDistributionData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Commodity Distribution');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, 'commoditydistributionreport.xlsx');
};

const getloadingplansSummaryByCommodity = async () => {
  loadingPlanStore
    .getloadingplansSummaryByCommodity()
    .then(result => {
      loadingPlanSummary.length = 0;
      loadingPlanSummary.push(...result);
    })
}

const completedDispatch = ref(0)
const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then(result => {
      const sortedDispatches = [...result].sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
      dispaches.length = 0;
      let reversedData = sortedDispatches.reverse();
      dispaches.push(...reversedData);
      completedDispatch.value = dispaches.filter(item => item.IsArchived).length
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const getDispatchesCount = async () => {
  dispatchStore.count().then((result) => {
    dispatchcount.value = result.count;
  });
}

const getLoadingPlans = async () => {
  loadingPlanStore
    .get()
    .then(result => {
      const sortedDispatches = [...result].sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
      loadingplans.length = 0;
      loadingplans.push(...sortedDispatches);
    })
}

const pendingplans = ref(0)
const totalBalance = ref(0)
const totalStockPlanned = ref("")
const dispatchPercentageFormated = ref("")
const totalDispatched = ref("")
const totalReceived = ref("")
const receivedPercentageFormated = ref("")
const receivedPercentage = ref("")
const dispatchPercentage = ref("")

const getLoadingPlansPending = async () => {
  loadingPlanStore
    .getloadingplansPending()
    .then(result => {
      pendingplans.value = result.count
    })
}

/* const getdispatchSummary = async () => {
  dispatchStore
    .getdispatchSummary()
    .then(result => {
      totalDispatched.value = result.totalDispatched.toLocaleString() + " MT"
      totalReceived.value = result.totalReceived
      receivedPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% received'
      receivedPercentage.value = result.dispatchPercentage.toFixed(2)
    })
} */

const getloadingplansSummary = async () => {
  loadingPlanStore
    .getloadingplansSummary()
    .then(result => {
      totalStockPlanned.value = result.totalStockPlanned.toLocaleString() + " MT"
      totalBalance.value = result.totalBalance
      dispatchPercentageFormated.value = result.dispatchPercentage.toFixed(2) + '% dispatched'
      dispatchPercentage.value = result.dispatchPercentage.toFixed(2)
    })
}

const getUsers = async () => {
  userStore.count().then((result) => {
    userCount.value = result.count;
  });

  userStore
    .get()
    .then(result => {
      users.length = 0;
      users.push(...result);
      users.sort((a, b) => new Date(b.created) - new Date(a.created));
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getBookings = async () => {
  bookingStore.count().then((result) => {
    bookingCount.value = result.count;
  });

  bookingStore.getbookingsClean().then((result) => {
    bookings.length = 0;
    bookings.push(...result);
  });
};

const createReport = async (model) => {
  isLoading.value = true;
  model.userId = user.value.id
  if (model.StartDate) {
    model.StartDate = moment(model.StartDate).toISOString();
  }
  if (model.EndDate) {
    model.EndDate = moment(model.EndDate).toISOString();
  }

  loadingPlanStore
    .create(model)
    .then(result => {
      Swal.fire({
        title: "Success",
        text: "Created a new loading plan successfully",
        icon: "success",
        confirmButtonText: "Ok"
      });

      $router.push('/commissioner/loadingplans');
    })
    .catch(error => {
      console.error("Failed to create loading plan:", error);
    })
    .finally(() => {
      isLoading.value = false;
      getDispatches();
      getLoadingPlans();
    });
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const totalRequiredTonnage = computed(() => {
  const total = commodityDistributionData.value.reduce((sum, item) => sum + item.required, 0);
  return `${total.toLocaleString()} MT`;
});

const stats2 = ref([
  {
    label: 'Total Required Tonnage (Emergency Response)',
    value: totalRequiredTonnage,
    icon: CheckCircleIcon,
    iconColor: 'green-500',
    percentageText: '',
    textColor: 'green-500',
    showProgress: false,
    moreInfo: true,

    extraInfo: true,
  },
  {
    label: 'Instructions Pending Approval (Emergency Response)',
    value: newInstructionsCount,
    icon: DocumentIcon,
    iconColor: 'blue-400',
    percentageText: '',
    textColor: 'blue-600',
    showProgress: false,
    moreInfo: true,
  },
  {
    label: 'Total Stocks Planned (Lean Season Response)',
    value: totalStockPlanned,
    icon: dispatchPercentage < 50 ? CheckCircleIcon : ExclamationCircleIcon,
    iconColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
    percentageText: dispatchPercentageFormated,
    textColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
    showProgress: true,
    moreInfo: true,
    progress: dispatchPercentage,
    isProgressPositive: dispatchPercentage >= 50,
    progressColor: dispatchPercentage < 50 ? 'green-500' : 'red-500',
  },
]);

const actions = [
  {
    icon: IdentificationIcon,
    name: "Catalogue",
    href: "/admin/catalogue",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all service catalogue",
  },
  {
    icon: OfficeBuildingIcon,
    name: "Enquiries",
    href: "/admin/bookings",
    iconForeground: "text-gray-500",
    iconBackground: "bg-gray-50",
    details: "Manage all Enquiries made to services",
  },
];

const dispatchstatus = ref(0)

const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

const damagedStockStats = computed(() => {
  if (commodityDispatchData.value.length === 0 || !commodityDispatchData.value[0].commoditySummary) {
    return [];
  }
  const commodities = [...new Set(commodityDispatchData.value[0].commoditySummary.map(item => item.commodity))];

  return commodities.map((commodity, index) => {
    const totalForCommodity = commodityDispatchData.value[0].commoditySummary
      .filter(item => item.commodity === commodity)


    return {
      commodity,
      percentage: totalForCommodity[0].damagePercentage.toFixed(2),
      color: colors[index % colors.length]
    };
  });
});

const damagedStockStatsEmergency = computed(() => {
  if (commodityEmergencyDispatchData.value.length === 0 || !commodityEmergencyDispatchData.value[0].commoditySummary) {
    return [];
  }
  const commodities = [...new Set(commodityEmergencyDispatchData.value[0].commoditySummary.map(item => item.commodity))];

  return commodities.map((commodity, index) => {
    const totalForCommodity = commodityEmergencyDispatchData.value[0].commoditySummary
      .filter(item => item.commodity === commodity)
    return {
      commodity,
      percentage: totalForCommodity[0].overallDamagePercentage.toFixed(2),
      color: colors[index % colors.length]
    };
  });
});



// Filters
const selectedDistrict = ref('');
const selectedCommodity = ref('');
const selectedDisaster = ref('');
const selectedDateFrom = ref('');
const selectedDateTo = ref('');

// Reset filters
const resetFilters = () => {
  selectedDistrict.value = '';
  selectedCommodity.value = '';
  selectedDisaster.value = '';
  selectedDateFrom.value = '';
  selectedDateTo.value = '';
};

// Filtered data for Emergency Response Dashboard
const filteredCommodityDistributionData = computed(() => {
  return commodityDistributionData.value.filter(item => {
    const matchDistrict = !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity = !selectedCommodity.value || item.commodity === selectedCommodity.value;
    const matchDisaster = !selectedDisaster.value || item.disaster === selectedDisaster.value;
    const matchDate = (!selectedDateFrom.value || moment(item.date_of_occurrence).isSameOrAfter(selectedDateFrom.value)) &&
      (!selectedDateTo.value || moment(item.date_of_occurrence).isSameOrBefore(selectedDateTo.value));
    return matchDistrict && matchCommodity && matchDisaster && matchDate;
  });
});

// Filtered data for Lean Season Response Dashboard
const filteredLeanCommodityDispatchData = computed(() => {
  return commodityDispatchData.value.filter(item => {
    const matchDistrict = !selectedDistrict.value || item.summary.some(summaryItem => summaryItem.district === selectedDistrict.value);
    const matchCommodity = !selectedCommodity.value || item.summary.some(summaryItem => summaryItem.commodity === selectedCommodity.value);
    return matchDistrict && matchCommodity;
  });
});

const filteredLeanStockSummary = computed(() => {
  return leanStockSummary.value.filter(item => {
    const matchCommodity = !selectedCommodity.value || item.commodityName == selectedCommodity.value;

    return matchCommodity;
  });
});
</script>

<style scoped>
.tab-button {
  background-color: #248cd6;
  color: white;
  border: none;
}

.active-tab {
  background-color: #0f6c97;
  color: white;
}

.rounded-table {
  border-radius: 10px;
  overflow: hidden;
}

.bg-blue-500 {
  background-color: #096eb4;
}

.h-20 {
  height: 80px;
}

.mr-4 {
  margin-right: 16px;
}

img.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
