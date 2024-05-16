<script setup lang="ts">
import { h, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UpdInfo } from './types/github/ghUpdInfo'
import { dialogComponent } from './types/dialog/dialog'
import { useDialog } from './utils/template-dialog'
import UpdateDialogContent from './components/UpdateDialogContent.vue'
import { translate } from './i18n'
import TopHeader from './components/TopHeader.vue'
import { useStore } from './store'

const store = useStore()

let appVer = ''
const updCheck = ref(false)
const updInfo = ref<UpdInfo>({
  assets: [],
  assets_url: '',
  author: undefined,
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
const rAF = window.requestAnimationFrame
// const rAFStop = window.cancelAnimationFrame
const gpType = ref('Xbox')
provide('gpType', gpType)

const hScale = ref(window.innerWidth / 1200)
const vScale = ref(window.innerHeight / 700)
const cardResizeCb = () => {
  hScale.value = window.innerWidth / 1200
  vScale.value = window.innerHeight / 700
}

provide('hScale', hScale)
provide('vScale', vScale)

const skipCurrent = ref(false)
const gamepad = ref(false)
const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
const router = useRouter()

let inThrottle = false
let rAFId: number | null = null
const waitMapInput = () => {
  var gamepads = navigator.getGamepads()
  if (!gamepads) return

  let gp: Gamepad | null = null

  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      gp = gamepads[i]
      break
    }
  }

  if (!gp) {
    return
  }
  if (!document.hasFocus()) {
    rAFId = rAF(waitMapInput)
    return
  }

  // Map: Enter Gamepad Mode
  if (gp.buttons[8].pressed) {
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => {
        let targetMode = store.settings.gamepad.defaultPS ? 'PS' : 'Xbox'
        console.log(store.settings.gamepad.defaultPS)
        if (gp.id.startsWith('DualSense') || gp.id.startsWith('DualShock')) {
          targetMode = 'PS'
        } else if (gp.id.startsWith('Xbox')) {
          targetMode = 'Xbox'
        }
        enterGamepad(targetMode)
        inThrottle = false
      }, 300)
    }
  }

  if (rAFId) {
    rAFId = rAF(waitMapInput)
  }
}

const enterGamepad = (gamepadType: string) => {
  rAFId = null
  gamepad.value = true
  gpType.value = gamepadType
  router.push('/gamepadPage')
}

const leaveGamepad = () => {
  gamepad.value = false
  rAFId = null
  router.push('/')

  const gamepads = navigator.getGamepads()
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i]
    if (gp) {
      rAFId = rAF(waitMapInput)
      break
    }
  }
}

provide('leaveGamepad', leaveGamepad)

onMounted(async () => {
  if (
    store.settings.appearance.colorTheme == 3 ||
    (store.settings.appearance.colorTheme == 2 && darkModePreference.matches)
  ) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }

  if (store.settings.appearance.colorTheme == 2) {
    darkModePreference.addEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    })
  }

  window.github
    .getLatestRelease()
    .then((resp: any) => {
      if (needsUpdate(resp.data.tag_name)) {
        const target = store.general.targetVersion
        if (!target || target < resp.data.tag_name) {
          updInfo.value = resp.data
          useDialog(
            dialogComponent(store.settings.appearance.dialogStyle),
            {
              onCancel(dispose: () => void) {
                if (skipCurrent.value) {
                  store.general.targetVersion = updInfo.value.tag_name
                }
                dispose()
              },
              onOk(dispose: () => void) {
                if (skipCurrent.value) {
                  return
                }
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
              vnode: () =>
                h(UpdateDialogContent, {
                  appVer: appVer,
                  updInfo: updInfo.value,
                  skipCurrent: skipCurrent.value,
                  'onUpdate:skipCurrent': (value: boolean) => {
                    skipCurrent.value = value
                  },
                  style: {
                    height: `calc(52vh / min(${hScale?.value}, ${vScale?.value}))`,
                  },
                  gameStyle: store.settings.appearance.dialogStyle,
                }),
            },
          )
        }
      }
      updCheck.value = true
    })
    .catch((err: Error) => {
      console.error(err)
    })

  const autoEnter = store.settings.gamepad.autoEnter
  if (autoEnter) {
    const gamepads = navigator.getGamepads()
    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i]
      if (gp) {
        let targetMode = store.settings.gamepad.defaultPS ? 'PS' : 'Xbox'
        console.log(store.settings.gamepad.defaultPS)
        if (gp.id.startsWith('DualSense') || gp.id.startsWith('DualShock')) {
          targetMode = 'PS'
        } else if (gp.id.startsWith('Xbox')) {
          targetMode = 'Xbox'
        }
        enterGamepad(targetMode)
        break
      }
    }
  } else {
    rAFId = rAF(waitMapInput)
  }

  fetch('../package.json')
    .then(response => response.json())
    .then(resp => {
      appVer = resp.version
    })

  window.visualViewport?.addEventListener('resize', cardResizeCb)

  window.addEventListener('gamepadconnected', e => {
    if (!store.settings.gamepad.autoEnter) {
      rAFId = rAF(waitMapInput)
      return
    }
    console.log('connected')
    const gp = (e as GamepadEvent).gamepad
    let targetMode = store.settings.gamepad.defaultPS ? 'PS' : 'Xbox'
    console.log(store.settings.gamepad.defaultPS)
    if (gp.id.startsWith('DualSense') || gp.id.startsWith('DualShock')) {
      targetMode = 'PS'
    } else if (gp.id.startsWith('Xbox')) {
      targetMode = 'Xbox'
    }
    enterGamepad(targetMode)
  })
  window.addEventListener('gamepaddisconnected', leaveGamepad)
})

onUnmounted(() => {
  window.visualViewport?.removeEventListener('resize', cardResizeCb)
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
</script>

<template id="app">
  <Transition name="swipe-top">
    <TopHeader v-if="!gamepad" />
  </Transition>
  <router-view></router-view>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.swipe-top-enter-from,
.swipe-top-leave-to {
  transform: translateY(-100%);
}

.swipe-top-enter-active {
  transition: transform 0.3s;
}
</style>
