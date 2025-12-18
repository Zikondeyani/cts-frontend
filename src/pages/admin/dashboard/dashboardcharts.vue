<template>
  <div class="space-y-6">

    <!-- Filter / Info Panel -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-md">
      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2 md:mb-0">Dispatch Dashboard</h2>
        <span class="text-gray-500 text-sm">Showing data for the last 30 days</span>
      </div>

      <div class="mt-2 md:mt-0">
        <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ activityList[0] || 'All LSR Activities' }}
        </span>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div class="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
  <h3 class="font-semibold mb-3 text-gray-700">Dispatch Trend (Qty MT)</h3>

  <!-- Loader -->
  <div v-if="loadingTrend" class="flex justify-center items-center h-48">
    <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
  </div>

  <!-- Chart stays in DOM with v-show -->
  <canvas ref="trendChart" v-show="!loadingTrend"></canvas>
</div>

<div class="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
  <h3 class="font-semibold mb-3 text-gray-700">Top 5 Destination Districts</h3>

  <!-- Loader -->
  <div v-if="loadingDestination" class="flex justify-center items-center h-48">
    <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
  </div>

  <!-- Chart stays in DOM with v-show -->
  <canvas ref="destinationChart" v-show="!loadingDestination"></canvas>
</div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  dispatches: { type: Array, required: true }
});

const trendChart = ref(null);
const destinationChart = ref(null);

let trendInstance = null;
let destInstance = null;

const loadingTrend = ref(true);
const loadingDestination = ref(true);

const selectedActivity = ref("");

// LSR activities
const activityList = computed(() => {
  const set = new Set();
  props.dispatches.forEach(d => {
    const act = d.loadingPlan?.activity?.Name;
    if (act && act.includes("LSR")) set.add(act);
  });
  return Array.from(set);
});

onMounted(buildCharts);
watch([() => props.dispatches, selectedActivity], buildCharts, { deep: true });


async function buildCharts() {
  if (!props.dispatches?.length) return;

  // START LOADERS
  loadingTrend.value = true;
  loadingDestination.value = true;

  await nextTick();

  // Destroy previous charts if they exist
  if (trendInstance) trendInstance.destroy();
  if (destInstance) destInstance.destroy();

  /* FILTER LSR DATA */
  let filtered = props.dispatches.filter(
    d => d.loadingPlan?.activity?.Name?.includes("LSR")
  );

  if (selectedActivity.value) {
    filtered = filtered.filter(
      d => d.loadingPlan?.activity?.Name === selectedActivity.value
    );
  }

  /* TREND CHART DATA */
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const last30 = filtered.filter(d => {
    const dt = new Date(d.Date);
    return dt >= thirtyDaysAgo && dt <= now;
  });

  const dateGroups = {};
  last30.forEach(d => {
    const date = new Date(d.Date).toLocaleDateString("en-GB");
    dateGroups[date] = (dateGroups[date] || 0) + Number(d.Quantity);
  });

  // CREATE TREND CHART ONLY IF canvas exists
  if (trendChart.value) {
    try {
      trendInstance = new Chart(trendChart.value, {
        type: "line",
        data: {
          labels: Object.keys(dateGroups),
          datasets: [
            {
              label: "Qty (MT)",
              data: Object.values(dateGroups),
              tension: 0.4
            }
          ]
        }
      });
    } catch (e) {
      console.error("Trend chart error:", e);
    }
  }

  loadingTrend.value = false;

  /* DESTINATION CHART DATA */
  const districtTotals = {};
  last30.forEach(d => {
    const district =
      d.loadingPlan?.district?.Name || d.FinalDestinationPoint || "Unknown";
    districtTotals[district] = (districtTotals[district] || 0) + Number(d.Quantity);
  });

  const top5 = Object.entries(districtTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // CREATE DESTINATION CHART ONLY IF canvas exists
  if (destinationChart.value) {
    try {
      destInstance = new Chart(destinationChart.value, {
        type: "bar",
        data: {
          labels: top5.map(x => x[0]),
          datasets: [
            {
              label: "Qty MT",
              data: top5.map(x => x[1])
            }
          ]
        }
      });
    } catch (e) {
      console.error("Destination chart error:", e);
    }
  }

  loadingDestination.value = false;
}

</script>


<style scoped>
canvas {
  max-height: 300px;
}
</style>
