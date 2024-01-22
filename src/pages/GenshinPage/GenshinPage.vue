<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {translate} from '../../i18n'
import {LauncherInfo, PostInfo} from "../../types/launcher/launcherInfo";
import GenshinInfoCard from "./Components/GenshinInfoCard.vue";
import {useDialog} from "../../utils/template-dialog";
import GenshinDialog from "./Components/GenshinDialog.vue";
import GSImportDialog from "./Components/GSImportDialog.vue";
import ScrollWrapper from "../../components/ScrollWrapper.vue";
import MyDropdown from "../../components/MyDropdown.vue";

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
const launcherInfo = ref<LauncherInfo>({
    adv: undefined,
    banner: [],
    icon: [],
    links: undefined,
    more: undefined,
    post: [],
    qq: []
})
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollBarRef = ref()

const postTypeMap = new Map<string, PostInfo[]>()

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
                    useDialog(GenshinDialog, {
                        onCancel(dispose: Function) {
                            dispose()
                        },
                        onOk(dispose: Function) {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                            dispose()
                        }
                    }, {
                        title: translate('general_gameUpdBoxTitle'),
                        msg: translate('general_gameUpdBoxText1', {
                            game: gameName,
                            beDays: translate('general_beDays', 42 - timeDelta.value)
                        }),
                        msgCenter: false,
                        showCancel: true
                    })
                } else if (timeDelta.value > 0 && timeDelta.value < 3) {
                    useDialog(GenshinDialog, {
                        onCancel(dispose: Function) {
                            dispose()
                        },
                        onOk(dispose: Function) {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                            dispose()
                        }
                    }, {
                        title: translate('general_gameUpdBoxTitle'),
                        msg: translate('general_gameUpdBoxText2', {
                            game: gameName,
                            days: translate('general_days', timeDelta.value)
                        }),
                        msgCenter: false,
                        showCancel: true
                    })
                } else if (timeDelta.value == 0) {
                    useDialog(GenshinDialog, {
                        onCancel(dispose: Function) {
                            dispose()
                        },
                        onOk(dispose: Function) {
                            window.child.exec(gsLauncherPath.value)
                            window.store.set('genshinUpd', true, false)
                            dispose()
                        }
                    }, {
                        title: translate('general_gameUpdBoxTitle'),
                        msg: translate('general_gameUpdBoxText3', {
                            game: gameName
                        }),
                        msgCenter: false,
                        showCancel: true
                    })
                }
            } else if (gsLauncherPath.value && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('genshinUpd', false, false)
            }
        }).catch((err) => {
        console.error(err)
    })
})

const importButtonClick = () => {
    useDialog(GSImportDialog, {
        onOk(dispose: Function) {
            dispose()
            refresh()
        },
        onCancel(dispose: Function) {
            gamePath.value = ''
            launcherPath.value = ''
            dispose()
        }
    })
}

const gsLaunch = async () => {
    await window.child.exec(gsGamePath.value)
    const trayOnLaunch = await window.store.get('trayOnLaunch')
    if (trayOnLaunch) {
        window.win.tray()
    }
}

const handleCommand = (idx: number) => {
    const commands = ['openLauncher', 'clearPath', 'clearPlayerinfo']

    switch (commands[idx]) {
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

const handleScroll = ({top}: Record<string, number>) => {
    hideElements.value = top > 0;
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
</script>

<template>
    <div v-if="!launcherInfoFailed && !launcherInfoReady"
         class="absolute pointer-events-none z-0 align-middle justify-center text-center" style="top: 45%; left: 45%;">
        <img :src="'../../src/assets/kleeLoading.gif'" class=" align-middle self-center object-scale-down"
             loading="eager"
             height="120" width="120"/>
        <div class="mt-3 font-gs text-xl">{{ $t('general_loading') }}</div>
    </div>
    <LoadFailedBlock v-else-if="launcherInfoFailed" class="absolute z-10 -translate-x-1/2"
                     style="margin-left: 50%; margin-top: 25vh;" :gameNo="0" :errMsg="errMsg">
    </LoadFailedBlock>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
         style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic rounded-3xl w-full h-full" style="transition-duration: 500ms;"
             :class="hideElements ? 'scale-x-95 translate-y-3' : ''">
            <img class=" top-0 rounded-3xl transition-all"
                 :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
                 style="transition-duration: 500ms;"
                 :src="launcherInfoReady && launcherInfo.adv ? launcherInfo.adv.background : '../../src/assets/gsbanner.png'"
                 @touchmove.prevent @mousewheel.prevent/>
        </div>
        <LauncherBanner v-if="launcherInfoReady && 'banner' in launcherInfo && launcherInfo.banner.length > 0"
                        class="absolute left-16 top-48 z-50 rounded-xl transition-all" :banners="launcherInfo.banner"
                        :class="hideElements ? 'opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
                        style="height: 182px; width: 396px; transition-duration: 500ms;"/>
        <LauncherPosts v-if="launcherInfoReady && 'post' in launcherInfo && launcherInfo.post.length > 0"
                       :postTypeMap="postTypeMap"
                       class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-gs"
                       :class="hideElements ? 'opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110' : 'opacity-100 pointer-events-auto'"
                       style="height: 112px; width: 396px; background-color: rgb(255 255 255 / 0.7); transition-duration: 500ms;"/>
        <ScrollWrapper ref="scrollBarRef" height="91vh" class="scroll-wrapper absolute z-40" @scroll="handleScroll"
                       show-bar="never">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="gsGamePath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''"
                         style=" transition-duration: 500ms;">
                        <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400 font-gs">
                            <button @click="gsLaunch"
                                    class="pl-4 px-4 text-2xl font-bold rounded-full h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">
                                {{ $t("general_launchGame") }}
                            </button>
                            <MyDropdown class="h-full px-1 text-sm" @command="handleCommand" placement="top"
                                        :width-digit="200" width-unit="px"
                                        :items="[$t('general_openOfficialLauncher'), $t('general_clearGamePath'), $t('general_clearProfileInfo')]">
                                <button
                                    class="text-xl text-gray-900 px-2 h-16 rounded-full hover:bg-yellow-500 transition-all">
                                    …
                                </button>
                            </MyDropdown>
                        </div>
                    </div>
                    <div v-else>
                        <div class="justify-between flex flex-row">
                            <div class="w-1"></div>
                            <div class="flex flex-row">
                                <button @click="importButtonClick"
                                        class=" mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-gs w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                                        :class="hideElements ? ' -translate-x-96' : ''"
                                        style="transition-duration: 500ms;">{{
                                        $t('general_importGame')
                                    }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <GenshinInfoCard class="my-2 w-full mb-4 shadow-md"></GenshinInfoCard>
            </div>
        </ScrollWrapper>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

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
