<script setup lang="ts">
import { defineModel } from 'vue'

const state = defineModel({
  type: Boolean,
})
const emit = defineEmits(['change'])

const valueChange = () => {
  state.value = !state.value
  emit('change')
}
</script>

<template>
  <div
    class="wrapper"
    @click="valueChange"
    :class="state ? 'enabled' : 'disabled'"
  >
    <div class="oval" :class="state ? 'enabled' : 'disabled'"></div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply relative h-8 w-14 rounded-full;
  @apply border-2 transition-all cursor-pointer;

  &.enabled {
    @apply bg-blue-500 border-blue-500;
  }
  &.disabled {
    @apply bg-white border-blue-200;
  }
}

.oval {
  @apply absolute w-5 h-5 top-1 bottom-1;
  @apply rounded-full transition-all;

  &.enabled {
    @apply left-7 bg-white;
  }
  &.disabled {
    @apply left-1 bg-blue-500;
  }
}
</style>
