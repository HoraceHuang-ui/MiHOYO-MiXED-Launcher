<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const apiUrl = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/'

const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const uidInput = ref('')
var uid = ''
var charsPage = ref(0)
const pages = ref(0)
const charsScrollbar = ref()
const playerInfo = ref({})
const showcaseIdx = ref(0)
const ascLevelMap = [20, 30, 40, 50, 60, 70, 80]

onMounted(() => {
    window.store.get('starRailInfo')
        .then((value) => {
            if (value) {
                playerInfoReady.value = true
                uid = value.player.uid
                uidInput.value = uid
                playerInfo.value = value
                pages.value = playerInfo.value.characters.length > 8
                    ? Math.floor((playerInfo.value.characters.length - 8) / 4) + 1
                    : 0
            }
            console.log(playerInfo.value)
        }).catch((err) => {
            console.error(err)
        })
})

const mergeToPlayerinfo = (newArr) => {
    for (let i = newArr.length - 1; i >= 0; i--) {
        let newChar = newArr[i]
        var exists = false
        // for (let j = playerInfo.value.characters.length - 1; j >= 0; j--) {
        for (let j = 0; j < playerInfo.value.characters.length; j++) {
            let oldChar = playerInfo.value.characters[j]
            if (oldChar.id == newChar.id) {
                playerInfo.value.characters[j] = newChar
                exists = true
                break
            }
        }
        if (!exists) {
            playerInfo.value.characters.push(newChar)
        }
    }
    console.log(playerInfo.value)
}

const router = useRouter()
const requestInfo = () => {
    uid = uidInput.value
    window.axios.get('https://api.mihomo.me/sr_info_parsed/' + uid + '?lang=cn')
        .then((resp) => {
            if (playerInfoReady.value && playerInfo.value.player.uid == resp.player.uid) {
                console.log('uid equal')
                mergeToPlayerinfo(resp.characters)
                playerInfo.value.player = resp.player
            } else {
                console.log('uid not equal')
                playerInfo.value = resp
            }
            playerInfoReady.value = false

            playerInfo.value.characters.sort(function (a, b) {
                // 等级
                if (a.level < b.level) {
                    return 1
                } else if (a.level > b.level) {
                    return -1
                } else {
                    // 突破等级
                    if (a.promotion < b.promotion) {
                        return 1
                    } else {
                        return -1
                    }
                    //     // 双爆分
                    //     const critA = a.stats.critRate.value * 200 + a.stats.critDamage.value * 100
                    //     const critB = b.stats.critRate.value * 200 + b.stats.critDamage.value * 100
                    //     if (critA < critB) {
                    //         return 1
                    //     } else {
                    //         return -1
                    //     }
                    // }
                }
            })
            window.store.set('starRailInfo', JSON.stringify(playerInfo.value), true)
            playerInfoLoading.value = false
            playerInfoReady.value = true
            // router.push('/tmpgspage')
        }).catch((err) => {
            console.error(err)
            playerInfoLoading.value = false
        })
    playerInfoLoading.value = true
    console.log(uid)
}

const charsPageNext = () => {
    if (charsPage.value < pages.value) {
        charsPage.value++
        charsScrollbar.value.scrollTo({
            // about 48 for each icon, 8 icons on each page
            left: charsPage.value * 48 * 4,
            top: 0,
            behavior: "smooth"
        })
    }
}
const charsPagePrev = () => {
    if (charsPage.value > 0) {
        charsPage.value--
        charsScrollbar.value.scrollTo({
            left: charsPage.value * 48 * 4,
            top: 0,
            behavior: "smooth"
        })
    }
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 97vh;' : ''">
        <!-- HEADER -->
        <div class="flex flex-row w-full p-0 relative justify-between z-50" style="height: 9vh;">
            <!-- 右上角名片 -->
            <div v-if="playerInfoLoading" class="absolute top-0 right-0 bottom-0 z-0"
                style="margin-left: 1vw; right: 2vw; top: 3vh;">正在加载数据，请稍候……</div>
            <!-- 左上角头像、昵称 -->
            <!-- playerInfo.player.profilePicture.assets.icon -->
            <div v-if="playerInfoReady" class="flex flex-row content-start items-center" style="width: 35vw;">
                <img class="rounded-full h-12 border-2 bg-slate-200" style="margin-left: 1vw;"
                    :src="apiUrl + playerInfo.player.avatar.icon" />
                <div class="font-sr" style="margin-left: 1vw; font-size: larger;">{{ playerInfo.player.nickname }}</div>
            </div>
            <div v-else style="width: 35vw" />
            <div class="flex flex-row self-center">
                <el-input size="large" v-model="uidInput" placeholder="在此输入uid" @keyup.enter.native="requestInfo"
                    style="width: 15vw;" clearable>
                    <template #append>
                        <el-button @click="requestInfo" size="large">查询</el-button>
                    </template>
                </el-input>
            </div>
            <!-- 右侧 WL AR -->
            <div v-if="playerInfoReady" style="width: 35vw; position: relative;">
                <div class="h-full flex flex-row justify-end items-center">
                    <el-tag size="large" round class="mr-2">
                        <div class="flex flex-row">
                            均衡
                            <span class="font-sr" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.world_level }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round class="mr-4">
                        <div class="flex flex-row">
                            等级
                            <span class="font-sr" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.level }}
                            </span>
                        </div>
                    </el-tag>
                </div>
            </div>
            <div v-else style="width: 35vw" />
        </div>
        <!-- BODY -->
        <div v-if="playerInfoReady && playerInfo.characters.length > 0" class="relative">
            <!-- 角色头像列表 8人一页 -->
            <div class="flex flex-row w-full justify-between">
                <div class="relative z-50" style="width: 30%;">
                    <el-icon
                        class="absolute right-2 top-3 rounded-full w-9 h-9 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all opacity-80"
                        @click="charsPagePrev" :class="charsPage === 0 ? 'disabled' : ''">
                        <ArrowLeftBold />
                    </el-icon>
                </div>
                <el-scrollbar ref="charsScrollbar" class="flex flex-row justify-center" noresize style="width: 40%;">
                    <div class="flex flex-row z-50 relative flex-nowrap w-max">
                        <div v-for="(character, index) in playerInfo.characters" class="relative w-12 h-12"
                            @click="showcaseIdx = index">
                            <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white transition-all"
                                :class="{ 'border-blue-600 border-3': showcaseIdx == index }" style="left: 10px;"></div>
                            <img class="absolute bottom-0 char-side-icon rounded-full ml-2 w-9 h-9 hover:transform hover:scale-110 hover:-translate-y-1 active:scale-100 active:translate-y-0 transition-all object-cover"
                                :src="apiUrl + character.icon" />
                        </div>
                    </div>
                </el-scrollbar>
                <div class="relative z-50" style="width: 30%;">
                    <el-icon
                        class="absolute left-2 top-3 rounded-full w-9 h-9 ml-2 bg-white hover:bg-gray-200 active:translate-x-1 transition-all opacity-80"
                        @click="charsPageNext" :class="charsPage === pages ? 'disabled' : ''">
                        <ArrowRightBold />
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 角色详情卡片 -->
        <div v-for="(character, index) in playerInfo.characters" class="z-0 relative w-full">
            <div class="mt-4 w-full absolute top-0 left-0 right-0 transition-all" :class="{ 'opacity-0 translate-x-40 pointer-events-none': showcaseIdx < index },
                { 'opacity-100 pointer-events-auto': showcaseIdx == index },
                { 'opacity-0 -translate-x-40 pointer-events-none': showcaseIdx > index }"
                style="transition-duration: 300ms;">
                <!-- absolute： 卡片元素背景、元素图标 -->
                <img class="relative z-0 w-full" src="../assets/srBg.jpg" style="border-radius: 4.5vh;" />
                <img class="h-1/4 absolute opacity-50" :src="apiUrl + character.element.icon"
                    style="top: -7px; right: -18px;" />
                <!-- 卡片前景 -->
                <div class="flex flex-row h-full absolute top-0 left-0 right-0 bottom-0 z-10">
                    <!-- 立绘 -->
                    <div class="left-gacha w-7/12 inline-block object-cover absolute left-0 bottom-0 z-10"
                        style="height: 130%;">
                        <img class="gacha-mask inline-block object-cover left-0 top-20 absolute z-10" loading="lazy"
                            style="height: 650px;" :src="apiUrl + character.portrait" />
                    </div>
                    <!-- 右侧详情 -->
                    <div class=" w-1/2 h-full absolute top-4 right-6 bottom-4 flex flex-col z-20">
                        <!-- Lv. 90/90 角色名字-->
                        <div class="w-full text-right">
                            <span class=" text-gray-200 font-sr text-2xl">
                                Lv. {{ character.level }} /
                            </span>
                            <span class=" text-gray-400 text-2xl mr-4 font-serif">
                                {{ ascLevelMap[character.promotion] }}
                            </span>
                            <img class="inline h-8 mb-2" :src="apiUrl + character.path.icon" />
                            <span class=" text-gray-200 bottom-0 text-xl font-sr mr-5 ml-2">{{ character.path.name
                            }}</span>
                            <span class=" text-white font-sr text-5xl">{{ character.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-sr {
    font-family: sr-font;
}

.char-side-icon {
    -webkit-mask: radial-gradient(white 80%, transparent)
}

.gacha-mask {
    -webkit-mask: linear-gradient(transparent 3%, white 12%, white 85%, transparent)
}

.left-gacha {
    -webkit-mask: linear-gradient(270deg, transparent, white 20%)
}

.artifact-mask {
    -webkit-mask: linear-gradient(270deg, transparent, white 60%)
}

.disabled {
    @apply bg-gray-200 opacity-30 pointer-events-none
}
</style>
