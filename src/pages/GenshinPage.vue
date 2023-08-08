<script setup>
import { onMounted, ref } from 'vue';
import TopHeader from '../components/TopHeader.vue'
import GenshinInfoCard from '../components/GenshinInfoCard.vue'
import { useRouter } from 'vue-router'

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
    window.win.tray()
}

const router = useRouter()
const handleCommand = (command) => {
    switch (command) {
        case 'openLauncher':
            window.child.exec(gsPath.value.concat('\\launcher.exe'))
            break
        case 'clearPath':
            window.store.delete('genshinPath')
            gsPath.value = ''
            break
        case 'clearPlayerinfo':
            window.store.delete('genshinInfo')
            router.push('/tmpgspage')
            break
    }
}
</script>

<template>
    <TopHeader :selection="2" />
    <img class="bg-pic top-0 rounded-3xl" src="../assets/gsbanner.jpg" @touchmove.prevent @mousewheel.prevent />
    <el-scrollbar height="91vh" class="scroll-wrapper absolute">
        <div class="items-scroll flex flex-col content-center items-center">
            <div>
                <div v-if="gsPath">
                    <div class="mx-2 my-2 flex flex-row rounded-full bg-yellow-400 font-genshin">
                        <button @click="gsLaunch" class="ml-4 text-xl font-bold">原神启动</button>
                        <el-dropdown class="h-full p-3" trigger="click" @command="handleCommand">
                            <button class="text-xl font-bold">…</button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="openLauncher">打开官方启动器</el-dropdown-item>
                                    <el-dropdown-item command="clearPath" divided>清除游戏路径</el-dropdown-item>
                                    <el-dropdown-item command="clearPlayerinfo">清除游戏数据</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
                <button v-else @click="gsImport"
                    class="font-genshin p-3 mx-2 my-2 font-bold text-xl bg-yellow-400">原神导入</button>
                <button v-if="displayConfirm" @click="confirmPath"
                    class="p-3 mx-2 my-2 text-xl bg-white border-3 border-yellow-500">确认</button>
            </div>
            <div v-if="displayConfirm">{{ path }}</div>
            <GenshinInfoCard class="my-2 w-full mb-4 shadow-md"></GenshinInfoCard>
        </div>
    </el-scrollbar>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-genshin {
    font-family: genshin-font;
}

.bg-pic {
    width: 98vw;
    -webkit-mask: linear-gradient(white, transparent)
}

.scroll-wrapper {
    top: 10vh;
    left: 10vw;
    border-radius: 5vh;
}

.items-scroll {
    margin-top: 69vh;
    width: 80vw;
}
</style>
