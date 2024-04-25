<script setup lang="ts">
import { defineModel, inject, ref, Ref } from 'vue'
import GamepadIcon from './GamepadIcon.vue'

const props = defineProps({
  gamepadMode: {
    type: Boolean,
    default: false,
  },
})

const value = defineModel({
  type: String,
})
defineEmits(['submit'])

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

const inputRef = ref<HTMLInputElement | null>(null)
const focusInput = () => {
  const t = inputRef.value
  if (t === document.activeElement) {
    t?.blur()
  } else {
    t?.focus()
  }
}

defineExpose({
  focusInput,
})
</script>

<template>
  <div class="flex flex-row">
    <GamepadIcon icon="Y" v-if="gamepadMode" class="my-[1vh] mr-2" />
    <div class="wrapper">
      <input
        ref="inputRef"
        :placeholder="$t('uidInput_placeholder')"
        v-model="value"
        @keyup.native.enter="$emit('submit')"
      />
      <button
        @click="$emit('submit')"
        :style="`width: ${gamepadMode ? '8vw' : '6vw'}`"
      >
        <GamepadIcon
          icon="A"
          v-if="gamepadMode"
          class="inline-block"
          :style="`height: calc(20px * min(${hScale}, ${vScale}));
          margin-bottom: calc(2px * min(${hScale}, ${vScale}))`"
        />
        {{ $t('uidInput_query') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-row;
  @apply rounded-full border border-gray-400;

  .dark & {
    @apply border-gray-700;
  }

  input {
    @apply px-[1vw] m-[1px];
    @apply rounded-full;
  }

  button {
    @apply rounded-full;
    @apply bg-gray-100 hover:bg-gray-300 active:bg-gray-500 active:scale-90 transition-all;

    .dark & {
      @apply bg-[#444] hover:bg-gray-700 active:bg-gray-600;
    }
  }
}
</style>
