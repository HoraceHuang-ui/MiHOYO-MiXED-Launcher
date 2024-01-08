<script setup lang="ts">
import {inject, ref} from 'vue'
import GenshinButton from "./GenshinButton.vue";

const props = defineProps({
    width: {
        type: String,
        default: '50%'
    },
    title: {
        type: String,
        default: 'Template GS Dialog'
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
    }
})

const dialogRef = ref<HTMLElement>()

const show = inject('app/showDialog', false)
const unmount: () => void = inject('app/unmountDialog', () => undefined)
const cShow = ref(show)

const closeDialog = (timeout: number) => {
    cShow.value = false
    setTimeout(unmount, timeout)
}

const cancelClick = () => {
    closeDialog(500)
    if (props.onCancel) {
        props.onCancel()
    }
}

const okClick = () => {
    if (props.closeOnOk) {
        closeDialog(500)
    }
    if (props.onOk) {
        props.onOk()
    }
}

defineExpose({
    closeDialog
})
</script>

<template>
    <transition :duration="600">
        <div v-if="cShow">
            <div
                class="outer absolute top-0 bottom-0 left-0 right-0 z-50 opacity-40 bg-black"
                @click="cancelClick"
            />
            <div
                class="inner absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center"
                :style="`width: ${width}`"
            >
                <div
                    v-if="!showCancel && !showOk"
                    class="z-50 w-6 h-6 p-1 absolute right-4 top-3 rounded-full hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90 transition-all cursor-pointer"
                    @click="cancelClick">
                    <img src="../../../assets/srCloseButton.png"/>
                </div>

                <div class="z-50 w-6 h-6 absolute top-0 left-0">
                    <img style="filter: drop-shadow(1px 1px 2px #aaaaaa)"
                         src="../../../assets/gsDialog/gsDialogCorner.png"/>
                </div>
                <div class="z-50 w-6 h-6 absolute top-0 right-0">
                    <img style="filter: drop-shadow(1px 1px 2px #aaaaaa)" class="rotate-90"
                         src="../../../assets/gsDialog/gsDialogCorner.png"/>
                </div>
                <div class="z-50 w-6 h-6 absolute bottom-0 right-0" style="transform: translate(1px, 9px)">
                    <img style="filter: drop-shadow(1px 1px 2px #aaaaaa)" class="rotate-180"
                         src="../../../assets/gsDialog/gsDialogCorner.png"/>
                </div>
                <div class="z-50 w-6 h-6 absolute bottom-0 left-0" style="transform: translate(1px, 9px)">
                    <img style="filter: drop-shadow(1px 1px 2px #aaaaaa)" class="-rotate-90"
                         src="../../../assets/gsDialog/gsDialogCorner.png"/>
                </div>

                <div class="dialog-wrapper flex flex-col justify-between">
                    <div>
                        <div class="pt-4 ml-6 mr-6">
                            <div class="text-center w-full font-gs text-xl text-black">{{ title }}</div>
                        </div>
                        <div class="w-full flex flex-row justify-center mt-1">
                            <div class="w-5/6 flex flex-row justify-center relative">
                                <img style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
                                     src="../../../assets/gsDialog/gsDividerSide.png"/>
                                <div class="divider-bg w-full" style="height: 1px; margin-top: 4px"/>
                                <img style="height: 9px" src="../../../assets/gsDialog/gsDividerSide.png"/>
                            </div>
                        </div>
                    </div>

                    <div class="w-full h-full relative flex flex-col justify-center">
                        <img
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full object-contain"
                            style="height: 200px"
                            src="../../../assets/gsDialog/gsDialogBg.png"/>
                        <div class="px-6 py-6"
                             style="z-index: 60">
                            <div class="font-gs px-5" :class="msgCenter ? 'text-center' : 'text-left'">{{ msg }}</div>
                            <slot/>
                        </div>
                    </div>

                    <div>
                        <div class="w-full flex flex-row justify-center mt-1">
                            <div class="w-5/6 flex flex-row justify-center relative">
                                <img style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
                                     src="../../../assets/gsDialog/gsDividerSide.png"/>
                                <div class="divider-bg w-full" style="height: 1px; margin-top: 4px"/>
                                <img style="height: 9px" src="../../../assets/gsDialog/gsDividerSide.png"/>
                            </div>
                        </div>

                        <div v-if="showCancel || showOk" class="w-full justify-center flex flex-row py-2">
                            <GenshinButton v-if="showCancel" type="cancel" class="w-1/3" @click="cancelClick"/>
                            <GenshinButton v-if="showOk" type="ok" class="w-1/3" @click="okClick"/>
                        </div>
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

.dialog-wrapper {
    min-height: 320px;
    background: #E4E2DC;
    width: calc(100% - 10px);
    transform: translateY(4px);
    border-radius: 20px;
}

.divider-bg {
    background: #DAD2C5;
}
</style>