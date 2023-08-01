<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const uidInput = ref('')
var uid = ''
const playerInfoReady = ref(false)
const playerInfoLoading = ref(false)
const playerInfo = ref({})

onMounted(() => {
    window.store.get('genshinInfo')
        .then((value) => {
            if (value) {
                playerInfoReady.value = true
                uid = value.uid
                uidInput.value = uid
            }
            playerInfo.value = value
            // console.log(playerInfo)
        }).catch((err) => {
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
    <div class="card-bg">
        <div class="card-header">
            <el-image v-if="playerInfoReady" class="bg-image"
                :src="'https://enka.network/ui/' + playerInfo.player.namecard.assets.picPath[0] + '.png'">
            </el-image>
            <el-text v-if="playerInfoLoading" class="bg-image"
                style="margin-left: 1vw; right: 2vw; top: 3vh;">正在加载数据，请稍候……</el-text>
            <div v-if="playerInfoReady" class="flex-row left items-center" style="width: 35vw;">
                <el-avatar style="margin-left: 1vw;"
                    :src="'https://enka.network/ui/' + playerInfo.player.profilePicture.assets.icon + '.png'"></el-avatar>
                <el-text size="large" tag="b" style="margin-left: 1vw; font-size: larger;">{{ playerInfo.player.username
                }}</el-text>
            </div>
            <div v-else style="width: 35vw" />
            <div class="flex-row mid">
                <el-input v-model="uidInput" placeholder="输入uid以显示账号信息" @keyup.enter.native="requestInfo"
                    class="title-input"></el-input>
            </div>
            <div v-if="playerInfoReady" style="width: 35vw; position: relative;">
                <div class="tags-wrapper gap-x-1 flex-row right items-center">
                    <el-tag size="large" round>
                        <div class="flex-row">
                            WL
                            <span style="font-weight: bold; margin-left: 1ch;">
                                {{ playerInfo.player.levels.world }}
                            </span>
                        </div>
                    </el-tag>
                    <el-tag size="large" round>
                        <div class="flex-row">
                            AR
                            <span style="font-weight: bold; margin-left: 1ch;">
                                {{ playerInfo.player.levels.rank }}
                            </span>
                        </div>
                    </el-tag>
                </div>
            </div>
            <div v-else style="width: 35vw" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.card-bg {
    background-color: white;
    border-radius: 4.5vh;
    min-height: 50vh;
}

.title-input {
    width: 15vw;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.left {
    justify-self: left;
    justify-content: left;
}

.mid {
    justify-self: center;
    justify-content: center;
    justify-items: center;
    align-self: center;
    align-content: center;
    align-items: center;
}

.right {
    justify-self: right;
    justify-content: right;
}

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    height: 9vh;
    position: relative;
}

.items-center {
    align-items: center;
}

.gap-x-1 {
    &>* {
        margin-right: 1rem;
    }
}

.bg-image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.tags-wrapper {
    height: 100%;
}
</style>
