<script setup>
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js modules
Chart.register(...registerables);

// Refs for chart canvases
const barChartRef = ref(null);
const pieChartRef = ref(null);

// Props received from the parent component
const props = defineProps({
  dispatchData: {
    type: Array,
    required: true,
  }
});

let barChart = null;
let pieChart = null;

// Utility to destroy existing charts
function destroyCharts() {
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();
}

// Function to initialize charts
function createCharts() {
  if (!barChartRef.value || !pieChartRef.value) return;

  // Destroy any existing charts
  destroyCharts();

  // Extract data from props
  const dispatcherNames = props.dispatchData.map(item => item.dispatcherName);
  const totalDispatches = props.dispatchData.map(item => item.totalDispatches);
  const totalQuantityMoved = props.dispatchData.map(item => item.totalQuantityMoved);

  // Create Bar Chart - Total Dispatches
  const barCtx = barChartRef.value.getContext('2d');
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: dispatcherNames,
      datasets: [
        {
          label: 'Total Dispatches',
          data: totalDispatches,
          backgroundColor: '#096eb4',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Total Dispatches per Dispatcher' }
      },
      scales: {
        x: { title: { display: true, text: 'Dispatcher' } },
        y: { title: { display: true, text: 'Total Dispatches' }, beginAtZero: true }
      }
    }
  });

  // Create Pie Chart - Quantity Moved
  const pieCtx = pieChartRef.value.getContext('2d');
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: dispatcherNames,
      datasets: [
        {
          label: 'Total Quantity Moved',
          data: totalQuantityMoved,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Proportion of Quantity Moved per Dispatcher' }
      }
    }
  });
}

// Watch for changes in props.dispatchData and create charts accordingly
watchEffect(() => {
  if (props.dispatchData.length > 0) {
    createCharts();
  }
});

// Clean up charts on component unmount
onBeforeUnmount(() => {
  destroyCharts();
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Bar Chart -->
    <div>
      <canvas ref="barChartRef" style="width: 100%; height: 400px;"></canvas>
    </div>

    <!-- Pie Chart -->
    <div>
      <canvas ref="pieChartRef" style="width: 100%; height: 400px;"></canvas>
    </div>
  </div>
</template>
