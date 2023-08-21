<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

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

const postTypeMap = new Map()

onMounted(async () => {
    // 获取原神启动器信息
    window.axios.post('https://sdk-static.mihoyo.com/hk4e_cn/mdk/launcher/api/content?filter_adv=false&key=eYd89JmJ&language=zh-cn&launcher_id=18')
        .then((value) => {
            launcherInfo.value = value.data
            launcherInfo.value.post.forEach(post => {
                let tmp
                switch (post.type) {
                    case 'POST_TYPE_INFO':
                        tmp = postTypeMap.get('资讯');
                        if (tmp) {
                            tmp.push(post);
                            postTypeMap.set('资讯', tmp);
                        } else {
                            postTypeMap.set('资讯', [post]);
                        }
                        break
                    case 'POST_TYPE_ANNOUNCE':
                        tmp = postTypeMap.get('公告');
                        if (tmp) {
                            tmp.push(post);
                            postTypeMap.set('公告', tmp);
                        } else {
                            postTypeMap.set('公告', [post]);
                        }
                        break
                    case 'POST_TYPE_ACTIVITY':
                        tmp = postTypeMap.get('活动');
                        if (tmp) {
                            tmp.push(post);
                            postTypeMap.set('活动', tmp);
                        } else {
                            postTypeMap.set('活动', [post]);
                        }
                        break
                }
            });
            console.log(postTypeMap)
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
                            window.store.set('genshinUpd', true, false)
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
                            window.store.set('genshinUpd', true, false)
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
                            window.store.set('genshinUpd', true, false)
                        }).catch(() => { })
                }
            } else if (gsPath.value && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('genshinUpd', false, false)
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
    await window.store.set('genshinPath', path.value, false)
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

const handleScroll = ({ scrollTop }) => {
    if (scrollTop > 0) {
        hideElements.value = true
        if (displayConfirm.value) {
            displayConfirm.value = false
            path.value = ''
        }
    } else {
        hideElements.value = false
    }
}
</script>

<template>
    <div v-if="!launcherInfoReady" class="absolute pointer-events-none z-0 align-middle justify-center text-center"
        style="top: 45%; left: 45%;">
        <img :src="'../../src/assets/kleeLoading.gif'" class=" align-middle self-center object-scale-down" loading="eager"
            height="120" width="120" />
        <div class="mt-3 font-genshin text-xl">加载中…</div>
    </div>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
        style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic rounded-3xl w-full h-full" style="transition-duration: 500ms;"
            :class="hideElements ? 'scale-x-95 translate-y-3' : ''">
            <img class=" top-0 rounded-3xl transition-all" :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
                style="transition-duration: 500ms;" :src="launcherInfoReady ? launcherInfo.adv.background : ''"
                @touchmove.prevent @mousewheel.prevent />
        </div>
        <LauncherBanner class="absolute left-16 top-48 z-50 rounded-xl transition-all" v-if="launcherInfoReady"
            :banners="launcherInfo.banner"
            :class="hideElements ? 'opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 182px; width: 396px; transition-duration: 500ms;" />
        <LauncherPosts :postTypeMap="postTypeMap" v-if="launcherInfoReady"
            class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-genshin"
            :class="hideElements ? 'opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 123px; width: 396px; background-color: rgb(255 255 255 / 0.7); transition-duration: 500ms;" />
        <el-scrollbar ref="scrollbarref" height="91vh" class="scroll-wrapper absolute z-40" @scroll="handleScroll">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="gsPath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''"
                        style=" transition-duration: 500ms;">
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
                    <div v-else>
                        <div class="justify-between flex flex-row">
                            <div class="w-1"></div>
                            <div class="flex flex-row">
                                <button @click="gsImport"
                                    class=" mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-genshin w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                                    :class="hideElements ? ' -translate-x-96' : ''"
                                    style="transition-duration: 500ms;">原神导入</button>
                                <button v-if="displayConfirm" @click="confirmPath"
                                    class="mx-2 my-3 px-3 rounded-full text-xl bg-white border-3 hover:bg-gray-200 active:bg-gray-500 active:scale-90 transition-all">确认</button>
                            </div>
                        </div>
                        <div v-if="displayConfirm" class="font-genshin text-right mr-4">{{ path }}</div>
                    </div>
                </div>
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
    left: 9vw;
    border-radius: 4.5vh 4.5vh 0 0;
}

.items-scroll {
    margin-top: 67vh;
    width: 80vw;
}
</style>
