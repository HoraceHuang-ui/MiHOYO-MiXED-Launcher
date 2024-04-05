<script setup lang="ts">
import { translate } from '../../../i18n'
import { PropType } from 'vue'

defineProps({
  // 'ok' | 'cancel'
  type: {
    type: String as PropType<'ok' | 'cancel'>,
    default: 'ok',
  },
  text: {
    type: String,
  },
})
</script>

<template>
  <div class="button-wrapper font-sr-sans">
    <div class="button-contents-wrapper">
      <div v-if="type === 'cancel'" class="button-content">
        <i class="bi bi-x button-icon" />
        <div>
          {{ text && text !== '' ? text : translate('general_cancel') }}
        </div>
      </div>
      <div v-if="type === 'ok'" class="button-content">
        <i class="bi bi-check button-icon" />
        <div>
          {{ text && text !== '' ? text : translate('general_confirm') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-wrapper {
  @apply mx-3 h-9 p-1 rounded-full bg-white transition-all cursor-default;
  border-width: 1px;
  border-color: #262626;

  &:hover {
    @apply bg-gray-100;
    border-color: white;
  }
  &:active {
    @apply bg-gray-300;
    border-color: white;
  }
}

.button-contents-wrapper {
  @apply w-full h-full flex flex-row justify-center rounded-full;
  @apply border border-gray-300 text-black;
}

.button-content {
  @apply flex flex-row mt-0.5;
}

.button-icon {
  @apply text-center rounded-full w-5 h-5 text-orange-200 mr-2;
  background: #262626;
}
</style>
