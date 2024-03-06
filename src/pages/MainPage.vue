<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import {
  availableLangCodes,
  availableLangNames,
  lang,
  str2Lang,
  translate,
} from '../i18n'
import { dialogComponent, DialogStyle } from '../types/dialog/dialog'
import { useDialog } from '../utils/template-dialog'
import { useRouter } from 'vue-router'

const router = useRouter()

const gsGamePath = ref('')
const srGamePath = ref('')
const hi3GamePath = ref('')
const transitionShow = ref(false)
const bgPath = ref('')

const dialogStyle = ref<DialogStyle>('gs')

const DEFAULT_BG = '../../src/assets/gsbanner.png'
const lang = ref<lang | null>(null)

onMounted(async () => {
  gsGamePath.value = await window.store.get('gsGamePath')
  srGamePath.value = await window.store.get('srGamePath')
  hi3GamePath.value = await window.store.get('hi3GamePath')
  bgPath.value = await window.store.get('mainBgPath')
  transitionShow.value = true

  window.store.get('dialogStyle').then((style: DialogStyle) => {
    if (!style) {
      window.store.set('dialogStyle', 'gs', false)
    }
    dialogStyle.value = style

    lang.value = str2Lang(localStorage.getItem('lang'))
    if (!lang.value) {
      localStorage.setItem('lang', 'en_US')
      lang.value = 'en_US'
      useDialog(
        dialogComponent(dialogStyle.value),
        {
          onOk(dispose: () => void) {
            if (lang.value !== 'en_US') {
              router.go(0)
            }
            dispose()
          },
          onCancel(dispose: () => void) {
            if (lang.value !== 'en_US') {
              router.go(0)
            }
            dispose()
          },
        },
        {
          title: translate('general_welcomeTitle'),
          msg: translate('general_langText'),
          vnode: h(
            'div',
            {
              style: {
                display: 'flex',
                'flex-direction': 'row',
                'justify-content': 'center',
                width: '100%',
              },
            },
            h(
              'select',
              {
                style: {
                  'border-width': '1px',
                  'border-color': '#CEA652',
                  'border-radius': '9999px',
                  'margin-top': '0.5rem',
                  padding: '0.25rem 0.5rem',
                  transition: 'all 0.2s',
                  color: '#886a32',
                  'background-color': '#ECE5D8',
                },
                onChange: (e: Event) => {
                  const target = e.target as HTMLSelectElement
                  localStorage.setItem('lang', target.value)
                  lang.value = str2Lang(target.value)
                },
              },
              availableLangCodes.map((langCode, i) => {
                return h(
                  'option',
                  {
                    style: {
                      'border-width': '1px',
                      'border-color': '#000000',
                      color: '#000000',
                      'background-color': '#ffffff',
                    },
                    value: langCode,
                  },
                  availableLangNames[i],
                )
              }),
            ),
          ),
        },
      )
    }
  })
})

const genshin = async () => {
  await window.child.exec(gsGamePath.value)
  const trayOnLaunch = await window.store.get('trayOnLaunch')
  if (trayOnLaunch) {
    await window.win.tray()
  }
}

const starRail = async () => {
  await window.child.exec(srGamePath.value)
  const trayOnLaunch = await window.store.get('trayOnLaunch')
  if (trayOnLaunch) {
    await window.win.tray()
  }
}

const honkai3 = async () => {
  await window.child.exec(hi3GamePath.value)
  const trayOnLaunch = await window.store.get('trayOnLaunch')
  if (trayOnLaunch) {
    await window.win.tray()
  }
}

const setPic = () => {
  window.dialog
    .showAndCopy({
      title: translate('mainBgDialog_title'),
      properties: ['openFile'],
      filters: [
        {
          name: translate('mainBgDialog_filter'),
          extensions: ['jpg', 'png', 'webp'],
        },
      ],
    })
    .then(resp => {
      if (resp) {
        bgPath.value = resp
        window.store.set('mainBgPath', bgPath.value, false)
      }
    })
    .catch(error => {
      console.error('Error in showing dialog:', error)
    })
}

const resetPic = () => {
  bgPath.value = DEFAULT_BG
  window.store.delete('mainBgPath')
}
</script>

<template>
  <div
    :class="transitionShow ? '' : 'opacity-0 blur-lg scale-90'"
    style="transition-duration: 400ms"
  >
    <img
      class="bg-pic object-cover"
      :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      alt="Background image of Home page"
    />
    <div class="bottom-area absolute justify-center w-full">
      <h1 class="text-5xl font-gs" style="margin-bottom: 10px">
        {{ translate('mainpage_title') }}
      </h1>
      <button
        v-if="gsGamePath"
        @click="genshin"
        class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_gsShort') }) }}
      </button>
      <button
        v-if="srGamePath"
        @click="starRail"
        class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_srShort') }) }}
      </button>
      <button
        v-if="hi3GamePath"
        @click="honkai3"
        class="p-3 mx-2 my-2 font-bold text-xl transition-all bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 cursor-default"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_hi3Short') }) }}
      </button>
    </div>
    <div
      class="rounded-full fixed left-8 bottom-4 w-10 h-10 bg-white pt-2 hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all"
      @click="setPic"
    >
      <i class="bi bi-image h-full w-full" />
    </div>
    <div
      v-if="bgPath && bgPath !== DEFAULT_BG"
      class="rounded-full fixed left-20 bottom-4 w-10 h-10 bg-white pt-1.5 hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all"
      @click="resetPic"
    >
      <i class="text-lg bi bi-arrow-clockwise h-full w-full" />
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-pic {
  width: 98vw;
  height: 92vh;
  border-radius: 24px 24px 0 0;
  -webkit-mask: linear-gradient(white 30%, rgb(255 255 255 / 0.1));
}

.bottom-area {
  @apply bottom-0;
  height: 20vh;
}

.lang-select {
  @apply border-2 rounded-full py-1 px-2 ml-3 hover:bg-gray-100 transition-all;
}
</style>
