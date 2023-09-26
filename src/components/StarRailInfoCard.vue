<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import DialogListItem from './DialogListItem.vue'
// import rankMap from '../textMaps/character_ranks.json' with { type: 'json' }

const apiUrl = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/'

const playerInfo = ref({})
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const uidInput = ref('')
var uid = ''
var charsPage = ref(0)
const pages = computed(() =>
    playerInfo.value.characters && playerInfo.value.characters.length > 10
        ? Math.floor((playerInfo.value.characters.length - 10) / 6 - 0.1) + 1
        : 0
)
const charsScrollbar = ref()
const showcaseIdx = ref(0)
const ascLevelMap = [20, 30, 40, 50, 60, 70, 80]
let rankMap = {}
const ranksReady = ref(false)
// const rankAdditions = ref([])
const rankAdditions = computed(() => {
    if (!ranksReady.value || !playerInfoReady.value) {
        return {}
    }
    let res = {}
    playerInfo.value.characters.forEach((character, index) => {
        const rank = character.rank
        if (rank >= 3 && rank < 5) {
            rankMap[character.id + "03"].level_up_skills.forEach(obj => {
                res[obj.id] = obj.num
            })
        } else if (rank >= 5) {
            rankMap[character.id + "03"].level_up_skills.forEach(obj => {
                res[obj.id] = obj.num
            })
            rankMap[character.id + "05"].level_up_skills.forEach(obj => {
                res[obj.id] = obj.num
            })
        }
    })
    console.log(res)
    return res
})
const charDialogShow = ref(false)
const charDialogId = ref(0)
const relicSetIdNameMap = new Map([
    ["101", "过客"],
    ["102", "快枪手"],
    ["103", "圣骑士"],
    ["104", "冰套"],
    ["105", "拳王"],
    ["106", "铁卫"],
    ["107", "火套"],
    ["108", "量子"],
    ["109", "雷套"],
    ["110", "风套"],
    ["111", "怪盗"],
    ["112", "虚数"],
    ["113", "莳者"],
    ["114", "信使"],
])

onMounted(() => {
    fetch('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/cn/character_ranks.json')
        .then(response => response.json())
        .then(resp => {
            rankMap = resp
            ranksReady.value = true
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
    window.store.get('starRailInfo')
        .then((value) => {
            if (value) {
                playerInfoReady.value = true
                uid = value.player.uid
                uidInput.value = uid
                playerInfo.value = value
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
            router.push({
                name: 'tempPage',
                query: {
                    from: '/srpage'
                }
            })
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

const findField = (range, field) => {
    for (var i = 0; i < range.length; i++) {
        const element = range[i]
        if (element.field === field) {
            return element
        }
    }
    return {
        "field": "",
        "name": "",
        "icon": "",
        "value": 0,
        "display": "",
        "percent": false
    }
}

// const findRankSkillId = (characterIdx, id) => {
//     let range = rankAdditions.value[characterIdx]
//     console.log(rankAdditions.value[characterIdx])
//     for (var i = 0; i < range.length; i++) {
//         const element = range[i]
//         if (element.id === id) {
//             return element
//         }
//     }
//     return {
//         "id": "",
//         "num": 0
//     }
// }

const parseRankDesc = (str) => {
    return str.replace('\\n', '\n')
}

const getOuterSets = (sets) => {
    if (sets.length == 0) { return '暂无套装' }
    else if (sets.length == 1) {
        return sets[0].id[0] == '3' ? '暂无套装' : (sets[0].name + ' 2')
    } else {
        if (sets[1].id[0] == '3') {
            return sets[0].name + ' 2'
        } else if (sets[1].num == 2) {
            return relicSetIdNameMap.get(sets[0].id) + ' 2 + ' + relicSetIdNameMap.get(sets[1].id) + ' 2'
        } else {
            return sets[0].name + ' 4'
        }
    }
}
const getInnerSet = (sets) => {
    if (sets.length > 0 && sets[sets.length - 1].id[0] == '3') {
        return sets[sets.length - 1].name
    } else {
        return '暂无套装'
    }
}

const showCharDetails = (index) => {
    charDialogId.value = index
    charDialogShow.value = true
}

const trimAdditions = (additions) => {
    const map = ['atk', 'hp', 'def', 'spd', 'crit_rate', 'crit_dmg']
    var tmp = [...additions]
    for (var i = 0; i < tmp.length; i++) {
        if (map.indexOf(tmp[i].field) != -1) {
            tmp.splice(i, 1)
            i--
        }
    }
    return tmp
}
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;" :style="playerInfoReady ? 'height: 97vh;' : ''">
        <el-dialog v-if="playerInfoReady" v-model="charDialogShow"
            :title="playerInfo.characters[charDialogId].name + ' 角色详情'" width="30%">
            <div class="flex flex-col content-center justify-center w-full px-5">
                <DialogListItem class="font-sr-sans" name="生命值">
                    <div class="font-sr-sans">
                        <span>{{ playerInfo.characters[charDialogId].attributes[0].display }}</span>
                        <span v-if="findField(playerInfo.characters[charDialogId].additions, 'hp').display !== ''"
                            class="ml-1 text-blue-500">+{{ findField(playerInfo.characters[charDialogId].additions,
                                "hp").display }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-sr-sans" name="攻击力">
                    <div class="font-sr-sans">
                        <span>{{ playerInfo.characters[charDialogId].attributes[1].display }}</span>
                        <span v-if="findField(playerInfo.characters[charDialogId].additions, 'atk').display !== ''"
                            class="ml-1 text-blue-500">+{{ findField(playerInfo.characters[charDialogId].additions,
                                "atk").display }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-sr-sans" name="防御力">
                    <div class="font-sr-sans">
                        <span>{{ playerInfo.characters[charDialogId].attributes[2].display }}</span>
                        <span v-if="findField(playerInfo.characters[charDialogId].additions, 'def').display !== ''"
                            class="ml-1 text-blue-500">+{{ findField(playerInfo.characters[charDialogId].additions,
                                "def").display }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-sr-sans" name="速度">
                    <div class="font-sr-sans">
                        <span>{{ playerInfo.characters[charDialogId].attributes[3].display }}</span>
                        <span v-if="findField(playerInfo.characters[charDialogId].additions, 'spd').display !== ''"
                            class="ml-1 text-blue-500">+{{ findField(playerInfo.characters[charDialogId].additions,
                                "spd").display }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-sr-sans" name="暴击率"
                    :val="((playerInfo.characters[charDialogId].attributes[4].value + findField(playerInfo.characters[charDialogId].additions, 'crit_rate').value) * 100).toFixed(1) + '%'">
                </DialogListItem>
                <DialogListItem class="font-sr-sans" name="暴击伤害"
                    :val="((playerInfo.characters[charDialogId].attributes[5].value + findField(playerInfo.characters[charDialogId].additions, 'crit_dmg').value) * 100).toFixed(1) + '%'">
                </DialogListItem>
                <DialogListItem v-for="attr in trimAdditions(playerInfo.characters[charDialogId].additions)"
                    class="font-sr-sans" :name="attr.name" :val="attr.display" />
            </div>
        </el-dialog>
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
            <!-- <div class="flex flex-row self-center">
                <el-input size="large" v-model="uidInput" placeholder="在此输入uid" @keyup.enter.native="requestInfo"
                    style="width: 15vw;" clearable>
                    <template #append>
                        <el-button @click="requestInfo" size="large">查询</el-button>
                    </template>
                </el-input>
            </div> -->
            <div class="flex flex-row mt-3">
                <CustomUIDInput v-model="uidInput" @submit="requestInfo" />
            </div>
            <!-- 右侧 WL AR -->
            <div v-if="playerInfoReady && !playerInfoLoading" style="width: 35vw; position: relative;">
                <div class="h-full flex flex-row justify-end items-center">
                    <el-tag size="large" round class="mr-2">
                        <div class="flex flex-row">
                            均衡
                            <span class="font-sr-sans" style="margin-left: 1ch; margin-top: 1px;">
                                {{ playerInfo.player.world_level }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round class="mr-4">
                        <div class="flex flex-row">
                            等级
                            <span class="font-sr-sans" style="margin-left: 1ch; margin-top: 1px;">
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
                <div class="relative z-50" style="width: 30.5%;">
                    <el-icon
                        class="absolute right-2 top-3 rounded-full w-9 h-9 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all opacity-80"
                        @click="charsPagePrev" :class="charsPage === 0 ? 'disabled' : ''">
                        <ArrowLeftBold />
                    </el-icon>
                </div>
                <el-scrollbar ref="charsScrollbar" class="flex flex-row justify-center" noresize style="width: 39%;">
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
                <div class="relative z-50" style="width: 30.5%;">
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
                        style="height: 117%;">
                        <img class="gacha-mask inline-block object-cover bottom-0 left-0 absolute z-10" loading="lazy"
                            style="height: 100%;" :src="apiUrl + character.portrait" />
                    </div>
                    <!-- 左下角星魂 -->
                    <div class="absolute bottom-2 left-2 z-20">
                        <div class="flex flex-col">
                            <div class="flex flex-row relative">
                                <el-tooltip v-for="idx in 6" placement="top">
                                    <template #content>
                                        <div class=" max-w-lg" v-if="ranksReady">
                                            <div class="font-sr text-xl">
                                                {{ rankMap[character.id + "0" + idx.toString()].name }}
                                                <span v-if="idx > character.rank"
                                                    class="ml-1 text-base text-gray-200">（未解锁）</span>
                                            </div>
                                            <div class="font-sr-sans text-sm mt-1 whitespace-pre-wrap">{{
                                                parseRankDesc(rankMap[character.id + "0" + idx.toString()].desc)
                                            }}</div>
                                        </div>
                                    </template>
                                    <div v-if="idx <= character.rank" class="relative">
                                        <div class="absolute bottom-0 left-2 w-8 h-8 rounded-full bg-black z-20 opacity-70">
                                        </div>
                                        <img class="relative h-8 rounded-full ml-2 z-30"
                                            :src="apiUrl + character.rank_icons[idx - 1]" />
                                    </div>
                                    <div v-else>
                                        <img src="../assets/locked.png" class="w-8 opacity-70 ml-2 bg-black rounded-full" />
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <!-- 右侧详情 -->
                    <div class=" w-1/2 h-full absolute top-4 right-6 bottom-4 flex flex-col z-20">
                        <!-- Lv. 80/80 命途 角色名字-->
                        <div class="w-full text-right">
                            <span class=" text-gray-200 font-sr-sans text-2xl">
                                Lv. {{ character.level }} /
                            </span>
                            <span class=" text-gray-400 text-xl mr-4 font-sr-sans">
                                {{ ascLevelMap[character.promotion] }}
                            </span>
                            <img class="inline h-8 mb-2" :src="apiUrl + character.path.icon" />
                            <span class=" text-gray-200 bottom-0 text-xl font-sr-sans mr-5 ml-2">{{ character.path.name
                            }}</span>
                            <span class=" text-white font-sr text-5xl">{{ character.name }}</span>
                        </div>
                        <!-- 右侧第一块：属性 -->
                        <div
                            class="mt-2 text-gray-200 text-lg text-left w-full rounded-xl px-2 py-3 pl-4 bg-black bg-opacity-20 backdrop-blur-md grid grid-cols-3 grid-rows-2">
                            <div class="w-full justify-between">
                                <span class="text-gray-300">生命值</span>
                                <span class="text-gray-200 text-right font-sr-sans ml-3">{{
                                    Math.floor(character.attributes[0].value) + Math.floor(findField(character.additions,
                                        "hp").value)
                                }}</span>
                            </div>
                            <div>
                                <span class="text-gray-300">攻击力</span>
                                <span class="text-gray-200 text-right font-sr-sans ml-3">{{
                                    Math.floor(character.attributes[1].value) + Math.floor(findField(character.additions,
                                        "atk").value) }}</span>
                            </div>
                            <div>
                                <span class="text-gray-300">防御力</span>
                                <span class="text-gray-200 text-right font-sr-sans ml-3">{{
                                    Math.floor(character.attributes[2].value) + Math.floor(findField(character.additions,
                                        "def").value) }}</span>
                            </div>
                            <div>
                                <span class="text-gray-300">暴击率</span>
                                <span class="text-gray-200 text-right font-sr-sans ml-3">{{
                                    ((character.attributes[4].value + findField(character.additions,
                                        "crit_rate").value) * 100).toFixed(1) }}%</span>
                            </div>
                            <div>
                                <span class="text-gray-300">暴击伤害</span>
                                <span class="text-gray-200 text-right font-sr-sans ml-3">{{
                                    ((character.attributes[5].value + findField(character.additions,
                                        "crit_dmg").value) * 100).toFixed(1) }}%</span>
                            </div>
                            <div class="mx-2 rounded-full text-sm bg-white bg-opacity-20 text-center hover:bg-opacity-30 active:scale-95 active:bg-opacity-40 cursor-default transition-all"
                                @click="showCharDetails(index)">
                                <div class=" font-sr-sans" style="margin-top: 6px;">查看更多</div>
                            </div>
                        </div>
                        <!-- 右侧第二块：光锥 -->
                        <div v-if="character.light_cone"
                            class="mt-2 w-full rounded-xl flex flex-row bg-black bg-opacity-20 backdrop-blur-md"
                            style="height: 90px;">
                            <img class="object-cover w-44 h-full" :src="apiUrl + character.light_cone.preview" />
                            <div class="w-full h-full relative">
                                <div class="flex flex-row justify-between ml-2 mt-3">
                                    <div>
                                        <span class="text-gray-200 font-sr text-2xl">
                                            {{ character.light_cone.name }}</span>
                                        <span class="text-gray-200 font-sr text-xl"> Lv. {{
                                            character.light_cone.level }} /</span>
                                        <span class="text-gray-300 ml-1 font-serif">{{
                                            ascLevelMap[character.light_cone.promotion] }}</span>
                                    </div>
                                    <div class="text-gray-200 mr-2 text-sm absolute right-0 top-0">叠影
                                        <span class="text-gray-200 font-sr-sans text-base">{{
                                            character.light_cone.rank }}</span>
                                        阶
                                    </div>
                                </div>
                                <div class="text-gray-300 ml-2 text-left grid grid-cols-3 mt-1">
                                    <div>
                                        生命值
                                        <span class="text-gray-200 font-sr-sans text-lg">{{
                                            character.light_cone.attributes[0].display }}</span>
                                    </div>
                                    <div>
                                        攻击力
                                        <span class="text-gray-200 font-sr-sans text-lg">{{
                                            character.light_cone.attributes[1].display }}</span>
                                    </div>
                                    <div>
                                        防御力
                                        <span class="text-gray-200 font-sr-sans text-lg">{{
                                            character.light_cone.attributes[2].display }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else
                            class="mt-2 w-full rounded-xl align-middle text-center bg-black bg-opacity-20 backdrop-blur-md"
                            style="height: 90px;">
                            暂未装配光锥
                        </div>
                        <!-- 右侧第三块：行迹 -->
                        <div
                            class="mt-2 px-2 py-3 w-full rounded-xl bg-black bg-opacity-20 backdrop-blur-md grid grid-cols-4 grid-rows-1">
                            <div v-for="idx in 4" class="h-full flex flex-row cursor-default">
                                <el-tooltip placement="left">
                                    <template #content>
                                        <div class=" max-w-md">
                                            <div class="font-sr text-xl">
                                                {{ character.skills[idx - 1].name }}
                                            </div>
                                            <div class="font-sr-sans text-sm mt-1">
                                                {{
                                                    character.skills[idx - 1].simple_desc ? character.skills[idx -
                                                        1].simple_desc :
                                                    character.skills[idx - 1].desc
                                                }}</div>
                                        </div>
                                    </template>
                                    <div class="h-12 w-12 p-1 rounded-full border-2 bg-opacity-50"
                                        :style="{ borderColor: character.element.color }, { backgroundColor: character.element.color }">
                                        <img :src="apiUrl + character.skills[idx - 1].icon" />
                                    </div>
                                </el-tooltip>
                                <div v-if="character.skill_trees[idx - 1].level >= character.skill_trees[idx - 1].max_level"
                                    class="ml-2 mt-2 text-orange-300 text-xl align-middle h-full font-sr-sans">MAX
                                </div>
                                <div v-else class="ml-2 mt-2 text-lg align-middle h-full font-sr-sans">
                                    <div class="text-gray-200" v-if="!rankAdditions[character.skills[idx - 1].id]">
                                        {{ character.skill_trees[idx - 1].level }} <span class="text-gray-400">/{{
                                            character.skill_trees[idx - 1].max_level }}</span>
                                    </div>
                                    <div v-else class=" text-cyan-400">
                                        {{ character.skill_trees[idx - 1].level + rankAdditions[character.skills[idx -
                                            1].id]
                                        }} <span class="text-gray-400">/{{
    character.skill_trees[idx - 1].max_level + rankAdditions[character.skills[idx -
        1].id]
}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧第四块：遗器 -->
                        <el-carousel v-if="character.relics && character.relics.length > 0"
                            class="mt-2 w-full h-40 rounded-xl bg-black bg-opacity-20 backdrop-blur-md" arrow="never"
                            :autoplay="false">
                            <el-carousel-item v-for="relic in character.relics"
                                class="pb-2 pr-2 pl-4 flex flex-row h-40 text-gray-200">
                                <img style="height: 100%; margin-left: -20px;" class="artifact-mask w-36 object-cover"
                                    :src="apiUrl + relic.icon" />
                                <div class=" w-full h-full relative">
                                    <div class="text-gray-400 font-sr absolute right-0 top-1">
                                        {{ relic.name }}
                                    </div>
                                    <!-- 主词条、等级 -->
                                    <div class="text-left mt-7 w-full flex flex-row">
                                        <span class="text-gray-200 text-xl">{{ relic.main_affix.name }}</span>
                                        <span class="text-gray-200 text-3xl ml-2 font-sr-sans">{{ relic.main_affix.display
                                        }}</span>
                                        <div :class="{ 'border-orange-400 bg-orange-900 text-orange-300': relic.rarity == 5 },
                                            { 'border-purple-400 bg-purple-900 text-purple-300': relic.rarity == 4 },
                                            { 'border-blue-400 bg-blue-900 text-blue-300': relic.rarity == 3 },
                                            { 'border-green-400 bg-green-900 text-green-300': relic.rarity == 2 }"
                                            class="h-full justify-end mt-1 ml-2 font-sr-sans rounded-full border px-2">
                                            +{{ relic.level }}
                                        </div>
                                    </div>
                                    <!-- 副词条 -->
                                    <div v-if="relic.sub_affix && relic.sub_affix.length > 0"
                                        class="grid grid-cols-2 mt-2 grid-rows-2 gap-1 w-full text-left">
                                        <div v-for="substat in relic.sub_affix">
                                            <span class="text-gray-300 text-lg">{{ substat.name }}</span>
                                            <span class="text-gray-200 font-sr-sans text-xl ml-2">{{ substat.display
                                            }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="mt-2 text-left text-gray-300 text-lg">暂无副词条</div>
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                        <div v-else
                            class="mt-2 w-full h-40 rounded-xl pt-16 text-gray-200 text-center align-middle bg-black bg-opacity-20 backdrop-blur-md">
                            暂未装配遗器</div>
                        <div v-if="character.relics && character.relics.length > 0" class="flex flex-row justify-between">
                            <div class=" text-gray-900 ml-1 mt-1">
                                <div class="inline rounded-full bg-gray-200 p-1 px-2 font-sr-sans middle">外</div>
                                <span class="text-gray-100 font-sr ml-2">{{ getOuterSets(character.relic_sets) }}</span>
                            </div>
                            <div class="text-gray-900 mt-1 mr-1 font-sr">
                                <span class="text-gray-100 mr-2">{{ getInnerSet(character.relic_sets) }}</span>
                                <div class="inline rounded-full bg-gray-200 p-1 px-2 font-sr-sans middle">内</div>
                            </div>
                        </div>
                        <div v-else class="flex flex-row justify-between">
                            <div class=" text-gray-900 ml-1 mt-1">
                                <div class="inline rounded-full bg-gray-200 p-1 px-2 font-sr-sans middle">外</div>
                                <span class="text-gray-100 font-sr ml-2">暂无套装</span>
                            </div>
                            <div class="text-gray-900 mt-1 mr-1 font-sr">
                                <span class="text-gray-100 mr-2">暂无套装</span>
                                <div class="inline rounded-full bg-gray-200 p-1 px-2 font-sr-sans middle">内</div>
                            </div>
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

.font-sr-sans {
    font-family: sr-sans-font;
}

.char-side-icon {
    -webkit-mask: radial-gradient(white 80%, transparent)
}

.gacha-mask {
    -webkit-mask: linear-gradient(transparent 5%, white 14%, white 85%, transparent)
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
