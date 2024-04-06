<script setup lang="ts">
import { PropType } from 'vue'
import { translate } from '../../../i18n'

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
  @apply border-2 mx-3 h-9 p-1 rounded-full transition-all cursor-default shadow-lg;
  background-color: #3e4555;
  border-color: #4a5366;

  .dark & {
    background-color: #ece4d7;
    border-color: #ece4d7;
  }

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

  .dark & {
    color: #3e4555;
  }
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
