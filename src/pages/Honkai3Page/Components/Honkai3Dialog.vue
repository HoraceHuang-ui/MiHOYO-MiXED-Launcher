<script setup lang="ts">
import { onMounted, PropType, Ref, ref, VNode } from 'vue'
import Honkai3Button from './Honkai3Button.vue'

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
        :style="`width: calc(${width} + 48px); max-height: calc((80vh + 48px) / min(${hScale.value}, ${vScale.value}));
          transform: scale(min(${hScale.value}, ${vScale.value})) translate(calc(-50% / min(${hScale.value}, ${vScale.value})), calc(-50% / min(${hScale.value}, ${vScale.value})))`"
      >
        <div class="dialog-content-wrapper">
          <div class="close-wrapper" @click="cancelClick">
            <i class="bi bi-x" />
          </div>

          <i
            class="bi bi-exclamation-circle dialog-deco-icon"
            style="color: rgba(53, 106, 148, 0.2)"
          />

          <div class="title-wrapper">
            <div class="title">
              {{ typeof title === 'string' ? title : title() }}
            </div>
            <div class="title-deco-text">- DIALOG -</div>
          </div>

          <div class="contents-area-wrapper">
            <div class="contents-wrapper">
              <div
                class="px-5"
                :class="msgCenter ? 'text-center' : 'text-left'"
              >
                {{ typeof msg === 'string' ? msg : msg() }}
              </div>
              <component :is="vnode" />
              <slot />
            </div>

            <div v-if="showCancel || showOk" class="buttons-wrapper">
              <Honkai3Button
                v-if="showCancel"
                type="cancel"
                class="w-1/3"
                @click="cancelClick"
              />
              <Honkai3Button
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
  background: rgba(10, 17, 33, 0.95);
}

.dialog-wrapper {
  @apply absolute p-6 z-50 top-1/2 left-1/2;
  @apply rounded-3xl border-2 flex justify-center;
  border-color: rgba(255, 255, 255, 0.1);
}

.dialog-content-wrapper {
  @apply relative w-full flex flex-col;
  @apply border-2 border-white;
  min-height: 250px;
  background: linear-gradient(#1c3350, #285a8c);
  border-radius: 15px;
  box-shadow: 0 0 100px 40px rgba(81, 131, 189, 0.29);
}

.close-wrapper {
  @apply absolute right-0 top-0 z-50 pt-0.5 h-12 w-16;
  @apply text-center transition-all cursor-pointer;
  background: rgb(72, 107, 161, 0.5);
  border-radius: 0 15px 0 15px;

  &:hover {
    background: rgb(72, 107, 161, 0.8);
  }
  &:active {
    background: rgb(72, 107, 161);
  }

  i {
    @apply w-full text-4xl;
    color: #46c3f9;
  }
}

.dialog-deco-icon {
  @apply absolute -left-1 -top-2 z-50 text-9xl;
}

.title-wrapper {
  @apply pt-2 ml-6 mr-6;
}

.title {
  @apply text-center w-full font-bold;
  font-size: larger;
  color: #51c3f9;
}

.title-deco-text {
  @apply text-center w-full opacity-60 font-bold text-xs;
  color: #51c3f9;
  font-family: 'Microsoft JhengHei', serif;
}

.contents-area-wrapper {
  @apply h-full mt-1 flex flex-col justify-between;
  @apply bg-blue-300 bg-opacity-10 backdrop-blur-sm;
  z-index: 60;
  border-radius: 0 0 12px 12px;
}

.contents-wrapper {
  @apply w-full h-full flex flex-col;
  @apply justify-center px-6 py-6 text-blue-100;
}

.buttons-wrapper {
  @apply w-full justify-center flex flex-row pt-2 pb-3;
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
