<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  commodityDispatchData: Array,
});

const barChartRef = ref(null);


const processedBarChartData = computed(() => {
  if (props.commodityDispatchData.length === 0) {
    return { datasets: [] }; // Return an empty dataset if no flattened data
  }

  const districts = [...new Set(props.commodityDispatchData.map(item => item.district))];

  const dispatchData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.dispatchCompletion : 0;
  });

  const receiptData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.receiptCompletion : 0;
  });

  return {
    labels: districts,
    datasets: [
      {
        label: 'Dispatch Completion (%)',
        data: dispatchData,
        backgroundColor: '#096eb4', // Primary shade of blue for dispatched
        stack: 'stack1'
      },
      {
        label: 'Receipt Completion (%)',
        data: receiptData,
        backgroundColor: '#0b8ad8', // Lighter shade of blue for received
        stack: 'stack1'
      }
    ]
  };
});

onMounted(() => {
  const barCtx = barChartRef.value.getContext('2d');
  new Chart(barCtx, {
    type: 'bar',
    data: processedBarChartData.value,
    options: {
      responsive: true,
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
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
            }
          }
        },
        title: {
          display: true,
          text: 'Dispatch and Receipt Completion',
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
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'District'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Completion (%)'
          },
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value}%` // Display percentage on y-axis
          }
        }
      }
    }
  });
});
</script>

<template>
  <div>
    <canvas ref="barChartRef" style="width: 100%; height: 400px;"></canvas>
  </div>
</template>
