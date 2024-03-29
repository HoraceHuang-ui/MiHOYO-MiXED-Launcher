<script setup lang="ts">
import { defineModel } from 'vue'

const state = defineModel({
  type: Boolean,
})
const emit = defineEmits(['change'])

const valueChange = () => {
  state.value = !state.value
  emit('change')
}
</script>

<template>
  <div
    class="rounded-full h-8 w-14 border-2 relative transition-all cursor-pointer"
    @click="valueChange"
    :class="state ? 'bg-blue-500 border-blue-500' : 'bg-white border-blue-200'"
  >
    <div
      class="rounded-full w-5 h-5 absolute top-1 bottom-1 transition-all"
      :class="state ? 'left-7 bg-white' : 'left-1 bg-blue-500'"
    ></div>
  </div>
</template>

<style scoped></style>
