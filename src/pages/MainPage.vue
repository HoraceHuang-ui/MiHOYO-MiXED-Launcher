<script setup>
import { ref, onMounted } from 'vue'
import { Picture, RefreshLeft } from '@element-plus/icons-vue'
import { translate } from '../i18n/index'

const gsPath = ref('')
const srPath = ref('')
const hiPath = ref('')
const transitionShow = ref(false)
const bgPath = ref('')

const DEFAULT_BG = '../../src/assets/gsbanner.png'

onMounted(async () => {
    // For electron-store test
    // await window.store.clear()

    gsPath.value = await window.store.get('genshinPath')
    srPath.value = await window.store.get('starRailPath')
    hiPath.value = await window.store.get('honkai3Path')
    bgPath.value = await window.store.get('mainBgPath')
    const imgElement = document.getElementById('bgImage');
    imgElement.src = bgPath.value ? bgPath.value : DEFAULT_BG;
    transitionShow.value = true
})

const genshin = async () => {
    window.child.exec(gsPath.value.concat('\\Genshin Impact Game\\YuanShen.exe'))
    window.win.tray()
}

const starRail = async () => {
    await window.child.exec(srPath.value.concat('\\Game\\StarRail.exe'))
    window.win.tray()
}

const honkai3 = async () => {
    await window.child.exec(hiPath.value.concat('\\Games\\BH3.exe'))
    window.win.tray()
}

const setPic = async () => {
    window.dialog.showAndCopy({
        title: translate('mainBgDialog_title'),
        properties: ['openFile'],
        filters: [{ name: translate('mainBgDialog_filter'), extensions: ['jpg', 'png', 'webp'] }]
    }).then((resp) => {
        if (resp) {
            bgPath.value = resp
            window.store.set('mainBgPath', bgPath.value, false)

            const imgElement = document.getElementById('bgImage');
            imgElement.src = resp;
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error);
    });
}

const resetPic = () => {
    bgPath.value = DEFAULT_BG
    window.store.delete('mainBgPath')
}
</script>

<template>
    <div @touchmove.prevent @mousewheel.prevent :class="transitionShow ? '' : 'opacity-0 blur-lg scale-90'"
        style="transition-duration: 400ms;">
        <img class="bg-pic object-cover" id="bgImage" :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'" />
        <div class="sticky bottom-0" style="height: 60vh;"></div>
        <div class="bottom-area sticky">
            <h1 class="font-sans font-bold text-5xl" style="margin-bottom: 10px; font-family: 'genshin-font';">{{ $t('mainpage_title') }}</h1>
            <button v-if="gsPath" @click="genshin"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default">{{
                    $t('mainpage_buttonText', { game: $t('general_gsShort') }) }}</button>
            <button v-if="srPath" @click="starRail"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default">{{
                    $t('mainpage_buttonText', { game: $t('general_srShort') }) }}</button>
            <button v-if="hiPath" @click="honkai3"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default">{{
                    $t('mainpage_buttonText', { game: $t('general_hi3Short') }) }}</button>
        </div>
        <div class="rounded-full absolute left-8 bottom-4 w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all"
            @click="setPic">
            <el-icon :size="20" class="w-full h-full">
                <Picture />
            </el-icon>
        </div>
        <div v-if="bgPath && bgPath !== DEFAULT_BG"
            class="rounded-full absolute left-20 bottom-4 w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all"
            @click="resetPic">
            <el-icon :size="20" class="w-full h-full">
                <RefreshLeft />
            </el-icon>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-pic {
    width: 98vw;
    height: 92vh;
    border-radius: 24px 24px 0 0;
    -webkit-mask: linear-gradient(white 30%, rgb(255 255 255 / 0.1))
}

.bottom-area {
    bottom: 10px;
    height: 20vh;
}
</style>
