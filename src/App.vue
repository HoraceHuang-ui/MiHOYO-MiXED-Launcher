<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {marked} from 'marked'
import {useRouter} from 'vue-router'
import {UpdInfo} from "./types/github/ghUpdInfo";
import {dialogStyle} from "./types/dialog/dialog";

let appVer = ''
const dialogStyle = ref<dialogStyle>('gs')
const updCheck = ref(false)
const updDialogShow = ref(false)
const updInfo = ref<UpdInfo>({
    assets: [],
    assets_url: "",
    author: undefined,
    body: "",
    created_at: "",
    discussion_url: "",
    draft: false,
    html_url: "",
    id: 0,
    name: "",
    node_id: "",
    prerelease: false,
    published_at: "",
    tag_name: "",
    tarball_url: "",
    target_commitish: "",
    upload_url: "",
    url: "",
    zipball_url: ""
})
const updDialogContent = computed(() => {
    return marked(updInfo.value.body)
})
const skipCurrent = ref(false)

const router = useRouter()
onMounted(() => {
    // window.store.delete("targetVersion")
    window.github.getLatestRelease()
        .then((resp: any) => {
            if (needsUpdate(resp.data.tag_name)) {
                window.store.get('targetVersion')
                    .then((target: any) => {
                        console.log(target)
                        if (!target || target < resp.data.tag_name) {
                            updDialogShow.value = true
                            updInfo.value = resp.data
                        }
                    })
            }
            updCheck.value = true
        })
        .catch((err: Error) => {
            console.error(err)
        })

    window.store.get('dialogStyle').then((style: dialogStyle) => {
        if (!style) {
            window.store.set('dialogStyle', 'gs', false)
        }
    })

    fetch('../package.json')
        .then(response => response.json())
        .then((resp) => {
            appVer = resp.version
        })

    router.push('/')
})

const verCompare = (a: string, b: string) => {
    const arr1 = a.split('.')
    const arr2 = b.split('.')

    if (arr1.length != arr2.length) {
        return 114
    }

    for (let i = 0; i < arr1.length; i++) {
        if (parseInt(arr1[i]) > parseInt(arr2[i])) {
            return 1
        } else if (parseInt(arr1[i]) < parseInt(arr2[i])) {
            return -1
        }
    }
    return 0
}

const needsUpdate = (latestStr: string) => {
    const latest = latestStr.substring(1)
    const curr = appVer
    console.log(latest)
    console.log(curr)

    return verCompare(latest, curr) > 0
}

const extUpd = () => {
    window.electron.openExtLink(updInfo.value.assets[0].browser_download_url)
    window.win.close()
}

const onDialogClose = () => {
    if (skipCurrent.value) {
        window.store.set("targetVersion", updInfo.value.tag_name, false)
    }
    updDialogShow.value = false
}
</script>

<template id="app">
    <el-dialog v-if="updCheck" v-model="updDialogShow" :title="$t('updDialog_title')" width="40%" center
               :before-close="onDialogClose">
        <div style="padding-left: 20px; padding-right: 20px;">
            <el-scrollbar height="40vh">
                <div v-html="updDialogContent"></div>
            </el-scrollbar>
            <div style="color: red; margin-top: 10px;">{{ $t('updDialog_version') }}v{{ appVer }} 👉 {{
                    updInfo.tag_name
                }}
            </div>
            <div style="color: red;">{{ $t('updDialog_size') }}{{ (updInfo.assets[0].size / 1024 / 1024).toFixed(1) }}MB
            </div>
            <div style="color: red;">{{ $t('updDialog_footerText') }}</div>
        </div>
        <template #footer>
            <div class="flex-row footer-wrapper">
                <el-checkbox v-model="skipCurrent">{{ $t("updDialog_skipCurrent") }}</el-checkbox>
                <div class="flex-row">
                    <el-button @click="onDialogClose">{{ $t('general_cancel') }}</el-button>
                    <el-button type="primary" @click="extUpd" :disabled="skipCurrent">
                        {{ $t('general_confirm') }}
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
    <TopHeader/>
    <router-view></router-view>
</template>

<style>
.flex-row {
    display: flex;
    flex-direction: row;
}

.footer-wrapper {
    width: 100%;
    justify-content: space-between;
}
</style>
