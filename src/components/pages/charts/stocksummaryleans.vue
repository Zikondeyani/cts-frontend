<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  leanStockSummary: Array,
});

const pieChartRef = ref(null);
const processedPieChartData = computed(() => {
  const commodities = props.leanStockSummary.map(item => item.commodityName);
  const totalStockPlanned = props.leanStockSummary.reduce((acc, item) => acc + item.totalStockPlanned, 0);

  const distributionPercentages = props.leanStockSummary.map(item => (item.totalStockPlanned / totalStockPlanned * 100).toFixed(2));

  return {
    labels: commodities,
    datasets: [{
      label: 'Stock Planned Percentage',
      data: distributionPercentages,
      backgroundColor: commodities.map(() => `hsla(${190 + Math.random() * 20}, 70%, 60%, 0.6)`), // More varied colors
      hoverOffset: 4
    }]
  };
});



onMounted(() => {
  const pieCtx = pieChartRef.value.getContext('2d');
  new Chart(pieCtx, {
    type: 'pie',
    data: processedPieChartData.value,
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
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}%`;
            }
          }
        },
        title: {
          display: true,
          text: 'Commodity Stock Planned Percentage',
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
      }
    }
  });

 
});
</script>

<template>
  <div>
    <canvas ref="pieChartRef" style="width: 100%; height: 500px;"></canvas>
  </div>
</template>
