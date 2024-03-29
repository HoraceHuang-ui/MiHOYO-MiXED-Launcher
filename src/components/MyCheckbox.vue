<script setup lang="ts">
import { defineModel } from 'vue'

const state = defineModel({
  type: Boolean,
  required: true,
})

defineProps({
  text: {
    type: String,
    default: 'Checkbox',
  },
  onColor: {
    type: String,
    default: '#409EFF',
  },
  offColor: {
    type: String,
    default: '#606266',
  },
})
</script>

<template>
  <div
    @click="state = !state"
    class="flex flex-row cursor-pointer hover:text-green-600"
    :class="state ? 'font-bold' : ''"
    :style="{ color: state ? onColor : offColor }"
  >
    <i v-if="state" class="bi bi-check-circle-fill mr-1" />
    <i v-else class="bi bi-circle mr-1" />
    {{ text }}
  </div>
</template>

<style scoped></style>
