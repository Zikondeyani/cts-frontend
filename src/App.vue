

<template>
  <VersionCheck />
  <router-view />
</template>

<script setup>
import VersionCheck from './components/widgets/VersionCheck.vue'
</script>

<style >
#app {
  height: 100vh;
}
</style>
