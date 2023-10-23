<script setup>
import { ref, onMounted, computed } from 'vue'
import { switchLang, availableLangCodes, availableLangNames } from '../i18n/index'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
const lang = ref('')
const langDialogShow = ref(false)
const clearDialogShow = ref(false)
const transitionShow = ref(false)
const bgPath = ref('')
const appVer = ref('')
const latest = ref(false)
const updDialogShow = ref(false)
const updInfo = ref({})
const checkUpdFailed = ref(false)
const updDialogContent = computed(() => {
    return marked(updInfo.value.data.body)
})

const DEFAULT_BG = '../../src/assets/gsbanner.png'

onMounted(async () => {
    lang.value = localStorage.lang
    bgPath.value = await window.store.get('mainBgPath')
    const imgElement = document.getElementById('bgImage');
    imgElement.src = bgPath.value ? bgPath.value : DEFAULT_BG;
    transitionShow.value = true

    fetch('../../package.json')
        .then(response => response.json())
        .then((resp) => { appVer.value = resp.version })
})

const router = useRouter()
const langChange = () => {
    switchLang(lang.value)
    router.go(0)
}
const langDialogCancel = () => {
    lang.value = localStorage.lang
    langDialogShow.value = false
}

const clearAllData = () => {
    window.store.clear()
    router.go(0)
}

const openLink = (url) => {
    window.electron.openExtLink(url)
}

const checkUpdates = () => {
    checkUpdFailed.value = false
    window.github.getLatestRelease()
        .then((resp) => {
            if (needsUpdate(resp.data.tag_name)) {
                updDialogShow.value = true
                updInfo.value = resp
            } else {
                latest.value = true
            }
        })
        .catch(() => {
            checkUpdFailed.value = true
        })
}

const needsUpdate = (latestStr) => {
    const latest = latestStr.substring(1).split('.')
    const curr = appVer.value.split('.')
    console.log(latest)
    console.log(curr)

    for (var i = 0; i < 3; i++) {
        if (parseInt(latest[i]) > parseInt(curr[i])) {
            return true
        }
    }
    return false
}

const extUpd = () => {
    window.electron.openExtLink(updInfo.value.data.assets[0].browser_download_url)
    window.win.close()
}
</script>

<template>
    <div @touchmove.prevent @mousewheel.prevent :class="transitionShow ? '' : 'opacity-0 blur-lg scale-90'"
        style="transition-duration: 400ms;">
        <div class="bg-pic">
            <img class="object-cover blur-xl opacity-25 scale-105" id="bgImage"
                :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'" />
        </div>
        <el-scrollbar height="91vh" class="scroll-wrapper absolute z-40">
            <div class="text-left px-10 pt-10 w-full">
                <div class="title">{{ $t('settings_general') }}</div>
                <div class="form-item">
                    <div class="h-full py-1">{{ $t('settings_selectLang') }}</div>
                    <select name="language" @change="langDialogShow = true" v-model="lang"
                        class="border-2 rounded-full py-1 px-2 ml-3">
                        <option v-for="(langCode, i) in availableLangCodes" :value="langCode">{{ availableLangNames[i] }}
                        </option>
                    </select>
                    <el-dialog v-model="langDialogShow" :title="$t('settings_langChangeTitle')" width="40%" center
                        :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
                        <div v-t="{ path: 'settings_langChangeText', locale: lang }"></div>
                        <template #footer>
                            <div class="flex-row justify-between">
                                <div class="w-1"></div>
                                <div class="flex-row">
                                    <button
                                        class="mr-3 rounded-full py-1 px-2 hover:bg-gray-200 active:bg-gray-400 transition-all"
                                        @click="langDialogCancel">{{
                                            $t('general_cancel')
                                        }}</button>
                                    <button
                                        class="rounded-full py-1 px-3 bg-blue-600 text-white hover:bg-blue-500 active:scale-90 transition-all"
                                        @click="langChange">
                                        {{ $t('general_confirm') }}
                                    </button>
                                </div>
                            </div>
                        </template>
                    </el-dialog>
                </div>
                <div class="form-item">
                    <div class="hover:underline active:text-orange-300 text-blue-700 cursor-pointer"
                        @click="clearDialogShow = true">
                        {{ $t('settings_clearAllData') }}</div>
                    <el-dialog v-model="clearDialogShow" :title="$t('settings_clearAllData')" width="40%" center
                        :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
                        {{ $t('settings_clearAllDataText') }}
                        <template #footer>
                            <div class="flex-row justify-between">
                                <div class="w-1"></div>
                                <div class="flex-row">
                                    <button
                                        class="mr-3 rounded-full py-1 px-2 hover:bg-gray-200 active:bg-gray-400 transition-all"
                                        @click="clearDialogShow = false">{{
                                            $t('general_cancel')
                                        }}</button>
                                    <button
                                        class="rounded-full py-1 px-3 bg-blue-600 text-white hover:bg-blue-500 active:scale-90 transition-all"
                                        @click="clearAllData">
                                        {{ $t('general_confirm') }}
                                    </button>
                                </div>
                            </div>
                        </template>
                    </el-dialog>
                </div>
                <div class="title">{{ $t('settings_about') }}</div>
                <div class="form-item rounded-full bg-white pl-3 border border-red-400 font-mono"
                    style="width: fit-content;">
                    miHoYo miXeD Launcher
                    <div class="rounded-full ml-2 px-2 bg-red-400 text-white font-sans cursor-default">v{{ appVer }}
                    </div>
                </div>
                <div class="form-item">
                    <img class="img-link cursor-pointer" src="../assets/github-mark.png"
                        @click="openLink('https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher')" />
                    <button @click="checkUpdates" class="rounded-full cursor-default ml-3 px-3"
                        :class="latest ? 'button-disabled' : 'button-enabled'">{{
                            latest ? $t('settings_latestVersion') : $t('settings_checkUpdates') }}</button>
                    <div class="text-red-600 ml-3 mt-1" v-if="checkUpdFailed">{{ $t('settings_checkUpdFailed') }}</div>
                    <el-dialog v-model="updDialogShow" :title="$t('updDialog_title')" width="40%" center>
                        <div style="padding-left: 20px; padding-right: 20px;">
                            <div v-html="updDialogContent"></div>
                            <div style="color: red; margin-top: 10px;">{{ $t('updDialog_version') }}v{{ appVer }} 👉 {{
                                updInfo.data.tag_name }}
                            </div>
                            <div style="color: red;">{{ $t('updDialog_size') }}{{ (updInfo.data.assets[0].size / 1024 /
                                1024).toFixed(1) }}MB
                            </div>
                            <div style="color: red;">{{ $t('updDialog_footerText') }}</div>
                        </div>
                        <template #footer>
                            <div class="flex-row footer-wrapper">
                                <div class="flex-row">
                                    <el-button
                                        class="mr-3 rounded-full py-1 px-2 hover:bg-gray-200 active:bg-gray-400 transition-all"
                                        @click="updDialogShow = false">{{ $t('general_cancel') }}</el-button>
                                    <el-button
                                        class="rounded-full py-1 px-3 bg-blue-600 text-white hover:bg-blue-500 active:scale-90 transition-all"
                                        @click="extUpd">
                                        {{ $t('general_confirm') }}
                                    </el-button>
                                </div>
                            </div>
                        </template>
                    </el-dialog>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.title {
    @apply text-4xl font-bold mt-8;
}

.form-item {
    @apply flex flex-row mt-4 ml-8;
}

.bg-pic {
    width: 98vw;
    height: 92vh;
    border-radius: 24px 24px 0 0;
    -webkit-mask: linear-gradient(white, white)
}

.scroll-wrapper {
    top: 2vh;
    left: 1vw;
    width: 96vw;
    border-radius: 5vh 5vh 0 0;
}

.img-link {
    @apply w-8 h-8 hover:opacity-70 active:scale-90 transition-all;
}

.button-enabled {
    @apply bg-white border border-gray-500 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all active:bg-blue-300;
}

.button-disabled {
    @apply opacity-70 bg-gray-100 border border-gray-300 text-gray-400 pointer-events-none cursor-not-allowed;
}
</style>
