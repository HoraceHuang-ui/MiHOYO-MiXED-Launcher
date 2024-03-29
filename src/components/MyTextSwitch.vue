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
    class="ml-3 rounded-full flex flex-row py-1 bg-white relative cursor-pointer"
    :style="{ width: `calc(${unitWidth}px * 2 + 10px)` }"
    @click="switchState"
  >
    <div
      class="rounded-full bg-blue-500 absolute top-0 bottom-0 z-0 transition-all"
      :style="{ width: `calc(${unitWidth}px + 5px)`, ...sliderTransform }"
    ></div>
    <div
      ref="leftRef"
      class="rounded-full absolute z-10 left-0 text-center transition-all text-nowrap"
      :class="{ 'text-white': state }"
      :style="{ width: `${unitWidth}px` }"
    >
      {{ leftText }}
    </div>
    <div
      ref="rightRef"
      class="rounded-full absolute z-10 right-0 text-center transition-all text-nowrap"
      :class="{ 'text-white': !state }"
      :style="{ width: `${unitWidth}px` }"
    >
      {{ rightText }}
    </div>
  </div>
</template>

<style scoped></style>
