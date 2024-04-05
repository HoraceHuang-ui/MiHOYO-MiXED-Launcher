<script setup lang="ts">
import { BannerInfo } from '../types/launcher/launcherInfo'
import { PropType } from 'vue'
import MyCarousel from './MyCarousel.vue'

defineProps({
  banners: {
    type: Array as PropType<BannerInfo[]>,
    default: Array.of(),
  },
})

const openLink = (url: string) => {
  window.electron.openExtLink(url)
}
</script>

<template>
  <MyCarousel
    show-arrow="hover"
    show-indicator="hover"
    indicator-style="circle"
  >
    <img
      v-for="banner in banners"
      @click="openLink(banner.url)"
      :src="banner.img"
      :key="banner.banner_id"
    />
  </MyCarousel>
</template>

<style lang="scss" scoped>
img {
  @apply object-scale-down cursor-pointer;

  .dark & {
    @apply brightness-75;
  }
}
</style>
