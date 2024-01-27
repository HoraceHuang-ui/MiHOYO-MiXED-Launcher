<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {translate} from '../../../i18n'
import StatIcon from '../../../components/StatIcon.vue'
import CustomUIDInput from "../../../components/CustomUIDInput.vue";
import {useDialog} from "../../../utils/template-dialog";
import GSCharDetailsOverlay from "./GSCharDetailsOverlay.vue";
import MyTag from "../../../components/MyTag.vue";
import ScrollWrapper from "../../../components/ScrollWrapper.vue";
import MyTooltip from "../../../components/MyTooltip.vue";
import MyCarousel from "../../../components/MyCarousel.vue";

const playerInfo = ref<any>()
const cardsCarouselRef = ref()

const uidInput = ref('')
let uid = '';
const charsPage = ref(0);
const pages = computed(() => {
    return playerInfo.value.characters && playerInfo.value.characters.length > 10
        ? Math.floor((playerInfo.value.characters.length - 10) / 6 - 0.1) + 1
        : 0
})
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const playerInfoFailed = ref(false)
const charsScrollbar = ref()
const showcaseIdx = ref(0)
const elementAssets = {
    cryo: {
        bg: '../../src/assets/elementBgs/cryo.png',
        ico: '../../src/assets/elementIcons/cryo.png'
    },
    anemo: {
        bg: '../../src/assets/elementBgs/anemo.png',
        ico: '../../src/assets/elementIcons/anemo.png'
    },
    dendro: {
        bg: '../../src/assets/elementBgs/dendro.png',
        ico: '../../src/assets/elementIcons/dendro.png'
    },
    electro: {
        bg: '../../src/assets/elementBgs/electro.png',
        ico: '../../src/assets/elementIcons/electro.png'
    },
    geo: {
        bg: '../../src/assets/elementBgs/geo.png',
        ico: '../../src/assets/elementIcons/geo.png'
    },
    hydro: {
        bg: '../../src/assets/elementBgs/hydro.png',
        ico: '../../src/assets/elementIcons/hydro.png'
    },
    pyro: {
        bg: '../../src/assets/elementBgs/pyro.png',
        ico: '../../src/assets/elementIcons/pyro.png'
    },
}

const mergeToPlayerinfo = (newArr: any[]) => {
    for (let i = newArr.length - 1; i >= 0; i--) {
        let newChar = newArr[i]
        let exists = false;
        // for (let j = playerInfo.value.characters.length - 1; j >= 0; j--) {
        for (let j = 0; j < playerInfo.value.characters.length; j++) {
            let oldChar = playerInfo.value.characters[j]
            if (oldChar.characterData.id == newChar.characterData.id) {
                playerInfo.value.characters[j] = newChar
                exists = true
                break
            }
        }
        if (!exists) {
            playerInfo.value.characters.push(newChar)
        }
    }
}

onMounted(() => {
    window.store.get('genshinInfo')
        .then((value) => {
            if (value) {
                playerInfoReady.value = true
                uid = value.uid
                uidInput.value = uid
                playerInfo.value = value
            }
            console.log(playerInfo.value)
        }).catch((err) => {
        console.error(err)
    })
})

const router = useRouter()
const requestInfo = () => {
    uid = uidInput.value
    playerInfoReady.value = false
    console.log(uidInput.value)
    playerInfoLoading.value = true
    playerInfoFailed.value = false
    window.enka.getGenshinPlayer(uid, translate('gs_enkaLangCode'))
        .then((resp) => {
            if (playerInfo.value && playerInfo.value.uid == resp.uid) {
                mergeToPlayerinfo(Object.values(resp.characters))
                const temp = playerInfo.value.characters
                playerInfo.value = Object.fromEntries(Object.entries(resp).filter(([key]) => key !== 'characters'))
                playerInfo.value.characters = temp
            } else {
                resp.characters = Object.values(resp.characters)
                playerInfo.value = resp
            }
            playerInfo.value.characters.sort(function (a: any, b: any) {
                // 等级
                if (a.level < b.level) {
                    return 1
                } else if (a.level > b.level) {
                    return -1
                } else {
                    // 突破等级
                    if (a.maxLevel < b.maxLevel) {
                        return 1
                    } else if (a.maxLevel > b.maxLevel) {
                        return -1
                    } else {
                        // 双爆分
                        const critA = a.stats.critRate.value * 2 + a.stats.critDamage.value
                        const critB = b.stats.critRate.value * 2 + b.stats.critDamage.value
                        if (critA < critB) {
                            return 1
                        } else {
                            return -1
                        }
                    }
                }
            })
            window.store.set('genshinInfo', JSON.stringify(playerInfo.value), true)
            playerInfoLoading.value = false
            console.log(playerInfo.value)
            router.push({
                name: 'tempPage',
                query: {
                    from: '/gspage'
                }
            })
        }).catch((err) => {
        console.error(err)
        playerInfoLoading.value = false
        playerInfoFailed.value = true
    })
}

const setShowcase = (index: number) => {
    cardsCarouselRef.value?.setPane?.(index)
    showcaseIdx.value = index
}

const getCharElementAssets = (id: number) => {
    const charElementId = playerInfo.value.characters[id].characterData.element.id

    switch (charElementId) {
        case "Water":
            return elementAssets.hydro
        case "Ice":
            return elementAssets.cryo
        case "Fire":
            return elementAssets.pyro
        case "Rock":
            return elementAssets.geo
        case "Grass":
            return elementAssets.dendro
        case "Wind":
            return elementAssets.anemo
        case "Electric":
            return elementAssets.electro
    }
}

const displayStat = (stat: any) => {
    if (stat.isPercent) {
        return `${(stat.value * 100).toFixed(1)}%`
    } else {
        return `${stat.value.toFixed(0)}`
    }
}

const calcCritScoreTotal = (id: number) => {
    let score = 0.0
    const artifacts = Object.values(playerInfo.value.characters[id].artifacts)
    artifacts.forEach((artifact: any) => {
        if (artifact.mainstat.fightProp == "FIGHT_PROP_CRITICAL_HURT") {
            score += artifact.mainstat.value
        } else if (artifact.mainstat.fightProp == "FIGHT_PROP_CRITICAL") {
            score += artifact.mainstat.value * 2
        }
        const substats = Object.values(artifact.substats.total)
        substats.forEach((substat: any) => {
            if (substat.fightProp == "FIGHT_PROP_CRITICAL_HURT") {
                score += substat.value
            } else if (substat.fightProp == "FIGHT_PROP_CRITICAL") {
                score += substat.value * 2
            }
        })
    })
    return score * 100
}

const getArtifactSetInfo = (id: number) => {
    const tokens: string[] = []
    const artifacts = Object.values(playerInfo.value.characters[id].artifacts)
    const sets = new Map<string, number>()
    artifacts.forEach((artifact: any) => {
        const setName = artifact.artifactData.set.name.text
        if (sets.get(setName)) {
            sets.set(setName, sets.get(setName)!! + 1)
        } else {
            sets.set(setName, 1)
        }
    })
    sets.forEach((value, key) => {
        if (value >= 4) {
            tokens.push(key)
            tokens.push(" 4")
        } else if (value >= 2) {
            if (tokens.length == 0) {
                tokens.push(key)
                tokens.push(" 2")
            } else {
                tokens.push(key)
                tokens.push(" 2")
            }
        }
    })
    if (tokens.length == 2) {
        return tokens[0] + tokens[1]
    } else if (tokens.length == 4) {
        // return `${tokens[0]}${tokens[1]}
        // ${tokens[2]}${tokens[3]}`
        return tokens[0] + tokens[1] + "\n" + tokens[2] + tokens[3]
    } else {
        return translate('gs_noArtifactSets')
    }
}
const charsPageNext = () => {
    if (charsPage.value < pages.value) {
        charsPage.value++
        charsScrollbar.value.scrollTo({
            // about 48 for each icon, 10 icons on each page
            left: charsPage.value * 48 * 6,
            top: 0,
            behavior: "smooth"
        })
    }
}
const charsPagePrev = () => {
    if (charsPage.value > 0) {
        charsPage.value--
        charsScrollbar.value.scrollTo({
            left: charsPage.value * 48 * 6,
            top: 0,
            behavior: "smooth"
        })
    }
}

const showCharDetails = (stats: any, name: string) => {
    useDialog(GSCharDetailsOverlay, {}, {
        title: name + ' ' + translate('gs_charDetails'),
        stats: stats
    })
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 86.5vh;' : ''">
        <div class="flex flex-row w-full p-0 relative justify-between" style="height: 9vh;">
            <!-- 右上角名片 -->
            <img v-if="playerInfoReady"
                 class="namecard-mask absolute top-0 right-0 bottom-0 z-0 w-1/3 object-cover"
                 style="height: 9vh; border-radius: 0 4.5vh 4.5vh 0"
                 :src="playerInfo.profileCard.pictures['1'].url"/>
            <div v-if="playerInfoLoading" class="absolute bottom-0 z-0" style="margin-left: 1vw; right: 2vw; top: 3vh;">
                {{
                    $t('gs_loadingPlayerInfo')
                }}
            </div>
            <div v-if="playerInfoFailed" class="absolute bottom-0 z-0 text-red-500"
                 style="margin-left: 1vw; right: 2vw; top: 3vh;">
                {{ $t('gs_playerInfoFailed') }}
            </div>
            <!-- 左上角头像、昵称 -->
            <!-- playerInfo.player.profilePicture.assets.icon -->
            <div v-if="playerInfoReady" class="flex flex-row content-start items-center" style="width: 35vw;">
                <img class="rounded-full h-12 border-2 bg-slate-200" style="margin-left: 1vw;"
                     :src="playerInfo.profilePicture.icon.url"/>
                <div class="font-gs" style="margin-left: 1vw; font-size: larger;">{{
                        playerInfo.nickname
                    }}
                </div>
            </div>
            <div v-else style="width: 35vw"/>
            <div class="relative flex flex-row mt-3 z-10">
                <CustomUIDInput v-model="uidInput" @submit="requestInfo"/>
            </div>
            <!-- 右侧 WL AR -->
            <div v-if="playerInfoReady" style="width: 35vw; position: relative;">
                <div class="h-full flex flex-row justify-end items-center">
                    <MyTag class="mx-2">
                        <div class="flex flex-row">
                            {{ $t('gs_worldLv') }}
                            <span class="font-gs" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.level }}
                            </span>
                        </div>
                    </MyTag>
                    <MyTag class="mr-4">
                        <div class="flex flex-row">
                            {{ $t('gs_playerLv') }}
                            <span class="font-gs" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.worldLevel }}
                            </span>
                        </div>
                    </MyTag>
                </div>
            </div>
            <div v-else style="width: 35vw"/>
        </div>
        <!-- BODY -->
        <div v-if="playerInfoReady && playerInfo.showCharacterDetails" class="relative">
            <!-- 角色头像列表 10人一页 -->
            <div class="flex flex-row w-full justify-between absolute top-0">
                <div class="relative z-50 w-1/4">
                    <div
                        class="absolute right-2 top-3 rounded-full w-9 h-9 pt-1 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all bg-opacity-80"
                        @click="charsPagePrev" :class="charsPage == 0 ? 'disabled' : ''">
                        <i class="bi bi-chevron-left text-lg text-center"/>
                    </div>
                </div>

                <ScrollWrapper ref="charsScrollbar" class="flex flex-row justify-center" width="50%" :no-resize="true"
                               show-bar="never">
                    <div class="flex flex-row justify-center">
                        <div class="flex flex-row flex-nowrap w-max">
                            <div v-for="(character, index) in playerInfo.characters" class="relative w-12 h-12 z-50"
                                 @click="setShowcase(index)">
                                <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white transition-all"
                                     :class="{ 'border-blue-600 border-3': showcaseIdx == index }"
                                     style="left: 10px;"></div>
                                <img
                                    class="absolute bottom-0 char-side-icon rounded-full ml-1 w-12 h-12 hover:transform hover:scale-110 hover:-translate-y-1 active:scale-100 active:translate-y-0 transition-all object-cover"
                                    :src="character.costume.sideIcon.url"/>
                            </div>
                        </div>
                    </div>
                </ScrollWrapper>
                <div class="relative z-50 w-1/4">
                    <div
                        class="absolute left-2 top-3 rounded-full w-9 h-9 pt-1 bg-white hover:bg-gray-200 active:translate-x-1 transition-all bg-opacity-80"
                        @click="charsPageNext" :class="charsPage == pages ? 'disabled' : ''">
                        <i class="bi bi-chevron-right text-lg text-center"/>
                    </div>
                </div>
            </div>
            <!-- 角色详情卡片 -->
            <MyCarousel ref="cardsCarouselRef" class="gacha-mask relative z-0" :autoplay="false" show-arrow="never"
                        animation="fade-swipe"
                        style="width: 960px; height: 543px; border-radius: 0 0 4.5vh 4.5vh">
                <div v-for="(character, index) in playerInfo.characters" class="z-0 relative w-full mt-12">
                    <div class="mt-4 w-full absolute top-0 left-0 right-0 transition-all"
                         style="transition-duration: 300ms;">
                        <!-- absolute： 卡片元素背景、元素图标 -->
                        <img class="relative z-0" :src="getCharElementAssets(index)!!.bg"
                             style="border-radius: 4.5vh"/>
                        <img class="h-1/4 absolute opacity-50" :src="getCharElementAssets(index)!!.ico"
                             style="top: -7px; right: -18px"/>
                        <!-- 卡片前景 -->
                        <div class="flex flex-row h-full absolute top-0 left-0 right-0 bottom-0 z-10">
                            <!-- 立绘 -->
                            <div class="left-gacha w-2/3 object-cover absolute left-0 bottom-0 z-10"
                                 style="height: 115%;">
                                <img
                                    class="inline-block object-cover bottom-0 left-0 absolute z-10 h-full pointer-events-none"
                                    :src="character.characterData.splashImage.url"/>
                            </div>
                            <!-- 左上角等级 -->
                            <div
                                class="z-50 absolute left-3 top-3 rounded-full backdrop-blur-lg bg-opacity-25 bg-black h-10">
                                <div class="mt-2 ml-3">
                                <span class=" text-gray-100 font-gs bottom-0 text-xl align-bottom">
                                    Lv. {{ character.level }} /
                                </span>
                                    <span class=" text-gray-300 bottom-0 text-xl align-bottom mr-3 font-gs">
                                    {{
                                            character.maxLevel
                                        }}
                                </span>
                                </div>
                            </div>
                            <!-- 左下角天赋、命之座 -->
                            <div class="absolute bottom-2 left-2 z-50">
                                <div class="flex flex-col">
                                    <div class="flex flex-row relative">
                                        <MyTooltip v-for="(skill, id) in character.skillLevels" placement="top"
                                                   :key="id">
                                            <template #content>
                                                <span class="font-gs text-base"> {{ skill.skill.name.text }} </span>
                                            </template>
                                            <div class="rounded-full ml-2 h-8 mb-2 flex flex-row cursor-default"
                                                 style="background-color: rgb(0 0 0 / 0.6); width: 72px;">
                                                <img class="h-8 rounded-full"
                                                     :src="skill.skill.icon.url"/>
                                                <div
                                                    class="text-center w-full mr-1 h-full align-middle text-base font-gs"
                                                    style="margin-top: 3px;">
                                                <span v-if="skill.level.extra > 0"
                                                      :class="skill.level.base == 10 ? 'text-orange-300' : 'text-cyan-400'">{{
                                                        skill.level.value
                                                    }}</span>
                                                    <span v-else
                                                          :class="skill.level.base == 10 ? 'text-orange-300' : 'text-white'">{{
                                                            skill.level.value
                                                        }}</span>
                                                </div>
                                            </div>
                                        </MyTooltip>
                                    </div>
                                    <div class="flex flex-row relative">
                                        <MyTooltip v-for="idx in 6" placement="top">
                                            <template #content>
                                                <span class="font-gs text-base point"> {{
                                                        idx <=
                                                        Object.keys(character.unlockedConstellations).length ? character.unlockedConstellations[`${idx -
                                                        1}`].name.text : $t("gs_lockedConstel")
                                                    }} </span>
                                            </template>
                                            <div v-if="idx <= Object.keys(character.unlockedConstellations).length"
                                                 class="relative">
                                                <div
                                                    class="absolute bottom-0 left-2 w-8 h-8 rounded-full bg-black z-20 opacity-70">
                                                </div>
                                                <img class="relative h-8 rounded-full ml-2 z-30"
                                                     :src="character.unlockedConstellations[`${idx - 1}`].icon.url"/>
                                            </div>
                                            <div v-else>
                                                <img src="../../../assets/locked.png"
                                                     class="w-8 opacity-70 ml-2 bg-black rounded-full"/>
                                            </div>
                                        </MyTooltip>
                                    </div>
                                </div>
                            </div>
                            <!-- 右侧详情 -->
                            <div class=" w-5/12 h-full absolute top-7 right-6 bottom-4 flex flex-col z-20">
                                <!-- 角色名字-->
                                <div class="w-full text-right">
                                <span class=" text-white font-gs font-bold"
                                      style="font-size: 2.15rem; line-height: 2.5rem;">{{
                                        character.characterData.name.text
                                    }}</span>
                                </div>
                                <!-- 详情第一块：属性 -->
                                <div
                                    class="mt-2 text-gray-200 text-lg text-left w-full rounded-xl p-2 pl-4 grid grid-cols-3 grid-rows-3 bg-opacity-20 bg-black backdrop-blur-lg">
                                    <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 1;">
                                        <!-- <span class="text-gray-300">生命</span> -->
                                        <StatIcon game="gs" stat="FIGHT_PROP_HP" fill="#d1d5db" class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                character.stats.maxHealth.value.toFixed(0)
                                            }}</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 1;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_ATTACK" fill="#d1d5db" class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                character.stats.attack.value.toFixed(0)
                                            }}</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 3; grid-row: 1;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_DEFENSE" fill="#d1d5db" class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                character.stats.defense.value.toFixed(0)
                                            }}</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 2;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_CHARGE_EFFICIENCY" fill="#d1d5db"
                                                  class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                (character.stats.chargeEfficiency.value * 100).toFixed(1)
                                            }}%</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 2;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_ELEMENT_MASTERY" fill="#d1d5db"
                                                  class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                character.stats.elementMastery.value.toFixed(0)
                                            }}</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 3; grid-row: 2;">
                                        <StatIcon game="gs" stat="CUSTOM_ENERGY_REQUIRED" fill="#d1d5db" class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                character.skillLevels['2'].skill.costElemVal
                                            }}</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 3;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_CRITICAL" fill="#d1d5db" class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                (character.stats.critRate.value * 100).toFixed(1)
                                            }}%</span>
                                    </div>
                                    <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 3;">
                                        <StatIcon game="gs" stat="FIGHT_PROP_CRITICAL_HURT" fill="#d1d5db"
                                                  class="w-5 h-5"
                                                  style="margin-top: 1px;"/>
                                        <span class="text-gray-200 text-right font-gs ml-3">{{
                                                (character.stats.critDamage.value * 100).toFixed(1)
                                            }}%</span>
                                    </div>
                                    <div
                                        class="mx-2 rounded-full text-sm bg-white bg-opacity-20 text-center hover:bg-opacity-30 active:scale-95 active:bg-opacity-40 cursor-default transition-all px-1"
                                        @click="showCharDetails(character.stats.statProperties, character.characterData.name.text)"
                                        style="grid-column: 3; grid-row: 3;">
                                        <div class="font-gs" style="margin-top: 5px;">{{ $t("gs_details") }}</div>
                                    </div>
                                </div>
                                <!-- 详情第二块：武器 -->
                                <div
                                    class="mt-2 w-full rounded-xl flex flex-row bg-opacity-20 bg-black backdrop-blur-lg"
                                    style="height: 84px;">
                                    <img class="h-full"
                                         :src="character.weapon.weaponData.awakenIcon.url"/>
                                    <div class="w-full h-full relative">
                                        <div class="flex flex-row justify-between ml-2 mt-4">
                                            <div class="text-gray-200 font-gs mt-1 truncated"
                                                 style="max-width: 300px; font-size: 1.4rem; line-height: 2rem;">
                                                {{ character.weapon.weaponData.name.text }}
                                            </div>
                                            <div
                                                class="absolute right-1 bottom-1 text-gray-100 rounded-full bg-opacity-20 bg-white px-2">
                                                <span class="font-gs">{{ character.weapon.level }} / </span>
                                                <span class="text-gray-300 font-serif">{{
                                                        character.weapon.maxLevel
                                                    }}</span>
                                            </div>
                                            <div class="text-gray-400 mr-2 text-sm absolute right-0 top-0">{{
                                                    $t('gs_refinement')
                                                }}
                                                <span class="text-gray-200 font-gs text-base">{{
                                                        character.weapon.refinementRank
                                                    }}</span>
                                            </div>
                                        </div>
                                        <div class="text-gray-300 ml-2 mt-1 text-left grid grid-cols-3">
                                            <div class="flex flex-row" style="grid-column: 1;">
                                                <!-- {{ $t('gs_statATK') }} -->
                                                <StatIcon game="gs" stat="FIGHT_PROP_ATTACK" fill="#d1d5db"
                                                          class="w-5 h-5 mr-2"
                                                          style="margin-top: 1px;"/>
                                                <span class="text-gray-200 font-gs text-lg">{{
                                                        character.weapon.weaponStats['0'].value.toFixed(0)
                                                    }}</span>
                                            </div>
                                            <div v-if="Object.keys(character.weapon.weaponStats).length > 1"
                                                 class="ml-2 flex flex-row" style="grid-column: 2 / 4;">
                                                <!-- {{ $t(`gs_${character.equipment.weapon.weaponStats[1].stat}`) }} -->
                                                <StatIcon game="gs"
                                                          :stat="character.weapon.weaponStats['1'].fightProp"
                                                          fill="#d1d5db" class="w-5 h-5 mr-2" style="margin-top: 1px;"/>
                                                <span class="text-gray-200 font-gs text-lg">{{
                                                        displayStat(character.weapon.weaponStats['1'])
                                                    }}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <!-- 详情第三块：圣遗物 -->
                                <MyCarousel
                                    v-if="character.artifacts && Object.keys(character.artifacts).length > 0"
                                    class="relative mt-2 w-full h-40 rounded-xl bg-opacity-20 bg-black backdrop-blur-lg"
                                    show-arrow="never" show-indicator="always"
                                    :autoplay="false">
                                    <div v-for="artifact in Object.values(character.artifacts)"
                                         class="pb-2 pr-2 pl-4 flex flex-row h-40 text-gray-200 w-full">
                                        <img style="height: 140%; margin-left: -15px; margin-top: -45px;"
                                             class="artifact-mask w-28 object-cover"
                                             :src="artifact.artifactData.icon.url"/>
                                        <div class="w-full h-full relative">
                                            <div class="text-gray-400 mr-2 text-sm absolute right-0 top-1 truncated">
                                                {{ artifact.artifactData.name.text }}
                                            </div>
                                            <!-- 主词条、等级 -->
                                            <div class="text-left mt-7 w-full flex flex-row">
                                                <StatIcon game="gs" :stat="artifact.mainstat.fightProp" fill="#eee"
                                                          class="w-6 h-6 mr-1" style="margin-top: 3px;"/>
                                                <!-- <span class="text-gray-200 text-xl">{{ $t(`gs_${artifact.mainstat.stat}`)
                                                }}</span> -->
                                                <span class="text-gray-200 text-3xl ml-2 font-gs">
                                                    {{ displayStat(artifact.mainstat) }}
                                                </span>
                                                <div :class="{ 'border-orange-400 bg-orange-900 text-orange-300': artifact.artifactData.stars == 5,
                                              'border-purple-400 bg-purple-900 text-purple-300': artifact.artifactData.stars == 4,
                                              'border-blue-400 bg-blue-900 text-blue-300': artifact.artifactData.stars == 3,
                                              'border-green-400 bg-green-900 text-green-300': artifact.artifactData.stars == 2}"
                                                     class="h-full justify-end mt-1 ml-2 font-gs rounded-full border px-2">
                                                    +{{ artifact.level - 1 }}
                                                </div>
                                            </div>
                                            <!-- 副词条 -->
                                            <div
                                                v-if="artifact.substats && Object.keys(artifact.substats.total).length > 0"
                                                class="grid grid-cols-2 mt-2 grid-rows-2 gap-1 w-full text-left">
                                                <div v-for="substat in Object.values(artifact.substats.total)"
                                                     class="flex flex-row">
                                                    <!-- <span class="text-gray-300 text-lg">{{ getPropShortName(substat.stat)
                                                    }}</span> -->
                                                    <StatIcon game="gs" :stat="substat.fightProp" fill="#d1d5db"
                                                              class="w-4 h-4 mr-1"
                                                              style="margin-top: 2px;"/>
                                                    <span class="text-gray-300 font-gs text-xl ml-2">{{
                                                            displayStat(substat)
                                                        }}</span>
                                                </div>
                                            </div>
                                            <div v-else class="mt-2 text-left text-gray-300 text-lg">{{
                                                    $t('gs_noSubstats')
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </MyCarousel>
                                <div v-else
                                     class="mt-2 w-full h-40 rounded-xl pt-16 text-gray-200 text-center align-middle bg-opacity-20 bg-black backdrop-blur-lg">
                                    {{ $t('gs_noArtifacts') }}
                                </div>
                                <div v-if="character.artifacts && Object.keys(character.artifacts).length > 0"
                                     class="flex flex-row justify-between">
                                    <div class="text-gray-200 ml-1 text-left text-sm">
                                        {{ $t('gs_critScore') }}
                                        <span class="text-gray-100 font-gs">{{
                                                calcCritScoreTotal(index).toFixed(1)
                                            }}</span>
                                    </div>
                                    <div class="text-gray-200 mt-1 mr-1 text-right text-sm">
                                    <pre class="font-gs text-sm"
                                         style="line-height: 1rem;">{{ getArtifactSetInfo(index) }}</pre>
                                    </div>
                                </div>
                                <div v-else class="flex flex-row justify-between text-sm">
                                    <div class="text-gray-200 ml-1 mt-1">
                                        {{ $t('gs_critScore') }}
                                        <span class="text-gray-100 font-gs">0</span>
                                    </div>
                                    <div class="text-gray-200 mt-1 mr-1 font-gs">
                                        {{ $t('gs_noArtifactSets') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MyCarousel>
        </div>
        <div v-else-if="!playerInfoReady" class="mt-4 mb-4">{{ $t('gs_emptyPlayerTip') }}</div>
        <div v-else class="mt-4 mb-4">{{ $t('gs_showcaseTip') }}</div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.font-gs {
    font-family: genshin-font, serif;
}

.namecard-mask {
    -webkit-mask: linear-gradient(90deg, transparent, white 50%)
}

.char-side-icon {
    -webkit-mask: radial-gradient(white 80%, transparent)
}

.gacha-mask {
    -webkit-mask: linear-gradient(transparent, white 3rem)
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

.truncated {
    @apply inline-block max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden;
}
</style>
