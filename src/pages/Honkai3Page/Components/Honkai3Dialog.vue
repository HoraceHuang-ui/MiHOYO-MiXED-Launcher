<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Honkai3Button from "./Honkai3Button.vue";

const props = defineProps({
    width: {
        type: String,
        default: '50%'
    },
    title: {
        type: String,
        default: 'Template HK3 Dialog'
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
                class="outer absolute top-0 bottom-0 left-0 right-0 z-50"
                style="background: rgba(10,17,33,0.95)"
                @click="cancelClick"
            />
            <div
                class="inner rounded-3xl border-2 p-6 absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center"
                style="border-color: rgba(255,255,255,0.1)"
                :style="`width: ${width}`"
            >
                <div class="dialog-wrapper relative border-2 border-white flex flex-col"
                     style="box-shadow: 0 0 100px 40px rgba(81,131,189,0.29)">
                    <div class="close-wrapper absolute right-0 top-0" @click="cancelClick">
                        <i class="bi bi-x w-full text-4xl" style="color: #46C3F9"/>
                        <!--                        <img class="invert opacity-60" src="../../../assets/gsDialog/gsDialogClose.png"/>-->
                    </div>

                    <i class="bi bi-exclamation-circle absolute -left-1 -top-2 z-50 text-9xl"
                       style="color: rgba(53,106,148,0.2)"></i>

                    <div class="pt-2 ml-6 mr-6">
                        <div class="text-center w-full font-bold text-2xl" style="color: #51C3F9">{{
                                title
                            }}
                        </div>
                        <div class="text-center w-full opacity-60 text-xs font-bold"
                             style="color: #51C3F9; font-family: 'Microsoft JhengHei', serif">
                            - DIALOG -
                        </div>
                    </div>

                    <div class="bg-blue-300 h-full bg-opacity-10 mt-1 flex flex-col justify-between backdrop-blur-sm"
                         style="z-index: 60; border-radius: 0 0 12px 12px">
                        <div class="w-full h-full flex flex-col justify-center">
                            <div class="px-6 py-6 text-blue-100">
                                <div class="px-5 text-lg"
                                     :class="msgCenter ? 'text-center' : 'text-left'">{{
                                        msg
                                    }}
                                </div>
                                <component :is="vnode"/>
                                <slot/>
                            </div>
                        </div>

                        <div>
                            <div v-if="showCancel || showOk" class="w-full justify-center flex flex-row pt-2 pb-3">
                                <Honkai3Button v-if="showCancel" type="cancel" class="w-1/3" @click="cancelClick"/>
                                <Honkai3Button v-if="showOk" type="ok" class="w-1/3" @click="okClick"/>
                            </div>
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
    min-height: 250px;
    background: linear-gradient(#1c3350, #285a8c);
    width: 100%;
    border-radius: 15px;
}

.close-wrapper {
    @apply z-50 pt-0.5 h-12 w-16 text-center transition-all cursor-pointer;
    background: rgb(72, 107, 161, 0.5);
    border-radius: 0 15px 0 15px;
}

.close-wrapper:hover {
    background: rgb(72, 107, 161, 0.8);
}

.close-wrapper:active {
    background: rgb(72, 107, 161);
}
</style>