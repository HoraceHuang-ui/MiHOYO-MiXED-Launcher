<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    gameNo: Number,
    errMsg: String
})

const imgs = ['../../src/assets/failedEmojis/kleeFailed.png', '../../src/assets/failedEmojis/wuwuboFailed.png', '../../src/assets/failedEmojis/hi3Failed.png']
const sources = ['/gspage', '/srpage', '/hipage']

const router = useRouter()
const refresh = () => {
    router.push({
        name: 'tempPage',
        query: {
            from: sources[props.gameNo]
        }
    })
}
</script>

<template>
    <div class="items-center justify-center text-center">
        <img :src="imgs[props.gameNo]" class="object-scale-down -translate-x-1/2" style="margin-left: 50%;" loading="eager"
            height="120" width="120" />
        <div class="mt-3 text-xl"
            :class="{ 'font-genshin': props.gameNo == 0 }, { 'font-sr': props.gameNo == 1 }, { 'font-semibold': props.gameNo == 2 }">
            {{ $t("general_loadingFailed") }}</div>
        <div class=" hover:underline active:text-orange-300 text-blue-500 cursor-pointer -translate-x-1/2"
            style="margin-left: 50%;" @click="refresh">{{ $t('general_refresh') }}</div>
        <div class="text-center max-w-xl mt-5">{{ errMsg }}</div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-sr {
    font-family: sr-font;
}

.font-genshin {
    font-family: genshin-font;
}
</style>
