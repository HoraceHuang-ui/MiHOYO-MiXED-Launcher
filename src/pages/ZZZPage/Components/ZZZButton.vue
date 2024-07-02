<script setup lang="ts">
import { PropType, ref } from 'vue'
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

const state = ref(0)
const borderColor: Record<number, string> = {
  0: '#363636',
  1: '#fbdc00',
  2: '#93bc00',
}
const backgroundColor: Record<number, string> = {
  0: '#131313',
  1: '#fbdc00',
  2: '#93bc00',
}
</script>

<template>
  <div
    class="button-wrapper"
    @mouseenter="state = 1"
    @mouseleave="state = 0"
    @mousedown="state = 2"
    @mouseup="state = 0"
    :style="{
      backgroundColor: backgroundColor[state],
      borderColor: borderColor[state],
    }"
  >
    <div v-if="type === 'cancel'" class="button">
      <div class="button-icon" :style="`border-color: ${borderColor[state]}`">
        <img
          class="w-full h-full"
          :src="
            state == 0
              ? './src/assets/zzzDialog/zzzDialogCancel.png'
              : './src/assets/zzzDialog/zzzDialogCancelActive.png'
          "
        />
      </div>
      <div
        class="button-text"
        :style="{ color: state == 0 ? '#e5e2dc' : '#000' }"
      >
        {{ text && text !== '' ? text : translate('general_cancel') }}
      </div>
      <div class="w-1" />
    </div>
    <div v-if="type === 'ok'" class="button">
      <div class="button-icon" :style="`border-color: ${borderColor[state]}`">
        <img
          class="w-full h-full"
          :src="
            state == 0
              ? './src/assets/zzzDialog/zzzDialogOk.png'
              : './src/assets/zzzDialog/zzzDialogOkActive.png'
          "
        />
      </div>
      <div
        class="button-text"
        :style="{ color: state == 0 ? '#e5e2dc' : '#000' }"
      >
        {{ text && text !== '' ? text : translate('general_confirm') }}
      </div>
      <div class="w-1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-wrapper {
  @apply mx-3 h-10 rounded-full cursor-default shadow-lg;
  border: 4px solid;
}

.button {
  @apply flex flex-row justify-between;
}

.button-text {
  @apply font-bold italic mt-[3px];
}

.button-icon {
  @apply rounded-full w-10 h-10 p-1 text-center justify-center;
  border: 4px solid;
  transform: translate(-4px, -4px);
}
</style>
