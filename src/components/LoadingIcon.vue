<script setup lang="ts">
defineProps({
  colour: {
    type: String,
    default: '#222222',
  },
})
</script>

<template>
  <i class="bi bi-arrow-repeat icon-loading" :style="{ color: colour }" />
</template>

<style lang="scss" scoped>
.icon-loading {
  @apply ml-2 w-9 h-9 pt-[3px];
  @apply text-center text-xl;
  animation: 1s linear 0s infinite running rotate;

  .dark & {
    @apply invert;
  }
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
