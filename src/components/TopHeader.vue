<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
    selection: Number
})

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
    console.log("click on close")
    window.win.close()
}
</script>

<template>
    <div class="drag sticky flex flex-row justify-between z-50 top-0 w-full left-0 bg-white" style="height: 8vh;">
        <div class="no-drag flex flex-row mt-3" style="width: 35vw;">
            <el-button @click="clearAll">清除全部</el-button>
            <el-button class="no-drag" @click="clearPlayerInfo">清除游戏数据</el-button>
        </div>
        <div class="no-drag flex flex-row h-full items-center justify-items-center">
            <img src="../assets/homeicon.png" class="mx-2 rounded-lg opacity-60" @click="home"
                :class="{ selected: props.selection == 1 }" style="height: 6vh;" />
            <img src="../assets/gsicon.webp" class="mx-2 rounded-lg" @click="genshin"
                :class="{ selected: props.selection == 2 }" style="height: 6vh;" />
            <img src="../assets/sricon.webp" class="mx-2 rounded-lg" @click="starRail"
                :class="{ selected: props.selection == 3 }" style="height: 6vh;" />
        </div>
        <div class="example focus no-drag" style="width: 35vw;">
            <div class="traffic-lights no-drag">
                <button class="traffic-light traffic-light-maximize mx-1" id="maximize"></button>
                <button class="traffic-light traffic-light-minimize mx-1" id="minimize"></button>
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
    background-color: lightblue;
    border: 5px solid rgb(121, 184, 255);
}
</style>
