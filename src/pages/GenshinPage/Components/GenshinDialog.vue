<script setup lang="ts">
import { onMounted, PropType, Ref, ref, VNode } from 'vue'
import GenshinButton from './GenshinButton.vue'

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
})
</script>

<template>
  <transition :duration="600">
    <div v-if="cShow">
      <div class="outer modal" @click="cancelClick" />
      <div
        class="inner dialog-wrapper"
        :style="`width: ${width}; max-height: calc(80vh / min(${hScale.value}, ${vScale.value}));
          transform: scale(min(${hScale.value}, ${vScale.value})) translate(calc(-50% / min(${hScale.value}, ${vScale.value})), calc(-50% / min(${hScale.value}, ${vScale.value})))`"
      >
        <div
          v-if="!showCancel && !showOk"
          class="close-button"
          @click="cancelClick"
        >
          <img
            class="invert opacity-60"
            src="../../../assets/gsDialog/gsDialogClose.png"
          />
        </div>

        <div class="dialog-corner top-0 left-0">
          <img src="../../../assets/gsDialog/gsDialogCorner.png" />
        </div>
        <div class="dialog-corner top-0 right-0">
          <img
            class="rotate-90"
            src="../../../assets/gsDialog/gsDialogCorner.png"
          />
        </div>
        <div
          class="dialog-corner bottom-0 right-0"
          style="transform: translate(1px, 9px)"
        >
          <img
            class="rotate-180"
            src="../../../assets/gsDialog/gsDialogCorner.png"
          />
        </div>
        <div
          class="dialog-corner bottom-0 left-0"
          style="transform: translate(1px, 9px)"
        >
          <img
            class="-rotate-90"
            src="../../../assets/gsDialog/gsDialogCorner.png"
          />
        </div>

        <div class="dialog-content-wrapper">
          <div>
            <div class="title font-gs">
              <div class="text">
                {{ typeof title === 'string' ? title : title() }}
              </div>
            </div>
            <div class="divider-wrapper">
              <div class="divider-contents">
                <img
                  style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
                  src="../../../assets/gsDialog/gsDividerSide.png"
                />
                <div
                  class="divider-bg w-full"
                  style="height: 1px; margin-top: 4px"
                />
                <img
                  style="height: 9px"
                  src="../../../assets/gsDialog/gsDividerSide.png"
                />
              </div>
            </div>
          </div>

          <div class="dialog-mid-wrapper">
            <img class="bg-img" src="../../../assets/gsDialog/gsDialogBg.png" />
            <div ref="mainArea" class="main-contents" style="z-index: 60">
              <div
                class="font-gs"
                :class="msgCenter ? 'text-center' : 'text-left'"
              >
                {{ typeof msg === 'string' ? msg : msg() }}
              </div>
              <component :is="vnode" />
              <slot />
            </div>
          </div>

          <div>
            <div class="divider-wrapper">
              <div class="divider-contents">
                <img
                  style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
                  src="../../../assets/gsDialog/gsDividerSide.png"
                />
                <div
                  class="divider-bg w-full"
                  style="height: 1px; margin-top: 4px"
                />
                <img
                  style="height: 9px"
                  src="../../../assets/gsDialog/gsDividerSide.png"
                />
              </div>
            </div>

            <div v-if="showCancel || showOk" class="buttons-wrapper">
              <GenshinButton
                v-if="showCancel"
                type="cancel"
                class="w-1/3"
                @click="cancelClick"
              />
              <GenshinButton
                v-if="showOk"
                type="ok"
                class="w-1/3"
                @click="okClick"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.modal {
  @apply absolute top-0 bottom-0 left-0 right-0 z-50;
  @apply opacity-40 bg-black;
}

.dialog-wrapper {
  @apply absolute z-50 top-1/2 left-1/2;
  @apply flex justify-center;
}

.close-button {
  @apply absolute z-50 w-6 h-6 p-1 right-6 top-5;
  @apply rounded-full transition-all cursor-pointer;
  @apply hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90;

  img {
    @apply invert opacity-60;
  }
}

.dialog-corner {
  @apply absolute z-50 w-6 h-6;

  img {
    filter: drop-shadow(1px 1px 2px #aaaaaa);
  }
}

.dialog-content-wrapper {
  @apply flex flex-col justify-between;
  min-height: 320px;
  background: #e4e2dc;
  width: calc(100% - 10px);
  transform: translateY(4px);
  border-radius: 20px;

  .dark & {
    background: #3e4555;
  }
}

.title {
  @apply pt-4 mx-6;

  & > .text {
    @apply text-center w-full text-black;
    font-size: larger;

    .dark & {
      @apply text-[#CCBE87];
    }
  }
}

.divider-wrapper {
  @apply w-full flex flex-row justify-center mt-1;

  .dark & {
    @apply opacity-30;
  }
}

.divider-contents {
  @apply w-5/6 flex flex-row justify-center relative;
}

.divider-bg {
  background: #dad2c5;
}

.dialog-mid-wrapper {
  @apply w-full h-full px-6 relative flex flex-col justify-center;
}

.main-contents {
  @apply p-6;
}

.bg-img {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply w-full h-[200px] object-contain;

  .dark & {
    @apply invert opacity-10;
  }
}

.buttons-wrapper {
  @apply w-full justify-center flex flex-row py-2;
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
  transform: translate(-50%, -20%);
}
</style>
