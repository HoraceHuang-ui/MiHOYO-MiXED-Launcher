<script setup lang="ts">
import { computed, PropType, ref } from 'vue'

const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  itemClass: {
    type: String,
  },
  placement: {
    type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
    default: 'bottom',
  },
  width: {
    type: String,
    default: 'max-content',
  },
  selected: {
    type: Number,
    default: -1,
  },
  middle: {
    type: Boolean,
    default: false,
  },
  trigger: {
    type: String as PropType<'hover' | 'click'>,
    default: 'hover',
  },
})

const emit = defineEmits(['command'])

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

const showMenu = ref(false)
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

const hideMenu = () => {
  showMenu.value = false
  clearTimeout(timer)
  timer = undefined
}

const onMouseEnter = () => {
  if (props.trigger === 'click') return

  if (!showMenu.value) {
    showMenu.value = true
  } else {
    clearTimeout(timer)
    timer = undefined
  }
}

const onMouseEnterMenu = () => {
  clearTimeout(timer)
  timer = undefined
}

const mouseClick = () => {
  showMenu.value = !showMenu.value
}

const onMouseLeave = () => {
  timer = setTimeout(hideMenu, 500)
}

const sendCommand = (idx: number) => {
  emit('command', idx)
  hideMenu()
}
</script>

<template>
  <div class="main-wrapper">
    <div
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      ref="wrapperRef"
      @click="mouseClick"
    >
      <slot />
    </div>

    <Transition name="fade">
      <div
        class="dropdown-wrapper"
        :style="{ ...wrapperStyles[placement], width: width }"
        v-if="showMenu"
        ref="dropdownRef"
      >
        <div
          class="items-wrapper"
          :style="middle ? transform : undefined"
          @mouseenter="onMouseEnterMenu"
          @mouseleave="onMouseLeave"
        >
          <div
            v-for="(item, idx) in items"
            class="item"
            :class="[{ selected: idx === selected }, itemClass]"
            @click="sendCommand(idx)"
            :key="idx"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply relative;
}

.dropdown-wrapper {
  @apply absolute z-50;
  @apply min-w-full overflow-visible flex flex-row;
}

.items-wrapper {
  @apply px-1 py-0.5 w-fit h-fit min-w-full;
  @apply bg-white rounded-xl;
  @apply text-center text-nowrap shadow-md;

  .dark & {
    @apply bg-[#222];
  }
}

.item {
  @apply py-1 px-2 my-0.5;
  @apply rounded-lg cursor-default transition-all;
  @apply hover:bg-yellow-100 hover:text-yellow-600;
  @apply active:bg-yellow-400 active:text-yellow-800;

  .dark & {
    @apply hover:bg-yellow-900 hover:text-yellow-400;
    @apply active:bg-yellow-600 active:text-yellow-400;
  }

  &.selected {
    @apply bg-yellow-100 text-yellow-600;

    .dark & {
      @apply bg-yellow-900 text-yellow-400;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
</style>
