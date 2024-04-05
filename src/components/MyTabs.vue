<script setup lang="ts">
import { defineModel, PropType, ref } from 'vue'
import ScrollWrapper from './ScrollWrapper.vue'
import MyCarousel from './MyCarousel.vue'

const tabIdx = defineModel({
  type: Number,
  required: true,
})

const props = defineProps({
  tabs: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const panesWrapper = ref()

const selectTab = (idx: number) => {
  if (idx == tabIdx.value) {
    return
  }
  panesWrapper.value?.setPane?.(idx)
  tabIdx.value = idx
}
</script>

<template>
  <div class="main-wrapper">
    <ScrollWrapper show-bar="hover" height="fit-content" class="mt-1">
      <div class="tabs-wrapper">
        <div
          v-for="(tabText, idx) in tabs"
          class="tab"
          :class="idx == tabIdx ? 'selected' : 'unselected'"
          @click="selectTab(idx)"
          :key="idx"
        >
          {{ tabText }}
        </div>
      </div>
    </ScrollWrapper>
    <MyCarousel
      class="carousel"
      ref="panesWrapper"
      animation="fade-swipe"
      show-arrow="never"
      :autoplay="false"
    >
      <slot />
    </MyCarousel>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply pt-2;
}

.tabs-wrapper {
  @apply flex flex-row;
}

.tab {
  @apply mx-1 px-3 py-0.5;
  @apply rounded-full transition-all;

  &.selected {
    @apply text-white bg-blue-600 cursor-default;
  }
  &.unselected {
    @apply cursor-pointer hover:bg-blue-100 hover:text-blue-600;
  }
}

.carousel {
  @apply relative w-full h-full;
}
</style>
