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
}

const starRail = async () => {
    console.log("click on starrail")
    console.log(srPath.value.concat('\\Game\\StarRail.exe'))
    await window.child.exec(srPath.value.concat('\\Game\\StarRail.exe'))
}

</script>

<template>
    <TopHeader :selection="1" />
    <!-- @touchmove.prevent @mousewheel.prevent -->
    <div class="bg" @touchmove.prevent @mousewheel.prevent>
        <img class="bg-pic" src="../assets/gsbanner.avif" />
        <div class="bottom-mask"></div>
        <div class="bottom-area mask">
            <h1 style="margin-bottom: 10px;">MiHOYO MiXED Launcher</h1>
            <button v-if="gsPath" @click="genshin" class="mainpage-button">原神启动</button>
            <button v-if="srPath" @click="starRail" class="mainpage-button">星铁启动</button>
        </div>
    </div>
</template>

<style scoped>
/* ::-webkit-scrollbar {
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
} */

/* .bg {
    height: 90vh;
    width: 96vw;
    justify-content: center;
    align-items: center;
    justify-content: center;
    align-content: center;
    border-radius: 30px;
} */

.bg-pic {
    width: 98vw;
    border-radius: 20px;
    -webkit-mask: linear-gradient(white, transparent)
}

.bottom-area {
    position: sticky;
    bottom: 10px;
    height: 20vh;
}

.bottom-mask {
    position: sticky;
    bottom: 0;
    height: 60vh;
}

.mainpage-button {
    font-weight: bold;
    font-size: 20px;
    background-color: rgb(255, 208, 114);
    margin: 5px;
}
</style>
