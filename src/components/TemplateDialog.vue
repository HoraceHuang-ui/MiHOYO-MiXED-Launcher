<script setup lang="ts">
import { onMounted, PropType, Ref, ref } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  onClose: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
  onOk: {
    type: Function,
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

onMounted(() => {
  cShow.value = true
})

defineExpose({
  cancelClick,
})
</script>

<template>
  <transition :duration="600">
    <div v-if="cShow">
      <div class="outer modal" @click="cancelClick" />
      <div class="outer modal-mask" />
      <div
        class="inner content"
        :style="`width: ${width}; max-height: calc(80vh / min(${hScale.value}, ${vScale.value}));
          transform: scale(min(${hScale.value}, ${vScale.value})) translate(calc(-50% / min(${hScale.value}, ${vScale.value})), calc(-50% / min(${hScale.value}, ${vScale.value})))`"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal {
  @apply absolute top-0 bottom-0 left-0 right-0;
  @apply backdrop-blur-2xl;
  z-index: 1999;
}

.modal-mask {
  @apply absolute top-0 bottom-0 left-0 right-0;
  @apply bg-black bg-opacity-50;
  z-index: 1998;
}

.content {
  @apply absolute top-1/2 left-1/2;
  z-index: 2000;
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
