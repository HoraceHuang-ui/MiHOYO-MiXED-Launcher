<script setup>
const props = defineProps({
    banners: {}
})

const openLink = (url) => {
    window.electron.openExtLink(url)
}
</script>

<template>
    <el-carousel arrow="hover" :interval="5000" indicator-position="none">
        <el-carousel-item class=" cursor-pointer" v-for="banner in banners" @click="openLink(banner.url)">
            <img class=" object-scale-down" :src="banner.img" />
        </el-carousel-item>
    </el-carousel>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
