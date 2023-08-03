<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const uidInput = ref('')
var uid = ''
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const playerInfo = ref({})
const showcaseIdx = ref(0)
const elementAssets = {
    cryo: {
        bg: './src/assets/elementBgs/cryo.png',
        ico: './src/assets/elementIcons/cryo.png',
    },
    anemo: {
        bg: './src/assets/elementBgs/anemo.png',
        ico: './src/assets/elementIcons/anemo.png',
    },
    dendro: {
        bg: './src/assets/elementBgs/dendro.png',
        ico: './src/assets/elementIcons/dendro.png',
    },
    electro: {
        bg: './src/assets/elementBgs/electro.png',
        ico: './src/assets/elementIcons/electro.png',
    },
    geo: {
        bg: './src/assets/elementBgs/geo.png',
        ico: './src/assets/elementIcons/geo.png',
    },
    hydro: {
        bg: './src/assets/elementBgs/hydro.png',
        ico: './src/assets/elementIcons/hydro.png',
    },
    pyro: {
        bg: './src/assets/elementBgs/pyro.png',
        ico: './src/assets/elementIcons/pyro.png',
    },
}
const ascLevelMap = [20, 40, 50, 60, 70, 80, 90]

onMounted(() => {
    window.store.get('genshinInfo')
        .then((value) => {
            if (value) {
                playerInfoReady.value = true
                uid = value.uid
                uidInput.value = uid
            }
            playerInfo.value = value
            console.log(playerInfo.value)
        }).catch((err) => {
            console.log('err')
            console.error(err)
        })
})

const router = useRouter()
const requestInfo = () => {
    // window.dialog.show({
    //     title: '选择原神根目录',
    //     properties: ['openDirectory']
    // }).then((resp) => {
    //     path.value = resp[0];
    //     displayConfirm.value = true
    // }).catch((error) => {
    //     console.error('Error in showing dialog:', error);
    // });

    uid = uidInput.value
    playerInfoReady.value = false
    window.enka.getPlayer(uid)
        .then((resp) => {
            console.log(resp)
            window.store.set('genshinInfo', resp)
            playerInfo.value = resp
            playerInfoLoading.value = false
            router.go(0)
        }).catch((err) => {
            console.error(err)
        })
    playerInfoLoading.value = true
    console.log(uid)
}

const getCharElement = (id) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value > 0) { return elementAssets.pyro }
    else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value > 0) { return elementAssets.cryo }
    else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value > 0) { return elementAssets.hydro }
    else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value > 0) { return elementAssets.electro }
    else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value > 0) { return elementAssets.geo }
    else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value > 0) { return elementAssets.anemo }
    else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value > 0) { return elementAssets.dendro }
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;">
        <!-- HEADER -->
        <div class="flex flex-row w-full p-0 relative justify-between" style="height: 9vh;">
            <!-- 右上角名片 -->
            <el-image v-if="playerInfoReady" class="absolute top-0 right-0 bottom-0 z-0"
                :src="'https://enka.network/ui/' + playerInfo.player.namecard.assets.picPath[0] + '.png'">
            </el-image>
            <el-text v-if="playerInfoLoading" class="absolute top-0 right-0 bottom-0 z-0"
                style="margin-left: 1vw; right: 2vw; top: 3vh;">正在加载数据，请稍候……</el-text>
            <!-- 左上角头像、昵称 -->
            <div v-if="playerInfoReady" class="flex flex-row content-start items-center" style="width: 35vw;">
                <el-avatar style="margin-left: 1vw;"
                    :src="'https://enka.network/ui/' + playerInfo.player.profilePicture.assets.icon + '.png'"></el-avatar>
                <div class="font-genshin" style="margin-left: 1vw; font-size: larger;">{{
                    playerInfo.player.username
                }}</div>
            </div>
            <div v-else style="width: 35vw" />
            <div class="flex flex-row self-center">
                <el-input v-model="uidInput" placeholder="输入uid以显示账号信息" @keyup.enter.native="requestInfo"
                    style="width: 15vw;"></el-input>
            </div>
            <!-- 右侧 WL AR -->
            <div v-if="playerInfoReady" style="width: 35vw; position: relative;">
                <div class="h-full flex flex-row justify-end items-center">
                    <el-tag size="large" round class="mr-2">
                        <div class="flex flex-row">
                            WL
                            <span class="font-genshin" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.levels.world }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round class="mr-4">
                        <div class="flex flex-row">
                            AR
                            <span class="font-genshin" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.levels.rank }}
                            </span>
                        </div>
                    </el-tag>
                </div>
            </div>
            <div v-else style="width: 35vw" />
        </div>
        <!-- BODY -->
        <div v-if="playerInfoReady && playerInfo.characters.length > 0">
            <!-- 角色头像列表 -->
            <div class="flex flex-row w-full justify-center z-50 relative">
                <div v-for="(character, index) in playerInfo.player.showcase" class="relative" @click="showcaseIdx = index">
                    <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white"
                        :class="{ 'border-blue-600 border-3': showcaseIdx == index }" style="left: 10px;"></div>
                    <img class="char-side-icon rounded-full ml-1 w-12"
                        :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].sideIconName : character.assets.sideIcon) + '.png'" />
                </div>
            </div>
            <!-- 角色详情卡片 -->
            <div v-for="(character, index) in playerInfo.characters" class="z-0">
                <div v-if="showcaseIdx == index" class="mt-4 w-full relative">
                    <!-- absolute： 卡片元素背景、元素图标 -->
                    <img class="relative z-0" :src="getCharElement(index).bg" style="border-radius: 4.5vh; height: 40vw;" />
                    <img class="h-1/4 absolute opacity-50" :src="getCharElement(index).ico"
                        style="top: -7px; right: -18px;" />
                    <!-- 卡片前景 -->
                    <div class="flex flex-row h-full absolute top-0 left-0 right-0 bottom-0 z-10">
                        <!-- 立绘 -->
                        <div class="left-gacha w-2/3 inline-block object-cover absolute left-0 bottom-0 z-10"
                            style="height: 115%;">
                            <!-- :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].art : character.assets.gachaIcon) + '.png'" -->
                            <img class="gacha-mask inline-block object-cover bottom-0 left-0 absolute z-10 h-full"
                                loading="lazy" :src="'https://enka.network/ui/' + character.assets.gachaIcon + '.png'" />
                        </div>
                        <!-- 左下角天赋、命之座 -->
                        <div class="absolute bottom-2 left-2 z-20">
                            <div class="flex flex-col">
                                <div class="flex flex-row relative">
                                    <div v-for="skill in character.skills" class="rounded-full ml-2 h-8 mb-2 flex flex-row"
                                        style="background-color: rgb(0 0 0 / 0.6); width: 72px;">
                                        <img class="h-8 rounded-full"
                                            :src="'https://enka.network/ui/' + skill.assets.icon + '.png'" />
                                        <div class="text-center w-full mr-1 h-full align-middle" style="margin-top: 3px;">
                                            <span
                                                :class="{ 'text-orange-300': skill.level >= 10 }, { 'text-white': skill.level < 10 }"
                                                class="text-base font-genshin">{{ skill.level }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row relative">
                                    <div v-for="idx in 6">
                                        <div v-if="idx <= character.constellationsList.length" class="relative">
                                            <div
                                                class="absolute bottom-0 left-2 w-8 h-8 rounded-full bg-black z-20 opacity-70">
                                            </div>
                                            <img class="relative h-8 rounded-full ml-2 z-30"
                                                :src="'https://enka.network/ui/' + character.constellationsList[idx - 1].assets.icon + '.png'" />
                                        </div>
                                        <div v-else>
                                            <img src="../assets/locked.png"
                                                class="w-8 opacity-70 ml-2 bg-black rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧详情 -->
                        <div class="w-2/5 h-full absolute top-4 right-6 bottom-4 flex flex-col z-20">
                            <div class="w-full text-right">
                                <span class=" text-gray-200 font-genshin bottom-0 text-xl align-bottom">
                                    Lv. {{ character.properties.level.val }} /
                                </span>
                                <span class=" text-gray-400 bottom-0 text-xl align-bottom mr-2 font-serif">
                                    {{ ascLevelMap[character.properties.ascension.val * 1] }}
                                </span>
                                <span class=" text-white font-genshin text-4xl font-bold">{{ character.name }}</span>
                            </div>
                            <div class="mt-2 text-white text-left w-full rounded-xl p-2 pl-4"
                                style="background-color: rgba(0, 0, 0, 0.5);">
                                <p>aaa</p>
                                <p>bbb</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!playerInfoReady" class="mt-4 mb-4">此处将显示角色的详细信息</div>
        <div v-else class="mt-4 mb-4">当前暂无详细信息，请在游戏内打开“展示详细信息”后再试</div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-genshin {
    font-family: genshin-font;
}

.char-side-icon {
    -webkit-mask: radial-gradient(white 80%, transparent)
}

.gacha-mask {
    -webkit-mask: linear-gradient(transparent, white 15%, white 85%, transparent)
}

.left-gacha {
    -webkit-mask: linear-gradient(270deg, transparent, white 20%)
}
</style>
