<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import {
  availableLangCodes,
  availableLangNames,
  Lang,
  switchLang,
  translate,
  translateWithLocale,
} from '../../i18n'
import { useRouter } from 'vue-router'
import CustomSwitch from '../../components/CustomSwitch.vue'
import { UpdInfo } from '../../types/github/ghUpdInfo'
import {
  availableDialogStyleDescs,
  availableDialogStyles,
  dialogComponent,
  DialogStyle,
} from '../../types/dialog/dialog'
import { useDialog } from '../../utils/template-dialog'
import UpdateDialogContent from '../../components/UpdateDialogContent.vue'
import LoadingIcon from '../../components/LoadingIcon.vue'
import ScrollWrapper from '../../components/ScrollWrapper.vue'
import MySelect from '../../components/MySelect.vue'

const lang = ref<Lang>('en_US')
const selectedLangIdx = ref(0)
const dialogStyle = ref<DialogStyle>('gs')
const transitionShow = ref(false)
const bgPath = ref('')
const appVer = ref('')
const latest = ref(false)
const updInfo = ref<UpdInfo>({
  assets: [],
  assets_url: '',
  body: '',
  created_at: '',
  discussion_url: '',
  draft: false,
  html_url: '',
  id: 0,
  name: '',
  node_id: '',
  prerelease: false,
  published_at: '',
  tag_name: '',
  tarball_url: '',
  target_commitish: '',
  upload_url: '',
  url: '',
  zipball_url: '',
})
const checkUpdFailed = ref(false)
const updChecking = ref(false)
const quitOnClose = ref(true)
const trayOnLaunch = ref(true)
const gsCostume = ref(false)

const setLangIdx = () => {
  for (let i = 0; i < availableLangCodes.length; i++) {
    if (availableLangCodes[i] === lang.value) {
      selectedLangIdx.value = i
      break
    }
  }
}

onMounted(async () => {
  lang.value = localStorage.lang || 'en_US'
  setLangIdx()
  let a = await window.store.get('quitOnClose')
  if (a === undefined) {
    await window.store.set('quitOnClose', true, false)
    quitOnClose.value = true
  } else {
    quitOnClose.value = a
  }
  a = await window.store.get('trayOnLaunch')
  if (a === undefined) {
    await window.store.set('trayOnLaunch', true, false)
    trayOnLaunch.value = true
  } else {
    trayOnLaunch.value = a
  }
  bgPath.value = await window.store.get('mainBgPath')
  dialogStyle.value = await window.store.get('dialogStyle')
  transitionShow.value = true

  gsCostume.value = await window.store.get('gsCostume')

  // BUILD: '../../app.asar/package.json'
  // DEV: '../../package.json'
  fetch('../../app.asar/package.json')
    .then(response => response.json())
    .then(resp => {
      appVer.value = resp.version
    })
})

const router = useRouter()

const openLink = (url: string) => {
  window.electron.openExtLink(url)
}

const checkUpdates = () => {
  updChecking.value = true
  checkUpdFailed.value = false
  window.github
    .getLatestRelease()
    .then(resp => {
      if (needsUpdate(resp.data.tag_name)) {
        updInfo.value = resp.data
        useDialog(
          dialogComponent(dialogStyle.value),
          {
            onCancel(dispose: () => void) {
              dispose()
            },
            onOk(dispose: () => void) {
              window.electron.openExtLink(
                updInfo.value.assets[0].browser_download_url,
              )
              window.win.close()
              dispose()
            },
          },
          {
            title: translate('updDialog_title'),
            showCancel: true,
            vnode: h(UpdateDialogContent, {
              appVer: appVer.value,
              updInfo: updInfo.value,
              showSkipCurrent: false,
            }),
          },
        )
      } else {
        latest.value = true
      }
      updChecking.value = false
    })
    .catch((err: Error) => {
      checkUpdFailed.value = true
      updChecking.value = false
      console.error(err)
    })
}

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
  const curr = appVer.value
  console.log(latest)
  console.log(curr)

  return verCompare(latest, curr) > 0
}

const switchQuitAction = () => {
  quitOnClose.value = !quitOnClose.value
  window.store.set('quitOnClose', quitOnClose.value, false)
}

const switchLaunchTray = () => {
  window.store.set('trayOnLaunch', trayOnLaunch.value, false)
}

const switchGsCostume = () => {
  window.store.set('gsCostume', gsCostume.value, false)
}

const showLangDialog = (idx: number) => {
  lang.value = availableLangCodes[idx]
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      onCancel(dispose: () => void) {
        lang.value = localStorage.lang
        setLangIdx()
        dispose()
      },
      onOk(dispose: () => void) {
        switchLang(lang.value)
        window.store.delete('genshinInfo')
        window.store.delete('starRailInfo')
        router.go(0)
        dispose()
      },
    },
    {
      title: translate('settings_langChangeTitle'),
      showCancel: true,
      msg: translateWithLocale('settings_langChangeText', lang.value),
      // vnode: h(LangChangeDialogContent, {
      //     lang: lang.value
      // })
    },
  )
}

const showDialogStyleChange = () => {
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      async onCancel(dispose: () => void) {
        dialogStyle.value = await window.store.get('dialogStyle')
        dispose()
      },
      onOk(dispose: () => void) {
        window.store.set('dialogStyle', dialogStyle.value, false)
        dispose()
      },
    },
    {
      title: translate('settings_dialogStyleTitle', {
        game: translate('general_' + dialogStyle.value + 'Short'),
      }),
      showCancel: true,
      msg: translate('settings_dialogStyleText', {
        game: translate('general_' + dialogStyle.value),
      }),
    },
  )
}

const showClearDialog = () => {
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      onOk(dispose: () => void) {
        window.store.clear()
        localStorage.clear()
        router.go(0)
        dispose()
      },
    },
    {
      title: translate('settings_clearAllData'),
      msg: translate('settings_clearAllDataText'),
      showCancel: true,
    },
  )
}
</script>

<template>
  <div
    class="relative"
    :class="transitionShow ? '' : 'opacity-0 blur-lg scale-90'"
    style="transition-duration: 400ms"
  >
    <div class="bg-pic">
      <img
        class="object-cover w-full h-full blur-xl opacity-25 scale-105"
        :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      />
    </div>
    <ScrollWrapper height="91vh" class="scroll-wrapper absolute z-40">
      <div class="text-left px-10 pb-5 w-[52%]">
        <!-- GENERAL -->
        <div class="title">{{ $t('settings_general') }}</div>
        <div class="form-item">
          <div class="h-full py-1">{{ $t('settings_selectLang') }}</div>
          <MySelect
            v-model="selectedLangIdx"
            :items="availableLangNames"
            @change="showLangDialog"
          ></MySelect>
          <!--          <select-->
          <!--            name="language"-->
          <!--            @change="showLangDialog"-->
          <!--            v-model="lang"-->
          <!--            class="border-2 rounded-full py-1 px-2 ml-3 hover:bg-gray-100 transition-all"-->
          <!--          >-->
          <!--            <option-->
          <!--              v-for="(langCode, i) in availableLangCodes"-->
          <!--              :key="i"-->
          <!--              :value="langCode"-->
          <!--            >-->
          <!--              {{ availableLangNames[i] }}-->
          <!--            </option>-->
          <!--          </select>-->
        </div>
        <div class="form-item">
          <div class="h-full py-1">{{ $t('settings_whenClosingWindow') }}</div>
          <div
            class="ml-3 rounded-full flex flex-row py-1 w-64 bg-white relative cursor-pointer"
            @click="switchQuitAction"
          >
            <div
              class="rounded-full bg-blue-500 w-1/2 absolute top-0 bottom-0 z-0 transition-all"
              :class="quitOnClose ? 'left-0' : 'left-32'"
            ></div>
            <div
              class="rounded-full w-1/2 absolute z-10 left-0 text-center transition-all"
              :class="{ 'text-white': quitOnClose }"
            >
              {{ $t('settings_quitOnClose') }}
            </div>
            <div
              class="rounded-full w-1/2 absolute z-10 right-0 text-center transition-all"
              :class="{ 'text-white': !quitOnClose }"
            >
              {{ $t('settings_trayOnClose') }}
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="h-full py-1">{{ $t('settings_trayOnLaunch') }}</div>
          <CustomSwitch
            class="ml-3"
            v-model="trayOnLaunch"
            @change="switchLaunchTray"
          ></CustomSwitch>
        </div>
        <div class="form-item">
          <div
            class="hover:underline active:text-orange-300 text-blue-700 cursor-pointer"
            @click="showClearDialog"
          >
            {{ $t('settings_clearAllData') }}
          </div>
        </div>

        <!-- APPEARANCE -->
        <div class="title">{{ $t('settings_appearance') }}</div>
        <div class="form-item">
          <div class="h-full py-1">{{ $t('settings_dialogStyle') }}</div>
          <select
            name="dialogStyle"
            @change="showDialogStyleChange"
            v-model="dialogStyle"
            class="border-2 rounded-full py-1 px-2 ml-3 hover:bg-gray-100 transition-all"
          >
            <option
              v-for="(styleCode, i) in availableDialogStyles"
              :key="i"
              :value="styleCode"
            >
              {{ availableDialogStyleDescs[i] }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <div class="h-full py-1">{{ $t('settings_gsCostume') }}</div>
          <CustomSwitch
            class="ml-3"
            v-model="gsCostume"
            @change="switchGsCostume"
          ></CustomSwitch>
        </div>

        <!-- ABOUT -->
        <div class="title">{{ $t('settings_about') }}</div>
        <div
          class="form-item rounded-full bg-white pl-3 border border-red-400 font-mono"
          style="width: fit-content"
        >
          miHoYo miXeD Launcher
          <div
            class="rounded-full ml-2 px-2 bg-red-400 text-white font-sans cursor-default"
          >
            v{{ appVer }}
          </div>
        </div>
        <div class="form-item">
          <div class="flex flex-row">
            <img
              class="img-link cursor-pointer"
              src="../../assets/github-mark.png"
              @click="
                openLink(
                  'https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher',
                )
              "
            />
            <button
              @click="checkUpdates"
              class="rounded-full cursor-default ml-3 px-3"
              :class="latest ? 'button-disabled' : 'button-enabled'"
            >
              {{
                latest
                  ? $t('settings_latestVersion')
                  : $t('settings_checkUpdates')
              }}
            </button>
            <LoadingIcon v-if="updChecking" />
            <div class="text-red-600 ml-3 mt-1.5" v-if="checkUpdFailed">
              {{ $t('settings_checkUpdFailed') }}
            </div>
          </div>
        </div>
      </div>
    </ScrollWrapper>
  </div>
</template>

<style scoped>
.title {
  @apply text-4xl font-bold mt-8 cursor-default;
}

.form-item {
  @apply flex flex-row justify-between mt-4 ml-8 cursor-default;
}

.bg-pic {
  width: 98vw;
  height: 92vh;
  border-radius: 24px 24px 0 0;
  -webkit-mask: linear-gradient(white, white);
}

.scroll-wrapper {
  top: 0;
  left: 1vw;
  width: 96vw;
  border-radius: 5vh 5vh 0 0;
}

.img-link {
  @apply w-9 h-9 hover:opacity-70 active:scale-90 transition-all;
}

.button-enabled {
  @apply bg-white border border-gray-500 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all active:bg-blue-300;
}

.button-disabled {
  @apply opacity-70 bg-gray-100 border border-gray-300 text-gray-400 pointer-events-none cursor-not-allowed;
}
</style>
