<script setup lang="ts">
defineProps({
  colour: {
    type: String,
    default: '#222222',
  },
})
</script>

<template>
  <i
    class="bi bi-arrow-repeat ml-2 text-xl w-9 h-9 text-center icon-loading"
    :style="{ color: colour }"
    style="padding-top: 3px"
  />
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.icon-loading {
  animation: 1s linear 0s infinite running rotate;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
