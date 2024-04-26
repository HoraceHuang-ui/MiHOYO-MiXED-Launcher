<script setup lang="ts">
import { computed, defineModel, ref } from 'vue'

const state = defineModel({
  type: Boolean,
  required: true,
})

const props = defineProps({
  leftText: {
    type: String,
    required: true,
  },
  rightText: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])

const max = (a: number, b: number) => (a > b ? a : b)

const leftRef = ref<HTMLElement>()
const rightRef = ref<HTMLElement>()

const unitWidth = computed(() => {
  if (!leftRef.value || !rightRef.value) return 0
  return max(leftRef.value.scrollWidth, rightRef.value.scrollWidth) + 10
})

const sliderTransform = computed(() => {
  return {
    transform: state.value
      ? 'translateX(0)'
      : `translateX(calc(${unitWidth.value}px + 5px))`,
  }
})

const switchState = () => {
  state.value = !state.value
  emit('change')
}
</script>

<template>
  <div
    class="main-wrapper"
    :style="{ width: `calc(${unitWidth}px * 2 + 10px)` }"
    @click="switchState"
  >
    <div
      class="slider"
      :style="{ width: `calc(${unitWidth}px + 5px)`, ...sliderTransform }"
    ></div>
    <div
      ref="leftRef"
      class="selection-text left"
      :class="{ selected: state }"
      :style="{ width: `${unitWidth}px` }"
    >
      {{ leftText }}
    </div>
    <div
      ref="rightRef"
      class="selection-text right"
      :class="{ selected: !state }"
      :style="{ width: `${unitWidth}px` }"
    >
      {{ rightText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply flex flex-row ml-3 relative;
  @apply rounded-full cursor-pointer;
  padding: 2px 0;
}

.slider {
  @apply absolute top-0 bottom-0 z-0;
  @apply rounded-full bg-blue-500 transition-all;

  .dark & {
    @apply bg-blue-700;
  }
}

.selection-text {
  @apply absolute z-10;
  @apply rounded-full text-center text-nowrap transition-all;

  &.left {
    @apply left-0;
  }
  &.right {
    @apply right-0;
  }

  &.selected {
    @apply text-white;
  }
}
</style>
