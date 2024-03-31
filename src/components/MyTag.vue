<script setup lang="ts">
defineProps({
  bgColor: {
    type: String,
    default: 'ECF5FF',
  },
  fgColor: {
    type: String,
    default: '409EFF',
  },
})
</script>

<template>
  <div
    class="wrapper"
    :style="{ backgroundColor: `#${bgColor}CC`, color: `#${fgColor}` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  @apply rounded-full py-1.5 px-2.5;
  @apply text-sm backdrop-blur-sm;
}
</style>
