<script setup lang="ts">
import { h, inject, onMounted, ref, Ref } from 'vue'
import {
  availableLangCodes,
  availableLangNames,
  Lang,
  switchLang,
  translate,
  translateWithLocale,
} from '../../i18n'
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
import MyTextSwitch from '../../components/MyTextSwitch.vue'
import MyLink from '../../components/MyLink.vue'
import MyGroupButtons from '../../components/MyGroupButtons.vue'

const lang = ref<Lang>('en_US')
const selectedLangIdx = ref(0)
const dialogStyle = ref<DialogStyle>('gs')
const selectedDialogStyleIdx = ref(0)
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
const colorTheme = ref(2)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

onMounted(async () => {
  lang.value = localStorage.lang || 'en_US'
  colorTheme.value = await window.store.get('colorTheme')
  selectedLangIdx.value = availableLangCodes.indexOf(lang.value)
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
  selectedDialogStyleIdx.value = availableDialogStyles.indexOf(
    dialogStyle.value,
  )
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
              gameStyle: dialogStyle.value,
              style: {
                height: `calc(50vh / min(${hScale?.value}, ${vScale?.value}))`,
              },
            }),
            hScale: hScale,
            vScale: vScale,
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
  window.store.set('quitOnClose', quitOnClose.value, false)
}

const switchLaunchTray = () => {
  window.store.set('trayOnLaunch', trayOnLaunch.value, false)
}

const switchGsCostume = () => {
  window.store.set('gsCostume', gsCostume.value, false)
}

const colorThemeChange = () => {
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')

  window.store.set('colorTheme', colorTheme.value, false)
  if (colorTheme.value == 1) {
    document.body.classList.remove('dark')

    darkModePreference.removeEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    })
  } else if (colorTheme.value == 3) {
    document.body.classList.add('dark')

    darkModePreference.removeEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    })
  } else {
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark')

    darkModePreference.addEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    })
  }
}

const showLangDialog = (idx: number) => {
  lang.value = availableLangCodes[idx]
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      onCancel(dispose: () => void) {
        lang.value = localStorage.lang
        selectedLangIdx.value = availableLangCodes.indexOf(lang.value)
        dispose()
      },
      onOk(dispose: () => void) {
        switchLang(lang.value)
        window.store.delete('gsInfo')
        window.store.delete('srInfo')
        window.win.relaunch()
        dispose()
      },
    },
    {
      title: translate('settings_langChangeTitle'),
      showCancel: true,
      msg: translateWithLocale('settings_langChangeText', lang.value),
      hScale: hScale,
      vScale: vScale,
    },
  )
}

const showDialogStyleChange = () => {
  dialogStyle.value = availableDialogStyles[selectedDialogStyleIdx.value]
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      async onCancel(dispose: () => void) {
        dialogStyle.value = await window.store.get('dialogStyle')
        selectedDialogStyleIdx.value = availableDialogStyles.indexOf(
          dialogStyle.value,
        )
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
      hScale: hScale,
      vScale: vScale,
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
        window.win.relaunch()
        dispose()
      },
    },
    {
      title: translate('settings_clearAllData'),
      msg: translate('settings_clearAllDataText'),
      showCancel: true,
      hScale: hScale,
      vScale: vScale,
    },
  )
}
</script>

<template>
  <div class="page-wrapper" :class="{ from: !transitionShow }">
    <div class="bg-pic-wrapper">
      <img :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'" />
    </div>
    <ScrollWrapper height="91vh" class="scroll-wrapper">
      <div class="scroll-content-wrapper">
        <!-- GENERAL -->
        <div class="title font-gs">{{ $t('settings_general') }}</div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_selectLang') }}</div>
          <MySelect
            v-model="selectedLangIdx"
            :items="availableLangNames"
            @change="showLangDialog"
            middle
            selector-class="border-2 bg-white py-1 px-2 hover:bg-gray-100 dark:border-[#333] dark:bg-[#222] dark:hover:bg-[#333] transition-all"
          />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">
            {{ $t('settings_whenClosingWindow') }}
          </div>
          <MyTextSwitch
            v-model="quitOnClose"
            :right-text="$t('settings_trayOnClose')"
            :left-text="$t('settings_quitOnClose')"
            @change="switchQuitAction"
          />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_trayOnLaunch') }}</div>
          <CustomSwitch
            v-model="trayOnLaunch"
            @change="switchLaunchTray"
          ></CustomSwitch>
        </div>
        <div class="form-item">
          <MyLink @click="showClearDialog">
            {{ $t('settings_clearAllData') }}
          </MyLink>
        </div>

        <!-- APPEARANCE -->
        <div class="title font-gs">{{ $t('settings_appearance') }}</div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_colorTheme') }}</div>
          <MyGroupButtons v-model="colorTheme" @change="colorThemeChange">
            <template #left>
              <i class="bi bi-sun" />
            </template>
            <template #mid>
              <div>A</div>
            </template>
            <template #right>
              <i class="bi bi-moon-stars" />
            </template>
          </MyGroupButtons>
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_dialogStyle') }}</div>
          <MySelect
            v-model="selectedDialogStyleIdx"
            :items="availableDialogStyleDescs"
            @change="showDialogStyleChange"
            middle
            selector-class="border-2 bg-white py-1 px-2 hover:bg-gray-100 dark:border-[#333] dark:bg-[#222] dark:hover:bg-[#333] transition-all"
          />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_gsCostume') }}</div>
          <CustomSwitch v-model="gsCostume" @change="switchGsCostume" />
        </div>

        <!-- ABOUT -->
        <div class="title font-gs">{{ $t('settings_about') }}</div>
        <div class="form-item version-area-wrapper">
          miHoYo miXeD Launcher
          <div class="version">v{{ appVer }}</div>
        </div>
        <div class="form-item non-padding">
          <div class="flex flex-row">
            <img
              class="img-link"
              src="../../assets/github-mark.png"
              @click="
                openLink(
                  'https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher',
                )
              "
            />
            <button
              @click="checkUpdates"
              class="update-button"
              :class="latest ? 'disabled' : 'enabled'"
            >
              {{
                latest
                  ? $t('settings_latestVersion')
                  : $t('settings_checkUpdates')
              }}
            </button>
            <LoadingIcon v-if="updChecking" />
            <div class="update-failed-text" v-if="checkUpdFailed">
              {{ $t('settings_checkUpdFailed') }}
            </div>
          </div>
        </div>
      </div>
    </ScrollWrapper>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  @apply relative;
  transition-duration: 400ms;

  &.from {
    @apply opacity-0 blur-lg scale-90;
  }
}

.bg-pic-wrapper {
  width: 98vw;
  border-radius: 24px 24px 0 0;
  height: calc(100vh - 56px);
  -webkit-mask: linear-gradient(white, white);

  img {
    @apply size-full object-cover;
    @apply blur-xl opacity-25 scale-105;
  }
}

.scroll-wrapper {
  @apply absolute z-40 top-0 left-[1vw];
}

.scroll-content-wrapper {
  @apply text-left px-10 pb-5 w-[95%];
}

.title {
  @apply text-4xl font-bold mt-8 mb-4 cursor-default;

  .dark & {
    @apply text-[#eee];
  }
}

.form-item {
  @apply flex flex-row justify-between;
  @apply ml-4 pl-5 p-1.5;
  @apply cursor-default rounded-full transition-all;

  &.hover {
    &:hover {
      @apply bg-[#bbb] bg-opacity-30;

      .dark & {
        @apply bg-[#222] bg-opacity-30;
      }
    }
  }

  &.non-padding {
    @apply px-0;
  }
}

.form-item-text {
  @apply h-full py-1;

  .dark & {
    @apply text-[#eee];
  }
}

.version-area-wrapper {
  @apply w-fit pl-3 rounded-full;
  @apply bg-white border border-red-400 font-mono;

  .dark & {
    @apply bg-[#222] border border-red-900;
  }
}

.version {
  @apply ml-2 px-2 rounded-full;
  @apply bg-red-400 text-white font-sans cursor-default;

  .dark & {
    @apply bg-red-900;
  }
}

.img-link {
  @apply w-9 h-9;
  @apply hover:opacity-70 active:scale-90 transition-all cursor-pointer;

  .dark & {
    @apply invert;
  }
}

.update-button {
  @apply ml-3 px-3 rounded-full cursor-default;

  &.enabled {
    @apply bg-white border border-gray-500 text-gray-600 transition-all;
    @apply hover:border-blue-500 hover:text-blue-600 hover:bg-blue-100;
    @apply active:bg-blue-300;

    .dark & {
      @apply bg-[#222] text-[#ccc];
      @apply hover:bg-blue-900 hover:text-blue-300 active:bg-blue-700;
    }
  }
  &.disabled {
    @apply opacity-70 bg-gray-100 border border-gray-300 text-gray-400;
    @apply pointer-events-none cursor-not-allowed;

    .dark & {
      @apply opacity-90 bg-[#555] border border-gray-500 text-gray-400;
    }
  }
}

.update-failed-text {
  @apply text-red-600 ml-3 mt-1.5;

  .dark & {
    @apply text-red-300;
  }
}
</style>
