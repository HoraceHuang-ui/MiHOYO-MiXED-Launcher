<script setup lang="ts">
import { marked } from 'marked'
import { translate } from '../i18n'
import MyCheckbox from './MyCheckbox.vue'
import { computed, PropType } from 'vue'
import ScrollWrapper from './ScrollWrapper.vue'
import { UpdInfo } from '../types/upd/updates'

const props = defineProps({
  appVer: {
    type: String,
    required: true,
  },
  updInfo: {
    type: Object as PropType<UpdInfo>,
    required: true,
  },
  gameStyle: {
    type: String as PropType<'gs' | 'sr' | 'hi3' | 'zzz'>,
    default: 'gs',
  },
  skipCurrent: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['update:skipCurrent'])

const updDialogContent = marked(props.updInfo.desc)

const onColor = computed(() => {
  switch (props.gameStyle) {
    case 'gs':
      return '#b78c22'
    case 'sr':
      return '#CEA652'
    case 'hi3':
      return '#4CC5FE'
    case 'zzz':
      return '#93bc00'
  }
})
const offColor = computed(() => {
  switch (props.gameStyle) {
    case 'gs':
      return '#606266'
    case 'sr':
      return '#606266'
    case 'hi3':
      return '#dddddd'
    case 'zzz':
      return '#dddddd'
  }
})

const colorClass = computed(() => {
  switch (props.gameStyle) {
    case 'sr':
      return 'text-color-sr'
    case 'hi3':
      return 'text-color-hi3'
    case 'zzz':
      return 'text-color-hi3'
    default:
      return 'text-color-normal'
  }
})
</script>

<template>
  <div class="main-wrapper">
    <ScrollWrapper style="max-height: calc(100% - 70px)" show-bar="always">
      <div v-html="updDialogContent"></div>
    </ScrollWrapper>
    <div :class="colorClass" style="margin-top: 10px">
      {{ translate('updDialog_version') }}v{{ appVer }} 👉
      {{ updInfo.version }}
    </div>
    <div :class="colorClass">
      {{ translate('updDialog_size')
      }}{{ (updInfo.size / 1024 / 1024).toFixed(1) }}MB
    </div>
    <div :class="colorClass">
      {{ translate('updDialog_footerText') }}
    </div>
    <MyCheckbox
      :model-value="skipCurrent"
      @update:model-value="(nv: boolean) => $emit('update:skipCurrent', nv)"
      :text="translate('updDialog_skipCurrent')"
      :on-color="onColor"
      :off-color="offColor"
    />
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply px-[20px] pb-4;
}

.text-color-normal {
  @apply text-red-600;

  .dark & {
    @apply text-red-400;
  }
}

.text-color-sr {
  @apply text-red-600;
}

.text-color-hi3 {
  @apply text-red-400;
}
</style>
