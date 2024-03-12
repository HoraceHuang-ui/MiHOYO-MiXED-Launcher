<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
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
const emit = defineEmits(['update:modelValue'])

const switchStatus = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    @click="switchStatus"
    class="flex flex-row cursor-pointer hover:text-green-600"
    :class="modelValue ? 'font-bold' : ''"
    :style="{ color: modelValue ? onColor : offColor }"
  >
    <i v-if="modelValue" class="bi bi-check-circle-fill mr-1" />
    <i v-else class="bi bi-circle mr-1" />
    {{ text }}
  </div>
</template>

<style scoped></style>
