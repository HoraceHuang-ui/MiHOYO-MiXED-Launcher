<script setup lang="ts"></script>

<template>
  <div class="link">
    <slot />
  </div>
</template>

<style scoped>
.link {
  @apply cursor-pointer underline-offset-2;
  @apply text-blue-500 hover:underline active:text-yellow-500;
}
</style>
