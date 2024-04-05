<script setup lang="ts">
const state = defineModel({
  type: Number,
  required: true,
})

const emit = defineEmits(['change'])

const change = (newState: number) => {
  state.value = newState
  emit('change', newState)
}
</script>

<template>
  <div class="wrapper">
    <div class="left" :class="{ selected: state == 1 }" @click="change(1)">
      <slot name="left" />
    </div>
    <div :class="{ selected: state == 2 }" @click="change(2)">
      <slot name="mid" />
    </div>
    <div class="right" :class="{ selected: state == 3 }" @click="change(3)">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  @apply flex flex-row rounded-full;
  @apply bg-white border-2 border-blue-300;
  @apply *:border *:border-blue-500 *:cursor-pointer *:transition-all;
  @apply *:h-8 *:pt-0.5 *:px-3;

  .dark & {
    @apply bg-gray-800 border-2 border-blue-800;
    @apply *:border *:border-blue-800;
  }
}

.left {
  @apply rounded-l-full;
}

.right {
  @apply rounded-r-full;
}

.selected {
  @apply bg-blue-500 text-white cursor-default;

  .dark & {
    @apply bg-blue-700;
  }
}
</style>
