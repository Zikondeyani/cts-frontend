<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
    commodityDistributionData: Array,
});

const chartRef = ref(null);

const processedChartData = computed(() => {
    const labels = [...new Set(props.commodityDistributionData.map(item => item.district))];
    const commodities = [...new Set(props.commodityDistributionData.map(item => item.commodity))];

    const datasets = commodities.map(commodity => ({
        label: commodity,
        backgroundColor: `hsla(${190 + Math.random() * 20}, 70%, 60%, 0.6)`, // Using fully random colors for fun
        data: labels.map(label => {
            const item = props.commodityDistributionData.find(d => d.district === label && d.commodity === commodity);
            return item ? item.distributed : 0;
        })
    }));

    return {
        labels,
        datasets
    };
});

onMounted(() => {
    const ctx = chartRef.value.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: processedChartData.value,
        options: {
            animation: false, // Disable animation
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 16, // Larger font size for ticks
                            style: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quantity Distributed (MT)',
                        font: {
                            size: 16,
                            style: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 14, // Larger font size for ticks
                            style: 'bold'
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14 // Bigger font for legend
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    bodyFont: {
                        size: 14 // Larger font size for tooltips
                    },
                    titleFont: {
                        size: 16, // Larger font size for tooltips
                        style: 'bold'
                    }
                },
                title: {
                    display: true,
                    text: 'Quantity Distributed (MT)',
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
            return value > 0 ? `${value}` : null; // Display percentage for non-zero values, null for zero values
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
    <!-- Adjusted canvas size via inline styling for better visibility -->
    <canvas ref="chartRef" style="width: 100%; height: 400px;"></canvas>
</template>

<style scoped>
canvas {
    max-width: 100%;
    height: auto !important;
    /* Ensures the height is respected */
}
</style>
