<script setup lang="ts">
import { onMounted, PropType, Ref, ref, VNode } from 'vue'
import ZZZButton from './ZZZButton.vue'

const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: Object as PropType<(() => string) | string>,
    default: () => {
      return 'Template GS Dialog'
    },
  },
  styleType: {
    type: String as PropType<'full-width' | 'normal'>,
    default: 'full-width',
  },
  gamepadMode: {
    type: Boolean,
    default: false,
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  msg: {
    type: Object as PropType<(() => string) | string>,
    default: () => {
      return ''
    },
  },
  msgCenter: {
    type: Boolean,
    default: true,
  },
  onCancel: {
    type: Function,
  },
  onOk: {
    type: Function,
  },
  closeOnOk: {
    type: Boolean,
    default: true,
  },
  vnode: {
    type: Object as PropType<() => VNode | undefined>,
    default: undefined,
  },
  hScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
  vScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
  gpType: {
    type: String as PropType<'Xbox' | 'PS'>,
    required: false,
  },
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
  closeDialog,
  cancelClick,
})
</script>

<template>
  <transition :duration="600">
    <div v-if="cShow">
      <div class="outer modal" @click="cancelClick" />
      <div class="outer modal-mask" />
      <div
        class="inner dialog-wrapper"
        :style="`max-height: calc(80vh / min(${hScale.value}, ${vScale.value}))`"
      >
        <div
          class="w-full dialog-bg"
          :class="styleType === 'full-width' ? 'left-0 w-full' : 'left-1/2'"
          :style="
            styleType === 'full-width'
              ? `
              transform: scaleY(min(${hScale.value}, ${vScale.value}));
              border-width: calc(4px * min(${hScale.value}, ${vScale.value})) 0;
          `
              : `
            width: ${width};
            transform: scale(min(${hScale.value}, ${vScale.value})) translateX(-50%);
            transform-origin: center left;
            border-width: 4px;
            border-radius: calc(20px * min(${hScale.value}, ${vScale.value})) 0 calc(20px * min(${hScale.value}, ${vScale.value})) calc(20px * min(${hScale.value}, ${vScale.value}));
          `
          "
        />
        <div
          class="dialog-content-wrapper"
          :style="`width: ${width};
            transform: scale(min(${hScale.value}, ${vScale.value})) translate(-50%)`"
        >
          <div
            class="close-area-wrapper"
            v-if="styleType === 'normal' || (!showCancel && !showOk)"
            :style="`transform: scale(min(${hScale.value}, ${vScale.value}))`"
          >
            <div class="close-button" @click="cancelClick">
              <img
                class="my-0.5 h-[28px] object-contain"
                src="../../../assets/zzzDialog/zzzDialogClose.png"
              />
            </div>
          </div>
          <div
            class="title-wrapper font-zzz-bold"
            :class="styleType === 'full-width' ? 'pt-5' : 'pt-3 pb-2'"
            :style="
              styleType === 'full-width'
                ? ''
                : `border-radius: calc(20px * min(${hScale.value}, ${vScale.value}) - 8px) 0 0 0;
                   background: linear-gradient(#2b2d2d, #000);`
            "
          >
            <div class="text">
              {{ typeof title === 'string' ? title : title() }}
            </div>
          </div>
          <div class="contents-wrapper">
            <div
              class="px-5 font-bold"
              :class="msgCenter ? 'text-center' : 'text-left'"
            >
              {{ typeof msg === 'string' ? msg : msg() }}
            </div>
            <component :is="vnode" />
            <slot />
          </div>
          <div v-if="showCancel || showOk" class="buttons-wrapper">
            <ZZZButton
              v-if="showCancel"
              type="cancel"
              class="w-1/3"
              @click="cancelClick"
            />
            <ZZZButton v-if="showOk" type="ok" class="w-1/3" @click="okClick" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.font-zzz-bold {
  font-family: zzz-font, sans-serif;
}

.modal {
  @apply absolute top-0 bottom-0 left-0 right-0;
  background: linear-gradient(
    45deg,
    #000 25%,
    #222 0,
    #222 50%,
    #000 0,
    #000 75%,
    #222 0
  );
  background-size: 15px 15px;
  opacity: 0.4;
  z-index: 1999;
}

.modal-mask {
  @apply absolute top-0 bottom-0 left-0 right-0;
  @apply bg-black bg-opacity-40;
  z-index: 1998;
}

.dialog-wrapper {
  @apply absolute top-1/2 left-0;
  @apply pt-3 w-full -translate-y-1/2;
  z-index: 2000;
}

.dialog-bg {
  @apply absolute h-full;
  @apply bg-black text-white;
  border-color: #2b2d2d;
}

.close-area-wrapper {
  @apply absolute w-12 h-8 right-5 top-2;
  @apply flex flex-row justify-end;
  z-index: 2001;
}

.gamepad-icon {
  @apply rounded-full bg-gray-100 mr-2;
  @apply h-[24px];
}

.close-button {
  @apply transition-all cursor-pointer w-full h-full;
  @apply hover:brightness-200 hover:scale-125 active:scale-90;
}

.dialog-content-wrapper {
  @apply relative pb-5 left-1/2;
  transform-origin: center left;
}

.title-wrapper {
  @apply px-6 mx-[8px] mt-[8px];

  & > .text {
    @apply text-center w-full font-bold text-white;
    font-size: x-large;
  }
}

.contents-wrapper {
  @apply px-6 pt-6 pb-4 text-white;
}

.buttons-wrapper {
  @apply w-full justify-center flex flex-row;
  @apply absolute bottom-0;
  @apply translate-y-7;
}

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
  transform: scale(1) translateY(-20%);
}
</style>
