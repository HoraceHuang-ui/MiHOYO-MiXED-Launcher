<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  itemClass: {
    type: String,
  },
  modelValue: {
    type: Number,
    default: -1,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectionChange = (idx: number) => {
  emit('update:modelValue', idx)
  emit('change', idx)
}
</script>

<template>
  <MyDropdown
    :items="items"
    class="w-fit"
    :item-class="itemClass"
    :selected="modelValue"
    @command="selectionChange"
  >
    <div
      class="w-fit rounded-full py-1 px-3 flex flex-row justify-between bg-white"
    >
      <div class="mr-4">{{ modelValue == -1 ? '' : items[modelValue] }}</div>
      <i class="bi bi-chevron-down" />
    </div>
  </MyDropdown>
</template>

<style scoped></style>
