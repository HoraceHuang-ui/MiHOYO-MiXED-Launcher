<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
    selection: Number
})

const pageNames = ['主页', '原神', '崩坏：星穹铁道']

const router = useRouter()
const home = () => {
    router.push("/")
}
const genshin = () => {
    router.push("/gspage")
}
const starRail = () => {
    router.push("/srpage")
}
const clearAll = async () => {
    await window.store.clear()
}
const clearPlayerInfo = async () => {
    await window.store.delete("genshinInfo")
}

const winClose = () => {
    window.win.close()
}
const winMin = () => {
    window.win.min()
}
</script>

<template>
    <div class="drag sticky flex flex-row justify-between z-50 top-0 w-full left-0 bg-white" style="height: 8vh;">
        <!-- <div class="no-drag flex flex-row mt-3" style="width: 35vw;">
            <el-button @click="clearAll">清除全部</el-button>
            <el-button class="no-drag" @click="clearPlayerInfo">清除游戏数据</el-button>
        </div> -->
        <div class="mt-3 ml-2 text-left flex flex-row" style="width: 35vw;">
            <img src="../../public/favicon.ico" class="h-6 mt-1" />
            <div class="ml-2" style="margin-top: 2px;">miXeD Launcher · {{ pageNames[selection - 1] }}</div>
        </div>
        <div class="no-drag flex flex-row h-full items-center justify-items-center">
            <img src="../assets/homeicon.png" class="mx-2 rounded-lg opacity-60 h-8" @click="home"
                :class="{ selected: props.selection == 1 }" />
            <img src="../assets/gsicon.webp" class="mx-2 rounded-lg h-8" @click="genshin"
                :class="{ selected: props.selection == 2 }" />
            <img src="../assets/sricon.webp" class="mx-2 rounded-lg h-8" @click="starRail"
                :class="{ selected: props.selection == 3 }" />
        </div>
        <div class="example focus no-drag" style="width: 35vw;">
            <div class="traffic-lights no-drag mt-2">
                <button class="traffic-light traffic-light-maximize mx-1" id="maximize"></button>
                <button class="traffic-light traffic-light-minimize mx-1" id="minimize" @click="winMin"></button>
                <button class="traffic-light traffic-light-close mx-1" id="close" @click="winClose"></button>
            </div>
        </div>
    </div>
</template>

<style>
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
