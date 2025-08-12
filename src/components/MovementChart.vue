<template>
  <div class="p-6 max-w-7xl mx-auto font-sans text-gray-800">
  
    <!-- Summary Pie Chart Card -->
    <section
      class="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start"
      aria-label="Inventory movement summary"
    >
      <div class="md:w-1/2">
        <h3 class="text-xl font-semibold mb-2 flex items-center">
          Movement Summary
          <span
            title="Distribution of commodities by movement speed: fast, slow, and no movement."
            class="ml-2 text-gray-400 cursor-help select-none"
            >ℹ️</span
          >
        </h3>
        <canvas ref="summaryChartRef" class="max-w-w- h-64 md:h-72"></canvas>
      </div>
      <div class="md:w-1/2 mt-6 md:mt-0 md:pl-8">
        <ul class="flex space-x-6 justify-center md:justify-start">
          <li class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-sm" :style="{backgroundColor: GREEN}"></span>
            <span class="font-medium">Fast</span>
          </li>
          <li class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-sm" :style="{backgroundColor: YELLOW}"></span>
            <span class="font-medium">Slow</span>
          </li>
          <li class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-sm" :style="{backgroundColor: BLUE}"></span>
            <span class="font-medium">No Movement</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Top Commodities Bar Charts -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div
        class="bg-white rounded-lg shadow-md p-6 flex flex-col"
        aria-label="Top fast-moving commodities"
      >
        <h3 class="text-xl font-semibold mb-4 flex items-center justify-between">
          Top Fast-Moving Commodities
          <span
            title="Top 10 commodities with fastest movement based on recent counts."
            class="text-gray-400 cursor-help select-none"
            >ℹ️</span
          >
        </h3>
        <div class="overflow-x-auto">
          <canvas ref="fastChartRef" class="min-w-[320px] h-48 md:h-64"></canvas>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 flex flex-col"
        aria-label="Top slow-moving commodities"
      >
        <h3 class="text-xl font-semibold mb-4 flex items-center justify-between">
          Top Slow-Moving Commodities
          <span
            title="Top 10 commodities with slowest movement based on recent counts."
            class="text-gray-400 cursor-help select-none"
            >ℹ️</span
          >
        </h3>
        <div class="overflow-x-auto">
          <canvas ref="slowChartRef" class="min-w-[320px] h-48 md:h-64"></canvas>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 flex flex-col"
        aria-label="Top no movement commodities"
      >
        <h3 class="text-xl font-semibold mb-4 flex items-center justify-between">
          Top No Movement Commodities
          <span
            title="Top 10 commodities with no movement in inventory."
            class="text-gray-400 cursor-help select-none"
            >ℹ️</span
          >
        </h3>
        <div class="overflow-x-auto">
          <canvas ref="noMovementChartRef" class="min-w-[320px] h-48 md:h-64"></canvas>
        </div>
      </div>
    </section>

 
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
  classificationCommodities: {
    type: Object,
    default: () => ({ fast: [], slow: [], "no movement": [] }),
  },
  nearingExpiryCommodities: {
    type: Array,
    default: () => [],
  },
});

const summaryChartRef = ref(null);
const fastChartRef = ref(null);
const slowChartRef = ref(null);
const noMovementChartRef = ref(null);

let summaryChart = null;
let fastChart = null;
let slowChart = null;
let noMovementChart = null;

const BLUE = "#096eb4";
const GREEN = "#10B981";
const YELLOW = "#FBBF24";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const buildSummaryData = () => ({
  labels: ["Fast", "Slow", "No Movement"],
  datasets: [
    {
      data: [props.summary.fast, props.summary.slow, props.summary["no movement"]],
      backgroundColor: [GREEN, YELLOW, BLUE],
      hoverOffset: 30,
    },
  ],
});

const buildBarChartData = (classification) => {
  const commodities = props.classificationCommodities[classification] || [];

  const top10 = [...commodities].sort((a, b) => b.count - a.count).slice(0, 10);

  return {
    labels: top10.map((c) => c.commodityName),
    datasets: [
      {
        label: `${classification.charAt(0).toUpperCase() + classification.slice(1)} Moving`,
        data: top10.map((c) => c.count),
        backgroundColor:
          classification === "fast" ? GREEN : classification === "slow" ? YELLOW : BLUE,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Count",
        font: { size: 14, weight: "bold" },
      },
      ticks: { font: { size: 12, weight: "bold" } },
    },
    x: {
      ticks: {
        font: { size: 12, weight: "bold" },
        maxRotation: 90,
        minRotation: 45,
      },
    },
  },
  plugins: {
    legend: { position: "top", labels: { font: { size: 14 } } },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y || ctx.parsed} commodities`,
      },
      bodyFont: { size: 12 },
      titleFont: { size: 14 },
    },
  },
};

const renderSummaryChart = () => {
  if (summaryChart) summaryChart.destroy();
  const ctx = summaryChartRef.value.getContext("2d");
  summaryChart = new Chart(ctx, {
    type: "doughnut",
    data: buildSummaryData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { font: { size: 14 } } },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed} commodities`,
          },
          bodyFont: { size: 12 },
          titleFont: { size: 14 },
        },
      },
    },
  });
};

const renderBarChart = (chartRef, classification, existingChart) => {
  if (existingChart) existingChart.destroy();
  const ctx = chartRef.value.getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: buildBarChartData(classification),
    options: chartOptions,
  });
};

onMounted(() => {
  renderSummaryChart();
  fastChart = renderBarChart(fastChartRef, "fast", fastChart);
  slowChart = renderBarChart(slowChartRef, "slow", slowChart);
  noMovementChart = renderBarChart(noMovementChartRef, "no movement", noMovementChart);
});

watch(
  () => [props.summary, props.classificationCommodities, props.nearingExpiryCommodities],
  () => {
    renderSummaryChart();
    fastChart = renderBarChart(fastChartRef, "fast", fastChart);
    slowChart = renderBarChart(slowChartRef, "slow", slowChart);
    noMovementChart = renderBarChart(noMovementChartRef, "no movement", noMovementChart);
  },
  { deep: true }
);
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 300px !important;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  user-select: none;
}

h2,
h3 {
  user-select: none;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
  transition: background-color 0.3s ease;
}
</style>
