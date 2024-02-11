<template>
  <div class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50" v-show="open">
    <span
      class="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0"
      style="top: 50%"
    >
   <div class="lds-facebook"><div></div><div></div><div></div></div>
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
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: rgb(0, 0, 0);
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}


</style>