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
    <img class="bg-pic top-0 rounded-3xl" src="../assets/gsbanner.avif" @touchmove.prevent @mousewheel.prevent />
    <el-scrollbar height="91vh" class="scroll-wrapper absolute">
        <div class="items-scroll flex flex-col space-x-1 content-center items-center">
            <div>
                <button v-if="gsPath" @click="gsLaunch" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">原神启动</button>
                <button v-else @click="gsImport" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">原神导入</button>
                <button v-if="displayConfirm" @click="confirmPath"
                    class="p-3 mx-2 my-2 text-xl bg-white border-3 border-yellow-500">确认</button>
            </div>
            <div v-if="displayConfirm">{{ path }}</div>
            <GenshinInfoCard class="my-2 w-full"></GenshinInfoCard>
        </div>
    </el-scrollbar>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-pic {
    width: 98vw;
    -webkit-mask: linear-gradient(white, transparent)
}

.scroll-wrapper {
    top: 10vh;
    left: 10vw;
}

.items-scroll {
    margin-top: 69vh;
    width: 80vw;
}
</style>
