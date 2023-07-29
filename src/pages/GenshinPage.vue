<script setup>
import { onMounted, ref } from 'vue';
import TopHeader from '../components/TopHeader.vue'

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
    <div class="bg">
        <img class="bg-pic" src="../assets/gsbanner.avif" />
        <div class="bottom-mask"></div>
        <div class="bottom-area mask">
            <div class="path-confirm">
                <button v-if="gsPath" @click="gsLaunch" class="mainpage-button">原神启动</button>
                <button v-else @click="gsImport" class="mainpage-button">原神导入</button>
                <button v-if="displayConfirm" @click="confirmPath" class="confirm-button">确认</button>
            </div>
            <div v-if="displayConfirm">{{ path }}</div>
        </div>
    </div>
</template>

<style scoped>
.path-confirm {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

/* ::-webkit-scrollbar {
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
} */

.bg {
    height: 90vh;
    width: 96vw;
    justify-content: center;
    align-items: center;
    justify-content: center;
    align-content: center;
    border-radius: 30px;
}

.bg-pic {
    width: 100%;
    border-radius: 20px;
    -webkit-mask: linear-gradient(white, transparent)
}

.bottom-area {
    position: sticky;
    bottom: 0;
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

.confirm-button {
    border-color: rgb(255, 208, 114);
    border-width: 3px;
    margin: 5px;
}
</style>
