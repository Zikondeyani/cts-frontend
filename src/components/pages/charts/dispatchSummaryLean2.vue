<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  commodityDispatchData: { type: Array, default: () => [] },
  activity: { type: Array, default: () => [] }
});

const barChartRef = ref(null);
let barChart = null;

// ------------------------------
// COMPUTED DATA
// ------------------------------
const processedBarChartData = computed(() => {
  const data = props.commodityDispatchData;
  if (!data.length) return { labels: [], datasets: [] };

  const districts = [...new Set(data.map(i => i.district))];

  return {
    labels: districts,
    datasets: [
      {
        label: 'Tonnage Allocation',
        data: districts.map(d => (data.find(i => i.district === d)?.tonnageAllocation || 0).toFixed(2)),
        backgroundColor: '#096eb4'
      },
      {
        label: 'Total Dispatched',
        data: districts.map(d => (data.find(i => i.district === d)?.totalDispatched || 0).toFixed(2)),
        backgroundColor: '#0b8ad8'
      },
      {
        label: 'Total Received',
        data: districts.map(d => (data.find(i => i.district === d)?.totalReceived || 0).toFixed(2)),
        backgroundColor: '#0aa0f5'
      }
    ]
  };
});

// ------------------------------
// RENDER / UPDATE CHART
// ------------------------------
function renderChart() {
  if (!barChartRef.value) return;

  const ctx = barChartRef.value.getContext('2d');

  if (!processedBarChartData.value.labels.length) return;

  if (barChart) {
    barChart.data = processedBarChartData.value;
    barChart.update();
    return;
  }

  barChart = new Chart(ctx, {
    type: 'bar',
    data: processedBarChartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Tonnage Allocation vs. Dispatched and Received'
        },
        datalabels: { display: false }
      },
      scales: {
        x: { stacked: true, title: { display: true, text: 'District' } },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: 'Quantity (MT)' },
          ticks: { callback: v => `${v} MT` }
        }
      }
    }
  });
}

// ------------------------------
// WATCHERS
// ------------------------------
watch([() => props.commodityDispatchData, () => props.activity], renderChart, { immediate: true });

onMounted(renderChart);
onBeforeUnmount(() => barChart?.destroy());
</script>

<template>
  <div>
    <!-- FIXED HEIGHT WRAPPER -->
    <div style="height: 400px; width: 100%;">
      <canvas ref="barChartRef"></canvas>
    </div>
  </div>
</template>
