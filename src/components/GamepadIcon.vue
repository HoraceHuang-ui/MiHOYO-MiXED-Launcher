<script setup lang="ts">
import { inject, Ref, ref } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
})

const gpType = inject<Ref<string>>('gpType', ref('Xbox'))
</script>

<template>
  <img :src="`../../src/assets/gpIcons/${gpType || 'Xbox'}/${icon}.png`" />
</template>

<style scoped lang="scss"></style>
