<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const uidInput = ref('')
var uid = ''
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const playerInfo = ref({})
const showcaseIdx = ref(0)

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
</script>

<template>
    <div class="bg-white" style="border-radius: 4.5vh;">
        <!-- HEADER -->
        <div class="flex flex-row w-full p-0 relative justify-between" style="height: 9vh;">
            <el-image v-if="playerInfoReady" class="absolute top-0 right-0 bottom-0 z-0"
                :src="'https://enka.network/ui/' + playerInfo.player.namecard.assets.picPath[0] + '.png'">
            </el-image>
            <el-text v-if="playerInfoLoading" class="absolute top-0 right-0 bottom-0 z-0"
                style="margin-left: 1vw; right: 2vw; top: 3vh;">正在加载数据，请稍候……</el-text>
            <div v-if="playerInfoReady" class="flex flex-row content-start items-center" style="width: 35vw;">
                <el-avatar style="margin-left: 1vw;"
                    :src="'https://enka.network/ui/' + playerInfo.player.profilePicture.assets.icon + '.png'"></el-avatar>
                <el-text size="large" tag="b" style="margin-left: 1vw; font-size: larger;">{{ playerInfo.player.username
                }}</el-text>
            </div>
            <div v-else style="width: 35vw" />
            <div class="flex flex-row self-center">
                <el-input v-model="uidInput" placeholder="输入uid以显示账号信息" @keyup.enter.native="requestInfo"
                    style="width: 15vw;"></el-input>
            </div>
            <div v-if="playerInfoReady" style="width: 35vw; position: relative;">
                <div class="h-full flex flex-row justify-end items-center">
                    <el-tag size="large" round class="mr-2">
                        <div class="flex flex-row">
                            WL
                            <span class="font-bold" style="margin-left: 1ch;">
                                {{ playerInfo.player.levels.world }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round class="mr-4">
                        <div class="flex flex-row">
                            AR
                            <span class="font-bold" style="margin-left: 1ch;">
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
            <div class="flex flex-row w-full justify-center z-50">
                <div v-for="(character, index) in playerInfo.player.showcase" class="relative">
                    <div class="absolute bottom-0 w-9 h-9 border-2 rounded-full"
                        :class="{ 'border-blue-600 border-3': showcaseIdx == index }" style="left: 10px;"></div>
                    <img class="charSideIcon rounded-full ml-1 w-12" @click="showcaseIdx = index"
                        :src="'https://enka.network/ui/' + (character.costumeId != '' ? character.assets.costumes[0].sideIconName : character.assets.sideIcon) + '.png'" />
                </div>
            </div>
            <!-- COLORS
                Anemo: #006163 #228283
                Dendro: #001d00 #1b6220
                Pyro: #761b09 #9e5d50
                Hydro: #09438d #517aae
                Cryo: #005175 #28839c
                Electro: #31005b #6f478c
                Geo: #773f00 #9f772c
            -->
            <div class="mt-4 bg-blue-200 w-full" style="border-radius: 4.5vh; height: 40vw;">
                <div v-for="(, index) in playerInfo.characters">
                    <div v-if="showcaseIdx == index">
                        <img class="gacha-mask block" style="height: 100%;" loading="lazy"
                            :src="'https://enka.network/ui/' + (playerInfo.characters[index].costumeId != '' ? playerInfo.characters[showcaseIdx].assets.costumes[0].art : playerInfo.characters[showcaseIdx].assets.gachaIcon) + '.png'" />

                        <div></div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!playerInfoReady">此处将显示角色的详细信息</div>
        <div v-else class="mt-4 mb-4">当前暂无详细信息，请在游戏内打开“展示详细信息”后再试</div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.charSideIcon {
    -webkit-mask: radial-gradient(white 90%, transparent)
}

.gacha-mask {
    -webkit-mask: radial-gradient(white 80%, transparent);
}
</style>
