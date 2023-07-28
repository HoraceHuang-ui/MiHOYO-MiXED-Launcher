<script setup>
var child = require('child_process')

const genshin = () => {
    console.log("click on genshin")
    // D:\Star Rail\Game\StarRail.exe
    child.execFile('D:\\Genshin Impact\\Genshin Impact Game\\YuanShen.exe', function (err, data) {
        if (err) {
            console.error(err)
            return
        }

        console.log(data.toString())
    })
}

const starRail = () => {
    console.log("click on starrail")
    // D:\Star Rail\Game\StarRail.exe
    child.execFile('D:\\Star Rail\\Game\\StarRail.exe', function (err, data) {
        if (err) {
            console.error(err)
            return
        }

        console.log(data.toString())
    })
}
</script>

<template>
    <h1>MiHOYO MiXED Launcher</h1>
    <button @click="genshin">原神启动</button>
    <button @click="starRail">星铁启动</button>
</template>

<style scoped>
</style>
