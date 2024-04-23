<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue'

type Mode = 'main' | 'settings' | 'out'
const mode = ref<Mode>('main')

const bgPath = ref('')
const showSettings = ref(false)
const gsGamePath = ref('')
const srGamePath = ref('')
const hi3GamePath = ref('')

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')
const leaveGamepad = inject<() => void>('leaveGamepad')

const genshin = async () => {
  await window.child.exec(gsGamePath.value)
}

const starRail = async () => {
  await window.child.exec(srGamePath.value)
}

const honkai3 = async () => {
  await window.child.exec(hi3GamePath.value)
}

const rAF =
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame

let requestedAFNumber = -1

const rAFStop =
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.cancelAnimationFrame

let inThrottle = false
const gameLoop = () => {
  var gamepads = navigator.getGamepads()
  if (!gamepads) return

  const gp = gamepads[0]

  if (!gp || mode.value === 'out') {
    return
  }

  // -------- Button index test --------
  // for (let i = 0; i < gp.buttons.length; i++) {
  //   if (gp.buttons[i].pressed) {
  //     if (!inThrottle) {
  //       console.log(i)
  //       inThrottle = true
  //       setTimeout(() => {
  //         inThrottle = false
  //       }, 300)
  //     }
  //   }
  // }
  //
  // for (let i = 0; i < gp.axes.length; i++) {
  //   if (gp.axes[i] > 0.5) {
  //     console.log('+' + i)
  //   }
  //   if (gp.axes[i] < -0.5) {
  //     console.log('-' + i)
  //   }
  // }

  // Pause: Settings
  if (gp.buttons[9].pressed) {
    if (!inThrottle) {
      showSettings.value = !showSettings.value
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // Map: Quit Gamepad Mode
  if (gp.buttons[8].pressed) {
    if (!inThrottle) {
      mode.value = 'out'
      inThrottle = true
      setTimeout(() => {
        leaveGamepad()
        inThrottle = false
      }, 300)
    }
  }

  rAF(gameLoop)
}

onMounted(async () => {
  bgPath.value = await window.store.get('mainBgPath')
  gsGamePath.value = await window.store.get('gsGamePath')
  srGamePath.value = await window.store.get('srGamePath')
  hi3GamePath.value = await window.store.get('hi3GamePath')

  gameLoop()

  window.addEventListener('gamepaddisconnected', function () {
    rAFStop(requestedAFNumber)
  })
})
</script>

<template>
  <div class="bg-wrapper drag">
    <img
      class="bg-pic no-drag"
      :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      alt="Background image of Home page"
    />
    <div class="bottom-bar">
      <div class="left">aaa</div>
      <div class="right">bbb</div>
    </div>

    <div class="launch-area-wrapper">
      <h1 class="title-text font-gs" style="margin-bottom: 10px">
        {{ $t('mainpage_title') }}
      </h1>
      <button v-if="gsGamePath" @click="genshin" class="game-button">
        {{ $t('mainpage_buttonText', { game: $t('general_gsShort') }) }}
      </button>
      <button v-if="srGamePath" @click="starRail" class="game-button">
        {{ $t('mainpage_buttonText', { game: $t('general_srShort') }) }}
      </button>
      <button v-if="hi3GamePath" @click="honkai3" class="game-button">
        {{ $t('mainpage_buttonText', { game: $t('general_hi3Short') }) }}
      </button>
    </div>
  </div>

  <Transition name="settings" :duration="600">
    <div v-if="showSettings">
      <div class="outer settings-wrapper" @click="showSettings = false" />
      <div class="inner settings-content">
        <div
          class="settings-title"
          :style="`font-size: calc(30px * min(${hScale}, ${vScale}))`"
        >
          {{ $t('general_settings') }}
        </div>
        <div class="settings-card">aaa</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bg-wrapper {
  @apply absolute z-0 size-full;
}

.bg-pic {
  @apply object-cover;
  margin-top: 1vw;
  width: 98vw;
  height: calc(100vh - 1vw - 64px);
  border-radius: 24px;
}

.launch-area-wrapper {
  @apply absolute z-10 bottom-[70px] left-1/2 -translate-x-1/2;
  @apply backdrop-blur-2xl p-6 rounded-2xl;
  @apply text-nowrap;
  background: rgb(255 255 255 / 0.4);

  .dark & {
    background: rgb(0 0 0 / 0.4);
  }
}

.title-text {
  @apply text-5xl;
}

.game-button {
  @apply p-3 mx-2 mt-2 rounded-lg;
  @apply font-bold text-xl bg-yellow-400 cursor-default;
  @apply hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;

  .dark & {
    @apply bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-500;
  }
}

.bottom-bar {
  @apply flex flex-row justify-between align-middle;
  @apply w-[96vw] ml-[1vw] py-[6px];
  height: 64px;

  & .left {
    @apply flex flex-row justify-start;
  }

  & .right {
    @apply flex flex-row justify-end;
  }
}

.settings-wrapper {
  @apply absolute z-40 size-full right-0;
  @apply backdrop-blur-3xl;
  background: rgb(255 255 255 / 50%);

  .dark & {
    background: rgb(0 0 0 / 50%);
  }
}

.settings-content {
  @apply absolute z-50 h-full top-[3vh] right-[3vw] rounded-lg;
  width: 30vw;
}

.settings-title {
  @apply w-full text-right font-bold;
  @apply pb-5;
}

.settings-card {
  @apply bg-white;
  @apply rounded-lg p-4 w-full;

  .dark & {
    @apply bg-[#222];
  }
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.settings-enter-active .outer {
  transition: opacity 0.5s ease;
}

.settings-leave-active .outer {
  transition: opacity 0.5s ease;
  transition-delay: 0.1s;
}

.settings-enter-from .outer,
.settings-leave-to .outer {
  opacity: 0;
}

.settings-enter-active .inner {
  transition: all 0.3s ease;
  transition-delay: 0.2s;
}

.settings-leave-active .inner {
  transition: all 0.3s ease;
}

.settings-enter-from .inner,
.settings-leave-to .inner {
  opacity: 0;
  transform: translateX(100%);
}
</style>
