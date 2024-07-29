<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  leanStockSummary: Array,
});

const barChartRef = ref(null);

// Predefined set of contrasting colors
const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#E6E6E6', '#B3B3B3', '#666666', '#FF3333', '#33FF33', '#3333FF',
];

const processedPieChartData = computed(() => {
  const commodities = props.leanStockSummary.map(item => item.commodityName);
  const totalStockPlanned = props.leanStockSummary.reduce((acc, item) => acc + item.totalStockPlanned, 0);

  const distributionPercentages = props.leanStockSummary.map(item => (item.totalStockPlanned / totalStockPlanned * 100).toFixed(2));

  return {
    labels: commodities,
    datasets: [{
      label: 'Stock Planned Percentage',
      data: distributionPercentages,
      backgroundColor: commodities.map((_, index) => colors[index % colors.length]), // Use the predefined colors
      hoverOffset: 4
    }]
  };
});

const processedBarChartData = computed(() => {
  const commodities = props.leanStockSummary.map(item => item.commodityName);
  const totalBalances = props.leanStockSummary.map(item => item.totalBalance);

  return {
    labels: commodities,
    datasets: [{
      label: 'Total Tonnage pending receipt',
      data: totalBalances,
      backgroundColor: commodities.map((_, index) => colors[index % colors.length]), // Use the predefined colors
    }]
  };
});

const processedLineChartData = computed(() => {
  const commodities = props.leanStockSummary.map(item => item.commodityName);
  const dispatchPercentages = props.leanStockSummary.map(item => item.dispatchPercentage.toFixed(2));

  return {
    labels: commodities,
    datasets: [{
      label: 'Dispatch Percentage',
      data: dispatchPercentages,
      borderColor: commodities.map(() => `hsla(${190 + Math.random() * 20}, 70%, 60%, 0.6)`), // More varied colors
      fill: false
    }]
  };
});

onMounted(() => {
  const barCtx = barChartRef.value.getContext('2d');
  new Chart(barCtx, {
    type: 'bar',
    data: processedBarChartData.value,
    options: {
      responsive: true,
      animation: false, // Disable animation
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Total Balance Pending Receipt (MT)',
          font: {
            size: 16
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        datalabels: {
          color: function (context) {
            const value = context.dataset.data[context.dataIndex];
            return value > 0 ? '#666' : 'rgba(0,0,0,0)'; // Gray text for non-zero values, transparent for zero values
          },
          backgroundColor: '#fff', // White background
          borderColor: '#ccc', // Gray border color
          borderWidth: 1, // Border width (adjust as needed)
          borderRadius: 10, // Border radius to make it round
          formatter: (value, context) => {
            return value > 0 ? `${value}MT` : null; // Display percentage for non-zero values, null for zero values
          },
          font: {
            weight: 'bold',
            size: 12
          },
          align: 'center',
          anchor: 'center',
          padding: {
            top: 2,
            bottom: 2
          }
        }

      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' MT';
            }
          },
          suggestedMax: Math.max(...processedBarChartData.value.datasets.flatMap(dataset => dataset.data)) + 1000
        }
      },
    }
  });
});
</script>

<template>
  <div>
    <canvas ref="barChartRef" style="width: 100%; height: 350px;"></canvas>
  </div>
</template>
