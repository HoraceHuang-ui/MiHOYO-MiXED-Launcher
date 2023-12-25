<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { translate } from '../i18n'
// const props = defineProps({
//     selection: Number
// })

const pageNames = [translate('general_mainpage'), translate('general_gs'), translate('general_sr'), translate('general_hi3'), translate('general_settings')]
const selection = ref(0)

const router = useRouter()
const home = () => {
    selection.value = 0
    router.push("/")
}
const genshin = () => {
    selection.value = 1
    router.push("/gspage")
}
const starRail = () => {
    selection.value = 2
    router.push("/srpage")
}
const honkai3 = () => {
    selection.value = 3
    router.push("/hipage")
}
const settings = () => {
    selection.value = 4
    router.push("/settingspage")
}

const winClose = async () => {
    const quitOnClose = await window.store.get('quitOnClose')
    if (quitOnClose) {
        await window.win.close()
    } else {
        await window.win.tray()
    }
}
const winMin = () => {
    window.win.min()
}
</script>

<template>
    <div class="drag sticky flex flex-row justify-between z-50 top-0 w-full left-0" style="height: 8vh;">
        <!-- <div class="no-drag flex flex-row mt-3" style="width: 35vw;">
            <el-button @click="clearAll">清除全部</el-button>
            <el-button class="no-drag" @click="clearPlayerInfo">清除游戏数据</el-button>
        </div> -->
        <div class="mt-3 ml-2 text-left flex flex-row" style="width: 35vw;">
            <img src="../../public/favicon.ico" class="h-6 mt-1" />
            <div class="ml-2" style="margin-top: 2px;">miXeD · {{ pageNames[selection] }}</div>
        </div>
        <div class="no-drag flex flex-row h-full items-center justify-items-center">
            <img src="../assets/homeicon.png"
                class="mx-2 rounded-lg opacity-60 h-8 transition-all hover:scale-110 active:scale-90" @click="home"
                :class="{ 'selected hover:scale-100': selection == 0 }" />
            <img src="../assets/gsicon.webp" class="mx-2 rounded-lg h-8 transition-all hover:scale-110 active:scale-90"
                @click="genshin" :class="{ 'selected hover:scale-100': selection == 1 }" />
            <img src="../assets/sricon.webp" class="mx-2 rounded-lg h-8 transition-all hover:scale-110 active:scale-90"
                @click="starRail" :class="{ 'selected hover:scale-100': selection == 2 }" />
            <img src="../assets/hi3icon.png" class="mx-2 rounded-lg h-8 transition-all hover:scale-110 active:scale-90"
                @click="honkai3" :class="{ 'selected hover:scale-100': selection == 3 }" />
            <img src="../assets/settingsIcon.png" @click="settings"
                class="mx-2 rounded-lg opacity-60 h-8 transition-all hover:scale-110 active:scale-90"
                style="padding: 2px   ;" :class="{ 'selected hover:scale-100': selection == 4 }" />
        </div>
        <div class="example focus drag" style="width: 35vw;">
            <div class="traffic-lights no-drag mt-2">
                <button class="traffic-light traffic-light-maximize mx-1" id="maximize"></button>
                <button class="traffic-light traffic-light-minimize mx-1" id="minimize" @click="winMin"></button>
                <button class="traffic-light traffic-light-close mx-1" id="close" @click="winClose"></button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.drag {
    -webkit-app-region: drag;
}

.no-drag {
    -webkit-app-region: no-drag;
}

.selected {
    height: 6vh;
    background-color: lightblue;
    border: 5px solid rgb(121, 184, 255);
}
</style>
