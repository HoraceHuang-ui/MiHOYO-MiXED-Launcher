<script setup lang="ts">
import { defineModel } from 'vue'

const value = defineModel({
  type: String,
})
defineEmits(['submit'])
</script>

<template>
  <div class="wrapper">
    <input
      :placeholder="$t('uidInput_placeholder')"
      v-model="value"
      @keyup.native.enter="$emit('submit')"
    />
    <button @click="$emit('submit')">
      {{ $t('uidInput_query') }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-row h-10;
  @apply rounded-full border border-gray-400;

  input {
    @apply px-2 w-[16vw] m-[1px];
    @apply rounded-full;
  }

  button {
    @apply px-3 rounded-full;
    @apply bg-gray-100 hover:bg-gray-300 active:bg-gray-500 active:scale-90 transition-all;
    min-width: 5rem;
  }
}
</style>
