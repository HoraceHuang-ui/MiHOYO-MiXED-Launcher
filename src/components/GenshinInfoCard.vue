<script setup>
import { onMounted, ref } from 'vue'
const uidInput = ref('')
var uid = ''
const playerInfoReady = ref(false)
let playerInfo

onMounted(() => {
    window.store.get('genshinInfo')
        .then((value) => {
            playerInfo = value
            console.log(playerInfo)
            if (playerInfo) {
                playerInfoReady.value = true
            }
        }).catch((err) => {
            console.error(err)
        })
})

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
    window.enka.getPlayer(uid)
        .then((resp) => {
            console.log(resp)
            window.store.set('genshinInfo', resp)
        }).catch((err) => {
            console.error(err)
        })
    console.log(uid)
}
</script>

<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <div v-if="playerInfoReady" class="header-slot left">
                    <el-avatar
                        :src="'https://enka.network/ui/' + playerInfo.player.profilePicture.assets.icon + '.png'"></el-avatar>
                    <div>{{ playerInfo.player.username }}</div>
                </div>
                <el-input v-model="uidInput" placeholder="输入uid以显示账号信息" @keyup.enter.native="requestInfo"
                    class="title-input"></el-input>
                <div v-if="playerInfoReady">{{ playerInfo.player.profilePicture.assets.icon }}</div>
            </div>
        </template>
    </el-card>
</template>

<style scoped>
.title-input {
    width: 40%;
}

.header-slot {
    display: flex;
    flex-direction: row;
}

.left {
    justify-content: left;
}

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
