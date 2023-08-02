<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
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
</script>

<template>
    <div class="navbar sticky flex flex-row justify-between p-2 z-50 top-0 w-full left-0 bg-white" style="height: 8vh;">
        <div>
            <el-button @click="clearAll">清除全部</el-button>
        </div>
        <div class="navbar-mid flex flex-row h-full items-center justify-items-center">
            <img src="../assets/homeicon.png" class="mx-2 rounded-lg opacity-60" @click="home"
                :class="{ selected: props.selection == 1 }" style="height: 6vh;" />
            <img src="../assets/gsicon.webp" class="mx-2 rounded-lg" @click="genshin"
                :class="{ selected: props.selection == 2 }" style="height: 6vh;" />
            <img src="../assets/sricon.webp" class="mx-2 rounded-lg" @click="starRail"
                :class="{ selected: props.selection == 3 }" style="height: 6vh;" />
        </div>
        <el-button @click="clearPlayerInfo">清除游戏数据</el-button>
    </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.navbar {
    /* -webkit-app-region: drag; */
}

.navbar-mid {
    /* -webkit-app-region: no-drag; */
}

.selected {
    background-color: lightblue;
    border: 5px solid rgb(121, 184, 255);
}
</style>
