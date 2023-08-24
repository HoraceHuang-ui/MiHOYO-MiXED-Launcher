<script setup>
import { ref, onMounted } from 'vue'

const gsPath = ref('')
const srPath = ref('')
const hiPath = ref('')
const transitionShow = ref(false)

onMounted(async () => {
    // For electron-store test
    // await window.store.clear()

    gsPath.value = await window.store.get('genshinPath')
    srPath.value = await window.store.get('starRailPath')
    hiPath.value = await window.store.get('honkai3Path')
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
</script>

<template>
    <!-- @touchmove.prevent @mousewheel.prevent -->
    <div @touchmove.prevent @mousewheel.prevent :class="transitionShow ? '' : 'opacity-0 blur-lg scale-90'"
        style="transition-duration: 400ms;">
        <!-- <el-dropdown class="absolute right-2 top-2 z-50 font-bold text-lg rounded-2xl bg-yellow-400 p-3" size="large">
            打开启动器
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        aaa
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown> -->
        <img class="bg-pic rounded-3xl" src="../assets/gsbanner.png" />
        <div class="sticky bottom-0" style="height: 60vh;"></div>
        <div class="bottom-area sticky">
            <h1 class="font-sans font-bold text-5xl" style="margin-bottom: 10px;">MiHOYO MiXED Launcher</h1>
            <button v-if="gsPath" @click="genshin"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90">原神启动</button>
            <button v-if="srPath" @click="starRail"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90">星铁启动</button>
            <button v-if="hiPath" @click="honkai3"
                class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90">崩坏3启动</button>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-pic {
    width: 98vw;
    -webkit-mask: linear-gradient(white, transparent)
}

.bottom-area {
    bottom: 10px;
    height: 20vh;
}
</style>
