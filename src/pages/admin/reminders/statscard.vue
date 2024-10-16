<template>
  <div :class="['p-4 rounded-lg custom-shadow tab-button', color]">

    <h3 class="text-lg font-bold">{{ title }}</h3>
    <p class="mt-2 text-2xl">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  color: String,
});
</script>
<style scoped>
.custom-shadow {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.tab-button {
  background-color: white;
  color:  black;
  border: none;
}
</style>