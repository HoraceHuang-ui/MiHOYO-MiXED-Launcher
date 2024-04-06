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
  <div class="button-wrapper" :class="`bg-${type}`">
    <div class="button" v-if="type === 'cancel'">
      <img src="../../../assets/hi3Dialog/hi3DialogCancel.png" />
      <div class="button-text">
        {{ text && text !== '' ? text : translate('general_cancel') }}
      </div>
    </div>
    <div class="button" v-if="type === 'ok'">
      <img src="../../../assets/hi3Dialog/hi3DialogOk.png" />
      <div class="button-text">
        {{ text && text !== '' ? text : translate('general_confirm') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-wrapper {
  @apply mx-3 h-9 rounded transition-all cursor-default;

  &:hover {
    @apply opacity-70;
  }
  &:active {
    @apply opacity-50;
  }
}

.button {
  @apply flex flex-row mt-0.5 size-full justify-center;

  img {
    @apply h-2/3 mt-1 mr-2;
  }
}

.button-text {
  @apply font-bold mt-0.5;

  .dark & {
    @apply text-black;
  }
}

.bg-cancel {
  background: #4cc5fe;
}

.bg-ok {
  background: #fbe05b;
}
</style>
