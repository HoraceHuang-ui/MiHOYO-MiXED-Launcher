<script setup lang="ts">
const props = defineProps({
  name: String,
  val: String,
})
</script>

<template>
  <div class="main-wrapper">
    <div class="left-wrapper">
      <div class="icon-wrapper">
        <slot name="icon"></slot>
      </div>
      <div class="prop-text">{{ props.name }}</div>
    </div>
    <div>{{ props.val }}</div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply flex flex-row justify-between my-1;
}

.left-wrapper {
  @apply flex flex-row;
}

.icon-wrapper {
  @apply w-4 mr-2 mt-0.5;
}

.prop-text {
  @apply font-normal font-sans;
}
</style>
