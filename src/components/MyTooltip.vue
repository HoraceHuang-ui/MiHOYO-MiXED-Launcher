<script setup lang="ts">
import { PropType, ref } from 'vue'

defineProps({
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

const showTooltip = ref(false)
let timer: NodeJS.Timeout | number | undefined = undefined

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
    <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <slot />
    </div>

    <Transition name="fade">
      <div
        class="absolute min-w-full min-h-full overflow-visible flex flex-row z-50"
        :style="{ ...wrapperStyles[placement], width: maxWidth }"
        v-if="showTooltip"
      >
        <div
          class="p-2 bg-opacity-80 bg-black rounded-lg text-gray-100 w-fit h-fit text-left"
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
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
