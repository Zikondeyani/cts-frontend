<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const chartData = ref(null);
const chartRef = ref(null);

onMounted(() => {
    const ctx = chartRef.value.getContext('2d');
    chartData.value = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Monthly Dispatches',
                data: [450, 60, 70, 80, 50, 60, 70, 80, 50, 160, 70, 80],
                backgroundColor: [
                    'rgba(9, 110, 180, 0.9)',  // darker shade
                    'rgba(9, 110, 180, 0.8)',
                    'rgba(9, 110, 180, 0.7)',
                    'rgba(9, 110, 180, 0.6)',
                    'rgba(9, 110, 180, 0.5)',  // original
                    'rgba(9, 110, 180, 0.4)',
                    'rgba(9, 110, 180, 0.7)',
                    'rgba(9, 110, 180, 0.8)',
                    'rgba(9, 110, 180, 0.9)',
                    'rgba(9, 110, 180, 0.6)',
                    'rgba(9, 110, 180, 0.5)',
                    'rgba(9, 110, 180, 0.4)'
                ],
                borderColor: 'rgb(9, 110, 180)', // consistent border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%'
        }
    });
});
</script>

<template>
    <canvas ref="chartRef"></canvas>
</template>
