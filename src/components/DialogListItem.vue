<script setup lang="ts">
const props = defineProps({
  name: String,
  val: String,
})
</script>

<template>
  <div class="flex flex-row justify-between my-1">
    <div class="flex flex-row">
      <div class="w-4 mr-2 mt-0.5">
        <slot name="icon"></slot>
      </div>
      <div class="font-normal font-sans">{{ props.name }}</div>
    </div>
    <div>{{ props.val }}</div>
    <slot></slot>
  </div>
</template>

<style scoped></style>
