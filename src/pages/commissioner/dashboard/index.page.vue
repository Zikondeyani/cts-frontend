<template>
  <main class="mt-1 pb-8 font-bold">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <breadcrumb-widget v-bind:breadcrumbs="breadcrumbs" />
      </div>

      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2
            class="font-bold leading-7 text-white sm:text-2xl py-3 sm:truncate"
          >
            Dashboard
          </h2>
        </div>
      </div>

      <!-- Main 3 column grid -->
      <div
        class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8 mt-4"
      >
        <!-- Tabs -->
        <div class="lg:col-span-3">
          <div class="flex justify-center space-x-4 mb-4">
            <button
              @click="toggleView('dashboard')"
              type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'dashboard' }"
            >
              <TemplateIcon class="h-5 w-5 mr-2" />
              Overall Dashboard
            </button>

            <button
              @click="toggleView('charts')"
              type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'charts' }"
            >
              <ChartBarIcon class="h-5 w-5 mr-2" />
              Emergency Response Dashboard
            </button>

            <button
              @click="toggleView('leanSeasonDashboard')"
              type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'leanSeasonDashboard' }"
            >
              <TemplateIcon class="h-5 w-5 mr-2" />
              Lean Season Response Dashboard
            </button>

            <button
              @click="toggleView('Donations')"
              type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'Donations' }"
            >
              <HeartIcon class="h-5 w-5 mr-2" />
              Donations
            </button>

            <button
              @click="toggleView('Loans')"
              type="button"
              class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
              :class="{ 'active-tab': currentView === 'Loans' }"
            >
              <CurrencyDollarIcon class="h-5 w-5 mr-2" />
              Commodity Loans
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <div class="grid grid-cols-1 gap-4">
            <!-- Welcome panel -->
            <section aria-labelledby="profile-overview-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <h2 class="sr-only" id="profile-overview-title">
                  Profile Overview
                </h2>
                <div class="bg-white p-6 shadow-0">
                  <div class="sm:flex sm:items-center sm:justify-between">
                    <div class="sm:flex sm:space-x-5">
                      <div class="bg-white p-6 rounded-2xl shadow-0">
                        <p class="text-2xl font-semibold text-gray-900">
                          {{ greeting }},
                          {{ user.username.replace(/\./g, " ") }}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                          It's {{ today }} • {{ currentTime }}
                        </p>
                      </div>
                    </div>

                    <div class="mt-1 flex justify-right gap-x-2 sm:mt-0">
                      <button
                        @click="exportToExcel"
                        v-if="
                          currentView !== 'dashboard' &&
                          currentView !== 'leanSeasonDashboard' &&
                          currentView !== 'Donations' &&
                          currentView !== 'charts' &&
                          currentView !== 'Loans'
                        "
                        type="button"
                        class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
                        :class="{ 'active-tab': false }"
                      >
                        <DocumentDownloadIcon class="h-5 w-5 mr-2" />
                        Export to Excel
                      </button>

                      <button
                        @click="takeScreenshot"
                        v-if="
                          currentView !== 'dashboard' &&
                          currentView !== 'Donations' &&
                          currentView !== 'Loans'
                          &&
                          currentView !== 'charts'
                        "
                        type="button"
                        class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
                        :class="{ 'active-tab': false }"
                      >
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
                  <donations-table
                    :data="donations"
                    :screenshotMode="screenshotMode"
                  />
                  <!-- Other components for stats, etc... -->
                </div>
              </div>

              <div class="bg-gray-100 p-5" v-show="currentView === 'Loans'">
                <div class="bg-gray-100 p-5">
                  <div
                    class="align-middle inline-block min-w-full mt-5 shadow-0 rounded-table font-semibold"
                  >
                    <vue-good-table
                      :columns="columnsLoans"
                      :rows="LoanloadingPlans"
                      :search-options="{ enabled: true }"
                      :pagination-options="{ enabled: true }"
                      theme="polar-bear"
                      styleClass="vgt-table striped"
                      compactMode
                    >
                      <template #table-actions> </template>
                    </vue-good-table>
                  </div>
                </div>
              </div>

              <div class="bg-gray-100 p-5" v-show="currentView === 'charts'"   >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Aligned images in the center -->
                  <div
                    v-show="screenshotMode"
                    class="col-span-3 flex flex-col justify-center items-center bg-blue-500 text-white p-5"
                  >
                    <div class="flex justify-center items-center">
                      <img
                        class="mr-4 h-20"
                        src="../../../assets/images/images.png"
                        alt="MW-Govt"
                      />
                      <img
                        class="h-20"
                        src="../../../assets/images/wfp-logo-emblem-white.png"
                        alt="WFP"
                      />
                    </div>
                  </div>

                  <div
                    class="col-span-3 flex flex-col justify-center items-center"
                   >
                    <div class="text-center mt-2">
                      <h1
                        class="text-lg font-semibold text-[#096eb4] text-blue-400 bg-white border border-blue-400 rounded-xl px-4 py-2 shadow-xs"
                      >
                        Emergency Response Dashboard
                      </h1>
                    </div>
                    <!-- Tabs -->
                    <div
                      class="flex justify-center mt-6 space-x-4"
                      :class="{ hidden: screenshotMode }"
                    >
                      <button
                        class="tab-button2"
                        :class="{ 'active-tab': activeTab === 'emergency' }"
                        @click="setActiveTab('emergency')"
                      >
                        Emergency Assistance
                      </button>
                      <button
                        class="tab-button2"
                        :class="{ 'active-tab': activeTab === 'district' }"
                        @click="setActiveTab('district')"
                      >
                        District Requisitions
                      </button>
                    </div>
                  </div>

                  <div
                    class="col-span-3 flex flex-col justify-center items-center mt-2"
                    v-if="activeTab === 'district'"
                  >
                    <div
                      class="flex flex-wrap items-center space-x-4 mb-4"
                      :class="{ hidden: screenshotMode }"
                    >
                      <div class="flex flex-col">
                        <label
                          for="district"
                          class="text-sm font-medium text-gray-700"
                          >District</label
                        >

                        <select
                          id="district"
                          v-model="selectedDistrict"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Districts</option>

                          <option
                            v-for="district in districts"
                            :key="district.Name"
                            :value="district.Name"
                          >
                            {{ district.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="commodity"
                          class="text-sm font-medium text-gray-700"
                          >Commodity</label
                        >
                        <select
                          id="commodity"
                          v-model="selectedCommodity"
                          class="focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Commodities</option>
                          <option
                            v-for="commodity in commodities"
                            :key="commodity.Name"
                            :value="commodity.Name"
                          >
                            {{ commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="disaster"
                          class="text-sm font-medium text-gray-700"
                          >Disaster/Emergency</label
                        >
                        <select
                          id="disaster"
                          v-model="selectedDisaster"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Disasters</option>
                          <option
                            v-for="disaster in disasters"
                            :key="disaster.name"
                            :value="disaster.name"
                          >
                            {{ disaster.type }} |
                            {{ disaster.date_of_occurrence }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="dateFrom"
                          class="text-sm font-medium text-gray-700"
                          >Date of Emergency From</label
                        >
                        <input
                          type="date"
                          id="dateFrom"
                          v-model="selectedDateFrom"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="dateTo"
                          class="text-sm font-medium text-gray-700"
                          >Date of Emergency To</label
                        >
                        <input
                          type="date"
                          id="dateTo"
                          v-model="selectedDateTo"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <button
                        @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <!-- Instance of chart components -->
                  <div class="mx-3" v-if="activeTab === 'district'">
                    <distribution-by-commodity
                      v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="
                        filteredCommodityDistributionData
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg mt-4"
                    >
                      No Data
                    </div>
                  </div>

                  <div class="mx-3" v-if="activeTab === 'district'">
                    <distribution-by-district
                      v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="
                        filteredCommodityDistributionData
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                  <div class="mx-3" v-if="activeTab === 'district'">
                    <distribution-percentage
                      v-if="filteredCommodityDistributionData.length > 0"
                      :commodityDistributionData="
                        filteredCommodityDistributionData
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>

                  <div
                    class="col-span-3 flex flex-col justify-center items-center mt-2"
                    v-if="activeTab !== 'district'"
                  ></div>
                </div>
              </div>

              <!-- Lean Season Response Dashboard -->
              <div
                class="bg-gray-100 p-5"
                   id="screenshot-area"
                v-show="currentView === 'leanSeasonDashboard'"
               >
                <!-- Content for Lean Season Response Dashboard -->
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Aligned images in the center -->
                  <div
                    v-show="screenshotMode"
                    class="col-span-3 flex flex-col justify-center items-center bg-blue-500 text-white p-5"
                  >
                    <div class="flex justify-center items-center">
                      <img
                        class="mr-4 h-20"
                        src="../../../assets/images/images.png"
                        alt="MW-Govt"
                      />
                      <img
                        class="h-20"
                        src="../../../assets/images/wfp-logo-emblem-white.png"
                        alt="WFP"
                      />
                    </div>
                    <div class="text-center mt-1 ml-6">
                      <h1 class="text-lg font-bold text-white">
                        DoDMA Commodity Tracking System
                      </h1>
                    </div>
                  </div>

                  <div
                    class="col-span-3 flex flex-col justify-center items-center"
                  >
                    <div class="text-center mt-2">
                      <h1
                        class="text-lg font-semibold text-[#096eb4] text-blue-400 bg-white border border-blue-400 rounded-xl px-4 py-2 shadow-xs"
                      >
                        Lean Season Response Dashboard
                      </h1>
                    </div>
                  </div>

                  <!-- Dashboard Cards Section -->
                  <div class="col-span-3">
                    <div
                      class="border rounded-lg shadow-lg p-4 bg-white relative"
                    >
                      <!-- Row with Heading and Filter -->
                      <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-[#096eb4]">
                          Overall Stats
                          <span v-if="selectedActivity1"
                            >({{ selectedActivity1 }})</span
                          >
                        </h2>

                        <!-- Activity Filter -->
                        <div class="flex justify-end items-center space-x-3">
                          <!-- Activity Dropdown -->
                          <div class="relative">
                            <select
                              v-model="selectedActivity1"
                              @change="updateStats"
                              :class="{ hidden: screenshotMode }"
                              class="appearance-none border border-gray-300 rounded-xl pl-4 pr-10 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b8ad8] focus:border-[#0b8ad8] transition"
                            >
                              <option
                                v-for="act in activities1"
                                :key="act.activity"
                                :value="act.activity"
                              >
                                {{ act.activity }}
                              </option>
                            </select>

                            <!-- Dropdown Icon -->
                            <span
                              class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400"
                              :class="{ hidden: screenshotMode }"
                            >
                              ▼
                            </span>
                          </div>

                          <!-- View More link -->
                          <router-link
                            to="/commissioner/stats/"
                            class="text-[#0b8ad8] text-sm font-medium hover:text-[#096eb4] transition"
                            :class="{ hidden: screenshotMode }"
                          >
                            View More →
                          </router-link>
                        </div>
                      </div>

                      <!-- Stats Section -->
                      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Total Commodities Planned -->
                        <div
                          class="border border-transparent hover:border-[#0b8ad8] transition-colors rounded-lg p-4"
                        >
                          <div class="flex items-center space-x-2">
                            <DocumentTextIcon class="w-5 h-5 text-[#096eb4]" />
                            <div class="text-[#096eb4] text-sm">
                              Tonnage Planned
                            </div>
                          </div>
                          <div class="text-2xl font-bold text-[#0b8ad8]">
                            {{ totalStockPlanned1?.toFixed(2) || 0 }}MT
                          </div>
                        </div>

                        <!-- Tonnage Dispatched -->
                        <div
                          class="border border-transparent hover:border-[#0b8ad8] transition-colors rounded-lg p-4"
                        >
                          <div class="flex items-center space-x-2">
                            <DocumentTextIcon class="w-5 h-5 text-[#096eb4]" />
                            <div class="text-[#096eb4] text-sm">
                              Tonnage Dispatched
                            </div>
                          </div>
                          <div class="text-2xl font-bold text-[#0b8ad8]">
                            {{ totalDispatched1?.toFixed(2) || 0 }}MT
                          </div>
                        </div>

                        <!-- Tonnage Received -->
                        <div
                          class="border border-transparent hover:border-[#0b8ad8] transition-colors rounded-lg p-4"
                        >
                          <div class="flex items-center space-x-2">
                            <InboxIcon class="w-5 h-5 text-[#096eb4]" />
                            <div class="text-[#096eb4] text-sm">
                              Tonnage Received
                            </div>
                          </div>
                          <div class="text-2xl font-bold text-[#0b8ad8]">
                            {{ totalReceived1?.toFixed(2) || 0 }}MT
                          </div>
                        </div>

                        <!-- Loading Plans -->
                        <router-link to="/commissioner/loadingplans">
                          <div
                            class="border border-transparent hover:border-[#0b8ad8] transition-colors rounded-lg p-4 cursor-pointer"
                          >
                            <div class="flex items-center space-x-2">
                              <ClipboardListIcon
                                class="w-5 h-5 text-[#096eb4]"
                              />
                              <div class="text-[#096eb4] text-sm">
                                Loading Plans Created
                              </div>
                            </div>
                            <div class="text-2xl font-bold text-[#0b8ad8]">
                              {{ loadingplansCount1 || 0 }}
                            </div>
                            <div class="text-sm text-gray-600 mt-1">
                              <span
                                class="font-bold text-[#ff6f61]"
                                v-if="loadingplansCountPending1 > 0"
                              >
                                {{ loadingplansCountPending1 || 0 }}
                                <span
                                  class="font-semibold text-sm text-[#0b8ad8]"
                                  >Pending Approval</span
                                >
                              </span>
                            </div>
                          </div>
                        </router-link>

                        <!-- % of Dispatches Received -->
                        <div
                          class="border border-transparent hover:border-[#0b8ad8] transition-colors rounded-lg p-4"
                        >
                          <div class="flex items-center space-x-2">
                            <ChartBarIcon class="w-5 h-5 text-[#096eb4]" />
                            <div class="text-[#096eb4] text-xs">
                              % of Dispatches Received
                            </div>
                          </div>
                          <div class="text-lg font-bold text-[#0b8ad8]">
                            {{ receivedPercentageFormated1 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-span-3 flex flex-col justify-center items-center mt-2"
                   >
                    <div
                      class="flex flex-wrap items-center space-x-4 mb-4"
                      :class="{ hidden: screenshotMode }"
                    >
                      <div class="flex flex-col">
                        <label
                          for="district"
                          class="text-sm font-medium text-gray-700"
                          >Activity</label
                        >
                        <select
                          id="district"
                          v-model="selectedActivity"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Activity</option>
                          <option
                            v-for="activity in activities"
                            :key="activity.Name"
                            :value="activity.Name"
                          >
                            {{ activity.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="district"
                          class="text-sm font-medium text-gray-700"
                          >District</label
                        >
                        <select
                          id="district"
                          v-model="selectedDistrict"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Districts</option>
                          <option
                            v-for="district in districts"
                            :key="district.Name"
                            :value="district.Name"
                          >
                            {{ district.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="commodity"
                          class="text-sm font-medium text-gray-700"
                          >Commodity</label
                        >
                        <select
                          id="commodity"
                          v-model="selectedCommodity"
                          class="focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Commodities</option>
                          <option
                            v-for="commodity in commodities"
                            :key="commodity.Name"
                            :value="commodity.Name"
                          >
                            {{ commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <button
                        @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <!-- Charts Section -->
                  <div class="mx-3">
                    <dispatch-summary-leans-two
                      v-if="filteredLeanCommodityDispatchData2.length > 0"
                      :commodityDispatchData="
                        filteredLeanCommodityDispatchData2
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <stock-summary-lean
                      v-if="filteredLeanCommodityDispatchData2.length > 0"
                      :leanStockSummary="filteredLeanCommodityDispatchData2"
                      :screenshotMode="screenshotMode"
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <dispatch-summary-leans
                      v-if="filteredLeanCommodityDispatchData2.length > 0"
                      :commodityDispatchData="
                        filteredLeanCommodityDispatchData2
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                </div>
             
              </div>

              <div
                class="bg-gray-100 p-2"
                v-show="activeTab !== 'district' && currentView === 'charts'"
              >
                <!-- Content for Lean Season Response Dashboard -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="col-span-3 flex flex-col justify-center items-center mt-2"
                  >
                    <div
                      class="flex flex-wrap items-center space-x-4 mb-4"
                      :class="{ hidden: screenshotMode }"
                    >
                      <div class="flex flex-col">
                        <label
                          for="district"
                          class="text-sm font-medium text-gray-700"
                          >Activity</label
                        >
                        <select
                          id="district"
                          v-model="selectedActivity"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Activity</option>
                          <option
                            v-for="activity in activitiesLsr"
                            :key="activity.Name"
                            :value="activity.Name"
                          >
                            {{ activity.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="district"
                          class="text-sm font-medium text-gray-700"
                          >District</label
                        >
                        <select
                          id="district"
                          v-model="selectedDistrict"
                          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Districts</option>
                          <option
                            v-for="district in districts"
                            :key="district.Name"
                            :value="district.Name"
                          >
                            {{ district.Name }}
                          </option>
                        </select>
                      </div>

                      <div class="flex flex-col">
                        <label
                          for="commodity"
                          class="text-sm font-medium text-gray-700"
                          >Commodity</label
                        >
                        <select
                          id="commodity"
                          v-model="selectedCommodity"
                          class="focus:ring-gray-500 w-40 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">All Commodities</option>
                          <option
                            v-for="commodity in commodities"
                            :key="commodity.Name"
                            :value="commodity.Name"
                          >
                            {{ commodity.Name }}
                          </option>
                        </select>
                      </div>

                      <button
                        @click="resetFilters"
                        class="bg-gray-200 mt-5 hover:bg-gray-300 text-black font-medium py-1 px-2 text-sm rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <!-- Charts Section -->
                  <div class="mx-3">
                    <dispatch-summary-leans-two-two
                      v-if="filteredLeanCommodityDispatchData22.length > 0"
                      :commodityDispatchData="
                        filteredLeanCommodityDispatchData22
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <stock-summary-lean-two
                      v-if="filteredLeanCommodityDispatchData22.length > 0"
                      :leanStockSummary="filteredLeanCommodityDispatchData22"
                      :screenshotMode="screenshotMode"
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                  <div class="mx-3">
                    <dispatch-summary-leans-three
                      v-if="filteredLeanCommodityDispatchData22.length > 0"
                      :commodityDispatchData="
                        filteredLeanCommodityDispatchData22
                      "
                    />
                    <div
                      v-else
                      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg"
                    >
                      No Data
                    </div>
                  </div>
                </div>
              </div>

              <!-- Emergency Response Dashboard -->
              <div
                class="bg-gray-100 p-5"
                v-show="currentView === 'charts'"
                v-if="activeTab === 'district'"
              >
                <!-- Commodity distribution table view -->
                <commodity-distribution-table
                  :data="filteredCommodityDistributionData"
                  :screenshotMode="screenshotMode"
                />
                <!-- Other components for stats, etc... -->
              </div>

              <div
                class="bg-gray-100 p-5"
                v-show="currentView === 'charts'"
                v-if="activeTab !== 'district'"
              >
                <!-- Commodity distribution table view -->
                <commodity-distribution-table-lean-two
                  :data="filteredLeanCommodityDispatchData22"
                  :screenshotMode="screenshotMode"
                />
                <!-- Other components for stats, etc... -->
              </div>
              <div
                class="bg-gray-100 p-5"
                v-show="currentView === 'leanSeasonDashboard'"
              >
                <div class="bg-gray-100 p-5">
                  <div class="tabs">
                    <button
                      @click="currentTab = 'all'"
                      :class="{
                        'tab-button text-white': currentTab === 'all',
                        'bg-white text-blue-500 border border-blue-500':
                          activeTab !== 'all',
                      }"
                      class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
                    >
                      All Reports
                    </button>

                    <button
                      @click="currentTab = 'DoDMA'"
                      :class="{
                        'tab-button text-white': currentTab === 'DoDMA',
                        'bg-white text-blue-500 border border-blue-500':
                          activeTab !== 'DoDMA',
                      }"
                      class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
                    >
                      DoDMA Reports
                    </button>

                    <button
                      @click="currentTab = 'WFP'"
                      :class="{
                        'tab-button text-white': currentTab === 'WFP',
                        'bg-white text-blue-500 border border-blue-500':
                          activeTab !== 'WFP',
                      }"
                      class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
                    >
                      WFP Reports
                    </button>

                    <button
                      @click="currentTab = 'Allo'"
                      :class="{
                        'tab-button text-white': currentTab === 'Allo',
                        'bg-white text-blue-500 border border-blue-500':
                          activeTab !== 'Allo',
                      }"
                      class="relative flex items-center py-2 px-4 mr-1 text-center rounded-t-lg font-semibold transition-colors duration-300 ease-in-out"
                    >
                      Allocation Trends
                    </button>
                  </div>

                  <div v-show="currentTab === 'Allo'">
                    <allocation-trends
                      :allocationData="filteredLeanCommodityDispatchData2"
                      :screenshotMode="screenshotMode"
                    />
                  </div>

                  <div v-show="currentTab === 'all'">
                    <span class="mr-4 font-bold mb-2">Filter By:</span>
                    <select
                      v-model="selectedFilter"
                      @change="fetchFilteredDataAll"
                      class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="lastMonth">Last Month</option>
                    </select>

                    <commodity-distribution-table-lean
                      :data="filteredLeanCommodityDispatchData2"
                      :screenshotMode="screenshotMode"
                    />
                  </div>

                  <div v-show="currentTab === 'WFP'">
                    <span class="mr-4 font-bold mb-2">Filter By:</span>
                    <select
                      v-model="selectedFilter"
                      @change="fetchFilteredData"
                      class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="lastMonth">Last Month</option>
                    </select>

                    <commodity-distribution-table-lean-WFP
                      :data="filteredLeanCommodityDispatchDataWFP"
                      :screenshotMode="screenshotMode"
                    />
                  </div>

                  <div v-show="currentTab === 'DoDMA'">
                    <span class="mr-4 font-bold mb-2">Filter By:</span>
                    <select
                      v-model="selectedFilter"
                      @change="fetchFilteredDataDodma"
                      class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="lastMonth">Last Month</option>
                    </select>
                    <commodity-distribution-table-lean-DoDMA
                      :data="filteredLeanCommodityDispatchDataDodma"
                      :screenshotMode="screenshotMode"
                    />
                  </div>

                  <!-- Other components for stats, etc... -->
                </div>
              </div>
            </section>
            <div class="bg-gray-100 p-5" v-show="currentView === 'dashboard'">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <!-- Loader when data is loading -->
                <div
                  v-if="isLoading"
                  class="flex justify-center items-center col-span-2 p-5 bg-white rounded-lg shadow-lg"
                >
                  <svg
                    class="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span class="ml-2 text-gray-500"
                    >Loading data, please wait...</span
                  >
                  <span class="ml-2 text-xs italic text-red-500"
                    >Make sure your internet is stable.</span
                  >
                </div>

                <!-- Stats Cards - only show when data is loaded -->
                <!--   <div v-else class="col-span-2 mb-2">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div
                      v-for="stat in stats2"
                      :key="stat.label"
                      class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col justify-between transition-transform duration-300 transform hover:scale-105"
                    >
                      <div>
                        <div class="flex items-center justify-between">
                          <span class="text-3xl font-semibold text-gray-800">{{
                            stat.value
                          }}</span>
                          <component
                            v-if="
                              stat.label ===
                              'Total Stocks Planned (Lean Season Response)'
                            "
                            class="h-8 w-8 text-blue-500"
                          >
                            <TruckIcon
                              class="h-10 w-10 inline-block mr-1"
                              style="color: #248cd6"
                            />
                          </component>
                          <component
                            v-else
                            :is="stat.icon"
                            :class="`h-7 w-7 text-${stat.iconColor}`"
                          />
                        </div>
                        <div class="text-sm font-medium text-gray-600 mt-2">
                          {{ stat.label }}
                        </div>
                      </div>
                      <div v-if="stat.percentageText" class="mt-4">
                        <div class="flex items-center justify-between">
                          <span
                            :class="
                              stat.progress >= 50
                                ? 'text-green-500'
                                : 'text-red-500'
                            "
                            >{{ stat.percentageText }}</span
                          >
                          <component
                            :is="
                              stat.progress >= 50 ? ArrowUpIcon : ArrowDownIcon
                            "
                            class="h-5 w-5"
                            :class="
                              stat.progress >= 50
                                ? 'text-green-500'
                                : 'text-red-500'
                            "
                          />
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            :class="
                              stat.progress >= 50
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            "
                            class="h-2 rounded-full"
                            :style="{ width: stat.progress + '%' }"
                          ></div>
                        </div>
                      </div>
                      <div class="text-lg font-medium text-gray-800 mt-3">
                        {{ stat.commodity }}
                      </div>
                      <router-link
                        v-if="stat.link"
                        :to="stat.href"
                        class="text-blue-500 hover:underline"
                        >View Details</router-link
                      >
                    </div>
                  </div>
                </div> -->

                <!-- Damaged Stock Stats - only show when data is loaded -->
                <div
                  v-if="!isLoading"
                  class="bg-white border border-gray-200 rounded-lg shadow-lg p-5 col-span-1 md:col-span-2"
                >
                  <div class="flex items-center mb-4">
                    <TruckIcon class="h-10 w-10 mr-2" style="color: #248cd6" />
                    <h3 class="text-xl font-bold text-gray-600">
                      Transporter Tracker
                    </h3>
                  </div>

                  <div class="mb-4">
                    <!-- Removed commented-out sections for clarity -->
                  </div>

                  <!-- Button to navigate to Vehicle or Transporter Tracker -->
                  <div class="mt-4 mb-6">
                    <router-link
                      to="/commissioner/tracker"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
                    >
                      Go to Transporter Tracker
                    </router-link>
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
import {
  inject,
  ref,
  watch,
  reactive,
  onMounted,
  toRefs,
  computed,
  onUnmounted,
  toRaw,
} from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../../../stores/session.store";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import timeGreetingMixin from "../../../services/utils/timeGreetingMixin";

const { currentTime, greeting, today, updateTime } = timeGreetingMixin.setup();

import "jspdf-autotable";
import breadcrumbWidget from "../../../components/widgets/breadcrumbs/admin.breadcrumb.vue";
import { useUserStore } from "../../../stores/user.store";

import ChartComponent from "../../../components/pages/charts/dashboardcharts.vue"; // Adjust path as needed
import distributionByCommodity from "../../../components/pages/charts/distributionByCommodity.vue"; // Adjust path as needed
import distributionByDistrict from "../../../components/pages/charts/distributionByDistrict.vue"; // Adjust path as needed
import distributionPercentage from "../../../components/pages/charts/distributionPercentage.vue"; // Adjust path as needed
import damageSummaryLean from "../../../components/pages/charts/damageSummaryLean.vue"; // Adjust path as needed
import damageSummaryLeans from "../../../components/pages/charts/damageSummaryLeans.vue"; // Adjust path as needed
import dispatchSummaryLeans from "../../../components/pages/charts/dispatchSummaryLean.vue"; // Adjust path as needed
import dispatchSummaryLeansThree from "../../../components/pages/charts/dispatchSummaryLean3.vue"; // Adjust path as needed

import dispatchSummaryLeansTwo from "../../../components/pages/charts/dispatchSummaryLean2.vue"; // Adjust path as needed
import dispatchSummaryLeansTwoTwo from "../../../components/pages/charts/dispatchSummaryLean22.vue"; // Adjust path as needed

import stockSummaryLean from "../../../components/pages/charts/stocksummarylean.vue"; // Adjust path as needed
import stockSummaryLeanTwo from "../../../components/pages/charts/stocksummarylean2.vue"; // Adjust path as needed

import allocationTrends from "../../../components/pages/charts/allocation_trends.vue"; // Adjust path as needed

import { useListingStore } from "../../../stores/catalogue.store";
import { usebookingstore } from "../../../stores/booking.store";
import { useReceivedCommoditiesStore } from "../../../stores/receivedCommodities.store";

import DonationsTable from "./DonationsTable.vue";

import { useloadingplanstore } from "../../../stores/loadingplans.store";
import html2canvas from "html2canvas";
import { useInstructedDispatchesStore } from "../../../stores/instructedDispatches.store";
import { useinstructionstore } from "../../../stores/instructions.store";

import { usereceiptstore } from "../../../stores/receipt.store";
import { usedonationstore } from "../../../stores/donation.store";

import { usedistrictstore } from "../../../stores/districts.store";

import { useactivitiestore } from "../../../stores/activity.store";

import { useDisasterstore } from "../../../stores/disaster.store";
import { usecommoditiestore } from "../../../stores/commodity.store";
import { usecommoditytypestore } from "../../../stores/commodity-type.store";
import CommodityDistributionTable from "./CommodityDistributionTable.vue";
import CommodityDistributionTableLean from "./CommodityDistributionTableLean.vue";

import CommodityDistributionTableLeanTwo from "./CommodityDistributionTableLean2.vue";
import CommodityDistributionTableLeanWFP from "./CommodityDistributionTableLeanWFP.vue";

import CommodityDistributionTableLeanDoDMA from "./CommodityDistributionTableLeanDodma.vue";
const commodityDispatchDataWFP = ref([]);
const commodityDispatchDataDoDMA = ref([]);

const currentTab = ref("all");
// Active tab state
const activeTab = ref("emergency"); // Default tab is 'emergency'

// Function to switch tabs
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
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
  OfficeBuildingIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  InboxIcon,
  ClipboardListIcon,
  ArrowDownIcon,
  ArchiveIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/outline";

const screenshotMode = ref(false);

// Example data structure for maize distribution
const commodityDistributionData = ref([]);
const commodityDispatchData = ref([]);

const commodityDispatchData2 = ref([]);

const commodityDispatchData22 = ref([]);
const commodityEmergencyDispatchData = ref([]);

const currentView = ref("dashboard"); // The initial view can be 'dashboard' or 'charts'

const toggleView = (view) => {
  currentView.value = view;
};

const columnsLoans = ref([
  {
    label: "#",
    field: (row) => row.originalIndex + 1,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },
  {
    label: "Loaned Commodity",
    field: (row) => row.commodity.Name,
    sortable: true,
    firstSortType: "asc",
    tdClass: "capitalize",
  },

  {
    label: "Loaned Quantity (MT)",
    field: (row) => row.Quantity,
    sortable: true,
    firstSortType: "asc",
  },

  {
    label: "Loaned By",
    hidden: false,
    field: (row) => row.LoanTo,
    sortable: true,
    firstSortType: "asc",
  },

  {
    label: "Loan Date",
    hidden: false,
    field: (row) => row.LoanStart,
    sortable: true,
    firstSortType: "asc",
  },

  {
    label: "Loan Description",
    hidden: false,
    field: (row) => row.LoanDescription,
    sortable: true,
    firstSortType: "asc",
  },
]);

const showTooltip = ref(false);

const districtstore = usedistrictstore();

const activitystore = useactivitiestore();

const commoditystore = usecommoditiestore();

const donationstore = usedonationstore();

const disasterStore = useDisasterstore();
const commoditytypestore = usecommoditytypestore();

const receivedcommoditiesstore = useReceivedCommoditiesStore();
const districts = reactive([]);

const activities = reactive([]);
const disasters = reactive([]);
const commodities = reactive([]);
const commodityTypes = reactive([]);
const warehouses = reactive([]);

const commodityTable = ref(null);

const takeScreenshot = () => {
  screenshotMode.value = true;

  setTimeout(() => {
    const screenshotArea = document.querySelector("#screenshot-area");

    if (screenshotArea) {
      html2canvas(screenshotArea, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,   // allow images/fonts if server supports CORS
        allowTaint: true,
        ignoreElements: (el) => {
          // Skip <link rel="stylesheet"> tags (the cause of cssRules error)
          return el.tagName === "LINK" && el.rel === "stylesheet";
        },
      })
        .then((canvas) => {
          const image = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          const link = document.createElement("a");
          link.download = "CTS-DASHBOARD.png";
          link.href = image;
          link.click();
          screenshotMode.value = false;
        })
        .catch((error) => {
          console.error("Error taking screenshot:", error);
          screenshotMode.value = false;
        });
    }
  }, 300);
};



import { userequisitionstore } from "../../../stores/requisition.store";
import { useDispatcherStore } from "../../../stores/dispatch.store";
import { HandIcon } from "@heroicons/vue/solid";
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

const selectedFilter = ref("all");
let userCount = ref(0);
const newRequisitionsCount = ref(0);
const receiptcount = ref(0);
const dispatchcount = ref(0);
const loadingplansCount = ref(0);
const LoanloadingPlans = reactive([]);
//MOUNTEDgetCatalogue
onMounted(async () => {
  isLoading.value = true;

  updateTime();
  setInterval(updateTime, 1000);

  try {
    await fetchFilteredData();
    await fetchFilteredDataAll();
    await fetchFilteredDataDodma();
    const data = await requisitionStore.getCommodityDistributionSummary();
    const dispatchdata = await dispatchesStore.getdispatchDamageSummary();

    const activityData = await loadingPlanStore.getDataSummaryAll();
    activities1.length = 0;

    // Exclude "Partner Commodity Loan" and "Stock Prepositioning"
    const filteredActivities = activityData.activities.filter(
      (a) =>
        a.activity !== "Partner Commodity Loan" &&
        a.activity !== "Stock Prepositioning" &&
        !a.activity.toLowerCase().includes("emergency response")
    );

    activities1.push(...filteredActivities);

    // Force reset after loading
    if (activities1.find((a) => a.activity === "LSR 2024 - 25")) {
      selectedActivity1.value = "LSR 2024 - 25";
    }

    const dispatchEmergencydata =
      await receivedcommoditiesstore.getdispatchDamageSummary();
    const leanstocks =
      await loadingPlanStore.getloadingplansSummaryByCommodity();
    commodityDispatchData.value.length = 0;
    commodityEmergencyDispatchData.value.length = 0;
    leanStockSummary.value = [...leanstocks];
    commodityDispatchData.value.push({ ...dispatchdata });
    const dispatchdata22 = await dispatchesStore.getdispatchSummary2();

    const dataLoans = await loadingPlanStore.get();
    commodityDispatchData22.value.push({ ...dispatchdata22 });
    commodityEmergencyDispatchData.value.push({ ...dispatchEmergencydata });
    commodityDistributionData.value = [...data];

    LoanloadingPlans.push(
      ...dataLoans.filter(
        (plan) => plan.activity?.Name == "Partner Commodity Loan"
      )
    );
  } catch (error) {
    console.error("Failed to load commodity data:", error);
  } finally {
    isLoading.value = false;
  }
  getActivities();
  getCommodities();
  getDisasters();
  getDistricts();
  getDonations();
  getLoadingPlans();
  getdispatchSummary();
  getUsers();
  getDispatches();
  getReceipts();
  getDispatchesCount();
  getLoadingPlansPending();
  getloadingplansSummary();
  getloadingplansSummaryEMR();
  getloadingplansSummaryByCommodity();
  getInstructions();
  getRequisitions();
});

function applyFilter() {
  console.log(`Filter applied: ${selectedFilter.value}`);
  // Add logic to filter data based on selectedFilter
  // Example: Filter by date range for each filter option
}

const fetchFilteredData = async () => {
  try {
    const data = await dispatchesStore.getExtendedDispatchSummaryWFP(
      selectedFilter.value || null
    );
    commodityDispatchDataWFP.value = data;
  } catch (error) {
    console.error("Error fetching filtered dispatch data:", error);
  }
};

const fetchFilteredDataAll = async () => {
  try {
    const data = await dispatchesStore.getExtendedDispatchSummary(
      selectedFilter.value || null
    );

    commodityDispatchData2.value = data;
  } catch (error) {
    console.error("Error fetching filtered dispatch data:", error);
  }
};

const fetchFilteredDataDodma = async () => {
  try {
    const data = await dispatchesStore.getExtendedDispatchSummaryDodma(
      selectedFilter.value || null
    );

    commodityDispatchDataDoDMA.value = data;
  } catch (error) {
    console.error("Error fetching filtered dispatch data:", error);
  }
};

const instructions = reactive([]);
const newInstructionsCount = ref(0);

const getDisasters = async () => {
  disasterStore
    .get()
    .then((result) => {
      disasters.length = 0; //empty array
      disasters.push(...result);
    })
    .catch((error) => {
      console.error("Failed to load disasters:", error);
    })
    .finally(() => {});
};

const getDonations = async () => {
  donationstore
    .get()
    .then((result) => {
      donations.length = 0; //empty array
      donations.push(...result);
    })
    .catch((error) => {
      console.error("Failed to load donations:", error);
    })
    .finally(() => {});
};

const getCommodities = async () => {
  commoditystore
    .get()
    .then((result) => {
      commodities.length = 0; //empty array
      commodities.push(
        ...result.filter((item) => item.commodityType?.Name == "Food")
      );
    })
    .catch((error) => {
      console.error("Failed to load commodities:", error);
    })
    .finally(() => {});
};

const getDistricts = async () => {
  districtstore
    .get()
    .then((result) => {
      districts.length = 0; //empty array
      districts.push(...result);
    })
    .catch((error) => {
      console.error("Failed to load districts:", error);
    })
    .finally(() => {});
};

const activitiesLsr = reactive([]);
const getActivities = async () => {
  activitystore
    .get()
    .then((result) => {
      activities.length = 0; // empty array
      activities.push(
        ...result.filter(
          (activity) =>
            !activity.Name.toLowerCase().includes("emergency") &&
            !activity.Name.includes("Partner Commodity Loan")
        )
      );

      activitiesLsr.push(
        ...result.filter(
          (activity) =>
            !activity.Name.toLowerCase().includes("lsr") &&
            !activity.Name.includes("Partner Commodity Loan")
        )
      );
    })
    .catch((error) => {
      console.error("Failed to load activities:", error);
    });
};

const getInstructions = async () => {
  loadingPlanStore
    .getloadingplansSummaryPrepo()
    .then((result) => {
      newInstructionsCount.value =
        result.totalQuantity.toLocaleString() + " MT";
    })
    .catch((error) => {
      console.error("Failed to load plans:", error);
    });
};

const getRequisitions = async () => {
  isLoading.value = true;
  requisitionsStore
    .get()
    .then((result) => {
      requisitions.length = 0;
      requisitions.push(
        ...result.filter(
          (item) => item.IsArchived == false || item.IsArchived == null
        )
      );
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
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commodity Distribution");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(data, "commoditydistributionreport.xlsx");
};

const getloadingplansSummaryByCommodity = async () => {
  loadingPlanStore.getloadingplansSummaryByCommodity().then((result) => {
    loadingPlanSummary.length = 0;
    loadingPlanSummary.push(...result);
  });
};

const completedDispatch = ref(0);
const getDispatches = async () => {
  isLoading.value = true;
  dispatchStore
    .get()
    .then((result) => {
      const sortedDispatches = [...result].sort(
        (a, b) => new Date(b.createdon) - new Date(a.createdon)
      );
      dispaches.length = 0;
      let reversedData = sortedDispatches.reverse();
      dispaches.push(...reversedData);
      completedDispatch.value = dispaches.filter(
        (item) => item.IsArchived
      ).length;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getDispatchesCount = async () => {
  dispatchStore.count().then((result) => {
    dispatchcount.value = result.count;
  });
};

const loadingplansCountPending = ref(0);

const getLoadingPlans = async () => {
  loadingPlanStore.getloadingplansByATC().then((result) => {
    loadingplans.length = 0;
    loadingplans.push(...result);
    loadingplansCount.value = loadingplans.length;

    loadingplansCountPending.value = loadingplans.filter(
      (item) => item.isApproved == false && item.isRejected == false
    ).length;
  });
};

const pendingplans = ref(0);
const totalBalance = ref(0);

const totalBalanceEMR = ref(0);
const totalStockPlanned = ref("");

const totalRequiredTonnage = ref("");
const dispatchPercentageFormated = ref("");
const dispatchPercentageFormatedEMR = ref("");
const totalDispatched = ref(0);
const totalReceived = ref("");
const receivedPercentageFormated = ref("");
const receivedPercentage = ref("");
const dispatchPercentage = ref("");
const dispatchPercentageEMR = ref("");
const getLoadingPlansPending = async () => {
  loadingPlanStore.getloadingplansPending().then((result) => {
    pendingplans.value = result.count;
  });
};
const getdispatchSummary = async () => {
  dispatchesStore.getdispatchSummary().then((result) => {
    totalDispatched.value = result.totalDispatched.toLocaleString() + " MT";
    totalReceived.value = result.totalReceived.toLocaleString() + " MT";
    receivedPercentageFormated.value =
      result.dispatchPercentage.toFixed(2) + "% received";
    receivedPercentage.value = result.dispatchPercentage.toFixed(2);
  });
};

const getloadingplansSummary = async () => {
  loadingPlanStore.getloadingplansSummary().then((result) => {
    totalStockPlanned.value = result.totalStockPlanned.toLocaleString() + " MT";
    totalBalance.value = result.totalBalance;
    dispatchPercentageFormated.value =
      result.dispatchPercentage.toFixed(2) + "% dispatched";
    dispatchPercentage.value = result.dispatchPercentage.toFixed(2);
  });
};

const getloadingplansSummaryEMR = async () => {
  loadingPlanStore.getloadingplansSummaryEMR().then((result) => {
    totalRequiredTonnage.value =
      result.totalStockPlanned.toLocaleString() + " MT";
    totalBalanceEMR.value = result.totalBalance;
    dispatchPercentageFormatedEMR.value =
      result.dispatchPercentage.toFixed(2) + "% dispatched";
    dispatchPercentageEMR.value = result.dispatchPercentage.toFixed(2);
  });
};

const getUsers = async () => {
  userStore.count().then((result) => {
    userCount.value = result.count;
  });

  userStore
    .get()
    .then((result) => {
      users.length = 0;
      users.push(...result);
      users.sort((a, b) => new Date(b.created) - new Date(a.created));
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const stats2 = ref([
  {
    label: "Total Stocks Planned (Lean Season Response)",
    value: totalStockPlanned,
    icon: dispatchPercentage < 50 ? CheckCircleIcon : ExclamationCircleIcon,
    iconColor: dispatchPercentage < 50 ? "green-500" : "red-500",
    percentageText: dispatchPercentageFormated,
    textColor: dispatchPercentage < 50 ? "green-500" : "red-500",
    showProgress: true,
    moreInfo: true,
    progress: dispatchPercentage,
    isProgressPositive: dispatchPercentage >= 50,
    progressColor: dispatchPercentage < 50 ? "green-500" : "red-500",
    link: true,
    href: "/commissioner/stats",
  },

  {
    label: "Total Stocks Planned (Emergency Assistance)",
    value: totalRequiredTonnage,
    icon: dispatchPercentageEMR < 50 ? CheckCircleIcon : ExclamationCircleIcon,
    iconColor: dispatchPercentageEMR < 50 ? "green-500" : "red-500",
    percentageText: dispatchPercentageFormatedEMR,
    textColor: dispatchPercentageEMR < 50 ? "green-500" : "red-500",
    showProgress: true,
    moreInfo: true,
    progress: dispatchPercentageEMR,
    isProgressPositive: dispatchPercentageEMR >= 50,
    progressColor: dispatchPercentageEMR < 50 ? "green-500" : "red-500",
    link: true,
    href: "/commissioner/stock-prepositioning",
  },

  {
    label: "Total Prepositioned Stock",
    value: newInstructionsCount,
    icon: ArchiveIcon,
    iconColor: "blue-400",
    percentageText: "",
    textColor: "blue-600",
    showProgress: false,
    moreInfo: true,
    link: true,
    href: "/commissioner/stock-prepositioning",
  },
]);

const colors = [
  "#ffadad",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
];

const damagedStockStats = computed(() => {
  if (
    commodityDispatchData.value.length === 0 ||
    !commodityDispatchData.value[0].commoditySummary
  ) {
    return [];
  }
  const commodities = [
    ...new Set(
      commodityDispatchData.value[0].commoditySummary.map(
        (item) => item.commodity
      )
    ),
  ];

  return commodities.map((commodity, index) => {
    const totalForCommodity =
      commodityDispatchData.value[0].commoditySummary.filter(
        (item) => item.commodity === commodity
      );

    return {
      commodity,
      percentage: totalForCommodity[0].damagePercentage.toFixed(2),
      color: colors[index % colors.length],
    };
  });
});

const damagedStockStatsEmergency = computed(() => {
  if (
    commodityEmergencyDispatchData.value.length === 0 ||
    !commodityEmergencyDispatchData.value[0].commoditySummary
  ) {
    return [];
  }
  const commodities = [
    ...new Set(
      commodityEmergencyDispatchData.value[0].commoditySummary.map(
        (item) => item.commodity
      )
    ),
  ];

  return commodities.map((commodity, index) => {
    const totalForCommodity =
      commodityEmergencyDispatchData.value[0].commoditySummary.filter(
        (item) => item.commodity === commodity
      );
    return {
      commodity,
      percentage: totalForCommodity[0].overallDamagePercentage.toFixed(2),
      color: colors[index % colors.length],
    };
  });
});

// Filters
const selectedDistrict = ref("");

const selectedActivity = ref("");
const selectedCommodity = ref("");
const selectedDisaster = ref("");
const selectedDateFrom = ref("");
const selectedDateTo = ref("");

// Reset filters
const resetFilters = () => {
  selectedDistrict.value = "";
  selectedActivity.value = "";
  selectedCommodity.value = "";
  selectedDisaster.value = "";
  selectedDateFrom.value = "";
  selectedDateTo.value = "";
};

// Filtered data for Emergency Response Dashboard
const filteredCommodityDistributionData = computed(() => {
  return commodityDistributionData.value.filter((item) => {
    const matchDistrict =
      !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity =
      !selectedCommodity.value || item.commodity === selectedCommodity.value;
    const matchDisaster =
      !selectedDisaster.value || item.disaster === selectedDisaster.value;
    const matchDate =
      (!selectedDateFrom.value ||
        moment(item.date_of_occurrence).isSameOrAfter(
          selectedDateFrom.value
        )) &&
      (!selectedDateTo.value ||
        moment(item.date_of_occurrence).isSameOrBefore(selectedDateTo.value));
    return matchDistrict && matchCommodity && matchDisaster && matchDate;
  });
});

const flattenedData2 = computed(() => {
  if (
    !commodityDispatchData22.value ||
    commodityDispatchData22.value.length === 0
  ) {
    return []; // Return an empty array if data is not available
  }

  // Assume props.data is an array with a single object containing numerically indexed keys
  const [dataObj] = commodityDispatchData22.value; // Extract the first object (your data)
  return Object.values(dataObj); // Convert the object into an array of values
});

const filteredLeanCommodityDispatchData2 = computed(() => {
  return commodityDispatchData2.value.filter((item) => {
    const matchActivity =
      !selectedActivity.value || item.activity === selectedActivity.value;
    const matchDistrict =
      !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity =
      !selectedCommodity.value || item.commodity === selectedCommodity.value;

    return matchActivity && matchCommodity && matchDistrict;
  });
});

const filteredLeanCommodityDispatchData22 = computed(() => {
  return flattenedData2.value.filter((item) => {
    const matchActivity =
      !selectedActivity.value || item.activity === selectedActivity.value;
    const matchDistrict =
      !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity =
      !selectedCommodity.value || item.commodity === selectedCommodity.value;

    return matchActivity && matchCommodity && matchDistrict;
  });
});

const filteredLeanCommodityDispatchDataWFP = computed(() => {
  return commodityDispatchDataWFP.value.filter((item) => {
    const matchActivity =
      !selectedActivity.value || item.activity === selectedActivity.value;
    const matchDistrict =
      !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity =
      !selectedCommodity.value || item.commodity === selectedCommodity.value;

    return matchActivity && matchCommodity && matchDistrict;
  });
});

const filteredLeanCommodityDispatchDataDodma = computed(() => {
  return commodityDispatchDataDoDMA.value.filter((item) => {
    const matchActivity =
      !selectedActivity.value || item.activity === selectedActivity.value;
    const matchDistrict =
      !selectedDistrict.value || item.district === selectedDistrict.value;
    const matchCommodity =
      !selectedCommodity.value || item.commodity === selectedCommodity.value;

    return matchActivity && matchCommodity && matchDistrict;
  });
});

const filteredLeanStockSummary = computed(() => {
  return leanStockSummary.value.filter((item) => {
    const matchCommodity =
      !selectedCommodity.value || item.commodityName == selectedCommodity.value;
    const matchDistrict =
      !selectedDistrict.value || item.commodityName == selectedDistrict.value;
    const matchActivity =
      !selectedActivity.value || item.commodityName == selectedActivity.value;

    return matchCommodity && matchActivity && matchDistrict;
  });
});

const activities1 = reactive([]);

const selectedActivity1 = ref("");

// Stats state
const totalStockPlanned1 = ref(0);
const totalDispatched1 = ref(0);
const totalReceived1 = ref(0);
const loadingplansCount1 = ref(0);
const loadingplansCountPending1 = ref(0); // for future use
const receivedPercentageFormated1 = ref("0%");

watch(
  selectedActivity1,
  (newVal) => {
    if (!newVal) {
      let allCommodities = activities1.flatMap((a) => a.commodities);
      totalStockPlanned1.value = allCommodities.reduce(
        (sum, c) => sum + c.totalStockPlanned,
        0
      );
      totalDispatched1.value = allCommodities.reduce(
        (sum, c) => sum + c.totalTonnageDispatched,
        0
      );
      totalReceived1.value = allCommodities.reduce(
        (sum, c) => sum + c.totalReceived,
        0
      );
      loadingplansCount1.value = allCommodities.reduce(
        (sum, c) => sum + c.totalLoadingPlans,
        0
      );
      receivedPercentageFormated1.value =
        totalDispatched1.value > 0
          ? ((totalReceived1.value / totalDispatched1.value) * 100).toFixed(2) +
            "%"
          : "0%";
    } else {
      let act = activities1.find((a) => a.activity === newVal);
      if (act) {
        let c = act.commodities[0];
        totalStockPlanned1.value = c.totalStockPlanned;
        totalDispatched1.value = c.totalTonnageDispatched;
        totalReceived1.value = c.totalReceived;
        loadingplansCount1.value = c.totalLoadingPlans;
        receivedPercentageFormated1.value =
          c.dispatchesReceivedPercentage.toFixed(2) + "%";
      }
    }
  },
  { immediate: true } // ✅ ensures it runs on page load
);

const updateStats = computed(() => {
  if (!selectedActivity1.value) {
    // Aggregate ALL activities
    let allCommodities = activities1.flatMap((a) => a.commodities);

    totalStockPlanned1.value = allCommodities.reduce(
      (sum, c) => sum + c.totalStockPlanned.toFixed(2),
      0
    );
    totalDispatched1.value = allCommodities.reduce(
      (sum, c) => sum + c.totalTonnageDispatched.toFixed(2),
      0
    );
    totalReceived1.value = allCommodities.reduce(
      (sum, c) => sum + c.totalReceived.toFixed(2),
      0
    );
    loadingplansCount1.value = allCommodities.reduce(
      (sum, c) => sum + c.totalLoadingPlans.toFixed(2),
      0
    );
    receivedPercentageFormated1.value =
      totalDispatched1.value > 0
        ? ((totalReceived1.value / totalDispatched1.value) * 100).toFixed(2) +
          "%"
        : "0%";
  } else {
    // Filter for selected activity
    let act = activities1.find((a) => a.activity === selectedActivity1.value);
    if (act) {
      let c = act.commodities[0]; // assume one commodity per activity
      totalStockPlanned1.value = c.totalStockPlanned.toFixed(2);
      totalDispatched1.value = c.totalTonnageDispatched.toFixed(2);
      totalReceived1.value = c.totalReceived.toFixed(2);
      loadingplansCount1.value = c.totalLoadingPlans.toFixed(2);
      receivedPercentageFormated1.value =
        c.dispatchesReceivedPercentage.toFixed(2) + "%";
    }
  }
});
</script>

<style scoped>
.tab-button2 {
  background-color: white;
  color: #3498db;
  /* Blue text color */
  border: 1px solid #3498db;
  padding: 10px 20px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.tab-button2:hover {
  background-color: #3498db;
  /* Light blue hover background */
  color: #eaf4fb;
  /* Blue text color */
}

.border {
  border-width: 1px;
  border-color: rgba(11, 138, 216, 0.2);
  transition: border-color 0.3s ease;
}

.tab-button {
  background-color: #248cd6;
  color: white;
  border: none;
}

.tabs {
  display: flex;
  margin-bottom: 1rem;
}

.tab-button.active {
  background: gray;
  color: white;
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

.vgt-table td {
  font-weight: normal !important;
}
.vgt-table th {
  font-weight: normal !important;
}
</style>
