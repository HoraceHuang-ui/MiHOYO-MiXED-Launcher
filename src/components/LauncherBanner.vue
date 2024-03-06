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
  <MyCarousel show-arrow="hover">
    <img
      v-for="banner in banners"
      @click="openLink(banner.url)"
      class="object-scale-down cursor-pointer"
      :src="banner.img"
      :key="banner.banner_id"
    />
  </MyCarousel>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
