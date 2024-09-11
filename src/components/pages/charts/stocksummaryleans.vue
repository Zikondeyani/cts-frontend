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
  const totalStockPlanned = props.leanStockSummary.reduce((acc, item) => acc + item.totalStockPlanned, 0).toFixed(2);

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
          display: false, // Completely hide datalabels
        },
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
