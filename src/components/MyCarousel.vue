<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { useTimeout } from '../utils/timeout'

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: true,
  },
  autoplayInterval: {
    type: Number,
    default: 5000,
  },
  showArrow: {
    type: String as PropType<'always' | 'hover' | 'never'>,
    default: 'hover',
  },
  showIndicator: {
    type: String as PropType<'always' | 'hover' | 'never'>,
    default: 'never',
  },
  animation: {
    type: String as PropType<'swipe' | 'fade-swipe'>,
    default: 'swipe',
  },
})

const curIdx = ref(0)
const hoverShowArrow = ref(false)
const hoverShowIndicator = ref(false)

let autoplayTimer: NodeJS.Timer | number | undefined = undefined

const panesWrapper = ref<HTMLDivElement>()
const panes = computed(() => {
  if (panesWrapper.value) {
    if (props.autoplay) {
      if (!autoplayTimer) {
        autoplayTimer = setInterval(nextPane, props.autoplayInterval)
      }
    }
    return panesWrapper.value.children
  }
  return null
})

const refreshState = () => {
  if (panes.value) {
    for (let i = 0; i < panes.value.length; i++) {
      ;(panes.value.item(i) as HTMLElement)!.style.position = 'absolute'
      ;(panes.value.item(i) as HTMLElement)!.style.top = '0'
      ;(panes.value.item(i) as HTMLElement)!.style.left = '0'
      ;(panes.value.item(i) as HTMLElement)!.style.transition = 'all 0.4s ease'
      // (panes.value.item(i) as HTMLElement)!!.style.width = `${panesWrapper.value!!.clientWidth}px`;
      if (i == curIdx.value) {
        continue
      }
      ;(panes.value.item(i) as HTMLElement)!.style.transform =
        `translateX(${panesWrapper.value?.clientWidth}px)`
      ;(panes.value.item(i) as HTMLElement)!.style.display = 'none'
    }
  }
}

const nextPane = () => {
  if (curIdx.value == panes.value!.length - 1) {
    curIdx.value = 0
  } else {
    curIdx.value++
  }
}

const prevPane = () => {
  if (curIdx.value == 0) {
    curIdx.value = panes.value!.length - 1
  } else {
    curIdx.value--
  }
}

const setPane = (idx: number) => {
  if (!panes.value || idx < 0 || idx >= panes.value?.length) {
    return
  }
  curIdx.value = idx
}

const onMouseEnter = () => {
  hoverShowArrow.value = true
  hoverShowIndicator.value = true

  if (autoplayTimer) {
    clearInterval(autoplayTimer as number)
    autoplayTimer = undefined
  }
}

const onMouseLeave = () => {
  hoverShowArrow.value = false
  hoverShowIndicator.value = false

  if (props.autoplay && !autoplayTimer) {
    autoplayTimer = setInterval(nextPane, props.autoplayInterval)
  }
}

watch(curIdx, (newId: number, oldId: number) => {
  const newItem = panes.value?.item(newId) as HTMLElement
  const oldItem = panes.value?.item(oldId) as HTMLElement

  if (panes.value) {
    newItem.style.transition = 'none'
    newItem.style.display = 'flex'

    if (props.animation === 'swipe') {
      if (newId > oldId) {
        newItem.style.transform = `translateX(${panesWrapper.value?.clientWidth}px)`
      } else {
        newItem.style.transform = `translateX(-${panesWrapper.value?.clientWidth}px)`
      }

      setTimeout(() => {
        if (newId > oldId) {
          oldItem.style.transform = `translateX(-${panesWrapper.value?.clientWidth}px)`
        } else {
          oldItem.style.transform = `translateX(${panesWrapper.value?.clientWidth}px)`
        }

        newItem.style.transition = 'all 0.4s ease'
        newItem.style.transform = 'translateX(0)'
      }, 10)

      useTimeout(() => {
        oldItem.style.display = 'none'
      }, 410).start()
    } else if (props.animation === 'fade-swipe') {
      if (newId > oldId) {
        newItem.style.transform = `translateX(25%)`
        newItem.style.opacity = '0'
      } else {
        newItem.style.transform = `translateX(-25%)`
        newItem.style.opacity = '0'
      }

      setTimeout(() => {
        if (newId > oldId) {
          oldItem.style.transform = `translateX(-25%)`
          oldItem.style.opacity = '0'
        } else {
          oldItem.style.transform = `translateX(25%)`
          oldItem.style.opacity = '0'
        }

        newItem.style.transition = 'all 0.4s ease'
        newItem.style.opacity = '1'
        newItem.style.transform = 'translateX(0)'
      }, 10)

      useTimeout(() => {
        oldItem.style.display = 'none'
      }, 410).start()
    }
  }
})

onMounted(() => {
  refreshState()
})

defineExpose({
  nextPane,
  prevPane,
  setPane,
})
</script>

<template>
  <div
    class="overflow-hidden"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div ref="panesWrapper" class="overflow-hidden w-full h-full relative">
      <slot />
    </div>

    <!-- INDICATORS -->
    <Transition name="slide-up">
      <div
        v-if="
          panes &&
          panes.length > 1 &&
          showIndicator !== 'never' &&
          (showIndicator === 'always' || hoverShowIndicator)
        "
        class="w-full absolute bottom-1 left-0 right-0 flex flex-row justify-center"
      >
        <div class="bg-gray-600 bg-opacity-20 px-2 rounded-full flex flex-row">
          <div
            v-for="idx in panes.length"
            class="py-2 mx-1"
            @mouseenter="curIdx = idx - 1"
            :key="idx"
          >
            <div
              class="h-1 rounded-full transition-all"
              :class="
                curIdx == idx - 1
                  ? 'indicator-selected'
                  : 'indicator-unselected'
              "
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- PAGE ARROWS -->
    <Transition name="slide-right">
      <div
        v-if="
          panes &&
          panes.length > 1 &&
          showArrow !== 'never' &&
          (showArrow === 'always' || hoverShowArrow)
        "
        class="h-full absolute left-0 top-0 bottom-0 flex flex-col justify-center px-1 bg-gray-600 bg-opacity-30 cursor-pointer hover:bg-opacity-60 transition-all"
        @click="prevPane"
      >
        <i class="bi bi-chevron-left text-white" />
      </div>
    </Transition>
    <Transition name="slide-left">
      <div
        v-if="
          panes &&
          panes.length > 1 &&
          showArrow !== 'never' &&
          (showArrow === 'always' || hoverShowArrow)
        "
        class="h-full absolute right-0 top-0 bottom-0 flex flex-col justify-center px-1 bg-gray-600 bg-opacity-30 cursor-pointer hover:bg-opacity-60 transition-all"
        @click="nextPane"
      >
        <i class="bi bi-chevron-right text-white" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.indicator-selected {
  @apply w-7 bg-white;
}

.indicator-unselected {
  @apply w-5 bg-gray-400 opacity-90;
}

.slide-up-enter-from,
.slide-up-leave-to {
  @apply opacity-0;
  transform: translateY(0.5rem);
}

.slide-right-enter-from,
.slide-right-leave-to {
  @apply opacity-0;
  transform: translateX(-0.25rem);
}

.slide-left-enter-from,
.slide-left-leave-to {
  @apply opacity-0;
  transform: translateX(0.25rem);
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
</style>
