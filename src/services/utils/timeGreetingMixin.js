import { ref, computed, onUnmounted, onMounted } from "vue";

export default {
  setup() {
    const currentTime = ref("");
    let timer;

    function updateTime() {
      currentTime.value = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // start the timer
    onMounted(() => {
      updateTime();
      timer = setInterval(updateTime, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    // Dynamic greeting
    const greeting = computed(() => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    });

    // Nicely formatted date
    const today = computed(() =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    return {
      currentTime,
      greeting,
      today,
      updateTime
    };
  },
};
