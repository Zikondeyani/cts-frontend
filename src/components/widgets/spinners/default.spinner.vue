<template>
  <div class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50" v-show="open">
    <span
      class="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0"
      style="top: 50%"
    >
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </span>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, defineProps, toRefs } from "vue";
//DECLARATIONS
const props = defineProps({
  open: Boolean,
});
//VARIABLES
const { open } = toRefs(props);
</script>
<style lang="scss" scoped>
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid rgb(0, 0, 0);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: rgb(0, 0, 0) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: 3s;
}
.lds-ring div:nth-child(2) {
  animation-delay: 3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: 3s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>