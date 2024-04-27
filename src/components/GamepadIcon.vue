<script setup lang="ts">
import { inject, PropType, Ref, ref } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  gpType: {
    typeType: String as PropType<'Xbox' | 'PS'>,
    required: false,
  },
})

const injectGpType = inject<Ref<string>>('gpType', ref('Xbox'))
</script>

<template>
  <img
    :src="`../../src/assets/gpIcons/${gpType || injectGpType}/${icon}.png`"
  />
</template>

<style scoped lang="scss"></style>
