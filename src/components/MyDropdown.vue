<script setup lang="ts">
import {computed, PropType, ref} from "vue";

const props = defineProps({
    items: {
        type: Array as PropType<String[]>,
        required: true
    },
    itemClass: {
        type: String
    },
    placement: {
        type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
        default: 'bottom'
    },
    width: {
        type: String,
        default: '100%'
    }
})

defineEmits(['command'])

const wrapperStyles: Record<string, any> = {
    top: {
        bottom: 'calc(100% + 10px)',
        left: 0,
        right: 0
    },
    right: {
        top: 0,
        bottom: 0,
        left: 'calc(100% + 10px)'
    },
    bottom: {
        top: 'calc(100% + 10px)',
        left: 0,
        right: 0
    },
    left: {
        right: 'calc(100% + 10px)',
        top: 0,
        bottom: 0,
        'justify-content': 'right',
    }
}

const showMenu = ref(false)
let timer: NodeJS.Timeout | number | undefined = undefined

const transformX = computed(() => {
    if (props.placement === 'top' || props.placement === 'bottom') {
        return {
            transform: 'translateX(-50%)'
        }
    } else {
        return {
            transform: 'translateY(-50%)'
        }
    }
})

const hideMenu = () => {
    showMenu.value = false
    clearTimeout(timer)
    timer = undefined
}

const onMouseEnter = () => {
    if (!showMenu.value) {
        showMenu.value = true
    } else {
        clearTimeout(timer)
        timer = undefined
    }
}

const onMouseLeave = () => {
    timer = setTimeout(hideMenu, 500)
}
</script>

<template>
    <div class="relative">
        <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <slot/>
        </div>

        <Transition name="fade">
            <div class="absolute min-w-full min-h-full overflow-visible flex flex-row z-50"
                 :style="{...wrapperStyles[placement], width: width}" v-if="showMenu">
                <div class="p-1 bg-white rounded-xl w-fit h-fit min-w-full text-center shadow-md"
                     :style="transformX"
                     @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
                    <div v-for="(item, idx) in items"
                         class="py-1.5 rounded-lg cursor-default hover:bg-yellow-100 hover:text-yellow-600 active:bg-yellow-400 active:text-yellow-800 transition-all"
                         :class="itemClass"
                         @click="$emit('command', idx)">
                        {{ item }}
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
</style>