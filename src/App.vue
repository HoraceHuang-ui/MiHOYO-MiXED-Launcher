<script setup>
import { onMounted, ref, computed } from 'vue'
import { marked } from 'marked'
import { switchLang } from './i18n/index'

var appVer = ''
const updCheck = ref(false)
const updDialogShow = ref(false)
const updInfo = ref({})
const updDialogContent = computed(() => {
  return marked(updInfo.value.data.body)
})
const skipCurrent = ref(false)

onMounted(() => {
  // window.store.delete("targetVersion")
  window.github.getLatestRelease()
    .then((resp) => {
      if (needsUpdate(resp.data.tag_name)) {
        window.store.get("targetVersion")
          .then((target) => {
            console.log(target)
            if (!target || target < resp.data.tag_name) {
              updDialogShow.value = true
              updInfo.value = resp
            }
          })
      }
      updCheck.value = true
    })
    .catch((err) => {
      console.error(err)
    })

  fetch('../package.json')
    .then(response => response.json())
    .then((resp) => { appVer = resp.version })

  switchLang('en-US')
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

const onDialogClose = () => {
  if (skipCurrent.value) {
    window.store.set("targetVersion", updInfo.value.data.tag_name, false)
  }
  updDialogShow.value = false
}
</script>

<template id="app">
  <el-dialog v-if="updCheck" v-model="updDialogShow" :title="$t('updDialog_title')" width="40%" center
    :before-close="onDialogClose">
    <div style="padding-left: 20px; padding-right: 20px;">
      <div v-html="updDialogContent"></div>
      <div style="color: red; margin-top: 10px;">{{ $t('updDialog_version') }}v{{ appVer }} 👉 {{ updInfo.data.tag_name }}
      </div>
      <div style="color: red;">{{ $t('updDialog_size') }}{{ (updInfo.data.assets[0].size / 1024 / 1024).toFixed(1) }}MB
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
