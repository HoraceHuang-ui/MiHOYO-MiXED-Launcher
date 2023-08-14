<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const uidInput = ref('')
var uid = ''
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const playerInfo = ref({})
const showcaseIdx = ref(0)
const elementAssets = ref({
    cryo: {
        bg: '',
        ico: ''
    },
    anemo: {
        bg: '',
        ico: ''
    },
    dendro: {
        bg: '',
        ico: ''
    },
    electro: {
        bg: '',
        ico: ''
    },
    geo: {
        bg: '',
        ico: ''
    },
    hydro: {
        bg: '',
        ico: ''
    },
    pyro: {
        bg: '',
        ico: ''
    },
})
const ascLevelMap = [20, 40, 50, 60, 70, 80, 90]
const propNameMap = new Map()
const propShortNameMap = new Map()
const setPropNameMaps = () => {
    propNameMap.set("FIGHT_PROP_HP", "生命值")
    propNameMap.set("FIGHT_PROP_ATTACK", "攻击力")
    propNameMap.set("FIGHT_PROP_DEFENSE", "防御力")
    propNameMap.set("FIGHT_PROP_HP_PERCENT", "生命值")
    propNameMap.set("FIGHT_PROP_ATTACK_PERCENT", "攻击力")
    propNameMap.set("FIGHT_PROP_DEFENSE_PERCENT", "防御力")
    propNameMap.set("FIGHT_PROP_CRITICAL", "暴击率")
    propNameMap.set("FIGHT_PROP_CRITICAL_HURT", "暴击伤害")
    propNameMap.set("FIGHT_PROP_CHARGE_EFFICIENCY", "元素充能效率")
    propNameMap.set("FIGHT_PROP_HEAL_ADD", "治疗加成")
    propNameMap.set("FIGHT_PROP_ELEMENT_MASTERY", "元素精通")
    propNameMap.set("FIGHT_PROP_PHYSICAL_ADD_HURT", "物伤加成")
    propNameMap.set("FIGHT_PROP_FIRE_ADD_HURT", "火伤加成")
    propNameMap.set("FIGHT_PROP_ELEC_ADD_HURT", "雷伤加成")
    propNameMap.set("FIGHT_PROP_WATER_ADD_HURT", "水伤加成")
    propNameMap.set("FIGHT_PROP_WIND_ADD_HURT", "风伤加成")
    propNameMap.set("FIGHT_PROP_ICE_ADD_HURT", "冰伤加成")
    propNameMap.set("FIGHT_PROP_ROCK_ADD_HURT", "岩伤加成")
    propNameMap.set("FIGHT_PROP_GRASS_ADD_HURT", "草伤加成")

    propShortNameMap.set("FIGHT_PROP_HP", "生命")
    propShortNameMap.set("FIGHT_PROP_ATTACK", "攻击")
    propShortNameMap.set("FIGHT_PROP_DEFENSE", "防御")
    propShortNameMap.set("FIGHT_PROP_HP_PERCENT", "生命")
    propShortNameMap.set("FIGHT_PROP_ATTACK_PERCENT", "攻击")
    propShortNameMap.set("FIGHT_PROP_DEFENSE_PERCENT", "防御")
    propShortNameMap.set("FIGHT_PROP_CRITICAL", "暴率")
    propShortNameMap.set("FIGHT_PROP_CRITICAL_HURT", "暴伤")
    propShortNameMap.set("FIGHT_PROP_CHARGE_EFFICIENCY", "充能")
    propShortNameMap.set("FIGHT_PROP_ELEMENT_MASTERY", "精通")
}
const artifactTypeNameMap = new Map()
const artifactShortNameMap = new Map()
const setArtifactPropsMaps = () => {
    artifactTypeNameMap.set("EQUIP_BRACER", "生之花")
    artifactTypeNameMap.set("EQUIP_NECKLACE", "死之羽")
    artifactTypeNameMap.set("EQUIP_SHOES", "时之沙")
    artifactTypeNameMap.set("EQUIP_RING", "空之杯")
    artifactTypeNameMap.set("EQUIP_DRESS", "理之冠")

    artifactShortNameMap.set("游医", "游医")
    artifactShortNameMap.set("冒险家", "冒险家")
    artifactShortNameMap.set("幸运儿", "幸运儿")
    artifactShortNameMap.set("学士", "学士")
    artifactShortNameMap.set("战狂", "战狂")
    artifactShortNameMap.set("祭水之人", "祭水")
    artifactShortNameMap.set("武人", "武人")
    artifactShortNameMap.set("守护之心", "守护")
    artifactShortNameMap.set("祭雷之人", "祭雷")
    artifactShortNameMap.set("流放者", "流放者")
    artifactShortNameMap.set("行者之心", "行者")
    artifactShortNameMap.set("祭冰之人", "祭冰")
    artifactShortNameMap.set("奇迹", "奇迹")
    artifactShortNameMap.set("勇士之心", "勇士")
    artifactShortNameMap.set("教官", "教官")
    artifactShortNameMap.set("赌徒", "赌徒")
    artifactShortNameMap.set("祭火之人", "祭火")
    artifactShortNameMap.set("如雷的盛怒", "如雷")
    artifactShortNameMap.set("追忆之注连", "追忆")
    artifactShortNameMap.set("冰风迷途的勇士", "冰套")
    artifactShortNameMap.set("染血的骑士道", "骑士道")
    artifactShortNameMap.set("华馆梦醒形骸记", "华馆")
    artifactShortNameMap.set("昔日宗室之仪", "宗室")
    artifactShortNameMap.set("沉沦之心", "水套")
    artifactShortNameMap.set("沙上楼阁史话", "楼阁")
    artifactShortNameMap.set("悠古的磐岩", "磐岩")
    artifactShortNameMap.set("海染砗磲", "海染")
    artifactShortNameMap.set("翠绿之影", "风套")
    artifactShortNameMap.set("苍白之火", "苍白")
    artifactShortNameMap.set("乐园遗落之花", "乐园")
    artifactShortNameMap.set("流浪大地的乐团", "乐团")
    artifactShortNameMap.set("逆飞的流星", "流星")
    artifactShortNameMap.set("辰砂往生录", "辰砂")
    artifactShortNameMap.set("平息鸣雷的尊者", "平雷")
    artifactShortNameMap.set("渡过烈火的贤人", "渡火")
    artifactShortNameMap.set("千岩牢固", "千岩")
    artifactShortNameMap.set("水仙之梦", "水仙")
    artifactShortNameMap.set("被怜爱的少女", "少女")
    artifactShortNameMap.set("来歆余响", "余响")
    artifactShortNameMap.set("炽烈的炎之魔女", "魔女")
    artifactShortNameMap.set("绝缘之旗印", "绝缘")
    artifactShortNameMap.set("花海甘露之光", "甘露")
    artifactShortNameMap.set("角斗士的终幕礼", "角斗")
    artifactShortNameMap.set("深林的记忆", "草套")
    artifactShortNameMap.set("饰金之梦", "饰金")
}

const mergeToPlayerinfo = (newArr) => {
    for (let i = newArr.length - 1; i >= 0; i--) {
        let newChar = newArr[i]
        var exists = false
        for (let j = playerInfo.value.characters.length - 1; j >= 0; j--) {
            let oldChar = playerInfo.value.characters[j]
            if (oldChar.characterId == newChar.characterId) {
                playerInfo.value.characters[j] = newChar
                exists = true
                break
            }
        }
        if (!exists) {
            playerInfo.value.characters.unshift(newChar)
        }
    }
    console.log(playerInfo.value)
}

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

    setPropNameMaps()
    setArtifactPropsMaps()
    window.path.joinDirnameAsset('elementBgs/cryo.png').then((value) => {
        elementAssets.value.cryo.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/cryo.png').then((value) => {
        elementAssets.value.cryo.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/pyro.png').then((value) => {
        elementAssets.value.pyro.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/pyro.png').then((value) => {
        elementAssets.value.pyro.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/electro.png').then((value) => {
        elementAssets.value.electro.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/electro.png').then((value) => {
        elementAssets.value.electro.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/hydro.png').then((value) => {
        elementAssets.value.hydro.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/hydro.png').then((value) => {
        elementAssets.value.hydro.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/geo.png').then((value) => {
        elementAssets.value.geo.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/geo.png').then((value) => {
        elementAssets.value.geo.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/dendro.png').then((value) => {
        elementAssets.value.dendro.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/dendro.png').then((value) => {
        elementAssets.value.dendro.ico = value
    })
    window.path.joinDirnameAsset('elementBgs/anemo.png').then((value) => {
        elementAssets.value.anemo.bg = value
    })
    window.path.joinDirnameAsset('elementIcons/anemo.png').then((value) => {
        elementAssets.value.anemo.ico = value
    })
})

const router = useRouter()
const requestInfo = () => {
    uid = uidInput.value
    playerInfoReady.value = false
    window.enka.getPlayer(uid)
        .then((resp) => {
            if (playerInfo.value.uid == resp.uid) {
                console.log('uid equal')
                mergeToPlayerinfo(resp.characters)
                playerInfo.value.player = resp.player
            } else {
                console.log('uid not equal')
                playerInfo.value = resp
            }
            console.log('aaaaaaaaa')
            window.store.set('genshinInfo', JSON.stringify(playerInfo.value))
            playerInfoLoading.value = false
            router.push('/tmpgspage')
        }).catch((err) => {
            console.error(err)
            playerInfoLoading.value = false
        })
    playerInfoLoading.value = true
    console.log(uid)
}

const getCharElementAssets = (id) => {
    const charStats = playerInfo.value.characters[id].stats
    if (charStats.pyroEnergyCost.value && charStats.pyroEnergyCost.value > 0) { return elementAssets.value.pyro }
    else if (charStats.cryoEnergyCost.value && charStats.cryoEnergyCost.value > 0) { return elementAssets.value.cryo }
    else if (charStats.hydroEnergyCost.value && charStats.hydroEnergyCost.value > 0) { return elementAssets.value.hydro }
    else if (charStats.electroEnergyCost.value && charStats.electroEnergyCost.value > 0) { return elementAssets.value.electro }
    else if (charStats.geoEnergyCost.value && charStats.geoEnergyCost.value > 0) { return elementAssets.value.geo }
    else if (charStats.anemoEnergyCost.value && charStats.anemoEnergyCost.value > 0) { return elementAssets.value.anemo }
    else if (charStats.dendroEnergyCost.value && charStats.dendroEnergyCost.value > 0) { return elementAssets.value.dendro }
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
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 86.5vh;' : ''">
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
                    :src="'https://enka.network/ui/' + (playerInfo.player.profilePicture.assets.costumes.length > 0 ? playerInfo.player.profilePicture.assets.costumes[0].icon : playerInfo.player.profilePicture.assets.icon) + '.png'" />
                <div class="font-genshin" style="margin-left: 1vw; font-size: larger;">{{
                    playerInfo.player.username
                }}</div>
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
        <div v-if="playerInfoReady && playerInfo.characters.length > 0" class="relative">
            <!-- 角色头像列表 -->
            <div class="flex flex-row w-full justify-center z-50 relative">
                <div v-for="(character, index) in playerInfo.characters" class="relative" @click="showcaseIdx = index">
                    <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full bg-white transition-all"
                        :class="{ 'border-blue-600 border-3': showcaseIdx == index }" style="left: 10px;"></div>
                    <img class="char-side-icon rounded-full ml-1 w-12 hover:transform hover:scale-110 hover:-translate-y-1 active:scale-100 active:translate-y-0 transition-all"
                        :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].sideIconName : character.assets.sideIcon) + '.png'" />
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
                            <img class="gacha-mask inline-block object-cover bottom-0 left-0 absolute z-10 h-full"
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
                                        <div class="rounded-full ml-2 h-8 mb-2 flex flex-row"
                                            style="background-color: rgb(0 0 0 / 0.6); width: 72px;">
                                            <img class="h-8 rounded-full"
                                                :src="'https://enka.network/ui/' + skill.assets.icon + '.png'" />
                                            <div class="text-center w-full mr-1 h-full align-middle"
                                                style="margin-top: 3px;">
                                                <span
                                                    :class="{ 'text-orange-300': skill.level >= 10 }, { 'text-white': skill.level < 10 }"
                                                    class="text-base font-genshin">{{ skill.level }}</span>
                                            </div>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="flex flex-row relative">
                                    <el-tooltip v-for="idx in 6" placement="top">
                                        <template #content>
                                            <span class="font-genshin text-base"> {{ idx <=
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
                            <div class="mt-2 text-gray-200 text-lg text-left w-full rounded-xl p-2 pl-4 grid grid-cols-3 grid-rows-3"
                                style="background-color: rgba(0, 0, 0, 0.5);">
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
                                <div class="grid grid-cols-2 grid-rows-1" style="grid-column: 1 / 4; grid-row: 3;">
                                    <div style="grid-column: 1; grid-row: 1;">
                                        <span class="text-gray-300">暴击率</span>
                                        <span class="text-gray-200 text-right font-genshin ml-3">{{
                                            (character.stats.critRate.value * 100).toFixed(1)
                                        }}%</span>
                                    </div>
                                    <div style="grid-column: 2; grid-row: 1;">
                                        <span class="text-gray-300">暴击伤害</span>
                                        <span class="text-gray-200 text-right font-genshin ml-3">{{
                                            (character.stats.critDamage.value * 100).toFixed(1)
                                        }}%</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 详情第二块：武器 -->
                            <div class="mt-2 w-full rounded-xl flex flex-row"
                                style="background-color: rgb(0 0 0 / 0.6); height: 84px;">
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
                                class="mt-2 w-full h-40 rounded-xl " arrow="never" :autoplay="false"
                                style="background-color: rgb(0 0 0 / 0.6);">
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
                            <div v-else class="mt-2 w-full h-40 rounded-xl pt-16 text-gray-200 text-center align-middle"
                                style="background-color: rgb(0 0 0 / 0.6);">暂未装配圣遗物</div>
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
    -webkit-mask: linear-gradient(270deg, transparent 10%, white 60%)
}
</style>
