<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '50%',
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
      <div class="inner content" :style="`width: ${width}`">
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal {
  @apply absolute top-0 bottom-0 left-0 right-0 z-50;
  @apply backdrop-blur-2xl;
}

.modal-mask {
  @apply absolute top-0 bottom-0 left-0 right-0 z-40;
  @apply bg-black bg-opacity-50;
}

.content {
  @apply absolute z-50 top-1/2 left-1/2;
  @apply -translate-x-1/2 -translate-y-1/2;
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
