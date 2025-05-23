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
import GamepadIcon from '../../components/GamepadIcon.vue'
import MyTooltip from '../../components/MyTooltip.vue'
import { useStore } from '../../store'
import { UpdInfo } from '../../types/upd/updates'

const store = useStore()
const lang = ref<Lang>('en_US')
const dialogStyle = ref<DialogStyle>('gs')
const selectedLangIdx = ref(0)
const selectedDialogStyleIdx = ref(0)
const transitionShow = ref(false)
const appVer = ref('')
const latest = ref(false)
const skipCurrent = ref(false)
const checkUpdFailed = ref(false)
const updChecking = ref(false)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

onMounted(() => {
  lang.value = localStorage.lang || 'en_US'
  dialogStyle.value = store.settings.appearance.dialogStyle
  selectedLangIdx.value = availableLangCodes.indexOf(lang.value)
  selectedDialogStyleIdx.value = availableDialogStyles.indexOf(
    store.settings.appearance.dialogStyle,
  )
  transitionShow.value = true

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
  window.axios
    .get(
      'https://gitee.com/HoraceHuang-ui/mixed-info-repo/raw/master/latestUpd.json',
    )
    .then((resp: UpdInfo) => {
      if (needsUpdate(resp.version)) {
        useDialog(
          dialogComponent(store.settings.appearance.dialogStyle),
          {
            onCancel(dispose: () => void) {
              if (skipCurrent.value) {
                store.general.targetVersion = resp.version
              }
              dispose()
            },
            onOk(dispose: () => void) {
              if (skipCurrent.value) {
                return
              }
              window.electron.openExtLink(resp.dlUrl)
              window.win.close()
              dispose()
            },
          },
          {
            title: translate('updDialog_title'),
            showCancel: true,
            styleType: 'normal',
            vnode: () =>
              h(UpdateDialogContent, {
                appVer: appVer.value,
                updInfo: resp,
                gameStyle: store.settings.appearance.dialogStyle,
                style: {
                  height: `calc(52vh / min(${hScale?.value}, ${vScale?.value}))`,
                },
                skipCurrent: skipCurrent.value,
                'onUpdate:skipCurrent': (value: boolean) => {
                  skipCurrent.value = value
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
  console.log(latestStr)
  console.log(appVer.value)

  return verCompare(latestStr, appVer.value) > 0
}

const colorThemeChange = () => {
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')

  if (store.settings.appearance.colorTheme == 1) {
    document.body.classList.remove('dark')

    darkModePreference.removeEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    })
  } else if (store.settings.appearance.colorTheme == 3) {
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
    dialogComponent(store.settings.appearance.dialogStyle),
    {
      onCancel(dispose: () => void) {
        lang.value = localStorage.lang
        selectedLangIdx.value = availableLangCodes.indexOf(lang.value)
        dispose()
      },
      onOk(dispose: () => void) {
        switchLang(lang.value)
        store.game.gs.playerInfo = undefined
        store.game.sr.playerInfo = undefined
        store.game.zzz.playerInfo = undefined
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
  const original = store.settings.appearance.dialogStyle
  useDialog(
    dialogComponent(dialogStyle.value),
    {
      onCancel(dispose: () => void) {
        selectedDialogStyleIdx.value = availableDialogStyles.indexOf(original)
        dialogStyle.value = original
        dispose()
      },
      onOk(dispose: () => void) {
        store.settings.appearance.dialogStyle = dialogStyle.value
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
    dialogComponent(store.settings.appearance.dialogStyle),
    {
      onOk(dispose: () => void) {
        store.clear()
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
      <img
        :src="
          store.general.mainBgPath
            ? store.general.mainBgPath
            : '../../src/assets/gsbanner.png'
        "
      />
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
            v-model="store.settings.general.quitOnClose"
            class="bg-white my-[1px] dark:bg-[#222]"
            :left-text="$t('settings_trayOnClose')"
            :right-text="$t('settings_quitOnClose')"
          />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_trayOnLaunch') }}</div>
          <CustomSwitch
            v-model="store.settings.general.trayOnLaunch"
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
          <MyGroupButtons
            v-model="store.settings.appearance.colorTheme"
            @change="colorThemeChange"
          >
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
            middle
            selector-class="border-2 bg-white py-1 px-2 hover:bg-gray-100 dark:border-[#333] dark:bg-[#222] dark:hover:bg-[#333] transition-all"
            @change="showDialogStyleChange"
          />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('settings_gsCostume') }}</div>
          <CustomSwitch v-model="store.settings.appearance.gsCostume" />
        </div>

        <!-- GAMEPAD -->
        <div class="title font-gs">{{ $t('gamepad_init') }}</div>
        <div class="form-item hover">
          <div class="flex flex-row">
            <div class="form-item-text mr-2">
              {{ $t('gamepad_autoEnterGamepad') }}
            </div>
            <MyTooltip max-width="300px" middle placement="bottom">
              <template #content>
                <ul
                  style="
                    list-style-type: disc;
                    padding-left: 20px;
                    list-style-position: outside;
                  "
                >
                  <li>
                    <span>{{ $t('gamepad_autoEnterTip1_1') }}</span>
                    <GamepadIcon
                      icon="Map"
                      style="
                        height: 20px;
                        padding: 0 4px 0 4px;
                        display: inline;
                      "
                    />
                    <span>{{ $t('gamepad_autoEnterTip1_2') }}</span>
                  </li>
                  <li>{{ $t('gamepad_autoEnterTip2') }}</li>
                  <li>{{ $t('gamepad_autoEnterTip3') }}</li>
                </ul>
              </template>
              <div class="flex flex-row">
                <div class="help">?</div>
              </div>
            </MyTooltip>
          </div>
          <CustomSwitch v-model="store.settings.gamepad.autoEnter" />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('gamepad_disableMouse') }}</div>
          <CustomSwitch v-model="store.settings.gamepad.disableMouse" />
        </div>
        <div class="form-item hover">
          <div class="form-item-text">{{ $t('gamepad_showToolbar') }}</div>
          <CustomSwitch v-model="store.settings.gamepad.showToolbar" />
        </div>
        <div class="form-item hover">
          <div class="flex flex-row">
            <div class="form-item-text mr-2">
              {{ $t('gamepad_defaultType') }}
            </div>
            <MyTooltip
              max-width="300px"
              middle
              placement="bottom"
              :content="$t('gamepad_defaultTypeTip')"
            >
              <div class="flex flex-row">
                <div class="help">?</div>
              </div>
            </MyTooltip>
          </div>
          <MyTextSwitch
            class="bg-white my-[2px] dark:bg-[#222]"
            right-text="PS"
            left-text="Xbox"
            v-model="store.settings.gamepad.defaultPS"
          />
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

.help {
  @apply mt-[6px] w-5 h-5 rounded-full;
  @apply text-center font-bold text-sm;
  @apply bg-gray-400 text-white cursor-help;
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
