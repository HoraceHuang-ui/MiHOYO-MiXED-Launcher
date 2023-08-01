<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const props = defineProps({
    selection: Number
})

const selection = ref(1)
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
    <div class="navbar">
        <div>
            <el-button @click="clearAll">清除全部</el-button>
        </div>
        <div class="navbar-mid">
            <img src="../assets/homeicon.png" class="navbar-homeicon" @click="home"
                :class="{ selected: props.selection == 1 }" style="opacity: 60%;" />
            <img src="../assets/gsicon.webp" class="navbar-gameicon" @click="genshin"
                :class="{ selected: props.selection == 2 }" />
            <img src="../assets/sricon.webp" class="navbar-gameicon" @click="starRail"
                :class="{ selected: props.selection == 3 }" />
        </div>
        <el-button @click="clearPlayerInfo">清除游戏数据</el-button>
    </div>
</template>

<style>
.navbar {
    position: sticky;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    z-index: 2001;
    top: 0px;
    height: 8vh;
    width: 100%;
    left: 0px;
    background-color: white;
    /* -webkit-app-region: drag; */
}

.navbar-mid {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    /* -webkit-app-region: no-drag; */
}

.navbar-gameicon {
    height: 6vh;
    margin-left: 20px;
    border-radius: 20%;
}

.navbar-homeicon {
    height: 6vh;
    margin-left: 20px;
    border-radius: 20%;
}

.selected {
    background-color: lightblue;
    border: 5px solid rgb(121, 184, 255);
}

.navbar-selection {
    position: absolute;
    height: 9vh;
    margin-left: 1vh;
    border-radius: 20%;
}
</style>
