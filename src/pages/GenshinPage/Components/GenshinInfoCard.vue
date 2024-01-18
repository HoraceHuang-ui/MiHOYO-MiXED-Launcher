<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'
import {translate} from '../../../i18n'
import StatIcon from '../../../components/StatIcon.vue'
import {Artifact} from "enkanetwork.js"
import {parseInt} from "lodash-es"
import CustomUIDInput from "../../../components/CustomUIDInput.vue";
import {useDialog} from "../../../utils/template-dialog";
import GSCharDetailsOverlay from "./GSCharDetailsOverlay.vue";

const playerInfo = ref<any>()

const uidInput = ref('')
let uid = '';
const charsPage = ref(0);
const pages = computed(() => {
    console.log("character.length: ")
    return playerInfo.value.characters && playerInfo.value.characters.length > 10
        ? Math.floor((playerInfo.value.characters.length - 10) / 6 - 0.1) + 1
        : 0
})
const constelsMap = ref<any[]>([])
const constelsReady = ref(false)
const constelsAdditions = computed(() => {
    if (!playerInfoReady.value || !constelsReady.value) {
        return {}
    }
    let res: Record<number, number> = {}
    playerInfo.value.characters.forEach((character: any) => {
        if (character.skillsExtraLevel) {
            Object.keys(character.skillsExtraLevel).forEach((level) => {
                // check
                let target = findSkillIdByProud(parseInt(level))
                if (target != -1) {
                    res[target] = character.skillsExtraLevel[level]
                }
            })
        }
    })
    return res
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
const ascLevelMap = [20, 40, 50, 60, 70, 80, 90]

const mergeToPlayerinfo = (newArr: any[]) => {
    console.log("Updated characters length: ")
    for (let i = newArr.length - 1; i >= 0; i--) {
        let newChar = newArr[i]
        let exists = false;
        // for (let j = playerInfo.value.characters.length - 1; j >= 0; j--) {
        for (let j = 0; j < playerInfo.value.characters.length; j++) {
            let oldChar = playerInfo.value.characters[j]
            if (oldChar.characterId == newChar.characterId) {
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


    window.store.get('genshinConstels')
        .then(resp => {
            if (resp) {
                constelsMap.value = JSON.parse(resp)
                constelsReady.value = true
            }
        })
        .catch(err => {
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
            if (playerInfo.value && playerInfo.value.uid === resp.uid) {
                mergeToPlayerinfo(resp.characters)
                playerInfo.value.player = resp.player
            } else {
                playerInfo.value = resp
            }
            playerInfo.value.characters.sort(function (a: any, b: any) {
                // 等级
                if (a.properties.level.val < b.properties.level.val) {
                    return 1
                } else if (a.properties.level.val > b.properties.level.val) {
                    return -1
                } else {
                    // 突破等级
                    if (a.properties.ascension.val < b.properties.ascension.val) {
                        return 1
                    } else if (a.properties.ascension.val > b.properties.ascension.val) {
                        return -1
                    } else {
                        // 双爆分
                        const critA = a.stats.critRate.value as number * 2 + a.stats.critDamage.value as number
                        const critB = b.stats.critRate.value as number * 2 + b.stats.critDamage.value as number
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

            fetch('https://gitlab.com/api/v4/projects/53216109/repository/files/ExcelBinOutput%2FAvatarSkillExcelConfigData.json/raw')
                .then(response => response.json())
                .then(resp2 => {
                    if (!resp2) return
                    resp2 = resp2.filter((a: any) => 'proudSkillGroupId' in a)
                    window.store.set('genshinConstels', JSON.stringify(resp2), false)

                    router.push({
                        name: 'tempPage',
                        query: {
                            from: '/gspage'
                        }
                    })
                })
                .catch(err => {
                    console.error(err)
                })
        }).catch((err) => {
        console.error(err)
        playerInfoLoading.value = false
        playerInfoFailed.value = true
    })
}

const getCharElementAssets = (id: number) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value as number > 0) {
        return elementAssets.pyro
    } else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value as number > 0) {
        return elementAssets.cryo
    } else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value as number > 0) {
        return elementAssets.hydro
    } else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value as number > 0) {
        return elementAssets.electro
    } else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value as number > 0) {
        return elementAssets.geo
    } else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value as number > 0) {
        return elementAssets.anemo
    } else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value as number > 0) {
        return elementAssets.dendro
    }
}

const getCharElementEnergy = (id: number) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value as number > 0) {
        return charStats.pyroEnergyCost.value
    } else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value as number > 0) {
        return charStats.cryoEnergyCost.value
    } else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value as number > 0) {
        return charStats.hydroEnergyCost.value
    } else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value as number > 0) {
        return charStats.electroEnergyCost.value
    } else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value as number > 0) {
        return charStats.geoEnergyCost.value
    } else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value as number > 0) {
        return charStats.anemoEnergyCost.value
    } else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value as number > 0) {
        return charStats.dendroEnergyCost.value
    }
}

const showPercentage = (prop: string) => {
    return (prop.endsWith("HURT") || prop.endsWith("CRITICAL") || prop.endsWith("PERCENT") || prop.endsWith("ADD") || prop.endsWith("EFFICIENCY")) ? '%' : ''
}

const calcCritScoreTotal = (index: number) => {
    let score = 0.0
    const artifacts = playerInfo.value.characters[index].equipment.artifacts
    artifacts.forEach((artifact: any) => {
        if (artifact.mainstat.stat == "FIGHT_PROP_CRITICAL_HURT") {
            score += artifact.mainstat.statValue
        } else if (artifact.mainstat.stat == "FIGHT_PROP_CRITICAL") {
            score += artifact.mainstat.statValue * 2
        }
        const substats = artifact.substats
        substats.forEach((substat: any) => {
            if (substat.stat == "FIGHT_PROP_CRITICAL_HURT") {
                score += substat.statValue
            } else if (substat.stat == "FIGHT_PROP_CRITICAL") {
                score += substat.statValue * 2
            }
        })
    })
    return score
}

const getArtifactSetInfo = (index: number) => {
    const tokens: string[] = []
    const artifacts = playerInfo.value.characters[index].equipment.artifacts
    const sets = new Map<string, number>()
    artifacts.forEach((artifact: Artifact) => {
        const setName = artifact.setName
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

const showCharDetails = (index: number) => {
    useDialog(GSCharDetailsOverlay, {}, {
        title: playerInfo.value.characters[index].name + ' ' + translate('gs_charDetails'),
        character: playerInfo.value.characters[index]
    })
}

const findSkillIdByProud = (proudId: number): number => {
    for (let i = 0; i < constelsMap.value.length; i++) {
        if (constelsMap.value[i].proudSkillGroupId == proudId) {
            return constelsMap.value[i].id
        }
    }

    return -1
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 86.5vh;' : ''">
        <div class="flex flex-row w-full p-0 relative justify-between" style="height: 9vh;">
            <!-- 右上角名片 -->
            <img v-if="playerInfoReady && playerInfo.player.namecard.assets.picPath[0] !== ''"
                 class="absolute top-0 right-0 bottom-0 z-0" style="height: 9vh;"
                 :src="'https://enka.network/ui/' + playerInfo.player.namecard.assets.picPath[0] + '.png'"/>
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
                     :src="'https://enka.network/ui/' + ('costumes' in playerInfo.player.profilePicture.assets && playerInfo.player.profilePicture.assets.costumes.length > 0 ? playerInfo.player.profilePicture.assets.costumes[0].icon : ('oldIcon' in playerInfo.player.profilePicture.assets ? playerInfo.player.profilePicture.assets.oldIcon : playerInfo.player.profilePicture.assets.icon)) + '.png'"/>
                <div class="font-gs" style="margin-left: 1vw; font-size: larger;">{{
                        playerInfo.player.username
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
                    <el-tag size="large" round class="mr-2">
                        <div class="flex flex-row">
                            {{ $t('gs_worldLv') }}
                            <span class="font-gs" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.levels.world }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round class="mr-4">
                        <div class="flex flex-row">
                            {{ $t('gs_playerLv') }}
                            <span class="font-gs" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.levels.rank }}
                            </span>
                        </div>
                    </el-tag>
                </div>
            </div>
            <div v-else style="width: 35vw"/>
        </div>
        <!-- BODY -->
        <div v-if="playerInfoReady && playerInfo.characters && playerInfo.characters.length > 0" class="relative">
            <!-- 角色头像列表 10人一页 -->
            <div class="flex flex-row w-full justify-between">
                <div class="relative z-50 w-1/4">
                    <el-icon
                        class="absolute right-2 top-3 rounded-full w-9 h-9 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all opacity-80"
                        @click="charsPagePrev" :class="charsPage === 0 ? 'disabled' : ''">
                        <ArrowLeftBold/>
                    </el-icon>
                </div>
                <el-scrollbar ref="charsScrollbar" class="flex flex-row w-1/2 justify-center" noresize>
                    <div class="flex flex-row z-50 relative flex-nowrap w-max">
                        <div v-for="(character, index) in playerInfo.characters" class="relative w-12 h-12"
                             @click="showcaseIdx = index">
                            <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white transition-all"
                                 :class="{ 'border-blue-600 border-3': showcaseIdx == index }"
                                 style="left: 10px;"></div>
                            <img
                                class="absolute bottom-0 char-side-icon rounded-full ml-1 w-12 h-12 hover:transform hover:scale-110 hover:-translate-y-1 active:scale-100 active:translate-y-0 transition-all object-cover"
                                :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].sideIconName : character.assets.sideIcon) + '.png'"/>
                        </div>
                    </div>
                </el-scrollbar>
                <div class="relative z-50 w-1/4">
                    <el-icon
                        class="absolute left-2 top-3 rounded-full w-9 h-9 ml-2 bg-white hover:bg-gray-200 active:translate-x-1 transition-all opacity-80"
                        @click="charsPageNext" :class="charsPage === pages ? 'disabled' : ''">
                        <ArrowRightBold/>
                    </el-icon>
                </div>
            </div>
            <!-- 角色详情卡片 -->
            <div v-for="(character, index) in playerInfo.characters" class="z-0 relative w-full">
                <div class="mt-4 w-full absolute top-0 left-0 right-0 transition-all"
                     :class="{ 'opacity-0 translate-x-40 pointer-events-none': showcaseIdx < index,
                      'opacity-100 pointer-events-auto': showcaseIdx == index,
                      'opacity-0 -translate-x-40 pointer-events-none': showcaseIdx > index }"
                     style="transition-duration: 300ms;">
                    <!-- absolute： 卡片元素背景、元素图标 -->
                    <img class="relative z-0" :src="getCharElementAssets(index)!!.bg"
                         style="border-radius: 4.5vh; height: 40vw;"/>
                    <img class="h-1/4 absolute opacity-50" :src="getCharElementAssets(index)!!.ico"
                         style="top: -7px; right: -18px;"/>
                    <!-- 卡片前景 -->
                    <div class="flex flex-row h-full absolute top-0 left-0 right-0 bottom-0 z-10">
                        <!-- 立绘 -->
                        <div class="left-gacha w-2/3 inline-block object-cover absolute left-0 bottom-0 z-10"
                             style="height: 115%;">
                            <!-- :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].art : character.assets.gachaIcon) + '.png'" -->
                            <img
                                class="gacha-mask inline-block object-cover bottom-0 left-0 absolute z-10 h-full pointer-events-none"
                                loading="lazy" :src="'https://enka.network/ui/' + character.assets.gachaIcon + '.png'"/>
                        </div>
                        <!-- 左上角等级 -->
                        <div
                            class="z-50 absolute left-3 top-3 rounded-full backdrop-blur-lg bg-opacity-25 bg-black h-10">
                            <div class="mt-2 ml-3">
                                <span class=" text-gray-100 font-gs bottom-0 text-xl align-bottom">
                                    Lv. {{ character.properties.level.val }} /
                                </span>
                                <span class=" text-gray-300 bottom-0 text-xl align-bottom mr-3 font-gs">
                                    {{
                                        ascLevelMap[character.properties.ascension.val ? parseInt(character.properties.ascension.val) : 0]
                                    }}
                                </span>
                            </div>
                        </div>
                        <!-- 左下角天赋、命之座 -->
                        <div class="absolute bottom-2 left-2 z-20">
                            <div class="flex flex-col">
                                <div class="flex flex-row relative">
                                    <el-tooltip v-for="skill in character.skills" placement="top">
                                        <template #content>
                                            <span class="font-gs text-base"> {{ skill.name }} </span>
                                        </template>
                                        <div class="rounded-full ml-2 h-8 mb-2 flex flex-row cursor-default"
                                             style="background-color: rgb(0 0 0 / 0.6); width: 72px;">
                                            <img class="h-8 rounded-full"
                                                 :src="'https://enka.network/ui/' + skill.assets.icon + '.png'"/>
                                            <div
                                                class="text-center w-full mr-1 h-full align-middle text-base font-gs"
                                                style="margin-top: 3px;">
                                                <span v-if="skill.id in constelsAdditions"
                                                      :class="{ 'text-orange-300': skill.level == 10, 'text-cyan-400': skill.level < 10 }">{{
                                                        skill.level + constelsAdditions[skill.id]
                                                    }}</span>
                                                <span v-else
                                                      :class="{ 'text-orange-300': skill.level == 10, 'text-white': skill.level < 10 }">{{
                                                        skill.level
                                                    }}</span>
                                            </div>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="flex flex-row relative">
                                    <el-tooltip v-for="idx in 6" placement="top">
                                        <template #content>
                                            <span class="font-gs text-base point"> {{
                                                    idx <=
                                                    character.constellationsList.length ? character.constellationsList[idx -
                                                    1].name : $t("gs_lockedConstel")
                                                }} </span>
                                        </template>
                                        <div v-if="idx <= character.constellationsList.length" class="relative">
                                            <div
                                                class="absolute bottom-0 left-2 w-8 h-8 rounded-full bg-black z-20 opacity-70">
                                            </div>
                                            <img class="relative h-8 rounded-full ml-2 z-30"
                                                 :src="'https://enka.network/ui/' + character.constellationsList[idx - 1].assets.icon + '.png'"/>
                                        </div>
                                        <div v-else>
                                            <img src="../../../assets/locked.png"
                                                 class="w-8 opacity-70 ml-2 bg-black rounded-full"/>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧详情 -->
                        <div class=" w-5/12 h-full absolute top-7 right-6 bottom-4 flex flex-col z-20">
                            <!-- 角色名字-->
                            <div class="w-full text-right">
                                <span class=" text-white font-gs font-bold"
                                      style="font-size: 2.15rem; line-height: 2.5rem;">{{ character.name }}</span>
                            </div>
                            <!-- 详情第一块：属性 -->
                            <div
                                class="mt-2 text-gray-200 text-lg text-left w-full rounded-xl p-2 pl-4 grid grid-cols-3 grid-rows-3 bg-opacity-20 bg-black backdrop-blur-lg">
                                <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 1;">
                                    <!-- <span class="text-gray-300">生命</span> -->
                                    <StatIcon game="gs" stat="FIGHT_PROP_HP" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            parseInt(character.stats.maxHp.value as string)
                                        }}</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 1;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_ATTACK" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            parseInt(character.stats.atk.value as string)
                                        }}</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 3; grid-row: 1;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_DEFENSE" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            parseInt(character.stats.def.value as string)
                                        }}</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 2;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_CHARGE_EFFICIENCY" fill="#d1d5db"
                                              class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            (character.stats.energyRecharge.value as number * 100).toFixed(1)
                                        }}%</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 2;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_ELEMENT_MASTERY" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            parseInt(!character.stats.elementalMastery.value ? '0' :
                                                character.stats.elementalMastery.value as string)
                                        }}</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 3; grid-row: 2;">
                                    <!-- <span class="text-gray-300">能量</span> -->
                                    <StatIcon game="gs" stat="CUSTOM_ENERGY_REQUIRED" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            getCharElementEnergy(index)
                                        }}</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 1; grid-row: 3;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_CRITICAL" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            (character.stats.critRate.value as number * 100).toFixed(1)
                                        }}%</span>
                                </div>
                                <div class="w-full flex flex-row" style="grid-column: 2; grid-row: 3;">
                                    <StatIcon game="gs" stat="FIGHT_PROP_CRITICAL_HURT" fill="#d1d5db" class="w-5 h-5"
                                              style="margin-top: 1px;"/>
                                    <span class="text-gray-200 text-right font-gs ml-3">{{
                                            (character.stats.critDamage.value as number * 100).toFixed(1)
                                        }}%</span>
                                </div>
                                <div
                                    class="mx-2 rounded-full text-sm bg-white bg-opacity-20 text-center hover:bg-opacity-30 active:scale-95 active:bg-opacity-40 cursor-default transition-all px-1"
                                    @click="showCharDetails(index)" style="grid-column: 3; grid-row: 3;">
                                    <div class="font-gs" style="margin-top: 5px;">{{ $t("gs_details") }}</div>
                                </div>
                            </div>
                            <!-- 详情第二块：武器 -->
                            <div class="mt-2 w-full rounded-xl flex flex-row bg-opacity-20 bg-black backdrop-blur-lg"
                                 style="height: 84px;">
                                <img class="h-full"
                                     :src="'https://enka.network/ui/' + character.equipment.weapon.assets.awakenIcon + '.png'"/>
                                <div class="w-full h-full relative">
                                    <div class="flex flex-row justify-between ml-2 mt-4">
                                        <el-text truncated class="text-gray-200 font-gs mt-1"
                                                 style="max-width: 300px; font-size: 1.4rem; line-height: 2rem;">
                                            {{ character.equipment.weapon.name }}
                                        </el-text>
                                        <div
                                            class="absolute right-1 bottom-1 text-gray-100 rounded-full bg-opacity-20 bg-white px-2">
                                            <span class="font-gs">{{ character.equipment.weapon.level }} / </span>
                                            <span class="text-gray-300 font-serif">{{
                                                    ascLevelMap[character.equipment.weapon.ascensionLevel ?
                                                        character.equipment.weapon.ascensionLevel as number : 0]
                                                }}</span>
                                        </div>
                                        <div class="text-gray-400 mr-2 text-sm absolute right-0 top-0">{{
                                                $t('gs_refinement')
                                            }}
                                            <span class="text-gray-200 font-gs text-base">{{
                                                    character.equipment.weapon.refinement.level as number + 1
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
                                                    character.equipment.weapon.weaponStats[0].statValue
                                                }}</span>
                                        </div>
                                        <div v-if="character.equipment.weapon.weaponStats.length > 1"
                                             class="ml-2 flex flex-row" style="grid-column: 2 / 4;">
                                            <!-- {{ $t(`gs_${character.equipment.weapon.weaponStats[1].stat}`) }} -->
                                            <StatIcon game="gs" :stat="character.equipment.weapon.weaponStats[1].stat"
                                                      fill="#d1d5db" class="w-5 h-5 mr-2" style="margin-top: 1px;"/>
                                            <span class="text-gray-200 font-gs text-lg">{{
                                                    character.equipment.weapon.weaponStats[1].statValue
                                                }}{{
                                                    showPercentage(character.equipment.weapon.weaponStats[1].stat)
                                                }}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <!-- 详情第三块：圣遗物 -->
                            <el-carousel
                                v-if="character.equipment.artifacts && character.equipment.artifacts.length > 0"
                                class="mt-2 w-full h-40 rounded-xl bg-opacity-20 bg-black backdrop-blur-lg"
                                arrow="never"
                                :autoplay="false">
                                <el-carousel-item v-for="artifact in character.equipment.artifacts"
                                                  class="pb-2 pr-2 pl-4 flex flex-row h-40 text-gray-200">
                                    <img style="height: 140%; margin-left: -15px; margin-top: -45px;"
                                         class="artifact-mask w-28 object-cover"
                                         :src="'https://enka.network/ui/' + artifact.icon + '.png'"/>
                                    <div class="w-full h-full relative">
                                        <div class="text-gray-400 mr-2 text-sm absolute right-0 top-1">
                                            {{ artifact.name }}
                                        </div>
                                        <!-- 主词条、等级 -->
                                        <div class="text-left mt-7 w-full flex flex-row">
                                            <StatIcon game="gs" :stat="artifact.mainstat.stat" fill="#eee"
                                                      class="w-6 h-6 mr-1" style="margin-top: 3px;"/>
                                            <!-- <span class="text-gray-200 text-xl">{{ $t(`gs_${artifact.mainstat.stat}`)
                                            }}</span> -->
                                            <span class="text-gray-200 text-3xl ml-2 font-gs">{{
                                                    artifact.mainstat.statValue
                                                }}{{
                                                    showPercentage(artifact.mainstat.stat)
                                                }}</span>
                                            <div :class="{ 'border-orange-400 bg-orange-900 text-orange-300': artifact.stars == 5,
                                              'border-purple-400 bg-purple-900 text-purple-300': artifact.stars == 4,
                                              'border-blue-400 bg-blue-900 text-blue-300': artifact.stars == 3,
                                              'border-green-400 bg-green-900 text-green-300': artifact.stars == 2}"
                                                 class="h-full justify-end mt-1 ml-2 font-gs rounded-full border px-2">
                                                +{{ artifact.level - 1 }}
                                            </div>
                                        </div>
                                        <!-- 副词条 -->
                                        <div v-if="artifact.substats && artifact.substats.length > 0"
                                             class="grid grid-cols-2 mt-2 grid-rows-2 gap-1 w-full text-left">
                                            <div v-for="substat in artifact.substats" class="flex flex-row">
                                                <!-- <span class="text-gray-300 text-lg">{{ getPropShortName(substat.stat)
                                                }}</span> -->
                                                <StatIcon game="gs" :stat="substat.stat" fill="#d1d5db"
                                                          class="w-4 h-4 mr-1"
                                                          style="margin-top: 2px;"/>
                                                <span class="text-gray-300 font-gs text-xl ml-2">{{
                                                        substat.statValue
                                                    }}{{ showPercentage(substat.stat) }}</span>
                                            </div>
                                        </div>
                                        <div v-else class="mt-2 text-left text-gray-300 text-lg">{{
                                                $t('gs_noSubstats')
                                            }}
                                        </div>
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                            <div v-else
                                 class="mt-2 w-full h-40 rounded-xl pt-16 text-gray-200 text-center align-middle bg-opacity-20 bg-black backdrop-blur-lg">
                                {{ $t('gs_noArtifacts') }}
                            </div>
                            <div v-if="character.equipment.artifacts && character.equipment.artifacts.length > 0"
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
        </div>
        <div v-else-if="!playerInfoReady" class="mt-4 mb-4">{{ $t('gs_emptyPlayerTip') }}</div>
        <div v-else class="mt-4 mb-4">{{ $t('gs_showcaseTip') }}</div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.char-side-icon {
    -webkit-mask: radial-gradient(white 80%, transparent)
}

.gacha-mask {
    -webkit-mask: linear-gradient(transparent, white 15%, white 85%, transparent)
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
