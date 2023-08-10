<script setup>
import { onMounted, ref } from 'vue';

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
    window.win.tray()
}

const handleCommand = (command) => {
    switch (command) {
        case 'openLauncher': window.child.exec(srPath.value.concat('launcher.exe'))
            break
        case 'clearPath': window.store.delete('starRailPath')
            break
    }
}
</script>

<template>
    <div class="bg">
        <img class="bg-pic rounded-3xl" src="../assets/srbanner.webp" />
        <div class="bottom-mask sticky bottom-0"></div>
        <div class="bottom-area sticky bottom-0">
            <div class="flex flex-row justify-center">
                <div v-if="srPath" class="mx-2 my-2 flex flex-row rounded-full bg-yellow-400">
                    <button @click="srLaunch"
                        class="pl-4 pr-2 text-xl font-bold rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">星铁启动</button>
                    <el-dropdown class="h-full p-1" trigger="click" @command="handleCommand">
                        <button
                            class="font-genshin text-xl text-gray-900 font-bold p-2 rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">…</button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="openLauncher">打开官方启动器</el-dropdown-item>
                                <el-dropdown-item command="clearPath" divided>清除游戏路径</el-dropdown-item>
                                <el-dropdown-item command="clearPlayerinfo">清除游戏数据</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <button v-else @click="srImport" class="p-3 mx-2 my-2 font-bold text-xl bg-yellow-400
                ">星铁导入</button>
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

.font-genshin {
    font-family: genshin-font;
}

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
