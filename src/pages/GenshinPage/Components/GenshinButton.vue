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
  <div class="button-wrapper font-gs">
    <div v-if="type === 'cancel'" class="button">
      <i class="bi bi-x button-icon ok" />
      <div class="button-text">
        {{ text && text !== '' ? text : translate('general_cancel') }}
      </div>
      <div class="w-1" />
    </div>
    <div v-if="type === 'ok'" class="button">
      <div class="button-icon cancel">
        <div />
      </div>
      <div class="button-text">
        {{ text && text !== '' ? text : translate('general_confirm') }}
      </div>
      <div class="w-1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-wrapper {
  @apply border-2 mx-3 h-9 p-1 rounded-full bg-white transition-all cursor-default shadow-lg;
  background: #4a5366;
  border-color: #4a5366;

  &:hover {
    border-color: #ffe7b2;
  }
  &:active {
    @apply opacity-50;
  }
}

.button {
  @apply flex flex-row justify-between;
}

.button-text {
  color: #e5e2dc;
}

.button-icon {
  @apply rounded-full w-6 h-6 mr-2 text-center justify-center;
  background: #313131;

  &.ok {
    @apply text-blue-300 text-xl;
  }
  &.cancel {
    @apply flex flex-row;
    & > div {
      @apply rounded-full w-4 h-4 border-2 border-yellow-400 mt-1;
    }
  }
}
</style>
