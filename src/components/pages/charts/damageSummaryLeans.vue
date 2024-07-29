<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  commodityDispatchData: Array,
});

const barChartRef = ref(null);

// Predefined set of contrasting colors
const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#E6E6E6', '#B3B3B3', '#666666', '#FF3333', '#33FF33', '#3333FF',
];

const processedPieChartData = computed(() => {
  const commodities = [...new Set(props.commodityDispatchData[0].commoditySummary.map(item => item.commodity))];
  const totalDamaged = props.commodityDispatchData[0].commoditySummary.reduce((acc, item) => acc + item.totalQuantity, 0);

  const distributionPercentages = commodities.map(commodity => {
    const totalForCommodity = props.commodityDispatchData[0].commoditySummary.filter(item => item.commodity === commodity)
      .reduce((acc, item) => acc + item.totalQuantity, 0);
    return (totalForCommodity / totalDamaged * 100).toFixed(2); // Convert to percentage
  });

  return {
    labels: commodities.map(commodity => `${commodity}`),
    datasets: [{
      label: 'Damage Percentage',
      data: distributionPercentages,
      backgroundColor: commodities.map((_, index) => colors[index % colors.length]), // Use the predefined colors
      hoverOffset: 4
    }]
  };
});

const processedBarChartData = computed(() => {
  if (!props.commodityDispatchData[0] || !props.commodityDispatchData[0].districtCommoditySummary) {
    return {
      labels: [],
      datasets: []
    };
  }
  const districts = [...new Set(props.commodityDispatchData[0].districtCommoditySummary.map(item => item.district))];
  const commodities = [...new Set(props.commodityDispatchData[0].districtCommoditySummary.map(item => item.commodity))];

  const dataset = commodities.map((commodity, index) => {
    return {
      label: commodity,
      data: districts.map(district => {
        const item = props.commodityDispatchData[0].districtCommoditySummary.find(dc => dc.district === district && dc.commodity === commodity);
        return item ? item.totalQuantity : 0;
      }),
      backgroundColor: colors[index % colors.length], // Use the predefined colors
    };
  });

  return {
    labels: districts,
    datasets: dataset
  };
});

const processedLineChartData = computed(() => {
  const commodities = [...new Set(props.commodityDispatchData[0].summary.map(item => item.commodity))];

  const dataset = commodities.map(commodity => {
    const data = props.commodityDispatchData[0].summary.filter(item => item.commodity === commodity).map(item => item.totalQuantity);
    const labels = props.commodityDispatchData[0].summary.filter(item => item.commodity === commodity).map(item => item.loadingPlanNumber);
    return {
      label: commodity,
      data: data,
      borderColor: `hsla(${190 + Math.random() * 20}, 70%, 60%, 0.6)`,
      fill: false
    };
  });

  return {
    labels: props.commodityDispatchData[0].summary.map(item => item.loadingPlanNumber),
    datasets: dataset
  };
});

const hasBarChartData = computed(() => {
  return processedBarChartData.value.datasets.length > 0;
});

onMounted(() => {
  if (hasBarChartData.value) {
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
            text: 'Damaged Commodity by District (MT)',
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
  }
});
</script>

<template>
  <div>
    <div v-if="hasBarChartData">
      <canvas ref="barChartRef" style="width: 100%; height: 350px;"></canvas>
    </div>
    <div v-else
      class="flex items-center justify-center border border-gray-300 rounded-md h-64 text-gray-500 text-lg">
      No Data
    </div>
  </div>
</template>
