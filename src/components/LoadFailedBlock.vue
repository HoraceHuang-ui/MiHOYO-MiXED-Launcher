<script setup lang="ts">
import { useRouter } from 'vue-router'
import MyLink from './MyLink.vue'

const props = defineProps({
  gameNo: {
    type: Number,
    default: 0,
  },
  errMsg: String,
})

const imgs = [
  '../../src/assets/failedEmojis/kleeFailed.png',
  '../../src/assets/failedEmojis/wuwuboFailed.png',
  '../../src/assets/failedEmojis/hi3Failed.png',
  '../../src/assets/failedEmojis/zzzFailed.png',
]
const sources = ['gs', 'sr', 'hi3', 'zzz']

const router = useRouter()
const refresh = () => {
  router.push({
    name: 'tempPage',
    query: {
      from: sources[props.gameNo],
    },
  })
}
</script>

<template>
  <div class="wrapper">
    <img :src="imgs[gameNo]" loading="eager" height="120" width="120" />
    <div
      class="failed-text"
      :class="{
        'font-gs': gameNo == 0,
        'font-sr': gameNo == 1,
        'font-semibold': gameNo == 2 || gameNo == 3,
      }"
    >
      {{ $t('general_loadingFailed') }}
    </div>
    <MyLink @click="refresh">
      {{ $t('general_refresh') }}
    </MyLink>
    <div class="error-msg">{{ errMsg }}</div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply items-center justify-center text-center;

  img {
    @apply object-scale-down -translate-x-1/2;
    margin-left: 50%;
  }

  a {
    @apply -translate-x-1/2;
    margin-left: 50%;
  }
}

.failed-text {
  @apply mt-3 text-xl;
}

.error-msg {
  @apply text-center max-w-xl mt-5;
}
</style>
