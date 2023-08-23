<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const srPath = ref('')
const displayConfirm = ref(false)
const path = ref('')
const timeUpd1_2 = Date.parse("2023/07/19 12:00:00 UTC+8")
const timeNow = Date.now()
const timeDelta = ref(0)
const launcherInfo = ref({})
const launcherInfoReady = ref(false)
const hideElements = ref(false)
const scrollbarref = ref()

const postTypeMap = new Map()

onMounted(async () => {
    // 获取星铁启动器信息
    window.axios.post('https://api-launcher-static.mihoyo.com/hkrpg_cn/mdk/launcher/api/content?filter_adv=false&key=6KcVuOkbcqjJomjZ&language=zh-cn&launcher_id=33')
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
            launcherInfoReady.value = true
        })
    srPath.value = await window.store.get('starRailPath')
    timeDelta.value = Math.ceil((timeNow - timeUpd1_2) / 1000 / 3600 / 24 - 0.5) % 42
    window.store.get('starRailUpd')
        .then((resp) => {
            if (srPath.value && !resp) {
                if (timeDelta.value > 40) {
                    ElMessageBox.confirm('距离星铁下一个大版本更新还有 ' + (42 - timeDelta.value) + ' 天，点击“确定”以打开官方启动器进行预下载，且此版本不再接收此消息。',
                        '更新提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            window.child.exec(srPath.value.concat('\\launcher.exe'))
                            window.store.set('starRailUpd', true, false)
                        }).catch(() => { })
                } else if (timeDelta.value > 0 && timeDelta.value < 3) {
                    ElMessageBox.confirm('距离星铁大版本更新已经过去' + timeDelta.value + ' 天，点击“确定”以打开官方启动器进行下载，且此版本不再接收此消息。',
                        '更新提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            window.child.exec(srPath.value.concat('\\launcher.exe'))
                            window.store.set('starRailUpd', true, false)
                        }).catch(() => { })
                } else if (timeDelta.value == 0) {
                    ElMessageBox.confirm('星铁已在今天进行大版本更新，点击“确定”以打开官方启动器进行下载，且此版本不再接收此消息。',
                        '更新提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            window.child.exec(srPath.value.concat('\\launcher.exe'))
                            window.store.set('starRailUpd', true, false)
                        }).catch(() => { })
                }
            } else if (srPath.value && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('starRailUpd', false, false)
            }
        }).catch((err) => {
            console.error(err)
        })
})

const srImport = async () => {
    window.dialog.show({
        title: '选择星铁根目录',
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
    await window.store.set('starRailPath', path.value, false)
    srPath.value = path.value
    displayConfirm.value = false
}
const srLaunch = () => {
    window.child.exec(srPath.value.concat('\\Game\\StarRail.exe'))
    window.win.tray()
}

// const router = useRouter()
const handleCommand = (command) => {
    switch (command) {
        case 'openLauncher':
            window.child.exec(srPath.value.concat('\\launcher.exe'))
            break
        case 'clearPath':
            window.store.delete('starRailPath')
            window.store.delete('starRailUpd')
            srPath.value = ''
            break
        case 'clearPlayerinfo':
            window.store.delete('starRailInfo')
            router.push({
                name: 'tempPage',
                query: {
                    from: '/srpage'
                }
            })
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
        <div class="mt-3 font-sr text-xl">加载中…</div>
    </div>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
        style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic h-full w-full" style="transition-duration: 500ms; border-radius: 1.5rem 1.5rem 0 0;"
            :class="hideElements ? 'scale-x-95 translate-y-3' : ''">
            <img class=" top-0 rounded-3xl transition-all scale-105"
                :class="hideElements ? 'blur-md scale-125 brightness-75' : ''" style="transition-duration: 500ms;"
                :src="launcherInfoReady ? launcherInfo.adv.background : ''" @touchmove.prevent @mousewheel.prevent />
        </div>
        <LauncherBanner class="absolute left-16 top-48 z-50 rounded-xl transition-all" v-if="launcherInfoReady"
            :banners="launcherInfo.banner"
            :class="hideElements ? 'opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 182px; width: 396px; transition-duration: 500ms;" />
        <LauncherPosts :postTypeMap="postTypeMap" v-if="launcherInfoReady"
            class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-sr-sans"
            :class="hideElements ? 'opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 125px; width: 396px; background-color: rgb(255 255 255 / 0.7); transition-duration: 500ms;" />
        <el-scrollbar ref="scrollbarref" height="91vh" class="scroll-wrapper absolute z-40" @scroll="handleScroll">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="srPath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''"
                        style=" transition-duration: 500ms;">
                        <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400 font-sr w-48">
                            <button @click="srLaunch"
                                class="pl-4 px-4 text-2xl font-bold rounded-full w-48 h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">星铁启动</button>
                            <el-dropdown class="h-full px-1" trigger="click" @command="handleCommand">
                                <button
                                    class="text-xl text-gray-900 font-bold px-2 mt-1 h-14 rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">…</button>
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
                                <button @click="srImport"
                                    class=" mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-sr w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                                    :class="hideElements ? ' -translate-x-96' : ''"
                                    style="transition-duration: 500ms;">星铁导入</button>
                                <button v-if="displayConfirm" @click="confirmPath"
                                    class="mx-2 my-3 px-3 rounded-full text-xl bg-white border-3 hover:bg-gray-200 active:bg-gray-500 active:scale-90 transition-all">确认</button>
                            </div>
                        </div>
                        <div v-if="displayConfirm" class="font-sr text-right mr-4">{{ path }}</div>
                    </div>
                </div>
                <StarRailInfoCard class="my-2 w-full shadow-md" style="height: 97vh;"></StarRailInfoCard>
            </div>
        </el-scrollbar>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-sr {
    font-family: sr-font;
}

.font-sr-sans {
    font-family: sr-sans-font;
}

.bg-pic {
    width: 98vw;
    -webkit-mask: linear-gradient(white 50%, transparent)
        /* -webkit-mask: linear-gradient(white, white); */
}

.bg-mask {
    -webkit-mask: linear-gradient(white 50%, transparent);
}

.scroll-wrapper {
    top: 2vh;
    left: 8vw;
    border-radius: 4.5vh 4.5vh 0 0;
}

.items-scroll {
    margin-top: 67vh;
    width: 82vw;
}
</style>
