<script setup lang="ts">
import { PropType, ref } from 'vue'
import ScrollWrapper from './ScrollWrapper.vue'
import MyCarousel from './MyCarousel.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  tabs: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const panesWrapper = ref()

const selectTab = (idx: number) => {
  if (idx == props.modelValue) {
    return
  }
  panesWrapper.value?.setPane?.(idx)
  emit('update:modelValue', idx)
}
</script>

<template>
  <div class="p-2">
    <ScrollWrapper show-bar="hover" height="fit-content" class="mt-1">
      <div class="flex flex-row pb-2">
        <div
          v-for="(tabText, idx) in tabs"
          class="mx-1 rounded-full px-3 py-0.5 transition-all"
          :class="idx == modelValue ? 'tab-selected' : 'tab-unselected'"
          @click="selectTab(idx)"
          :key="idx"
        >
          {{ tabText }}
        </div>
      </div>
    </ScrollWrapper>
    <MyCarousel
      class="relative w-full h-full"
      ref="panesWrapper"
      animation="fade-swipe"
      show-arrow="never"
      :autoplay="false"
    >
      <slot />
    </MyCarousel>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.tab-selected {
  @apply text-white bg-blue-600 cursor-default;
}

.tab-unselected {
  @apply cursor-pointer hover:bg-blue-100 hover:text-blue-600;
}
</style>
