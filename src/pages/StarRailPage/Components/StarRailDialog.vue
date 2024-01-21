<script setup lang="ts">
import {onMounted, PropType, ref, VNode} from 'vue'
import StarRailButton from "./StarRailButton.vue";

const props = defineProps({
    width: {
        type: String,
        default: '50%'
    },
    title: {
        type: String,
        default: 'Template SR Dialog'
    },
    showCancel: {
        type: Boolean,
        default: false
    },
    showOk: {
        type: Boolean,
        default: true
    },
    msg: {
        type: String,
        default: ''
    },
    msgCenter: {
        type: Boolean,
        default: true
    },
    onCancel: {
        type: Function
    },
    onOk: {
        type: Function
    },
    closeOnOk: {
        type: Boolean,
        default: true
    },
    vnode: {
        type: Object as PropType<VNode>,
        default: undefined
    }
})

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

const okClick = () => {
    if (props.closeOnOk) {
        closeDialog()
    }
    if (props.onOk) {
        props.onOk()
    }
}

onMounted(() => {
    cShow.value = true
})

defineExpose({
    closeDialog
})
</script>

<template>
    <transition :duration="600">
        <div v-if="cShow">
            <div
                class="outer absolute top-0 bottom-0 left-0 right-0 z-50 backdrop-blur-2xl"
                @click="cancelClick"
            />
            <div class="outer bg-black bg-opacity-20 outer absolute top-0 bottom-0 left-0 right-0 z-40"/>
            <div
                class="inner absolute z-50 top-1/2 left-1/2 border"
                style="border-radius: 5px 20px 0 0; transform: translate(calc(-50% - 5px), calc(-50% + 5px))"
                :style="`width: ${width}`"
            >
                <div
                    v-if="!showCancel && !showOk"
                    class="z-50 w-6 h-6 p-1 absolute right-4 top-3 rounded-full hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90 transition-all cursor-pointer"
                    @click="cancelClick">
                    <img src="../../../assets/srCloseButton.png"/>
                </div>
                <div
                    class="bg-white"
                    style="border-radius: 5px 20px 0 0; transform: translate(5px, -5px)">
                    <div class="pt-4 ml-6 mr-6">
                        <div class="text-center w-full font-sr-sans text-xl text-black">{{ title }}</div>
                    </div>
                    <div class="w-full flex flex-row justify-center mt-1">
                        <div class="w-5/6 flex flex-row justify-center relative">
                            <div class="absolute left-0 flex flex-row"
                                 style="width: calc(50% - 10px); top: 1px">
                                <div class="absolute left-0 divider-bg rounded-full"
                                     style="width: 3px; height: 3px; margin-top: 1px"/>
                                <div class="absolute left-0 divider-bg w-full" style="height: 1px; margin-top: 2px"/>
                                <div class="absolute divider-bg rounded-full"
                                     style="width: 3px; height: 3px; margin-top: 1px; right: 10px"/>
                                <div class="absolute divider-bg rounded-full"
                                     style="width: 5px; height: 5px; right: 0"/>
                            </div>

                            <div class="divider-border border-2 rounded-full"
                                 style="height: 9px; width: 9px; transform: translateY(-1px)"></div>

                            <div class="absolute right-0 flex flex-row"
                                 style="width: calc(50% - 10px); top: 1px">
                                <div class="absolute divider-bg rounded-full"
                                     style="width: 5px; height: 5px; left: 0"/>
                                <div class="absolute divider-bg rounded-full"
                                     style="width: 3px; height: 3px; margin-top: 1px; left: 10px"/>
                                <div class="absolute right-0 divider-bg w-full" style="height: 1px; margin-top: 2px"/>
                                <div class="absolute right-0 divider-bg rounded-full"
                                     style="width: 3px; height: 3px; margin-top: 1px"/>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-6">
                        <div class="font-sr-sans px-5" :class="msgCenter ? 'text-center' : 'text-left'">{{ msg }}</div>
                        <component :is="vnode"/>
                        <slot/>
                    </div>
                    <div v-if="showCancel || showOk" class="w-full justify-center flex flex-row py-2"
                         style="background: #262626">
                        <StarRailButton v-if="showCancel" type="cancel" class="w-1/3" @click="cancelClick"/>
                        <StarRailButton v-if="showOk" type="ok" class="w-1/3" @click="okClick"/>
                    </div>
                </div>
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

.divider-bg {
    background: #aaaaaa;
}

.divider-border {
    border-color: #aaaaaa;
}
</style>