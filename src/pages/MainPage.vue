<script setup lang="ts">
import { h, inject, onMounted, Ref, ref } from 'vue'
import {
  availableLangCodes,
  availableLangNames,
  translate,
  translateWithLocale,
} from '../i18n'
import { dialogComponent } from '../types/dialog/dialog'
import { useDialog } from '../utils/template-dialog'
import { useRouter } from 'vue-router'
import MySelect from '../components/MySelect.vue'
import { useStore } from '../store'

const store = useStore()

const router = useRouter()
const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

const transitionShow = ref(false)

const DEFAULT_BG = '../../src/assets/gsbanner.png'
const lang = ref(0)

onMounted(async () => {
  if (!localStorage.lang) {
    localStorage.lang = 'en_US'
    lang.value = 0
    useDialog(
      dialogComponent(store.settings.appearance.dialogStyle),
      {
        onOk(dispose: () => void) {
          if (lang.value !== 0) {
            localStorage.lang = availableLangCodes[lang.value]
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
        hScale: hScale,
        vScale: vScale,
      },
    )
  }

  setTimeout(() => {
    transitionShow.value = true
  }, 50)
})

const launch = async (game: 'gs' | 'sr' | 'hi3') => {
  let gameStore: any
  if (game === 'gs') {
    gameStore = store.game.gs
    if (gameStore.curAccountId != -1) {
      await window.reg.gsSet(
        JSON.stringify(gameStore.accounts[gameStore.curAccountId]),
      )
    }
  } else if (game === 'sr') {
    gameStore = store.game.sr
    if (gameStore.curAccountId != -1) {
      await window.reg.srSet(
        JSON.stringify(gameStore.accounts[gameStore.curAccountId]),
      )
    }
  } else {
    gameStore = store.game.hi3
  }

  await window.child.exec(gameStore.gamePath)
  if (store.settings.general.trayOnLaunch) {
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
        store.general.mainBgPath = resp
      }
    })
    .catch(error => {
      console.error('Error in showing dialog:', error)
    })
}

const resetPic = () => {
  store.general.mainBgPath = undefined
}
</script>

<template>
  <div class="content-wrapper" :class="{ from: !transitionShow }">
    <img
      class="bg-pic"
      :src="
        store.general.mainBgPath
          ? store.general.mainBgPath
          : '../../src/assets/gsbanner.png'
      "
      alt="Background image of Home page"
    />
    <div
      class="bottom-area"
      style="transform-origin: center bottom"
      :style="`transform: scale(min(${hScale}, ${vScale}, 1.5))`"
    >
      <h1 class="title-text font-gs" style="margin-bottom: 10px">
        {{ translate('mainpage_title') }}
      </h1>
      <button
        v-if="store.game.gs.gamePath"
        @click="launch('gs')"
        class="game-button"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_gsShort') }) }}
      </button>
      <button
        v-if="store.game.sr.gamePath"
        @click="launch('sr')"
        class="game-button"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_srShort') }) }}
      </button>
      <button
        v-if="store.game.hi3.gamePath"
        @click="launch('hi3')"
        class="game-button"
      >
        {{ translate('mainpage_buttonText', { game: $t('general_hi3Short') }) }}
      </button>
    </div>
    <div class="icon-button pt-2 left-8" @click="setPic">
      <i class="bi bi-image size-full" />
    </div>
    <div
      v-if="store.general.mainBgPath && store.general.mainBgPath !== DEFAULT_BG"
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
  height: calc(100vh - 56px);
  border-radius: 24px 24px 0 0;
  -webkit-mask: linear-gradient(white 30%, rgb(255 255 255 / 0.1));
}

.title-text {
  @apply text-5xl;
}

.bottom-area {
  @apply absolute bottom-0 w-full justify-center;
  height: 140px;
}

.game-button {
  @apply p-3 mx-2 my-2 rounded-lg;
  @apply font-bold text-xl bg-yellow-400 cursor-default;
  @apply hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;

  .dark & {
    @apply bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-500;
  }
}

.icon-button {
  @apply fixed bottom-4 w-10 h-10;
  @apply rounded-full bg-white;
  @apply hover:bg-gray-100 active:bg-gray-400 active:scale-90 transition-all;

  .dark & {
    @apply border border-gray-600;
    @apply bg-gray-800 hover:bg-gray-600 active:bg-gray-500;
  }
}
</style>
