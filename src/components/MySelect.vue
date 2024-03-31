<script setup lang="ts">
import { defineModel, PropType } from 'vue'

const selectedIdx = defineModel({
  type: Number,
  default: -1,
})

const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  selectorClass: {
    type: String,
  },
  selectorStyle: {
    type: Object as PropType<Record<string, any>>,
  },
  itemClass: {
    type: String,
  },
  modelValue: {
    type: Number,
    default: -1,
  },
  middle: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectionChange = (idx: number) => {
  selectedIdx.value = idx
  if (idx === props.modelValue) {
    return
  }
  emit('change', idx)
}
</script>

<template>
  <MyDropdown
    :items="items"
    :item-class="itemClass"
    :selected="selectedIdx"
    :middle="middle"
    trigger="click"
    @command="selectionChange"
  >
    <div class="selector-wrapper" :class="selectorClass" :style="selectorStyle">
      {{ selectedIdx == -1 ? '' : items[selectedIdx] }}
      <i class="bi bi-chevron-down ml-4" />
    </div>
  </MyDropdown>
</template>

<style scoped>
.selector-wrapper {
  @apply w-fit py-1 px-3 rounded-full;
  @apply flex flex-row justify-between;
}
</style>
