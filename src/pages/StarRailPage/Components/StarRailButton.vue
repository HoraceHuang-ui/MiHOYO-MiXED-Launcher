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
    <div
      class="rounded-full border border-gray-300 w-full h-full flex flex-row justify-center text-black"
    >
      <div v-if="type === 'cancel'" class="flex flex-row mt-0.5">
        <i class="bi bi-x button-icon" />
        <div>
          {{ text && text !== '' ? text : translate('general_cancel') }}
        </div>
      </div>
      <div v-if="type === 'ok'" class="flex flex-row mt-0.5">
        <i class="bi bi-check button-icon" />
        <div>
          {{ text && text !== '' ? text : translate('general_confirm') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-wrapper {
  @apply mx-3 h-9 p-1 rounded-full bg-white transition-all cursor-default;
  border-width: 1px;
  border-color: #262626;
}

.button-wrapper:hover {
  @apply bg-gray-100;
  border-color: white;
}

.button-wrapper:active {
  @apply bg-gray-300;
  border-color: white;
}

.button-icon {
  @apply text-center rounded-full w-5 h-5 text-orange-200 mr-2;
  background: #262626;
}
</style>
