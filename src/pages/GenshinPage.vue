<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { translate } from '../i18n/index'
const gameName = translate('general_gs')

const gsLauncherPath = ref('')
const gsGamePath = ref('')
const displayConfirm = ref(false)
const launcherPath = ref('')
const gamePath = ref('')
const timeUpd3_8 = Date.parse("2023/07/05 12:00:00 UTC+8")
const timeNow = Date.now()
const timeDelta = computed(() =>
    Math.ceil((timeNow - timeUpd3_8) / 1000 / 3600 / 24 - 0.5) % 42
)
const launcherInfo = ref({})
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollbarref = ref()
const importDialogShow = ref(false)
const combinePaths = ref(true)

const postTypeMap = new Map()

onMounted(async () => {
    // 获取原神启动器信息
    window.axios.post(translate('genshin_launcherContentsUrl'))
        .then((value) => {
            launcherInfo.value = value.data
            launcherInfo.value.post.forEach(post => {
                let tmp = postTypeMap.get(post.type)
                if (tmp) {
                    tmp.push(post)
                    postTypeMap.set(post.type, tmp)
                } else {
                    postTypeMap.set(post.type, [post])
                }
            })
            console.log(postTypeMap)
            launcherInfoReady.value = true
            console.log(launcherInfo.value)
        }).catch((err) => {
            launcherInfoFailed.value = true
            errMsg.value = err.toString()
        })
    gsLauncherPath.value = await window.store.get('gsLauncherPath')
    gsGamePath.value = await window.store.get('gsGamePath')
    window.store.get('genshinUpd')
        .then((resp) => {
            if (gsLauncherPath.value && !resp) {
                if (timeDelta.value > 40) {
                    ElMessageBox.confirm(translate('general_gameUpdBoxText1', { game: gameName, beDays: translate('general_beDays', 42 - timeDelta.value) }),
                        translate('general_gameUpdBoxTitle'),
                        {
                            confirmButtonText: translate('general_confirm'),
                            cancelButtonText: translate('general_cancel'),
                            type: 'info'
                        }).then(() => {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                        }).catch(() => { })
                } else if (timeDelta.value > 0 && timeDelta.value < 3) {
                    ElMessageBox.confirm(translate('general_gameUpdBoxText2', { game: gameName, days: translate('general_days', 42 - timeDelta.value) }),
                        translate('general_gameUpdBoxTitle'),
                        {
                            confirmButtonText: translate('general_confirm'),
                            cancelButtonText: translate('general_cancel'),
                            type: 'info'
                        }).then(() => {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                        }).catch(() => { })
                } else if (timeDelta.value == 0) {
                    ElMessageBox.confirm(translate('general_gameUpdBoxText3', { game: gameName }),
                        translate('general_gameUpdBoxTitle'),
                        {
                            confirmButtonText: translate('general_confirm'),
                            cancelButtonText: translate('general_cancel'),
                            type: 'info'
                        }).then(() => {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                        }).catch(() => { })
                }
            } else if (gsLauncherPath.value && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('genshinUpd', false, false)
            }
        }).catch((err) => {
            console.error(err)
        })
})

const gsLauncherImport = async () => {
    window.dialog.show({
        title: translate('general_launcherImportTitle', { game: gameName }),
        properties: ['openDirectory']
    }).then((resp) => {
        if (resp.length > 0) {
            launcherPath.value = resp[0]
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error);
    });
}
const gsGameImport = async () => {
    window.dialog.show({
        title: translate('general_gameImportTitle', { game: gameName }),
        properties: ['openFile'],
        filters: [{ name: 'EXE', extensions: ['exe'] }]
    }).then((resp) => {
        if (resp.length > 0) {
            gamePath.value = resp[0]
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error);
    });
}
const confirmPaths = async () => {
    if (combinePaths.value) {
        gamePath.value = launcherPath.value + '\\Genshin Impact Game\\YuanShen.exe'
    }
    launcherPath.value += '\\launcher.exe'
    await window.store.set('gsLauncherPath', launcherPath.value, false)
    await window.store.set('gsGamePath', gamePath.value, false)
    gsLauncherPath.value = launcherPath.value
    gsGamePath.value = gamePath.value
    importDialogShow.value = false
}
const gsLaunch = () => {
    window.child.exec(gsGamePath.value)
    window.win.tray()
}

const handleCommand = (command) => {
    switch (command) {
        case 'openLauncher':
            window.child.exec(gsLauncherPath.value)
            break
        case 'clearPath':
            window.store.delete('gsLauncherPath')
            window.store.delete('gsGamePath')
            window.store.delete('genshinUpd')
            gsLauncherPath.value = ''
            gsGamePath.value = ''
            break
        case 'clearPlayerinfo':
            window.store.delete('genshinInfo')
            refresh()
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

const router = useRouter()
const refresh = () => {
    console.log('click on refresh')
    router.push({
        name: 'tempPage',
        query: {
            from: '/gspage'
        }
    })
}

const onImportDialogClose = () => {
    importDialogShow.value = false
    gamePath.value = ''
    launcherPath.value = ''
}
</script>

<template>
    <el-dialog v-model="importDialogShow" :title="`${$t('general_gs')} ${$t('general_import')}`" width="50%" center
        :before-close="onImportDialogClose">
        <div class="px-1 grid grid-cols-2 gap-4">
            <button @click="gsLauncherImport" class="import-button-enabled py-1 px-2 rounded-full transition-all">{{
                $t('general_importLauncher') }}</button>
            <button @click="gsGameImport" class="py-1 px-2 rounded-full transition-all"
                :class="combinePaths ? 'import-button-disabled' : 'import-button-enabled'">
                {{ $t('general_importGame') }}
            </button>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-bold mr-2">{{ $t('general_launcher') }}</span>
                {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
            </div>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-bold mr-2">{{ $t('general_game') }}</span>
                {{ launcherPath === '' ? '' : (combinePaths ? launcherPath + '\\Genshin Impact Game\\YuanShen.exe' :
                    gamePath) }}
            </div>
        </div>
        <template #footer>
            <div class="flex flex-row w-full justify-between">
                <div class="flex flex-row">
                    <el-checkbox v-model="combinePaths">{{ $t("general_defaultStructure") }}</el-checkbox>
                    <el-tooltip placement="right"
                        :content="`<${$t('general_launcherDirectory')}>\\Genshin Impact Game\\YuanShen.exe`">
                        <div class="ml-2 rounded-full w-5 h-5 bg-gray-400 text-white font-bold text-sm cursor-help"
                            style="margin-top: 5px;">?</div>
                    </el-tooltip>
                </div>
                <div class="flex flex-row">
                    <button class="mr-3 rounded-full py-1 px-2 hover:bg-gray-200 active:bg-gray-400 transition-all"
                        @click="onImportDialogClose">{{ $t('general_cancel') }}</button>
                    <button class="rounded-full py-1 px-3 transition-all" @click="confirmPaths"
                        :class="launcherPath && (gamePath || combinePaths) ? 'confirm-button-enabled' : 'confirm-button-disabled'">
                        {{ $t('general_confirm') }}
                    </button>
                </div>
            </div>
        </template>
    </el-dialog>
    <div v-if="!launcherInfoFailed && !launcherInfoReady"
        class="absolute pointer-events-none z-0 align-middle justify-center text-center" style="top: 45%; left: 45%;">
        <img :src="'../../src/assets/kleeLoading.gif'" class=" align-middle self-center object-scale-down" loading="eager"
            height="120" width="120" />
        <div class="mt-3 font-genshin text-xl">{{ $t('general_loading') }}</div>
    </div>
    <LoadFailedBlock v-else-if="launcherInfoFailed" class="absolute z-10 -translate-x-1/2"
        style="margin-left: 50%; margin-top: 25vh;" :gameNo="0" :errMsg="errMsg">
    </LoadFailedBlock>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
        style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic rounded-3xl w-full h-full" style="transition-duration: 500ms;"
            :class="hideElements ? 'scale-x-95 translate-y-3' : ''">
            <img class=" top-0 rounded-3xl transition-all" :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
                style="transition-duration: 500ms;"
                :src="launcherInfoReady && launcherInfo.adv ? launcherInfo.adv.background : '../../src/assets/gsbanner.png'"
                @touchmove.prevent @mousewheel.prevent />
        </div>
        <LauncherBanner v-if="launcherInfoReady && 'banner' in launcherInfo && launcherInfo.banner.length > 0"
            class="absolute left-16 top-48 z-50 rounded-xl transition-all" :banners="launcherInfo.banner"
            :class="hideElements ? 'opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 182px; width: 396px; transition-duration: 500ms;" />
        <LauncherPosts v-if="launcherInfoReady && 'post' in launcherInfo && launcherInfo.post.length > 0"
            :postTypeMap="postTypeMap"
            class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-genshin"
            :class="hideElements ? 'opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
            style="height: 123px; width: 396px; background-color: rgb(255 255 255 / 0.7); transition-duration: 500ms;" />
        <el-scrollbar ref="scrollbarref" height="91vh" class="scroll-wrapper absolute z-40" @scroll="handleScroll">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="gsGamePath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''"
                        style=" transition-duration: 500ms;">
                        <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400 font-genshin">
                            <button @click="gsLaunch"
                                class="pl-4 px-4 text-2xl font-bold rounded-full h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">
                                {{ $t("general_launchGame") }}
                            </button>
                            <el-dropdown class="h-full px-1" trigger="click" @command="handleCommand">
                                <button
                                    class="text-xl text-gray-900 font-bold px-2 h-16 rounded-full hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">…</button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="openLauncher">{{ $t('general_openOfficialLauncher')
                                        }}</el-dropdown-item>
                                        <el-dropdown-item command="clearPath" divided>{{ $t('general_clearGamePath')
                                        }}</el-dropdown-item>
                                        <el-dropdown-item command="clearPlayerinfo">{{ $t('general_clearProfileInfo')
                                        }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                    <div v-else>
                        <div class="justify-between flex flex-row">
                            <div class="w-1"></div>
                            <div class="flex flex-row">
                                <button @click="importDialogShow = true"
                                    class=" mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-genshin w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                                    :class="hideElements ? ' -translate-x-96' : ''" style="transition-duration: 500ms;">{{
                                        $t('general_importGame') }}</button>
                            </div>
                        </div>
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

.import-button-enabled {
    @apply border border-gray-400 text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-100 active:bg-blue-300;
}

.import-button-disabled {
    @apply bg-gray-100 text-gray-400 pointer-events-none;
}

.confirm-button-enabled {
    @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
    @apply bg-blue-200 text-white pointer-events-none;
}
</style>
