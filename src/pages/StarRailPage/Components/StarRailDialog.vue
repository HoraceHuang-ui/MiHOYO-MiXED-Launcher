<script setup lang="ts">
import { onMounted, PropType, Ref, ref, VNode } from 'vue'
import StarRailButton from './StarRailButton.vue'
import GamepadIcon from '../../../components/GamepadIcon.vue'

const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: Object as PropType<(() => string) | string>,
    default: () => {
      return 'Template SR Dialog'
    },
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
        :style="`width: ${width}; max-height: calc(80vh / min(${hScale.value}, ${vScale.value}));
          transform: scale(min(${hScale.value}, ${vScale.value})) translate(calc(-50% / min(${hScale.value}, ${vScale.value})), calc(-50% / min(${hScale.value}, ${vScale.value})))`"
      >
        <div class="close-area-wrapper" v-if="!showCancel && !showOk">
          <GamepadIcon
            icon="B"
            class="gamepad-icon"
            v-if="gamepadMode"
            :gp-type="gpType"
          />
          <div class="close-button" @click="cancelClick">
            <img
              class="my-0.5 h-[20px] object-contain"
              src="../../../assets/srCloseButton.png"
            />
          </div>
        </div>
        <div class="dialog-content-wrapper">
          <div class="title-wrapper">
            <div class="text font-sr-sans">
              {{ typeof title === 'string' ? title : title() }}
            </div>
          </div>
          <div class="divider-wrapper">
            <div class="divider-contents">
              <div
                class="absolute left-0 flex flex-row"
                style="width: calc(50% - 10px); top: 1px"
              >
                <div
                  class="absolute left-0 divider-bg rounded-full"
                  style="width: 3px; height: 3px; margin-top: 1px"
                />
                <div
                  class="absolute left-0 divider-bg w-full"
                  style="height: 1px; margin-top: 2px"
                />
                <div
                  class="absolute divider-bg rounded-full"
                  style="width: 3px; height: 3px; margin-top: 1px; right: 10px"
                />
                <div
                  class="absolute divider-bg rounded-full"
                  style="width: 5px; height: 5px; right: 0"
                />
              </div>

              <div
                class="divider-border border-2 rounded-full"
                style="height: 9px; width: 9px; transform: translateY(-1px)"
              ></div>

              <div
                class="absolute right-0 flex flex-row"
                style="width: calc(50% - 10px); top: 1px"
              >
                <div
                  class="absolute divider-bg rounded-full"
                  style="width: 5px; height: 5px; left: 0"
                />
                <div
                  class="absolute divider-bg rounded-full"
                  style="width: 3px; height: 3px; margin-top: 1px; left: 10px"
                />
                <div
                  class="absolute right-0 divider-bg w-full"
                  style="height: 1px; margin-top: 2px"
                />
                <div
                  class="absolute right-0 divider-bg rounded-full"
                  style="width: 3px; height: 3px; margin-top: 1px"
                />
              </div>
            </div>
          </div>
          <div class="contents-wrapper">
            <div
              class="font-sr-sans px-5"
              :class="msgCenter ? 'text-center' : 'text-left'"
            >
              {{ typeof msg === 'string' ? msg : msg() }}
            </div>
            <component :is="vnode" />
            <slot />
          </div>
          <div v-if="showCancel || showOk" class="buttons-wrapper">
            <StarRailButton
              v-if="showCancel"
              type="cancel"
              class="w-1/3"
              @click="cancelClick"
            />
            <StarRailButton
              v-if="showOk"
              type="ok"
              class="w-1/3"
              @click="okClick"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
div {
  @apply text-black;
}

.modal {
  @apply absolute top-0 bottom-0 left-0 right-0;
  @apply backdrop-blur-2xl;
  z-index: 1999;
}

.modal-mask {
  @apply absolute top-0 bottom-0 left-0 right-0;
  @apply bg-black bg-opacity-20;
  z-index: 1998;
}

.dialog-wrapper {
  @apply absolute top-1/2 left-1/2 border;
  border-radius: 5px 20px 0 0;
  z-index: 2000;
}

.close-area-wrapper {
  @apply absolute w-12 h-6 right-4 top-3;
  @apply flex flex-row justify-end;
  z-index: 2001;
}

.gamepad-icon {
  @apply rounded-full bg-gray-100 mr-2;
  @apply h-[24px];
}

.close-button {
  @apply rounded-full transition-all cursor-pointer;
  @apply hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90;
}

.dialog-content-wrapper {
  @apply bg-white;
  border-radius: 5px 20px 0 0;
  transform: translate(5px, -5px);
}

.title-wrapper {
  @apply pt-4 ml-6 mr-6;

  & > .text {
    @apply text-center w-full text-black;
    font-size: larger;
  }
}

.divider-wrapper {
  @apply w-full flex flex-row justify-center mt-1;
}

.divider-contents {
  @apply w-5/6 flex flex-row justify-center relative;
}

.divider-bg {
  background: #aaaaaa;
}

.divider-border {
  border-color: #aaaaaa;
}

.contents-wrapper {
  @apply px-6 py-6;
}

.buttons-wrapper {
  @apply w-full justify-center flex flex-row py-2;
  background: #262626;
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
  transform: scale(1) translate(-50%, -20%);
}
</style>
