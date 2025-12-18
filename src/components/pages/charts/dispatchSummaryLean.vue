<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  commodityDispatchData: Array,
});

const barChartRef = ref(null);
let chartInstance = null;

// Function to build chart data
function getChartData() {
  if (!props.commodityDispatchData || props.commodityDispatchData.length === 0) {
    return { datasets: [] };
  }

  const districts = [...new Set(props.commodityDispatchData.map(item => item.district))];

  const dispatchData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.dispatchCompletion : 0;
  });

  const receiptData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? Math.min(data.receiptCompletion, 100) : 0;
  });

  return {
    labels: districts,
    datasets: [
      {
        label: 'Dispatch Completion (%)',
        data: dispatchData,
        backgroundColor: '#096eb4',
        stack: 'stack1'
      },
      {
        label: 'Receipt Completion (%)',
        data: receiptData,
        backgroundColor: 'rgba(11, 138, 216, 0.6)',
        stack: 'stack1'
      }
    ]
  };
}

function renderChart() {
  const ctx = barChartRef.value.getContext('2d');
  const chartData = getChartData();

  if (chartInstance) {
    chartInstance.data = chartData;
    chartInstance.update('none'); // Update chart without animation for smooth refresh
  } else {
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { padding: 20, font: { size: 12 } } },
          tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}%` } },
          title: {
            display: true,
            text: 'Dispatch and Receipt Completion',
            font: { size: 12 },
            padding: { top: 10, bottom: 30 }
          },
          datalabels: { display: false },
        },
        scales: {
          x: { stacked: true, title: { display: true, text: 'District' } },
          y: {
            stacked: true,
            title: { display: true, text: 'Completion (%)' },
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` }
          }
        }
      }
    });
  }
}

onMounted(() => renderChart());

// Watch prop changes to refresh chart
watch(() => props.commodityDispatchData, () => renderChart(), { deep: true });

onBeforeUnmount(() => chartInstance?.destroy());
</script>

<template>
  <div>
    <canvas ref="barChartRef" style="width: 100%; height: 400px;"></canvas>
  </div>
</template>
