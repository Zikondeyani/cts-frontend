<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  leanStockSummary: Array,
  screenshotMode: Boolean,
});

const pieChartRef = ref(null);
const expanded = ref(false);
const limit = ref(4);
let chartInstance = null;

// Compute if all data values are zero
function isAllZero(data) {
  return data.every(item => item.receiptCompletion === 0);
}

// Generate chart data
function getChartData() {
  const dataToShow = expanded.value
    ? props.leanStockSummary
    : props.leanStockSummary.slice(0, limit.value);

  const labels = dataToShow.map(item => item.district);
  const receiptCompletionData = dataToShow.map(item => item.receiptCompletion);

  return { labels, datasets: [{ label: 'Receipt Completion(%)', data: receiptCompletionData }] };
}

function renderChart() {
  const ctx = pieChartRef.value.getContext('2d');
  const dataToShow = expanded.value
    ? props.leanStockSummary
    : props.leanStockSummary.slice(0, limit.value);

  const allZero = isAllZero(dataToShow);

  if (chartInstance) {
    if (allZero) {
      chartInstance.destroy();
      chartInstance = null;
      return;
    }
    chartInstance.data = getChartData();
    chartInstance.update('none');
  } else if (!allZero) {
    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        ...getChartData(),
        datasets: [{
          ...getChartData().datasets[0],
          backgroundColor: ['#42a5f5', '#1e88e5', '#1565c0', '#0d47a1']
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 16 }, padding: 20 } },
          title: {
            display: true,
            text: 'Receipt Completion Rates by District',
            font: { size: 17 },
            padding: { top: 20, bottom: 30 }
          },
          datalabels: { display: false },
        },
        layout: { padding: { left: 20, right: 20, top: 20, bottom: 20 } },
      },
    });
  }
}

onMounted(renderChart);
watch([expanded, () => props.leanStockSummary], renderChart, { deep: true });
</script>

<template>
  <div class="chart-container" style="position: relative; width: 100%; height: 400px;">
    <!-- Chart canvas -->
    <canvas 
      ref="pieChartRef" 
      v-show="props.leanStockSummary.some(i => i.receiptCompletion > 0)"
    ></canvas>

    <!-- Placeholder if all values are zero -->
    <div 
      v-if="!props.leanStockSummary.some(i => i.receiptCompletion > 0)" 
      class="no-data-placeholder"
    >
      <div class="icon">📊</div>
      <div class="text">No completion data available</div>
      <div class="subtext">Data will appear once receipt completion is reported for districts.</div>
    </div>

    <!-- Toggle button is hidden if all values are zero -->
    <button 
      v-if="props.leanStockSummary.some(i => i.receiptCompletion > 0)" 
      @click="expanded = !expanded" 
      :class="{ 'hidden': screenshotMode }"
         class="tab-button  font-body inline-flex items-center px-6 py-2.5 font-medium text-xs leading-tight rounded shadow-md transition duration-100 ease-in-out capitalize"
     
 
    >
      {{ expanded ? 'Show Less' : 'Show All' }}
    </button>
  </div>
</template>

<style scoped>
.chart-container { display: flex; flex-direction: column; align-items: center; justify-content: center; }

.no-data-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #555;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  height: 100%;
}

.no-data-placeholder .icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.no-data-placeholder .text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.no-data-placeholder .subtext {
  font-size: 14px;
  color: #888;
}

.toggle-button {
  margin-top: 20px;
  padding: 10px 15px;
  border: none;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  border-radius: 5px;
}
</style>
