<script setup lang="ts">
import { h, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UpdInfo } from './types/github/ghUpdInfo'
import { dialogComponent, DialogStyle } from './types/dialog/dialog'
import { useDialog } from './utils/template-dialog'
import UpdateDialogContent from './components/UpdateDialogContent.vue'
import { translate } from './i18n'
import TopHeader from './components/TopHeader.vue'

let appVer = ''
const dialogStyle = ref<DialogStyle>('gs')
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
const rAF =
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame
const rAFStop =
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.cancelAnimationFrame

const hScale = ref(window.innerWidth / 1200)
const vScale = ref(window.innerHeight / 700)
const cardResizeCb = () => {
  hScale.value = window.innerWidth / 1200
  vScale.value = window.innerHeight / 700
}

provide('hScale', hScale)
provide('vScale', vScale)

const skipCurrent = ref(false)
const colorTheme = ref(2)
const gamepad = ref(false)
const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
const router = useRouter()

let inThrottle = false
const waitMapInput = () => {
  var gamepads = navigator.getGamepads()
  if (!gamepads) return

  const gp = gamepads[0]

  if (!gp) {
    return
  }

  // Map: Enter Gamepad Mode
  if (gp.buttons[8].pressed) {
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => {
        enterGamepad()
        inThrottle = false
      }, 300)
    }
  }

  rAF(waitMapInput)
}

const enterGamepad = () => {
  gamepad.value = true
  rAFStop(waitMapInput)
  router.push('/gamepadPage')
}

const leaveGamepad = () => {
  gamepad.value = false
  router.push('/')

  const gamepads = navigator.getGamepads()
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i]
    if (gp) {
      rAF(waitMapInput)
      break
    }
  }
}

provide('leaveGamepad', leaveGamepad)

onMounted(() => {
  window.store.get('colorTheme').then((theme: number) => {
    if (!theme) {
      window.store.set('colorTheme', 2, false)
    } else {
      colorTheme.value = theme
    }

    if (
      colorTheme.value == 3 ||
      (colorTheme.value == 2 && darkModePreference.matches)
    ) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    if (colorTheme.value == 2) {
      darkModePreference.addEventListener('change', e => {
        if (e.matches) {
          document.body.classList.add('dark')
        } else {
          document.body.classList.remove('dark')
        }
      })
    }
  })

  window.github
    .getLatestRelease()
    .then((resp: any) => {
      if (needsUpdate(resp.data.tag_name)) {
        window.store.get('targetVersion').then((target: any) => {
          console.log(target)
          if (!target || target < resp.data.tag_name) {
            updInfo.value = resp.data
            useDialog(
              dialogComponent(dialogStyle.value),
              {
                onCancel(dispose: () => void) {
                  if (skipCurrent.value) {
                    window.store.set(
                      'targetVersion',
                      updInfo.value.tag_name,
                      false,
                    )
                  }
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
                  appVer: appVer,
                  updInfo: updInfo.value,
                  skipCurrent: skipCurrent.value,
                  'onUpdate:skipCurrent': (value: boolean) => {
                    skipCurrent.value = value
                  },
                  gameStyle: dialogStyle.value,
                }),
              },
            )
          }
        })
      }
      updCheck.value = true
    })
    .catch((err: Error) => {
      console.error(err)
    })

  window.store.get('dialogStyle').then((style: DialogStyle) => {
    if (!style) {
      window.store.set('dialogStyle', 'gs', false)
    }
    dialogStyle.value = style
  })

  fetch('../package.json')
    .then(response => response.json())
    .then(resp => {
      appVer = resp.version
    })

  window.visualViewport?.addEventListener('resize', cardResizeCb)

  const gamepads = navigator.getGamepads()
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i]
    if (gp) {
      enterGamepad()
      break
    }
  }

  window.addEventListener('gamepadconnected', enterGamepad)
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
