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
    window.win.min()
}
</script>

<template>
    <TopHeader :selection="3" />
    <div class="bg">
        <img class="bg-pic rounded-3xl" src="../assets/srbanner.webp" />
        <div class="bottom-mask sticky bottom-0"></div>
        <div class="bottom-area sticky bottom-0">
            <div class="flex flex-row justify-center">
                <button v-if="srPath" @click="srLaunch" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">星铁启动</button>
                <button v-else @click="srImport" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">星铁导入</button>
                <button v-if="displayConfirm" @click="confirmPath"
                    class="p-3 mx-2 my-2 text-xl bg-white border-3 border-yellow-500">确认</button>
            </div>
            <div v-if="displayConfirm">{{ path }}</div>
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
    height: 20vh;
}

.bottom-mask {
    height: 60vh;
}
</style>
