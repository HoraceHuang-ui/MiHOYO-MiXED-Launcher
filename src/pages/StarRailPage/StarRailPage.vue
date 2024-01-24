<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {translate} from '../../i18n'
import StarRailInfoCard from "./Components/StarRailInfoCard.vue";
import {useDialog} from "../../utils/template-dialog";
import StarRailDialog from "./Components/StarRailDialog.vue";
import SRImportDialog from "./Components/SRImportDialog.vue";
import {LauncherInfo, PostInfo} from "../../types/launcher/launcherInfo";
import ScrollWrapper from "../../components/ScrollWrapper.vue";
import MyDropdown from "../../components/MyDropdown.vue";

const gameName = translate('general_sr')

const srLauncherPath = ref('')
const srGamePath = ref('')
const displayConfirm = ref(false)
const launcherPath = ref('')
const gamePath = ref('')
const timeUpd1_4 = Date.parse("2023/10/04 12:00:00 UTC+8")
const timeNow = Date.now()
const timeDelta = computed(() =>
    Math.ceil((timeNow - timeUpd1_4) / 1000 / 3600 / 24 - 0.5) % 42
)
const launcherInfo = ref<LauncherInfo>({banner: [], icon: [], post: [], qq: []})
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollBarRef = ref()

const postTypeMap = new Map()

onMounted(async () => {
    window.axios.post(translate('sr_launcherContentsUrl'))
        .then((value) => {
            launcherInfo.value = value.data
            launcherInfo.value.post.forEach((post: PostInfo) => {
                let tmp = postTypeMap.get(post.type)
                if (tmp) {
                    tmp.push(post)
                    postTypeMap.set(post.type, tmp)
                } else {
                    postTypeMap.set(post.type, [post])
                }
            });
            launcherInfoReady.value = true
        }).catch((err) => {
        launcherInfoFailed.value = true
        errMsg.value = err.toString()
    })
    srLauncherPath.value = await window.store.get('srLauncherPath')
    srGamePath.value = await window.store.get('srGamePath')
    window.store.get('starRailUpd')
        .then((resp) => {
            if (srLauncherPath.value && !resp) {
                console.log(timeDelta.value)
                if (timeDelta.value > 40) {
                    useDialog(StarRailDialog, {
                        onOk(dispose: Function) {
                            window.child.exec(srLauncherPath.value)
                            window.store.set('starRailUpd', true, false)
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
                    useDialog(StarRailDialog, {
                        onOk(dispose: Function) {
                            window.child.exec(srLauncherPath.value)
                            window.store.set('starRailUpd', true, false)
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
                    useDialog(StarRailDialog, {
                        onOk(dispose: Function) {
                            window.child.exec(srLauncherPath.value)
                            window.store.set('starRailUpd', true, false)
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
            } else if (srLauncherPath.value && timeDelta.value > 2 && timeDelta.value < 37) {
                window.store.set('starRailUpd', false, false)
            }
        }).catch((err) => {
        console.error(err)
    })
})

const importButtonClick = () => {
    useDialog(SRImportDialog, {
        onOk(dispose: Function) {
            refresh()
            dispose()
        },
        onCancel(dispose: Function) {
            gamePath.value = ''
            launcherPath.value = ''
            dispose()
        }
    })
}
const srLaunch = async () => {
    await window.child.exec(srGamePath.value)
    const trayOnLaunch = await window.store.get('trayOnLaunch')
    if (trayOnLaunch) {
        await window.win.tray()
    }
}

const handleCommand = (idx: number) => {
    const commands = ['openLauncher', 'clearPath', 'clearPlayerinfo']

    switch (commands[idx]) {
        case 'openLauncher':
            window.child.exec(srLauncherPath.value)
            break
        case 'clearPath':
            window.store.delete('srLauncherPath')
            window.store.delete('srGamePath')
            window.store.delete('starRailUpd')
            srLauncherPath.value = ''
            srGamePath.value = ''
            break
        case 'clearPlayerinfo':
            window.store.delete('starRailInfo')
            refresh()
            break
    }
}

const handleScroll = ({top}: Record<string, number>) => {
    hideElements.value = top > 0;
}

const router = useRouter()
const refresh = () => {
    router.push({
        name: 'tempPage',
        query: {
            from: '/srpage'
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
        <div class="mt-3 font-sr text-xl">{{ $t('general_loading') }}</div>
    </div>
    <LoadFailedBlock v-else-if="launcherInfoFailed" class="absolute z-10 -translate-x-1/2"
                     style="margin-left: 50%; margin-top: 25vh;" :gameNo="1" :errMsg="errMsg">
    </LoadFailedBlock>
    <div class="transition-all relative" :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
         style="width: 98vw; height: 92vh; transition-duration: 400ms;">
        <div class="bg-pic" style="transition-duration: 500ms; border-radius: 1.5rem 1.5rem 0 0;"
             :class="hideElements ? 'scale-x-95 translate-y-3' : ''">
            <img class="top-0 rounded-3xl transition-all h-full w-full object-cover"
                 :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
                 style="transition-duration: 500ms;"
                 :src="launcherInfoReady && launcherInfo.adv ? launcherInfo.adv.background : '../../src/assets/srbanner.jpg'"
                 @touchmove.prevent @mousewheel.prevent alt="Launcher background image for Honkai Star Rail"/>
        </div>
        <Transition name="banner">
            <LauncherBanner class="absolute left-16 top-48 z-50 rounded-xl transition-all"
                            v-if="launcherInfoReady && 'banner' in launcherInfo && launcherInfo.banner.length > 0 && !hideElements"
                            :banners="launcherInfo.banner"
                            style="height: 182px; width: 396px"/>
        </Transition>
        <Transition name="posts">
            <LauncherPosts :postTypeMap="postTypeMap"
                           v-if="launcherInfoReady && 'post' in launcherInfo && launcherInfo.post.length > 0 && !hideElements"
                           class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-sr-sans"
                           style="height: 112px; width: 396px; background-color: rgb(255 255 255 / 0.7)"/>
        </Transition>
        <ScrollWrapper ref="scrollBarRef" height="91vh" class="scroll-wrapper absolute z-40"
                       @scroll="handleScroll"
                       show-bar="never">
            <div class="items-scroll flex flex-col content-center items-center w-full">
                <div class="w-full flex flex-row justify-between">
                    <div class="w-1"></div>
                    <div v-if="srGamePath" class="transition-all" :class="hideElements ? ' -translate-x-96' : ''"
                         style=" transition-duration: 500ms;">
                        <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400 font-sr">
                            <button @click="srLaunch"
                                    class="pl-4 px-4 text-2xl font-bold rounded-full h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all">
                                {{
                                    $t('general_launchGame')
                                }}
                            </button>
                            <MyDropdown class="h-full px-1" @command="handleCommand"
                                        item-class="font-sr-sans text-sm" placement="top" width="200px"
                                        :items="[$t('general_openOfficialLauncher'), $t('general_clearGamePath'), $t('general_clearProfileInfo')]">
                                <button
                                    class="text-xl text-gray-900 px-2 mt-1 h-14 rounded-full hover:bg-yellow-500 transition-all">
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
                                        class=" mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-sr w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                                        :class="hideElements ? ' -translate-x-96' : ''"
                                        style="transition-duration: 500ms;">{{
                                        $t('general_importGame')
                                    }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <StarRailInfoCard class="my-2 w-full shadow-md"></StarRailInfoCard>
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
    height: 96.4vh;
    -webkit-mask: linear-gradient(white 50%, transparent)
    /* -webkit-mask: linear-gradient(white, white); */
}

.bg-mask {
    -webkit-mask: linear-gradient(white 50%, transparent);
}

.scroll-wrapper {
    top: 2vh;
    left: 8vw;
}

.items-scroll {
    margin-top: 67vh;
    width: 82vw;
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

.banner-enter-from, .banner-leave-to {
    @apply opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110;
}

.posts-enter-from, .posts-leave-to {
    @apply opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110;
}

.banner-enter-active,
.banner-leave-active,
.posts-enter-active,
.posts-leave-active {
    transition: all 0.5s ease;
}
</style>
