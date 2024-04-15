<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  @apply rounded-full py-[1vh] px-[1vw];
  @apply backdrop-blur-sm;
  @apply bg-[#ecf5ff] text-[#409eff] bg-opacity-70;

  .dark & {
    @apply bg-blue-900 text-blue-200 bg-opacity-70;
  }
}
</style>
