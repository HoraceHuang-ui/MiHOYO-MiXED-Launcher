<script setup lang="ts">
import { defineModel } from 'vue'

const state = defineModel({
  type: Boolean,
  required: true,
})

defineProps({
  text: {
    type: String,
    default: 'Checkbox',
  },
  onColor: {
    type: String,
    default: '#409EFF',
  },
  offColor: {
    type: String,
    default: '#606266',
  },
})
</script>

<template>
  <div
    @click="state = !state"
    class="wrapper"
    :class="{ selected: state }"
    :style="{ color: state ? onColor : offColor }"
  >
    <i v-if="state" class="bi bi-check-circle-fill" />
    <i v-else class="bi bi-circle" />
    {{ text }}
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-row cursor-pointer;

  &.selected {
    @apply font-bold;
  }

  i {
    @apply mr-1;
  }
}
</style>
