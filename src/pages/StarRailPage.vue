<script setup>
import { onMounted, ref } from 'vue';
import TopHeader from '../components/TopHeader.vue'

const srPath = ref('')
const displayConfirm = ref(false)
const path = ref('')

onMounted(async () => {
    srPath.value = await window.store.get('starRailPath')
    // await window.store.delete('starRailPath')
    // await window.store.clear()
})

const srImport = async () => {
    window.dialog.show({
        title: '选择星铁根目录',
        properties: ['openDirectory']
    }).then((resp) => {
        path.value = resp[0];
        displayConfirm.value = true
    }).catch((error) => {
        console.error('Error in showing dialog:', error);
    });
}
const confirmPath = async () => {
    await window.store.set('starRailPath', path.value)
    srPath.value = path.value
    displayConfirm.value = false
}
const srLaunch = () => {
    window.child.exec(srPath.value.concat('\\Game\\StarRail.exe'))
}
</script>

<template>
    <TopHeader :selection="3" />
    <div class="bg">
        <el-scrollbar height="90vh">
            <img class="bg-pic" src="../assets/srbanner.webp" />
            <div class="bottom-mask"></div>
            <div class="bottom-area mask">
                <div class="path-confirm">
                    <button v-if="srPath" @click="srLaunch" class="mainpage-button">星铁启动</button>
                    <button v-else @click="srImport" class="mainpage-button">星铁导入</button>
                    <button v-if="displayConfirm" @click="confirmPath" class="confirm-button">确认</button>
                </div>
                <div v-if="displayConfirm">{{ path }}</div>
            </div>
        </el-scrollbar>
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
