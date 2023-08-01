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
    <el-card>
        <template #header>
            <div class="card-header">
                <div v-if="playerInfoReady" class="flex-row left" style="width: 30vw;">
                    <el-avatar
                        :src="'https://enka.network/ui/' + playerInfo.player.profilePicture.assets.icon + '.png'"></el-avatar>
                    <el-text size="large" tag="b" style="margin-left: 1vw;">{{ playerInfo.player.username }}</el-text>
                </div>
                <div class="flex-row mid">
                    <el-input v-model="uidInput" placeholder="输入uid以显示账号信息" @keyup.enter.native="requestInfo"
                        class="title-input"></el-input>
                    <el-text v-if="playerInfoLoading" style="margin-left: 1vw;">正在加载数据，请稍候……</el-text>
                </div>
                <div v-if="playerInfoReady" class="flex-row right" style="width: 30vw;">
                    <el-tag size="large" style="margin-left: 5px;">世界等级 {{ playerInfo.player.levels.world }}</el-tag>
                    <el-tag size="large" style="margin-left: 5px;">冒险等阶 {{ playerInfo.player.levels.rank }}</el-tag>
                </div>
            </div>
        </template>
    </el-card>
</template>

<style scoped>
.title-input {
    width: 20vw;
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
    align-self: center;
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
}
</style>
