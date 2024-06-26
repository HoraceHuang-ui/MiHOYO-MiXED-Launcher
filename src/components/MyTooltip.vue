<script setup lang="ts">
import { computed, defineModel, PropType, ref } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: false,
  },
  placement: {
    type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
    default: 'top',
  },
  maxWidth: {
    type: String,
    default: '300px',
  },
  middle: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const showTooltip = defineModel({
  default: false,
})

const wrapperStyles: Record<string, any> = {
  top: {
    bottom: 'calc(100% + 10px)',
    left: 0,
    right: 0,
  },
  right: {
    top: 0,
    bottom: 0,
    left: 'calc(100% + 10px)',
  },
  bottom: {
    top: 'calc(100% + 10px)',
    left: 0,
    right: 0,
  },
  left: {
    right: 'calc(100% + 10px)',
    top: 0,
    bottom: 0,
    'justify-content': 'right',
  },
}

const wrapperRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
let timer: NodeJS.Timeout | number | undefined = undefined

const transform = computed(() => {
  if (!wrapperRef.value || !dropdownRef.value) return {}
  if (props.placement === 'top' || props.placement === 'bottom') {
    return wrapperRef.value.clientWidth >= dropdownRef.value.clientWidth
      ? {}
      : {
          transform: `translateX(-${((dropdownRef.value.clientWidth - wrapperRef.value.clientWidth) / 2).toFixed(0)}px)`,
        }
  } else {
    return wrapperRef.value.clientHeight >= dropdownRef.value.clientHeight
      ? {}
      : {
          transform: `translateY(-${((dropdownRef.value.clientHeight - wrapperRef.value.clientHeight) / 2).toFixed(0)}px)`,
        }
  }
})

const hideTooltip = () => {
  showTooltip.value = false
  clearTimeout(timer)
  timer = undefined
}

const onMouseEnter = () => {
  if (!showTooltip.value) {
    showTooltip.value = true
  } else {
    clearTimeout(timer)
    timer = undefined
  }
}

const onMouseLeave = () => {
  timer = setTimeout(hideTooltip, 500)
}
</script>

<template>
  <div class="relative">
    <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" ref="wrapperRef">
      <slot />
    </div>

    <Transition name="fade">
      <div
        class="tooltip-wrapper"
        :style="{ ...wrapperStyles[placement], maxWidth: maxWidth }"
        v-if="!disabled && showTooltip"
      >
        <div
          class="tooltip"
          ref="dropdownRef"
          :style="middle ? transform : undefined"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <div v-if="content">{{ content }}</div>
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  @apply absolute w-max flex flex-row z-50;
  @apply min-w-full min-h-full overflow-visible cursor-default;
}

.tooltip {
  @apply p-2 w-fit h-fit text-left rounded-lg;
  @apply bg-opacity-80 bg-black text-gray-100;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
