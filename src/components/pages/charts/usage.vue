<script setup>
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js modules
Chart.register(...registerables);

// Refs for chart canvases
const barChartRef = ref(null);
const pieChartRef = ref(null);
const statsChartRef = ref(null);
const usageChartRef = ref(null);

// Props received from the parent component
const props = defineProps({
  logsData: {
    type: Array,
    required: true,
  }
});

// Reactive state for selected action
const selectedAction = ref('');

// Available actions (for the dropdown)
const actions = ['LOGIN', 'CREATE_DISPATCH', 'UPDATE_LOADINGPLAN', 'CREATE_LOADINGPLAN', 'CREATE_RECEIPT'];

// Track current charts
let barChart = null;
let pieChart = null;
let statsChart = null;
let usageChart = null;

// New statistics
const totalLogs = ref(0);
const successPercentage = ref(0);
const failurePercentage = ref(0);
const averageFrequency = ref(0);

// Utility to destroy existing charts
function destroyCharts() {
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();
  if (statsChart) statsChart.destroy();
  if (usageChart) usageChart.destroy();
}

// Function to initialize charts
function createCharts() {
  if (!barChartRef.value || !pieChartRef.value || !usageChartRef.value || !statsChartRef.value) return;

  // Destroy any existing charts
  destroyCharts();

  // Filter logs based on selected action
  const filteredLogs = props.logsData.filter(item => item.action === selectedAction.value);

  // Initialize counters for actions and statuses
  const actionCounts = {};
  let successCount = 0;
  let failureCount = 0;

  // Process filtered logs data to count actions and statuses
  filteredLogs.forEach(item => {
    const action = item.action;
    const status = item.status;

    // Count the frequency of each action
    if (!actionCounts[action]) {
      actionCounts[action] = 0;
    }
    actionCounts[action]++;

    // Count success and failure actions
    if (status) {
      successCount++;
    } else {
      failureCount++;
    }
  });

  // Update statistics
  totalLogs.value = filteredLogs.length;
  successPercentage.value = (successCount / totalLogs.value) * 100;
  failurePercentage.value = (failureCount / totalLogs.value) * 100;
  averageFrequency.value = filteredLogs.length / Object.keys(actionCounts).length;

  // Prepare data for Bar Chart (Action counts)
  const actionLabels = Object.keys(actionCounts);
  const actionFrequency = actionLabels.map(action => actionCounts[action]);

  // Prepare data for Pie Chart (Success vs Failure)
  const pieLabels = ['Success', 'Failure'];
  const pieData = [successCount, failureCount];

  // Create Bar Chart - Frequency of Actions
  const barCtx = barChartRef.value.getContext('2d');
  barChartRef.value.height = 300;  // Control chart height (adjust as needed)
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: actionLabels,
      datasets: [
        {
          label: 'Frequency of Actions',
          data: actionFrequency,
          backgroundColor: '#096eb4',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Action Frequency' }
      },
      scales: {
        x: { title: { display: true, text: 'Action' } },
        y: { title: { display: true, text: 'Frequency' }, beginAtZero: true }
      }
    }
  });

  // Create Pie Chart - Success vs Failure
  const pieCtx = pieChartRef.value.getContext('2d');
  pieChartRef.value.height = 300;  // Control chart height (adjust as needed)
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: pieLabels,
      datasets: [
        {
          label: 'Success vs Failure',
          data: pieData,
          backgroundColor: ['#4CAF50', '#FF6347'], // Green for Success, Red for Failure
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Success vs Failure Actions' }
      }
    }
  });

  // Failure Trend Line Chart
  const failureTrend = filteredLogs
    .filter(item => !item.status)
    .map(item => {
      const date = new Date(item.created);
      return { month: date.toLocaleString('default', { month: 'short' }), count: 1 };
    })
    .reduce((acc, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + curr.count;
      return acc;
    }, {});

  // Create Stats Chart - Success vs Failure Percentage
  const statsCtx = statsChartRef.value.getContext('2d');
  statsChart = new Chart(statsCtx, {
    type: 'line',
    data: {
      labels: Object.keys(failureTrend),
      datasets: [
        {
          label: 'Failed Actions Trend',
          data: Object.values(failureTrend),
          borderColor: '#FF0000',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: `Failed Actions Trend` },
      },
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Failure Count' }, beginAtZero: true },
      },
    },
  });


  // Create Line Chart - Peak Usage Times
const usageData = filteredLogs.map(item => ({
  time: new Date(item.created).getHours(), // Hour of the day
  actionCount: 1
}));

// Initialize usageCounts for all 24 hours of the day (0-23)
const usageCounts = Array(24).fill(0); // Fill array with zeros initially

// Count the occurrences of actions for each hour
usageData.forEach(item => {
  usageCounts[item.time]++; // Increment count for the specific hour
});

// Filter out inactive hours (those with zero count)
const activeHours = usageCounts
  .map((count, hour) => ({ hour, count })) // Create an array of {hour, count}
  .filter(item => item.count > 0); // Only keep hours with usage

// Prepare data for Usage Frequency chart
const usageLabels = activeHours.map(item => {
  const hour = item.hour;
  return hour >= 12 ? `${hour - 12 || 12} PM` : `${hour || 12} AM`; // Convert to 12-hour format
});

const usageFrequency = activeHours.map(item => item.count);

const usageCtx = usageChartRef.value.getContext('2d');
usageChartRef.value.height = 350; // Control chart height (adjust as needed)

let blinkState = true; // Variable to control the blinking

// Helper function to generate blinking colors
const generateBlinkingColors = (length, highlightIndex) => {
  const activeColor = '#FF9800'; // Color when blinking on
  const inactiveColor = '#FF0000'; // Color when blinking off
  return Array(length)
    .fill('')
    .map((_, index) =>
      index === highlightIndex
        ? blinkState
          ? activeColor
          : inactiveColor
        : activeColor
    );
};

// Create the chart
usageChart = new Chart(usageCtx, {
  type: 'line',
  data: {
    labels: usageLabels,
    datasets: [
      {
        label: 'Usage Frequency by Hour',
        data: usageFrequency,
        fill: false,
        borderColor: '#FF9800',
        tension: 0.4,
        pointRadius: 6, // Size of the points
        pointHoverRadius: 8, // Size when hovering
        pointBackgroundColor: generateBlinkingColors(usageFrequency.length, -1),
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Peak Usage Times' }
    },
    scales: {
      x: { title: { display: true, text: 'Hour of the Day' } },
      y: { title: { display: true, text: 'Frequency' }, beginAtZero: true }
    }
  }
});

// Set up blinking effect
setInterval(() => {
  blinkState = !blinkState; // Toggle blink state
  usageChart.data.datasets[0].pointBackgroundColor = generateBlinkingColors(
    usageFrequency.length,
    usageFrequency.indexOf(Math.max(...usageFrequency)) // Highlight the max usage point
  );
  usageChart.update(); // Update the chart
}, 500); // Blink interval in milliseconds


}

// Watch for changes in selected action and recreate charts
watchEffect(() => {
  if (selectedAction.value) {
    createCharts();
  } else {
    destroyCharts();
  }
});
</script>

<template>
  <div>
    <!-- Dropdown to select action -->
    <div class="mb-4">
      <label for="actionSelect" class="block text-gray-700">Select Action</label>
      <select id="actionSelect" v-model="selectedAction" class="w-full p-2 border rounded-lg">
        <option value="">Choose an action</option>
        <option v-for="action in actions" :key="action" :value="action">{{ action }}</option>
      </select>
    </div>

    <!-- Message if no action selected -->
    <div v-if="!selectedAction"
      class="text-center text-gray-600 font-semibold mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <p>Please select an action to view the stats. <span class="font-medium text-blue-500">Choose from the dropdown
          above.</span></p>
    </div>

    <!-- Usage chart -->
    <div v-if="selectedAction">
      <canvas ref="usageChartRef" height="100px" width="100%"></canvas>
      <hr class="my-2">
    </div>

    <!-- Stats charts and Pie chart in the same row -->
    <div v-if="selectedAction" class="flex space-x-4">
      <div>
        <canvas ref="barChartRef"></canvas>
      </div>
      <div>
        <canvas ref="pieChartRef"></canvas>
      </div>
      <div>
        <canvas ref="statsChartRef" height="200px"></canvas>
      </div>
    </div>


  </div>
</template>
