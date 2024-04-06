<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  @apply rounded-full py-1.5 px-2.5;
  @apply text-sm backdrop-blur-sm;
  @apply bg-[#ecf5ff] text-[#409eff] bg-opacity-70;

  .dark & {
    @apply bg-blue-900 text-blue-200 bg-opacity-70;
  }
}
</style>
