<script setup>
import { onMounted, ref } from 'vue';
import TopHeader from '../components/TopHeader.vue'
import GenshinInfoCard from '../components/GenshinInfoCard.vue'

const gsPath = ref('')
const displayConfirm = ref(false)
const path = ref('')

onMounted(async () => {
    gsPath.value = await window.store.get('genshinPath')
})

const gsImport = async () => {
    window.dialog.show({
        title: '选择原神根目录',
        properties: ['openDirectory']
    }).then((resp) => {
        path.value = resp[0];
        displayConfirm.value = true
    }).catch((error) => {
        console.error('Error in showing dialog:', error);
    });
}
const confirmPath = async () => {
    await window.store.set('genshinPath', path.value)
    gsPath.value = path.value
    displayConfirm.value = false
}
const gsLaunch = () => {
    window.child.exec(gsPath.value.concat('\\Genshin Impact Game\\YuanShen.exe'))
}
</script>

<template>
    <TopHeader :selection="2" />
    <img class="bg-pic" src="../assets/gsbanner.avif" @touchmove.prevent @mousewheel.prevent />
    <el-scrollbar height="91vh" class="scroll-wrapper">
        <div class="items-scroll">
            <div>
                <button v-if="gsPath" @click="gsLaunch" class="mainpage-button">原神启动</button>
                <button v-else @click="gsImport" class="mainpage-button">原神导入</button>
                <button v-if="displayConfirm" @click="confirmPath" class="confirm-button">确认</button>
            </div>
            <div v-if="displayConfirm">{{ path }}</div>
            <!-- <div class="gsInfoCard">
                <h2 style="margin-top: 5px;">账号信息</h2>
            </div> -->
            <GenshinInfoCard class="scroll-card"></GenshinInfoCard>
        </div>
    </el-scrollbar>
</template>

<style scoped>
/* ::-webkit-scrollbar {
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
} */

.bg-pic {
    width: 98vw;
    top: 0;
    border-radius: 20px;
    -webkit-mask: linear-gradient(white, transparent)
}

.scroll-wrapper {
    position: absolute;
    top: 9vh;
    left: 10vw;
}

.items-scroll {
    /* position: relative;
    margin-top: -35vh; */
    margin-top: 69vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    justify-items: space-between;
    /* background-color: linear-gradient(transparent, white 50%); */
    /* background: linear-gradient(180deg, rgba(2, 0, 36, 0) 0%, rgba(255, 255, 255, 1) 39%); */
}

.mainpage-button {
    font-weight: bold;
    font-size: 20px;
    background-color: rgb(255, 208, 114);
    margin: 10px;
}

.confirm-button {
    border-color: rgb(255, 208, 114);
    border-width: 3px;
    margin: 5px;
}

.scroll-card {
    width: 100%;
    border-radius: 10px;
}

.gsInfoCard {
    padding: 10px;
    width: 80vw;
    height: 90vh;
    background-color: white;
    border-radius: 10px;
}
</style>
