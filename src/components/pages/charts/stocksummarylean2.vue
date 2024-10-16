<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  leanStockSummary: Array,
  screenshotMode: Boolean,
});

const pieChartRef = ref(null);
const expanded = ref(false); // To toggle between showing all or limited data
const showModal = ref(false); // To control the visibility of the modal
const limit = ref(4); // Number of districts to show initially
let chartInstance = null;

const processedPieChartData = computed(() => {
  const dataToShow = expanded.value
    ? props.leanStockSummary
    : props.leanStockSummary.slice(0, limit.value);

  const labels = dataToShow.map(item => item.district);
  const receiptCompletionData = dataToShow.map(item => item.receiptCompletion );
  const dispatchCompletionData = dataToShow.map(item => item.dispatchCompletion);

  return {
    labels,
    datasets: [
      {
        label: 'Receipt Completion(%)',
        data: receiptCompletionData ,
        backgroundColor: ['#42a5f5', '#1e88e5', '#1565c0', '#0d47a1'],
      }
    ],
  };
});

function renderChart() {
  const pieCtx = pieChartRef.value.getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(pieCtx, {
    type: 'pie',
    data: processedPieChartData.value,
    options: {
      responsive: true,
      aspectRatio: 1, // Set aspect ratio to 1:1 for a larger chart
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
            },
            padding: 20,
          },
        },
        title: {
          display: true,
          text: 'Receipt Completion Rates by District',
          font: {
            size: 17,
          },
          padding: {
            top: 20,
            bottom: 30,
          },
        },
        datalabels: {
          display: false, // Completely hide datalabels
        },
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
    },
  });
}

onMounted(() => {
  renderChart();
});

watch([expanded, props.leanStockSummary], () => {
  renderChart();
});

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <div>
    <!-- Increase the height of the canvas to make the pie chart larger -->
    <canvas ref="pieChartRef" style="width: 100%; height: 800px;"></canvas>
    <button @click="expanded = !expanded" :class="{ 'hidden': screenshotMode }" >
      {{ expanded ? 'Show Less' : 'Show All' }}
    </button>
  </div>
</template>

<style scoped>
.toggle-button {
  margin-top: 20px;
  padding: 10px;
  border: none;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  border-radius: 5px;
}

.toggle-button:nth-of-type(1) {
  background-color: #28a745;
}

.toggle-button:nth-of-type(2) {
  background-color: #007bff;
}

.modal {
  display: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
