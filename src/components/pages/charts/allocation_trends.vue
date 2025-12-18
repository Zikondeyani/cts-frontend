<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const parabolaChartRef = ref(null);
const selectedActivity = ref("All");

const props = defineProps({
  allocationData: { type: Array, required: true },
  activities: { type: Array, required: true },
});

// ------------- AGGREGATED DATA WHEN "ALL" IS SELECTED -------------
const filteredData = computed(() => {
  if (selectedActivity.value !== "All") {
    return props.allocationData.filter(i => i.activity === selectedActivity.value);
  }

  const grouped = {};
  props.allocationData.forEach(item => {
    const key = `${item.district}_${item.commodity}`;
    if (!grouped[key]) {
      grouped[key] = {
        district: item.district,
        commodity: item.commodity,
        tonnageAllocation: 0
      };
    }
    grouped[key].tonnageAllocation += item.tonnageAllocation;
  });

  return Object.values(grouped);
});

let parabolaChart = null;
let blinkValue = 0;

// -----------------------------------
// CREATE / UPDATE CHART
// -----------------------------------
function createCharts() {
  if (!parabolaChartRef.value) return;

  const ctx = parabolaChartRef.value.getContext('2d');
  const districtLabels = [...new Set(filteredData.value.map(i => i.district))];
  const commodities = [...new Set(filteredData.value.map(i => i.commodity))];

  const colors = ['#248cd6', '#d62472', '#ffbb33', '#55d624'];

  const datasets = commodities.map((commodity, index) => {
    const commodityData = districtLabels.map(district => {
      const found = filteredData.value.find(
        i => i.district === district && i.commodity === commodity
      );
      return found ? found.tonnageAllocation : 0;
    });

    const maxValue = Math.max(...commodityData);
    const peakIndex = commodityData.indexOf(maxValue);

    return {
      label: `${commodity} Allocations (MT)`,
      data: commodityData,
      borderColor: commodity === 'YourTargetCommodity' ? 'orange' : colors[index % colors.length], // peak line color can be orange
      backgroundColor: colors[index % colors.length],
      fill: false,
      tension: 0.4,

      pointBackgroundColor: ctx => {
        const i = ctx.dataIndex;
        return i === peakIndex ? "orange" : colors[index % colors.length];
      },

      pointBorderColor: ctx => {
        const i = ctx.dataIndex;
        return i === peakIndex ? "orange" : colors[index % colors.length];
      },
      pointBorderWidth: 2,

      pointRadius: ctx => {
        const i = ctx.dataIndex;
        if (i === peakIndex) {
          return 6 + Math.abs(Math.sin(blinkValue)) * 3; // slower and subtle pulsating
        }
        return 6;
      }
    };
  });

  if (parabolaChart) parabolaChart.destroy();

  parabolaChart = new Chart(ctx, {
    type: 'line',
    data: { labels: districtLabels, datasets },
    options: {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text:
            selectedActivity.value === "All"
              ? "Commodity Allocations per District (Aggregated Across All Activities)"
              : `Commodity Allocations per District (${selectedActivity.value})`
        },
        datalabels: { display: false }
      }
    }
  });

  // slower blinking animation loop
  function animateBlink() {
    blinkValue += 0.05; // slower speed
    parabolaChart.update();
    requestAnimationFrame(animateBlink);
  }

  animateBlink();
}

// -----------------------------------
// DOWNLOAD CHART AS IMAGE
// -----------------------------------
function downloadChart() {
  if (!parabolaChart) return;

  const link = document.createElement("a");
  link.href = parabolaChart.toBase64Image();
  link.download = "commodity_allocation_chart.png";
  link.click();
}

// -----------------------------------
// WATCHERS
// -----------------------------------
watch(() => props.allocationData, createCharts, { immediate: true });
watch(selectedActivity, createCharts);

onMounted(createCharts);
onBeforeUnmount(() => parabolaChart?.destroy());
</script>

<template>
  <div>
    <!-- Dropdown + Screenshot Button -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <label class="font-semibold text-black mr-2">Select Activity:</label>
        <select
          v-model="selectedActivity"
          class="focus:ring-gray-500 focus:border-blue-300 block shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="All">All</option>
          <option v-for="act in activities" :key="act.activity" :value="act.activity">
            {{ act.activity }}
          </option>
        </select>
      </div>

      <button
        @click="downloadChart"
          class="tab-button font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
      >
        Download Chart
      </button>
    </div>

    <!-- FIXED HEIGHT WRAPPER -->
    <div style="height: 300px; width: 100%;">
      <canvas ref="parabolaChartRef"></canvas>
    </div>
  </div>
</template>
