<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const playerInfo = ref({})

const uidInput = ref('')
var uid = ''
var charsPage = ref(0)
const pages = computed(() => {
    console.log("character.length: ")
    return playerInfo.value.characters && playerInfo.value.characters.length > 10
        ? Math.floor((playerInfo.value.characters.length - 10) / 6 - 0.1) + 1
        : 0
})
const constelsMap = ref({})
const constelsReady = ref(false)
const constelsAdditions = computed(() => {
    if (!playerInfoReady.value || !constelsReady.value) {
        return {}
    }
    let res = {}
    playerInfo.value.characters.forEach((character) => {
        if (character.skillsExtraLevel) {
            Object.keys(character.skillsExtraLevel).forEach((level) => {
                // check
                var target = findSkillIdByProud(parseInt(level))
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
const charDialogShow = ref(false)
const charDialogId = ref(0)
const statNameMap = new Map([
    ['critRate', '暴击率'],
    ['critDamage', '暴击伤害'],
    ['energyRecharge', '元素充能效率'],
    ['healingBonus', '治疗加成'],
    ['incomingHealingBonus', '受治疗加成'],
    ['elementalMastery', '元素精通'],
    ['physicalRes', '物理抗性'],
    ['physicalDamageBonus', '物理伤害加成'],
    ['pyroDamageBonus', '火元素伤害加成'],
    ['electroDamageBonus', '雷元素伤害加成'],
    ['hydroDamageBonus', '水元素伤害加成'],
    ['dendroDamageBonus', '草元素伤害加成'],
    ['anemoDamageBonus', '风元素伤害加成'],
    ['geoDamageBonus', '岩元素伤害加成'],
    ['cryoDamageBonus', '冰元素伤害加成'],
    ['pyroRes', '火元素抗性'],
    ['electroRes', '雷元素抗性'],
    ['hydroRes', '水元素抗性'],
    ['dendroRes', '草元素抗性'],
    ['anemoRes', '风元素抗性'],
    ['geoRes', '岩元素抗性'],
    ['cryoRes', '冰元素抗性'],
    ['cooldownReduction', '冷却时间减少'],
    ['shieldStrength', '护盾强效'],
])
const propNameMap = new Map([
    ["FIGHT_PROP_HP", "生命值"],
    ["FIGHT_PROP_ATTACK", "攻击力"],
    ["FIGHT_PROP_DEFENSE", "防御力"],
    ["FIGHT_PROP_HP_PERCENT", "生命值"],
    ["FIGHT_PROP_ATTACK_PERCENT", "攻击力"],
    ["FIGHT_PROP_DEFENSE_PERCENT", "防御力"],
    ["FIGHT_PROP_CRITICAL", "暴击率"],
    ["FIGHT_PROP_CRITICAL_HURT", "暴击伤害"],
    ["FIGHT_PROP_CHARGE_EFFICIENCY", "元素充能"],
    ["FIGHT_PROP_HEAL_ADD", "治疗加成"],
    ["FIGHT_PROP_ELEMENT_MASTERY", "元素精通"],
    ["FIGHT_PROP_PHYSICAL_ADD_HURT", "物伤加成"],
    ["FIGHT_PROP_FIRE_ADD_HURT", "火伤加成"],
    ["FIGHT_PROP_ELEC_ADD_HURT", "雷伤加成"],
    ["FIGHT_PROP_WATER_ADD_HURT", "水伤加成"],
    ["FIGHT_PROP_WIND_ADD_HURT", "风伤加成"],
    ["FIGHT_PROP_ICE_ADD_HURT", "冰伤加成"],
    ["FIGHT_PROP_ROCK_ADD_HURT", "岩伤加成"],
    ["FIGHT_PROP_GRASS_ADD_HURT", "草伤加成"],
])
const propShortNameMap = new Map([
    ["FIGHT_PROP_HP", "生命"],
    ["FIGHT_PROP_ATTACK", "攻击"],
    ["FIGHT_PROP_DEFENSE", "防御"],
    ["FIGHT_PROP_HP_PERCENT", "生命"],
    ["FIGHT_PROP_ATTACK_PERCENT", "攻击"],
    ["FIGHT_PROP_DEFENSE_PERCENT", "防御"],
    ["FIGHT_PROP_CRITICAL", "暴率"],
    ["FIGHT_PROP_CRITICAL_HURT", "暴伤"],
    ["FIGHT_PROP_CHARGE_EFFICIENCY", "充能"],
    ["FIGHT_PROP_ELEMENT_MASTERY", "精通"],
])
const artifactTypeNameMap = new Map([
    ["EQUIP_BRACER", "生之花"],
    ["EQUIP_NECKLACE", "死之羽"],
    ["EQUIP_SHOES", "时之沙"],
    ["EQUIP_RING", "空之杯"],
    ["EQUIP_DRESS", "理之冠"],
])
const artifactShortNameMap = new Map([
    ["游医", "游医"],
    ["冒险家", "冒险家"],
    ["幸运儿", "幸运儿"],
    ["学士", "学士"],
    ["战狂", "战狂"],
    ["祭水之人", "祭水"],
    ["武人", "武人"],
    ["守护之心", "守护"],
    ["祭雷之人", "祭雷"],
    ["流放者", "流放者"],
    ["行者之心", "行者"],
    ["祭冰之人", "祭冰"],
    ["奇迹", "奇迹"],
    ["勇士之心", "勇士"],
    ["教官", "教官"],
    ["赌徒", "赌徒"],
    ["祭火之人", "祭火"],
    ["如雷的盛怒", "如雷"],
    ["追忆之注连", "追忆"],
    ["冰风迷途的勇士", "冰套"],
    ["染血的骑士道", "骑士道"],
    ["华馆梦醒形骸记", "华馆"],
    ["昔日宗室之仪", "宗室"],
    ["沉沦之心", "水套"],
    ["沙上楼阁史话", "楼阁"],
    ["悠古的磐岩", "磐岩"],
    ["海染砗磲", "海染"],
    ["翠绿之影", "风套"],
    ["苍白之火", "苍白"],
    ["乐园遗落之花", "乐园"],
    ["流浪大地的乐团", "乐团"],
    ["逆飞的流星", "流星"],
    ["辰砂往生录", "辰砂"],
    ["平息鸣雷的尊者", "平雷"],
    ["渡过烈火的贤人", "渡火"],
    ["千岩牢固", "千岩"],
    ["水仙之梦", "水仙"],
    ["被怜爱的少女", "少女"],
    ["来歆余响", "余响"],
    ["炽烈的炎之魔女", "魔女"],
    ["绝缘之旗印", "绝缘"],
    ["花海甘露之光", "甘露"],
    ["角斗士的终幕礼", "角斗"],
    ["深林的记忆", "草套"],
    ["饰金之梦", "饰金"],
    ["逐影猎人", "猎人"],
    ["黄金剧团", "剧团"],
])

const mergeToPlayerinfo = (newArr) => {
    console.log("Updated characters length: ")
    for (let i = newArr.length - 1; i >= 0; i--) {
        let newChar = newArr[i]
        var exists = false
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
    window.enka.getGenshinPlayer(uid)
        .then((resp) => {
            if (playerInfo.value.uid == resp.uid) {
                mergeToPlayerinfo(resp.characters)
                playerInfo.value.player = resp.player
            } else {
                playerInfo.value = resp
            }
            playerInfo.value.characters.sort(function (a, b) {
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
                        const critA = a.stats.critRate.value * 200 + a.stats.critDamage.value * 100
                        const critB = b.stats.critRate.value * 200 + b.stats.critDamage.value * 100
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

            fetch('https://gitlab.com/api/v4/projects/41287973/repository/files/ExcelBinOutput%2FAvatarSkillExcelConfigData.json/raw?ref=master')
                .then(response => response.json())
                .then(resp => {
                    resp = resp.filter(a => 'proudSkillGroupId' in a)
                    resp.sort((a, b) => a.proudSkillGroupId < b.proudSkillGroupId ? -1 : 1)
                    window.store.set('genshinConstels', JSON.stringify(resp))

                    playerInfoLoading.value = true
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
        })
}

const getCharElementAssets = (id) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value > 0) { return elementAssets.pyro }
    else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value > 0) { return elementAssets.cryo }
    else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value > 0) { return elementAssets.hydro }
    else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value > 0) { return elementAssets.electro }
    else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value > 0) { return elementAssets.geo }
    else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value > 0) { return elementAssets.anemo }
    else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value > 0) { return elementAssets.dendro }
}

const getCharElementEnergy = (id) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value > 0) { return charStats.pyroEnergyCost.value }
    else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value > 0) { return charStats.cryoEnergyCost.value }
    else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value > 0) { return charStats.hydroEnergyCost.value }
    else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value > 0) { return charStats.electroEnergyCost.value }
    else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value > 0) { return charStats.geoEnergyCost.value }
    else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value > 0) { return charStats.anemoEnergyCost.value }
    else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value > 0) { return charStats.dendroEnergyCost.value }
}

const getPropName = (prop) => {
    return propNameMap.get(prop)
}

const getPropShortName = (prop) => {
    return propShortNameMap.get(prop)
}

const getArtifactTypeName = (prop) => {
    return artifactTypeNameMap.get(prop)
}

const getArtifactShortName = (prop) => {
    return artifactShortNameMap.get(prop)
}

const showPercentage = (prop) => {
    return (prop.endsWith("HURT") || prop.endsWith("CRITICAL") || prop.endsWith("PERCENT") || prop.endsWith("ADD") || prop.endsWith("EFFICIENCY")) ? '%' : ''
}

const getStatName = (stat) => {
    return statNameMap.get(stat)
}

const calcCritScoreTotal = (index) => {
    var score = 0.0
    const artifacts = playerInfo.value.characters[index].equipment.artifacts
    artifacts.forEach(artifact => {
        if (artifact.mainstat.stat == "FIGHT_PROP_CRITICAL_HURT") {
            score += artifact.mainstat.statValue
        } else if (artifact.mainstat.stat == "FIGHT_PROP_CRITICAL") {
            score += artifact.mainstat.statValue * 2
        }
        const substats = artifact.substats
        substats.forEach(substat => {
            if (substat.stat == "FIGHT_PROP_CRITICAL_HURT") {
                score += substat.statValue
            } else if (substat.stat == "FIGHT_PROP_CRITICAL") {
                score += substat.statValue * 2
            }
        })
    })
    return score
}

const getArtifactSetInfo = (index) => {
    var tokens = []
    const artifacts = playerInfo.value.characters[index].equipment.artifacts
    const sets = new Map()
    artifacts.forEach(artifact => {
        const setName = artifact.setName
        if (sets.get(setName)) {
            sets.set(setName, sets.get(setName) + 1)
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
        return getArtifactShortName(tokens[0]) + tokens[1] + " + " + getArtifactShortName(tokens[2]) + tokens[3]
    } else {
        return "暂无圣遗物套装"
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

const showCharDetails = (index) => {
    charDialogId.value = index
    charDialogShow.value = true
}

const trimStats = (stats) => {
    const trim = ['baseHp', 'hpPercentage', 'maxHp', 'currentHp', 'baseAtk', 'atk', 'atkPercentage', 'def', 'baseDef', 'defPercentage', 'Cost', 'Energy', 'Mastery']
    var res = { ...stats }
    var entries = Object.entries(stats);

    for (var [stat, val] of entries) {
        var flag = false;
        for (var t of trim) {
            if (stat.endsWith(t) || val.value === '' || val.value === '0') {
                flag = true;
                break
            }
        }
        if (flag) {
            delete res[stat]
        }
    }

    return res
}

const findSkillIdByProud = (proudId) => {
    var l = 0
    console.log("constelsMap length: ")
    var r = constelsMap.value.length
    var m

    while (l < r) {
        m = parseInt((r - l) / 2 + l)
        if (constelsMap.value[m].proudSkillGroupId == proudId) {
            return constelsMap.value[m].id
        } else if (constelsMap.value[m].proudSkillGroupId > proudId) {
            r = m - 1
        } else {
            l = m
        }
    }

    return -1
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 86.5vh;' : ''">
        <el-dialog v-if="playerInfoReady && playerInfo.characters && playerInfo.characters.length > 0"
            v-model="charDialogShow" :title="playerInfo.characters[charDialogId].name + ' 角色详情'" width="30%">
            <div class="flex flex-col content-center justify-center w-full px-5">
                <DialogListItem class="font-genshin" name="生命值">
                    <div class="font-genshin">
                        <span>{{ parseInt(playerInfo.characters[charDialogId].stats.baseHp.value) }}</span>
                        <span
                            v-if="parseInt(playerInfo.characters[charDialogId].stats.maxHp.value) != parseInt(playerInfo.characters[charDialogId].stats.baseHp.value)"
                            class="ml-1 text-blue-500">+{{ parseInt(playerInfo.characters[charDialogId].stats.maxHp.value)
                                - parseInt(playerInfo.characters[charDialogId].stats.baseHp.value) }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-genshin" name="攻击力">
                    <div class="font-genshin">
                        <span>{{ parseInt(playerInfo.characters[charDialogId].stats.baseAtk.value) }}</span>
                        <span
                            v-if="parseInt(playerInfo.characters[charDialogId].stats.atk.value) != parseInt(playerInfo.characters[charDialogId].stats.baseAtk.value)"
                            class="ml-1 text-blue-500">+{{ parseInt(playerInfo.characters[charDialogId].stats.atk.value) -
                                parseInt(playerInfo.characters[charDialogId].stats.baseAtk.value) }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-genshin" name="防御力">
                    <div class="font-genshin">
                        <span>{{ parseInt(playerInfo.characters[charDialogId].stats.baseDef.value) }}</span>
                        <span
                            v-if="parseInt(playerInfo.characters[charDialogId].stats.def.value) != parseInt(playerInfo.characters[charDialogId].stats.baseDef.value)"
                            class="ml-1 text-blue-500">+{{ parseInt(playerInfo.characters[charDialogId].stats.def.value) -
                                parseInt(playerInfo.characters[charDialogId].stats.baseDef.value) }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-genshin" name="元素精通"
                    :val="playerInfo.characters[charDialogId].stats.elementalMastery.value ? parseInt(playerInfo.characters[charDialogId].stats.elementalMastery.value) : '0'" />
                <DialogListItem v-for="(stat, key) in trimStats(playerInfo.characters[charDialogId].stats)"
                    class="font-genshin" :name="getStatName(key)" :val="(stat.value * 100).toFixed(2).toString() + '%'" />
            </div>
        </el-dialog>
        <!-- HEADER -->
        <div class="flex flex-row w-full p-0 relative justify-between" style="height: 9vh;">
            <!-- 右上角名片 -->
            <img v-if="playerInfoReady" class="absolute top-0 right-0 bottom-0 z-0" style="height: 9vh;"
                :src="'https://enka.network/ui/' + playerInfo.player.namecard.assets.picPath[0] + '.png'" />
            <div v-if="playerInfoLoading" class="absolute top-0 right-0 bottom-0 z-0"
                style="margin-left: 1vw; right: 2vw; top: 3vh;">正在加载数据，请稍候……</div>
            <!-- 左上角头像、昵称 -->
            <!-- playerInfo.player.profilePicture.assets.icon -->
            <div v-if="playerInfoReady" class="flex flex-row content-start items-center" style="width: 35vw;">
                <img class="rounded-full h-12 border-2 bg-slate-200" style="margin-left: 1vw;"
                    :src="'https://enka.network/ui/' + ('costumes' in playerInfo.player.profilePicture.assets ? playerInfo.player.profilePicture.assets.costumes[0].icon : playerInfo.player.profilePicture.assets.oldIcon) + '.png'" />
                <div class="font-genshin" style="margin-left: 1vw; font-size: larger;">{{
                    playerInfo.player.username
                }}</div>
            </div>
            <div v-else style="width: 35vw" />
            <div class="relative flex flex-row mt-3 z-10">
                <CustomUIDInput v-model="uidInput" @submit="requestInfo" />
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
        <div v-if="playerInfoReady && playerInfo.characters && playerInfo.characters.length > 0" class="relative">
            <!-- 角色头像列表 10人一页 -->
            <div class="flex flex-row w-full justify-between">
                <div class="relative z-50 w-1/4">
                    <el-icon
                        class="absolute right-2 top-3 rounded-full w-9 h-9 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all opacity-80"
                        @click="charsPagePrev" :class="charsPage === 0 ? 'disabled' : ''">
                        <ArrowLeftBold />
                    </el-icon>
                </div>
                <el-scrollbar ref="charsScrollbar" class="flex flex-row w-1/2 justify-center" noresize>
                    <div class="flex flex-row z-50 relative flex-nowrap w-max">
                        <div v-for="(character, index) in playerInfo.characters" class="relative w-12 h-12"
                            @click="showcaseIdx = index">
                            <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white transition-all"
                                :class="{ 'border-blue-600 border-3': showcaseIdx == index }" style="left: 10px;"></div>
                            <img class="absolute bottom-0 char-side-icon rounded-full ml-1 w-12 h-12 hover:transform hover:scale-110 hover:-translate-y-1 active:scale-100 active:translate-y-0 transition-all object-cover"
                                :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].sideIconName : character.assets.sideIcon) + '.png'" />
                        </div>
                    </div>
                </el-scrollbar>
                <div class="relative z-50 w-1/4">
                    <el-icon
                        class="absolute left-2 top-3 rounded-full w-9 h-9 ml-2 bg-white hover:bg-gray-200 active:translate-x-1 transition-all opacity-80"
                        @click="charsPageNext" :class="charsPage === pages ? 'disabled' : ''">
                        <ArrowRightBold />
                    </el-icon>
                </div>
            </div>
            <!-- 角色详情卡片 -->
            <div v-for="(character, index) in playerInfo.characters" class="z-0 relative w-full">
                <div class="mt-4 w-full absolute top-0 left-0 right-0 transition-all" :class="{ 'opacity-0 translate-x-40 pointer-events-none': showcaseIdx < index },
                    { 'opacity-100 pointer-events-auto': showcaseIdx == index },
                    { 'opacity-0 -translate-x-40 pointer-events-none': showcaseIdx > index }"
                    style="transition-duration: 300ms;">
                    <!-- absolute： 卡片元素背景、元素图标 -->
                    <img class="relative z-0" :src="getCharElementAssets(index).bg"
                        style="border-radius: 4.5vh; height: 40vw;" />
                    <img class="h-1/4 absolute opacity-50" :src="getCharElementAssets(index).ico"
                        style="top: -7px; right: -18px;" />
                    <!-- 卡片前景 -->
                    <div class="flex flex-row h-full absolute top-0 left-0 right-0 bottom-0 z-10">
                        <!-- 立绘 -->
                        <div class="left-gacha w-2/3 inline-block object-cover absolute left-0 bottom-0 z-10"
                            style="height: 115%;">
                            <!-- :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].art : character.assets.gachaIcon) + '.png'" -->
                            <img class="gacha-mask inline-block object-cover bottom-0 left-0 absolute z-10 h-full pointer-events-none"
                                loading="lazy" :src="'https://enka.network/ui/' + character.assets.gachaIcon + '.png'" />
                        </div>
                        <!-- 左下角天赋、命之座 -->
                        <div class="absolute bottom-2 left-2 z-20">
                            <div class="flex flex-col">
                                <div class="flex flex-row relative">
                                    <el-tooltip v-for="skill in character.skills" placement="top">
                                        <template #content>
                                            <span class="font-genshin text-base"> {{ skill.name }} </span>
                                        </template>
                                        <div class="rounded-full ml-2 h-8 mb-2 flex flex-row cursor-default"
                                            style="background-color: rgb(0 0 0 / 0.6); width: 72px;">
                                            <img class="h-8 rounded-full"
                                                :src="'https://enka.network/ui/' + skill.assets.icon + '.png'" />
                                            <div class="text-center w-full mr-1 h-full align-middle text-base font-genshin"
                                                style="margin-top: 3px;">
                                                <span v-if="skill.id in constelsAdditions"
                                                    :class="{ 'text-orange-300': skill.level == 10, 'text-cyan-400': skill.level < 10 }">{{
                                                        skill.level + constelsAdditions[skill.id] }}</span>
                                                <span v-else
                                                    :class="{ 'text-orange-300': skill.level == 10, 'text-white': skill.level < 10 }">{{
                                                        skill.level }}</span>
                                            </div>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="flex flex-row relative">
                                    <el-tooltip v-for="idx in 6" placement="top">
                                        <template #content>
                                            <span class="font-genshin text-base point"> {{ idx <=
                                                character.constellationsList.length ? character.constellationsList[idx -
                                                    1].name : '未解锁命之座' }} </span>
                                        </template>
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
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧详情 -->
                        <div class=" w-5/12 h-full absolute top-4 right-6 bottom-4 flex flex-col z-20">
                            <!-- Lv. 90/90 角色名字-->
                            <div class="w-full text-right">
                                <span class=" text-gray-200 font-genshin bottom-0 text-2xl align-bottom">
                                    Lv. {{ character.properties.level.val }} /
                                </span>
                                <span class=" text-gray-400 bottom-0 text-2xl align-bottom mr-6 font-serif">
                                    {{ ascLevelMap[character.properties.ascension.val ? character.properties.ascension.val *
                                        1 : 0] }}
                                </span>
                                <span class=" text-white font-genshin text-5xl font-bold">{{ character.name }}</span>
                            </div>
                            <!-- 详情第一块：属性 -->
                            <div
                                class="mt-2 text-gray-200 text-lg text-left w-full rounded-xl p-2 pl-4 grid grid-cols-3 grid-rows-3 bg-opacity-20 bg-black backdrop-blur-lg">
                                <div class="w-full justify-between" style="grid-column: 1; grid-row: 1;">
                                    <span class="text-gray-300">生命</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        parseInt(character.stats.maxHp.value)
                                    }}</span>
                                </div>
                                <div style="grid-column: 2; grid-row: 1;">
                                    <span class="text-gray-300">攻击</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        parseInt(character.stats.atk.value)
                                    }}</span>
                                </div>
                                <div style="grid-column: 3; grid-row: 1;">
                                    <span class="text-gray-300">防御</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        parseInt(character.stats.def.value)
                                    }}</span>
                                </div>
                                <div style="grid-column: 1; grid-row: 2;">
                                    <span class="text-gray-300">充能</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        (character.stats.energyRecharge.value * 100).toFixed(1)
                                    }}%</span>
                                </div>
                                <div style="grid-column: 2; grid-row: 2;">
                                    <span class="text-gray-300">精通</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        parseInt(!character.stats.elementalMastery.value ? 0 :
                                            character.stats.elementalMastery.value)
                                    }}</span>
                                </div>
                                <div style="grid-column: 3; grid-row: 2;">
                                    <span class="text-gray-300">能量</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        getCharElementEnergy(index)
                                    }}</span>
                                </div>
                                <div style="grid-column: 1; grid-row: 3;">
                                    <span class="text-gray-300">暴率</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        (character.stats.critRate.value * 100).toFixed(1)
                                    }}%</span>
                                </div>
                                <div style="grid-column: 2; grid-row: 3;">
                                    <span class="text-gray-300">暴伤</span>
                                    <span class="text-gray-200 text-right font-genshin ml-3">{{
                                        (character.stats.critDamage.value * 100).toFixed(1)
                                    }}%</span>
                                </div>
                                <div class="mx-2 rounded-full text-sm bg-white bg-opacity-20 text-center hover:bg-opacity-30 active:scale-95 active:bg-opacity-40 cursor-default transition-all px-1"
                                    @click="showCharDetails(index)" style="grid-column: 3; grid-row: 3;">
                                    <div class="font-genshin" style="margin-top: 5px;">查看更多</div>
                                </div>
                            </div>
                            <!-- 详情第二块：武器 -->
                            <div class="mt-2 w-full rounded-xl flex flex-row bg-opacity-20 bg-black backdrop-blur-lg"
                                style="height: 84px;">
                                <img class="h-full"
                                    :src="'https://enka.network/ui/' + character.equipment.weapon.assets.awakenIcon + '.png'" />
                                <div class="w-full h-full relative">
                                    <div class="flex flex-row justify-between ml-2 mt-4">
                                        <div>
                                            <span class="text-gray-200 font-genshin text-2xl">
                                                {{ character.equipment.weapon.name }}</span>
                                            <span class="text-gray-200 font-genshin text-xl"> Lv. {{
                                                character.equipment.weapon.level }} /</span>
                                            <span class="text-gray-300 ml-1 font-serif">{{
                                                ascLevelMap[character.equipment.weapon.ascensionLevel ?
                                                    character.equipment.weapon.ascensionLevel : 0] }}</span>
                                        </div>
                                        <div class="text-gray-200 mr-2 text-sm absolute right-0 top-0">精炼
                                            <span class="text-gray-200 font-genshin text-base">{{
                                                character.equipment.weapon.refinement.level + 1 }}</span>
                                            阶
                                        </div>
                                    </div>
                                    <div class="text-gray-300 ml-2 text-left grid grid-cols-3">
                                        <div style="grid-column: 1;">
                                            攻击力
                                            <span class="text-gray-200 font-genshin text-lg">{{
                                                character.equipment.weapon.weaponStats[0].statValue }}</span>
                                        </div>
                                        <div v-if="character.equipment.weapon.weaponStats.length > 1" class="ml-2"
                                            style="grid-column: 2 / 4;">
                                            {{ getPropName(character.equipment.weapon.weaponStats[1].stat) }}
                                            <span class="text-gray-200 font-genshin text-lg">{{
                                                character.equipment.weapon.weaponStats[1].statValue }}{{
        showPercentage(character.equipment.weapon.weaponStats[1].stat) }}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <!-- 详情第三块：圣遗物 -->
                            <el-carousel v-if="character.equipment.artifacts && character.equipment.artifacts.length > 0"
                                class="mt-2 w-full h-40 rounded-xl bg-opacity-20 bg-black backdrop-blur-lg" arrow="never"
                                :autoplay="false">
                                <el-carousel-item v-for="artifact in character.equipment.artifacts"
                                    class="pb-2 pr-2 pl-4 flex flex-row h-40 text-gray-200">
                                    <img style="height: 140%; margin-left: -15px; margin-top: -45px;"
                                        class="artifact-mask w-28 object-cover"
                                        :src="'https://enka.network/ui/' + artifact.icon + '.png'" />
                                    <div class="w-full h-full relative">
                                        <div class="text-gray-400 mr-2 text-sm absolute right-0 top-1">
                                            {{ artifact.name }} ·
                                            <span class="text-gray-200 font-genshin text-base">{{
                                                getArtifactTypeName(artifact.equipType) }}</span>
                                        </div>
                                        <!-- 主词条、等级 -->
                                        <div class="text-left mt-7 w-full flex flex-row">
                                            <span class="text-gray-200 text-xl">{{ getPropName(artifact.mainstat.stat)
                                            }}</span>
                                            <span class="text-gray-200 text-3xl ml-2 font-genshin">{{
                                                artifact.mainstat.statValue }}{{
        showPercentage(artifact.mainstat.stat) }}</span>
                                            <div :class="{ 'border-orange-400 bg-orange-900 text-orange-300': artifact.stars == 5 },
                                                { 'border-purple-400 bg-purple-900 text-purple-300': artifact.stars == 4 },
                                                { 'border-blue-400 bg-blue-900 text-blue-300': artifact.stars == 3 },
                                                { 'border-green-400 bg-green-900 text-green-300': artifact.stars == 2 }"
                                                class="h-full justify-end mt-1 ml-2 font-genshin rounded-full border px-2">
                                                +{{ artifact.level - 1 }}
                                            </div>
                                        </div>
                                        <!-- 副词条 -->
                                        <div v-if="artifact.substats && artifact.substats.length > 0"
                                            class="grid grid-cols-2 mt-2 grid-rows-2 gap-1 w-full text-left">
                                            <div v-for="substat in artifact.substats">
                                                <span class="text-gray-300 text-lg">{{ getPropShortName(substat.stat)
                                                }}</span>
                                                <span class="text-gray-200 font-genshin text-xl ml-2">{{ substat.statValue
                                                }}{{
    showPercentage(substat.stat) }}</span>
                                            </div>
                                        </div>
                                        <div v-else class="mt-2 text-left text-gray-300 text-lg">暂无副词条</div>
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                            <div v-else
                                class="mt-2 w-full h-40 rounded-xl pt-16 text-gray-200 text-center align-middle bg-opacity-20 bg-black backdrop-blur-lg">
                                暂未装配圣遗物</div>
                            <div v-if="character.equipment.artifacts && character.equipment.artifacts.length > 0"
                                class="flex flex-row justify-between">
                                <div class="text-gray-200 ml-1 mt-1 font-genshin">
                                    双爆总分：
                                    <span class="text-gray-100">{{ calcCritScoreTotal(index).toFixed(1)
                                    }}</span>
                                </div>
                                <div class="text-gray-100 mt-1 mr-1 font-genshin">
                                    {{ getArtifactSetInfo(index) }}
                                </div>
                            </div>
                            <div v-else class="flex flex-row justify-between">
                                <div class="text-gray-200 ml-1 mt-1 font-genshin">
                                    双爆总分：
                                    <span class="text-gray-100">0</span>
                                </div>
                                <div class="text-gray-100 mt-1 mr-1 font-genshin">
                                    暂无圣遗物套装
                                </div>
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

.artifact-mask {
    -webkit-mask: linear-gradient(270deg, transparent, white 60%)
}

.disabled {
    @apply bg-gray-200 opacity-30 pointer-events-none
}
</style>
