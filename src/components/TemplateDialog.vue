<script setup lang="ts">
import {onMounted, ref} from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '50%'
    },
    onClose: {
        type: Function
    },
    onCancel: {
        type: Function
    },
    onOk: {
        type: Function
    }
})
const dialogRef = ref<HTMLElement>()

const cShow = ref(false)

const closeDialog = () => {
    cShow.value = false
}

const cancelClick = () => {
    closeDialog()
    if (props.onCancel) {
        props.onCancel()
    }
}

onMounted(() => {
    cShow.value = true
})

defineExpose({
    cancelClick
})
</script>

<template>
    <transition :duration="600">
        <div v-if="cShow">
            <div
                class="outer absolute top-0 bottom-0 left-0 right-0 z-50 backdrop-blur-2xl"
                @click="cancelClick"
            />
            <div class="bg-black bg-opacity-50 outer absolute top-0 bottom-0 left-0 right-0 z-40"/>
            <div
                class="inner absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                :style="`width: ${width}`"
            >
                <slot/>
            </div>
        </div>
    </transition>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.v-enter-active .outer {
    transition: opacity 0.5s ease;
}

.v-leave-active .outer {
    transition: opacity 0.5s ease;
    transition-delay: 0.1s;
}

.v-enter-from .outer,
.v-leave-to .outer {
    opacity: 0;
}

.v-enter-active .inner {
    transition: all 0.3s ease;
    transition-delay: 0.2s;
}

.v-leave-active .inner {
    transition: all 0.3s ease;
}

.v-enter-from .inner,
.v-leave-to .inner {
    opacity: 0;
    transform: translate(-50%, -20%);
}
</style>