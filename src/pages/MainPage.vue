<script setup>
import { ref, onMounted } from 'vue'
import TopHeader from '../components/TopHeader.vue'

const gsPath = ref('')
const srPath = ref('')

onMounted(async () => {
    // For electron-store test
    // await window.store.clear()

    gsPath.value = await window.store.get('genshinPath')
    srPath.value = await window.store.get('starRailPath')
})

const genshin = async () => {
    console.log("click on genshin")
    console.log(gsPath.value.concat('\\Genshin Impact Game\\YuanShen.exe'))
    window.child.exec(gsPath.value.concat('\\Genshin Impact Game\\YuanShen.exe'))
    window.win.tray()
}

const starRail = async () => {
    console.log("click on starrail")
    console.log(srPath.value.concat('\\Game\\StarRail.exe'))
    await window.child.exec(srPath.value.concat('\\Game\\StarRail.exe'))
    window.win.tray()
}

</script>

<template>
    <TopHeader :selection="1" />
    <!-- @touchmove.prevent @mousewheel.prevent -->
    <div class="bg" @touchmove.prevent @mousewheel.prevent>
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
        <img class="bg-pic rounded-3xl" src="../assets/gsbanner.jpg" />
        <div class="sticky bottom-0" style="height: 60vh;"></div>
        <div class="bottom-area sticky">
            <h1 class="font-sans font-bold text-5xl" style="margin-bottom: 10px;">MiHOYO MiXED Launcher</h1>
            <button v-if="gsPath" @click="genshin" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">原神启动</button>
            <button v-if="srPath" @click="starRail" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">星铁启动</button>
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
