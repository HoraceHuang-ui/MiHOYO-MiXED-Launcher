<script setup>
import { onMounted, ref, computed } from 'vue'
import { marked } from 'marked'

var appVer = ''
const updCheck = ref(false)
const updDialogShow = ref(false)
const updInfo = ref({})
const updDialogContent = computed(() => {
  return marked(updInfo.value.data.body)
})

onMounted(() => {
  // TODO: add update feature via GitHub API
  // test personal access token
  // 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
  window.github.getLatestRelease()
    .then((resp) => {
      if (needsUpdate(resp.data.tag_name)) {
        updDialogShow.value = true
        updInfo.value = resp
      }
      updCheck.value = true
    })
    .catch((err) => {
      console.error(err)
    })

  fetch('../package.json')
    .then(response => response.json())
    .then((resp) => { appVer = resp.version })
})

const needsUpdate = (latestStr) => {
  const latest = latestStr.substring(1).split('.')
  const curr = appVer.split('.')
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

<template id="app">
  <el-dialog v-if="updCheck" v-model="updDialogShow" title="检测到miXeD新版本！" width="40%" center>
    <div style="padding-left: 20px; padding-right: 20px;">
      <div v-html="updDialogContent"></div>
      <div style="color: red; margin-top: 10px;">版本：v{{ appVer }} 👉 {{ updInfo.data.tag_name }}</div>
      <div style="color: red;">大小：{{ (updInfo.data.assets[0].size / 1024 / 1024).toFixed(1) }}MB</div>
      <div style="color: red;">点击确定以打开浏览器下载新版。</div>
    </div>
    <template #footer>
      <div class="flex-row footer-wrapper">
        <div style="width: 1px"></div>
        <div class="flex-row">
          <el-button @click="updDialogShow = false">取消</el-button>
          <el-button type="primary" @click="extUpd">
            确定
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <TopHeader />
  <router-view></router-view>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.footer-wrapper {
  width: 100%;
  justify-content: space-between;
}
</style>
