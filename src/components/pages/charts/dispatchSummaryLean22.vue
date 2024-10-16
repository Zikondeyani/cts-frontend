<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const props = defineProps({
  commodityDispatchData: Array,
});

const barChartRef = ref(null);


const processedBarChartData = computed(() => {
  if (props.commodityDispatchData.length === 0) {
    return { datasets: [] }; // Return an empty dataset if no flattened data
  }

  const districts = [...new Set(props.commodityDispatchData.map(item => item.district))];

  const tonnageAllocationData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.tonnageAllocation.toFixed(2) : 0;
  });

  const dispatchedData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.totalDispatched.toFixed(2) : 0;
  });

  const receivedData = districts.map(district => {
    const data = props.commodityDispatchData.find(item => item.district === district);
    return data ? data.totalReceived.toFixed(2) : 0;
  });

  return {
    labels: districts,
    datasets: [
      {
        label: 'Tonnage Allocation',
        data: tonnageAllocationData,
        backgroundColor: '#096eb4', // Primary shade for allocation
      },
      {
        label: 'Total Dispatched',
        data: dispatchedData,
        backgroundColor: '#0b8ad8', // Lighter shade of #096eb4 for dispatched
      },
      {
        label: 'Total Received',
        data: receivedData,
        backgroundColor: '#0aa0f5', // Even lighter shade of #096eb4 for received
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
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw} MT`;
            }
          }
        },
        title: {
          display: true,
          text: 'Tonnage Allocation vs. Dispatched and Received',
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
        plugins: {
          tooltip: {
            enabled: true, // Show tooltip on hover
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} MT`;
              }
            }
          }
        }



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
            text: 'Quantity (MT)'
          },
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} MT` // Display quantity on y-axis
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
