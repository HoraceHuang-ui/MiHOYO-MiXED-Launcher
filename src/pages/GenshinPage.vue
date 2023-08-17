<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'

const gsPath = ref('')
const displayConfirm = ref(false)
const path = ref('')
const timeUpd3_8 = Date.parse("2023/07/05 12:00:00 UTC+8")
const timeNow = Date.now()
const timeDelta = ref(0)
const launcherInfo = ref({})
const launcherInfoReady = ref(false)
const hideElements = ref(false)
const scrollbarref = ref()

onMounted(async () => {
    // 获取原神启动器信息
    window.axios.post('https://sdk-static.mihoyo.com/hk4e_cn/mdk/launcher/api/content?filter_adv=false&key=eYd89JmJ&language=zh-cn&launcher_id=18')
        .then((value) => {
            launcherInfo.value = value.data
            launcherInfoReady.value = true
            console.log(launcherInfo.value)
        })
    gsPath.value = await window.store.get('genshinPath')
    timeDelta.value = Math.ceil((timeNow - timeUpd3_8) / 1000 / 3600 / 24 - 0.5) % 42
    window.store.get('genshinUpd')
        .then((resp) => {
            if (gsPath.value && !resp) {
                if (timeDelta.value > 40) {
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
                } else if (timeDelta.value > 0 && timeDelta.value < 3) {
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
                } else if (timeDelta.value == 0) {
                    ElMessageBox.confirm('原神已在今天进行大版本更新，点击“确定”以打开官方启动器进行下载，且此版本不再接收此消息。',
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

const openLink = (url) => {
    window.electron.openExtLink(url)
}

const handleScroll = ({ scrollTop }) => {
    if (scrollTop > 40) {
        hideElements.value = true
    } else {
        hideElements.value = false
    }
}
</script>

<template>
    <div class="absolute pointer-events-none z-0 align-middle justify-center text-center" style="top: 45%; left: 45%;"
        v-if="!launcherInfoReady">
        <img src="../assets/kleeLoading.gif" class=" align-middle self-center object-scale-down" height="120" width="120" />
        <div class="mt-3 font-genshin text-xl">加载中…</div>
    </div>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
        style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic rounded-3xl w-full h-full" :class="hideElements ? 'scale-95' : ''"
            style="transition-duration: 300ms;">
            <img class=" top-0 rounded-3xl transition-all" :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
                style="transition-duration: 500ms;" :src="launcherInfoReady ? launcherInfo.adv.background : ''"
                @touchmove.prevent @mousewheel.prevent />
        </div>
        <el-carousel class="absolute left-16 top-64 z-50 rounded-xl transition-all" v-if="launcherInfoReady" arrow="hover"
            :class="hideElements ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100 pointer-events-auto'"
            indicator-position="none" style="height: 182px; width: 396px;">
            <el-carousel-item class=" cursor-pointer" v-for="ban in launcherInfo.banner" @click="openLink(ban.url)">
                <img class=" object-scale-down" :src="ban.img" />
            </el-carousel-item>
        </el-carousel>
        <el-scrollbar ref="scrollbarref" height="91vh" class="scroll-wrapper absolute z-40" @scroll="handleScroll">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="gsPath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''">
                        <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400 font-genshin w-48">
                            <button @click="gsLaunch"
                                class="pl-4 px-4 text-2xl font-bold rounded-full w-48 h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">原神启动</button>
                            <el-dropdown class="h-full px-1" trigger="click" @command="handleCommand">
                                <button
                                    class="text-xl text-gray-900 font-bold px-2 h-16 rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">…</button>
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
                        class="font-genshin p-3 mx-2 my-3 font-bold text-xl bg-yellow-400 transition-all">原神导入</button>
                    <button v-if="displayConfirm" @click="confirmPath"
                        class="p-3 mx-2 my-3 text-xl bg-white border-3 border-yellow-500">确认</button>
                </div>
                <div v-if="displayConfirm">{{ path }}</div>
                <GenshinInfoCard class="my-2 w-full mb-4 shadow-md"></GenshinInfoCard>
            </div>
        </el-scrollbar>
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
    -webkit-mask: linear-gradient(white 50%, transparent)
}

.scroll-wrapper {
    top: 2vh;
    left: 10vw;
    border-radius: 5vh;
}

.items-scroll {
    margin-top: 67vh;
    width: 80vw;
}
</style>
