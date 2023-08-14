<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'

const gsPath = ref('')
const displayConfirm = ref(false)
const path = ref('')
const timeUpd3_8 = Date.parse("2023/07/05 10:30:00 UTC+8")
const timeNow = Date.now()
const timeDelta = ref(0)

onMounted(async () => {
    gsPath.value = await window.store.get('genshinPath')
    timeDelta.value = ((timeNow - timeUpd3_8) / 1000 / 3600 / 24 - 0.5).toFixed(0) % 42
    window.store.set('genshinUpd', false)
    window.store.get('genshinUpd')
        .then((resp) => {
            if (gsPath.value && !resp) {
                if (timeDelta.value > 39) {
                    ElMessageBox.confirm('距离原神下一个大版本更新还有 ' + (42 - timeDelta.value) + ' 天，点击“确定”以打开官方启动器进行预下载，且此版本不再接收此消息。',
                        '更新提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            window.child.exec(gsPath.value.concat('\\launcher.exe'))
                            window.store.set('genshinUpd', true)
                        }).catch(() => { })
                } else if (timeDelta.value < 3) {
                    ElMessageBox.confirm('距离原神大版本更新已经过去' + timeDelta.value + ' 天，点击“确定”以打开官方启动器进行下载，且此版本不再接收此消息。',
                        '更新提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            window.child.exec(gsPath.value.concat('\\launcher.exe'))
                            window.store.set('genshinUpd', true)
                        }).catch(() => { })
                }
            } else if (gsPath && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('genshinUpd', false)
            }
        }).catch((err) => {
            console.error(err)
        })
})

const gsImport = async () => {
    window.dialog.show({
        title: '选择原神根目录',
        properties: ['openDirectory']
    }).then((resp) => {
        if (resp.length > 0) {
            path.value = resp[0]
            displayConfirm.value = true
        }
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
            window.store.delete('genshinUpd')
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
    <img class="bg-pic top-0 rounded-3xl" src="../assets/gsbanner.jpg" @touchmove.prevent @mousewheel.prevent />
    <el-scrollbar height="91vh" class="scroll-wrapper absolute">
        <div class="items-scroll flex flex-col content-center items-center">
            <div>
                <div v-if="gsPath">
                    <div class="mx-2 my-2 flex flex-row rounded-full bg-yellow-400 font-genshin">
                        <button @click="gsLaunch"
                            class="pl-4 pr-2 text-xl font-bold rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">原神启动</button>
                        <el-dropdown class="h-full p-1" trigger="click" @command="handleCommand">
                            <button
                                class="text-xl text-gray-900 font-bold p-2 rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">…</button>
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
                    class="font-genshin p-3 mx-2 my-2 font-bold text-xl bg-yellow-400 transition-all">原神导入</button>
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
