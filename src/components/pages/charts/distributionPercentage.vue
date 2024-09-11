<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  commodityDistributionData: Array,
});

const chartRef = ref(null);

const processedChartData = computed(() => {
  const commodities = [...new Set(props.commodityDistributionData.map(item => item.commodity))];
  const totalDistributed = props.commodityDistributionData.reduce((acc, item) => acc + item.distributed, 0).toFixed(2);

  const distributionPercentages = commodities.map(commodity => {
    const totalForCommodity = props.commodityDistributionData.filter(item => item.commodity === commodity)
      .reduce((acc, item) => acc + item.distributed, 0);
    return (totalForCommodity / totalDistributed * 100).toFixed(2); // Convert to percentage
  });

  return {
    labels: commodities.map(commodity => `${commodity}`),
    datasets: [{
      label: 'Distribution Percentage (%)',
      data: distributionPercentages,
      backgroundColor: commodities.map(() => `hsla(${190 + Math.random() * 20}, 70%, 60%, 0.6)`), // More varied colors
      hoverOffset: 4
    }]
  };
});

onMounted(() => {
  const ctx = chartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: processedChartData.value,
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
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}%`;
            }
          }
        },
        title: {
          display: true,
          text: 'Commodity Type Distributed (%)',
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
  <canvas ref="chartRef" style="width: 100%; height: 500px;"></canvas>
</template>
