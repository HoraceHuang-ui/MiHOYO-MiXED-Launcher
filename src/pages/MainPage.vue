<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import {
  availableLangCodes,
  availableLangNames,
  str2Lang,
  translate,
  translateWithLocale,
} from '../i18n'
import { dialogComponent, DialogStyle } from '../types/dialog/dialog'
import { useDialog } from '../utils/template-dialog'
import { useRouter } from 'vue-router'
import MySelect from '../components/MySelect.vue'

const router = useRouter()

const gsGamePath = ref('')
const srGamePath = ref('')
const hi3GamePath = ref('')
const transitionShow = ref(false)
const bgPath = ref('')

const dialogStyle = ref<DialogStyle>('gs')

const DEFAULT_BG = '../../src/assets/gsbanner.png'
const lang = ref(0)

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

    const langCode = str2Lang(localStorage.getItem('lang'))
    if (!langCode) {
      localStorage.setItem('lang', 'en_US')
      lang.value = 0
      useDialog(
        dialogComponent(dialogStyle.value),
        {
          onOk(dispose: () => void) {
            if (lang.value !== 0) {
              localStorage.setItem('lang', availableLangCodes[lang.value])
              router.go(0)
            }
            dispose()
          },
          onCancel(dispose: () => void) {
            lang.value = 0
            dispose()
          },
        },
        {
          title: () =>
            translateWithLocale(
              'general_welcomeTitle',
              availableLangCodes[lang.value],
            ),
          msg: () =>
            translateWithLocale(
              'general_langText',
              availableLangCodes[lang.value],
            ),
          vnode: () =>
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  'flex-direction': 'row',
                  'justify-content': 'center',
                  width: '100%',
                },
              },
              h(MySelect, {
                selectorStyle: {
                  'border-width': '1px',
                  'border-color': '#CEA652',
                  'border-radius': '9999px',
                  'margin-top': '0.5rem',
                  padding: '0.25rem 0.5rem',
                  transition: 'all 0.2s',
                  color: '#886a32',
                  'background-color': '#ECE5D8',
                },
                items: availableLangNames,
                modelValue: lang.value,
                middle: true,
                onChange: (idx: number) => {
                  lang.value = idx
                },
              }),
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
  <div class="content-wrapper" :class="{ from: !transitionShow }">
    <img
      class="bg-pic"
      :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      alt="Background image of Home page"
    />
    <div class="bottom-area">
      <h1 class="title-text font-gs" style="margin-bottom: 10px">
        {{ translate('mainpage_title') }}
      </h1>
      <button v-if="gsGamePath" @click="genshin" class="game-button">
        {{ translate('mainpage_buttonText', { game: $t('general_gsShort') }) }}
      </button>
      <button v-if="srGamePath" @click="starRail" class="game-button">
        {{ translate('mainpage_buttonText', { game: $t('general_srShort') }) }}
      </button>
      <button v-if="hi3GamePath" @click="honkai3" class="game-button">
        {{ translate('mainpage_buttonText', { game: $t('general_hi3Short') }) }}
      </button>
    </div>
    <div class="icon-button pt-2 left-8" @click="setPic">
      <i class="bi bi-image size-full" />
    </div>
    <div
      v-if="bgPath && bgPath !== DEFAULT_BG"
      class="icon-button pt-1.5 left-20"
      @click="resetPic"
    >
      <i class="text-lg bi bi-arrow-clockwise size-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  transition-duration: 400ms;

  &.from {
    @apply opacity-0 blur-lg scale-90;
  }
}

.bg-pic {
  @apply object-cover;
  width: 98vw;
  height: 92vh;
  border-radius: 24px 24px 0 0;
  -webkit-mask: linear-gradient(white 30%, rgb(255 255 255 / 0.1));
}

.title-text {
  @apply text-5xl;
}

.bottom-area {
  @apply absolute bottom-0 w-full justify-center;
  height: 20vh;
}

.game-button {
  @apply p-3 mx-2 my-2;
  @apply font-bold text-xl bg-yellow-400 cursor-default;
  @apply hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;
}

.icon-button {
  @apply fixed bottom-4 w-10 h-10;
  @apply rounded-full bg-white;
  @apply hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all;
}

.lang-select {
  @apply border-2 rounded-full py-1 px-2 ml-3 hover:bg-gray-100 transition-all;
}
</style>
