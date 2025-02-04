<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js modules
Chart.register(...registerables);
Chart.register(ChartDataLabels);  // Register the plugin for data labels

// Refs for chart canvases
const parabolaChartRef = ref(null);

// Feeder dataset
const props = defineProps({
  allocationData: {
    type: Array,
    required: true,
  }
});

// Initialize chart
let parabolaChart = null;

// Function to create charts
function createCharts() {
  if (!parabolaChartRef.value) return;

  const ctx = parabolaChartRef.value.getContext('2d');
  parabolaChartRef.value.height = 300;

  const districtLabels = props.allocationData.map(item => item.district);
  const commodities = [...new Set(props.allocationData.map(item => item.commodity))];  // Get unique commodities

  const datasets = commodities.map((commodity, index) => {
    const commodityData = props.allocationData.filter(item => item.commodity === commodity);
    const allocationDataPoints = commodityData.map(item => item.tonnageAllocation.toFixed(2));

    // Define unique color for each commodity (can be customized)
    const colors = ['#248cd6', '#d62472', '#ffbb33', '#55d624'];  // Example color set
    const color = colors[index % colors.length];

    return {
      label: `${commodity} Allocations (MT)`,
      data: allocationDataPoints,
      borderColor: color,
      backgroundColor: color,  // For fill
      fill: false,
      tension: 0.4,
      pointRadius: 5,
      datalabels: {
        display: false,
        color: 'gray',
        align: 'top',
      }
    };
  });

  // Destroy the existing chart if it exists before creating a new one
  if (parabolaChart) {
    parabolaChart.destroy();
  }

  // Create the chart
  parabolaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: districtLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Commodity Allocations per District Over Time' },
        datalabels: {
          display: false,
          color: 'gray',
          align: 'top',
        }
      },
      scales: {
        x: { title: { display: true, text: 'District' } },
        y: { title: { display: true, text: 'Tonnage Allocation' }, beginAtZero: true }
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItems) {
            return `District: ${tooltipItems[0].label}`;
          },
          label: function(tooltipItem) {
            const datasetIndex = tooltipItem.datasetIndex;
            const dataset = parabolaChart.data.datasets[datasetIndex];
            return `Tonnage: ${tooltipItem.raw} (Commodity: ${dataset.label})`;
          }
        }
      }
    }
  });
}

// Watch for changes in allocationData and recreate the chart
watch(() => props.allocationData, createCharts, { immediate: true });

// Watch for changes and create charts
onMounted(() => {
  createCharts();
  window.scrollTo({ bottom: 0, behavior: 'smooth' });

});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (parabolaChart) {
    parabolaChart.destroy();
  }
  window.scrollTo({ bottom: 0, behavior: 'smooth' });

});
</script>

<template>
  <div>
    <!-- Parabola chart for allocations per district -->
    <div>
      <canvas ref="parabolaChartRef" width="100%" height="150px"></canvas>
    </div>
  </div>
</template>
