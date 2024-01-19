<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'

const props = defineProps({
    height: {
        type: String,
        default: '100%'
    },
    width: {
        type: String,
        default: '100%'
    },
    showBar: {
        type: Boolean,
        default: true
    },
    scrollPadding: {
        type: Number,
        default: 5
    },
    stickBottom: {
        type: Boolean,
        default: false
    },
    noResize: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['scroll'])

const outerRef = ref()
const innerRef = ref()

const trackHeight = ref(0)
const wrapContentHeight = ref(0)
const trackWidth = ref(0)
const wrapContentWidth = ref(0)

const translateX = ref(0)
const translateY = ref(0)
const moveClientX = ref(0)
const moveClientY = ref(0)
const vMovingState = ref(false)
const hMovingState = ref(false)

const heightPre = computed(() => {
    return trackHeight.value / wrapContentHeight.value
})
const widthPre = computed(() => {
    return trackWidth.value / wrapContentWidth.value
})
const barHeight = computed(() => {
    return heightPre.value * trackHeight.value
})
const barWidth = computed(() => {
    return widthPre.value * trackWidth.value
})

const onScroll = (e: Event) => {
    const target: HTMLDivElement = e.target
    translateX.value = target.scrollLeft * widthPre.value
    translateY.value = target.scrollTop * heightPre.value

    emit('scroll', {
        left: target.scrollLeft,
        top: target.scrollTop
    })
}

// 鼠标开始移动
const vMoveStart = (e: MouseEvent) => {
    vMovingState.value = true
    // 开始移动时鼠标距离thumb顶部的位置
    moveClientY.value = e.clientY - translateY.value
    moveTo()
    moveEnd()
}

const hMoveStart = (e: MouseEvent) => {
    hMovingState.value = true
    moveClientX.value = e.clientX - translateX.value
    moveTo()
    moveEnd()
}
const moveTo = () => {
    document.onmousemove = (e) => {
        if (vMovingState.value) {
            if (e.clientY - moveClientY.value > trackHeight.value - barHeight.value) {
                translateY.value = trackHeight.value - barHeight.value
            } else if (e.clientY - moveClientY.value < 0) {
                translateY.value = 0
            } else {
                translateY.value = e.clientY - moveClientY.value
            }
            outerRef.value.scrollTop = translateY.value / heightPre.value
        }
        if (hMovingState.value) {
            if (e.clientX - moveClientX.value > trackWidth.value - barWidth.value) {
                translateX.value = trackWidth.value - barWidth.value
            } else if (e.clientX - moveClientX.value < 0) {
                translateX.value = 0
            } else {
                translateX.value = e.clientX - moveClientX.value
            }
            outerRef.value.scrollLeft = translateX.value / widthPre.value
        }
    }
}
// 鼠标移动结束
const moveEnd = () => {
    document.onmouseup = () => {
        if (vMovingState.value) {
            vMovingState.value = false
        }
        if (hMovingState.value) {
            hMovingState.value = false
        }
    }
}

const innerResizeObserver = new ResizeObserver(() => {
    if (innerRef.value) {
        wrapContentWidth.value = innerRef.value.scrollWidth
        wrapContentHeight.value = innerRef.value.scrollHeight
    }
    if (outerRef.value) {
        if (props.stickBottom) {
            outerRef.value.scrollTo({
                top: wrapContentHeight.value,
                behavior: 'smooth'
            })
            translateY.value = wrapContentHeight.value
        }
    }
})
const outerResizeObserver = new ResizeObserver(() => {
    if (outerRef.value) {
        trackWidth.value = outerRef.value.clientWidth
        trackHeight.value = outerRef.value.clientHeight
        if (props.stickBottom) {
            outerRef.value.scrollTo({
                top: wrapContentHeight.value,
                behavior: 'smooth'
            })
            translateY.value = wrapContentHeight.value
        }
    }
})

onMounted(() => {
    wrapContentWidth.value = innerRef.value.scrollWidth
    wrapContentHeight.value = innerRef.value.scrollHeight
    trackWidth.value = outerRef.value.clientWidth
    trackHeight.value = outerRef.value.clientHeight

    if (!props.noResize) {
        innerResizeObserver.observe(innerRef.value)
        outerResizeObserver.observe(outerRef.value)
    }
})

const scrollTo = (scrollProps: {
    top: number,
    left: number,
    behavior: string
}) => {
    outerRef.value.scrollTo({
        top: scrollProps.top,
        left: scrollProps.left,
        behavior: scrollProps.behavior
    })
}

defineExpose({
    scrollTo
})
</script>

<template>
    <div class="overflow-hidden" :style="{ height: height, width: width }">
        <div class="h-full w-full relative overflow-hidden">
            <div ref="outerRef" class="h-full w-full overflow-scroll" @scroll="onScroll">
                <div ref="innerRef">
                    <slot/>
                </div>
            </div>
            <div class="absolute top-0 bottom-0 right-0.5 w-1.5 rounded-full z-50">
                <div
                    v-show="heightPre < 1 && showBar"
                    :style="{
                        height: barHeight + 'px',
                        transform:
                          `translate(0, ${scrollPadding + translateY - (translateY / (trackHeight - barHeight)) * 2 * scrollPadding}px)`
                      }"
                    style="transition-property: height, width; transition-duration: 0.2s"
                    class="w-1 rounded-full bg-gray-600 opacity-40 hover:w-1.5 hover:opacity-100"
                    @mousedown.stop.prevent="vMoveStart"
                />
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-1.5 rounded-full z-50">
                <div v-show="widthPre < 1 && showBar"
                     :style="{
                        width: barWidth + 'px',
                        transform:
                            `translate(${scrollPadding + translateX - (translateX / (trackWidth - barWidth)) * 2 * scrollPadding}px, 0)`
                     }"
                     style="transition-property: height, width; transition-duration: 0.2s"
                     class="h-1 rounded-full bg-gray-600 opacity-40 hover:h-1.5 hover:opacity-100"
                     @mousedown.stop.prevent="hMoveStart"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

::-webkit-scrollbar {
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
}
</style>