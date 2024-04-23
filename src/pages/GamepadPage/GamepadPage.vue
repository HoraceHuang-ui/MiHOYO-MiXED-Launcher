<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue'
import GamepadIcon from '../../components/GamepadIcon.vue'

type Mode = 'main' | 'settings' | 'window-action' | 'out'
type GamePath = {
  game: string
  path: string
}
const mode = ref<Mode>('main')
const games = ['gs', 'sr', 'hi3']
const importedGames = ref<GamePath[]>([])

const bgPath = ref('')

const selectedGameIndex = ref(0)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')
const leaveGamepad = inject<() => void>('leaveGamepad')

const leaveGamepadClick = () => {
  mode.value = 'out'
  leaveGamepad()
}

const launch = async (path: string) => {
  await window.child.exec(path)
}

const winClose = async () => {
  const quitOnClose = await window.store.get('quitOnClose')
  if (quitOnClose) {
    await window.win.close()
  } else {
    await window.win.tray()
  }
}
const winMin = () => {
  window.win.min()
}
const winMax = () => {
  window.win.max()
}

const rAF =
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame

const rAFStop =
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.cancelAnimationFrame

let inThrottle = false
const gameLoop = () => {
  const gamepads = navigator.getGamepads()
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

  // Menu: Settings
  if (gp.buttons[9].pressed) {
    if (!inThrottle) {
      if (mode.value !== 'settings') {
        mode.value = 'settings'
      } else if (mode.value === 'settings') {
        mode.value = 'main'
      }
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] Map: Quit Gamepad Mode
  if (mode.value === 'main' && gp.buttons[8].pressed) {
    if (!inThrottle) {
      mode.value = 'out'
      inThrottle = true
      setTimeout(() => {
        leaveGamepad()
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] L Axis / ARROW: Select Game
  if (mode.value === 'main' && (gp.axes[0] < -0.5 || gp.buttons[14].pressed)) {
    if (!inThrottle) {
      selectedGameIndex.value =
        selectedGameIndex.value === 0
          ? importedGames.value.length - 1
          : selectedGameIndex.value - 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }
  if (mode.value === 'main' && (gp.axes[0] > 0.5 || gp.buttons[15].pressed)) {
    if (!inThrottle) {
      selectedGameIndex.value =
        selectedGameIndex.value === importedGames.value.length - 1
          ? 0
          : selectedGameIndex.value + 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] A: Launch Game
  if (mode.value === 'main' && gp.buttons[0].pressed) {
    if (!inThrottle) {
      launch(importedGames.value[selectedGameIndex.value].path)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] LT: Window Actions
  // [WINDOW-ACTIONS] X/Y/B: Maximize / Minimize / Close
  if (
    mode.value === 'main' &&
    gp.buttons[6].pressed &&
    gp.buttons[6].value > 0.5
  ) {
    mode.value = 'window-action'
  }
  if (mode.value === 'window-action' && gp.buttons[6].value <= 0.5) {
    mode.value = 'main'
  }
  if (mode.value === 'window-action') {
    if (gp.buttons[2].pressed) {
      if (!inThrottle) {
        inThrottle = true
        winMax()
        setTimeout(() => {
          console.log('max')
          inThrottle = false
        }, 300)
      }
    }
    if (gp.buttons[3].pressed) {
      if (!inThrottle) {
        inThrottle = true
        winMin()
        setTimeout(() => {
          inThrottle = false
        }, 300)
      }
    }
    if (gp.buttons[1].pressed) {
      if (!inThrottle) {
        inThrottle = true
        setTimeout(async () => {
          await winClose()
          inThrottle = false
        }, 300)
      }
    }
  }

  rAF(gameLoop)
}

onMounted(async () => {
  bgPath.value = await window.store.get('mainBgPath')
  for (const game of games) {
    const path = await window.store.get(`${game}GamePath`)
    if (path) {
      importedGames.value.push({
        game,
        path,
      })
    }
  }

  gameLoop()

  // window.addEventListener('gamepaddisconnected', function () {
  //   rAFStop(requestedAFNumber)
  // })
})
</script>

<template>
  <div class="bg-wrapper drag">
    <img
      class="bg-pic no-drag"
      :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      alt="Background image of Home page"
    />
    <Transition name="fade">
      <div class="bottom-bar" v-if="mode === 'main'">
        <div class="left no-drag">
          <div class="bar-item hoverable" @click="leaveGamepad">
            <GamepadIcon icon="Map" />
            <span>退出手柄模式</span>
          </div>
          <div class="bar-item">
            <GamepadIcon icon="LS_h" />
            <span>选择游戏</span>
          </div>
          <div class="bar-item hoverable">
            <GamepadIcon icon="A" />
            <span>启动游戏</span>
          </div>
        </div>
        <div class="right no-drag">
          <div class="bar-item hoverable" @click="mode = 'settings'">
            <GamepadIcon icon="Menu" />
            <i class="bi bi-gear" />
          </div>
          <div class="bar-item">
            <GamepadIcon icon="LT" />
            <div style="width: 90px" />
          </div>
          <div class="drag focus">
            <div class="traffic-lights no-drag window-actions normal py-2">
              <div
                class="traffic-light traffic-light-maximize"
                @click="winMax"
              ></div>
              <div
                class="traffic-light traffic-light-minimize"
                @click="winMin"
              ></div>
              <div
                class="traffic-light traffic-light-close"
                @click="winClose"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div class="bottom-bar" v-if="mode === 'window-action'">
        <div class="left">
          <div class="bar-item">
            <GamepadIcon icon="LT" />
            <span>按住并选择窗口操作</span>
          </div>
        </div>
        <div class="right no-drag">
          <div class="drag focus">
            <div class="traffic-lights no-drag window-actions py-1">
              <GamepadIcon icon="X" style="height: 24px" />
              <div
                class="traffic-light traffic-light-maximize"
                style="margin-top: 4px"
                @click="winMax"
              ></div>
              <GamepadIcon icon="Y" class="ml-2" style="height: 24px" />
              <div
                class="traffic-light traffic-light-minimize"
                style="margin-top: 4px"
                @click="winMin"
              ></div>
              <GamepadIcon icon="B" class="ml-2" style="height: 24px" />
              <div
                class="traffic-light traffic-light-close"
                style="margin-top: 4px"
                @click="winClose"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div class="bottom-bar" v-if="mode === 'settings'">
        <div class="left">
          <div class="bar-item">
            <GamepadIcon icon="B" />
            <span>返回</span>
          </div>
        </div>
        <div class="right no-drag">
          <div class="bar-item hoverable" @click="mode = 'settings'">
            <GamepadIcon icon="Menu" />
            <i class="bi bi-gear" />
          </div>
          <div class="bar-item">
            <GamepadIcon icon="LT" />
            <div style="width: 90px" />
          </div>
          <div class="drag focus">
            <div class="traffic-lights no-drag window-actions normal py-2">
              <div
                class="traffic-light traffic-light-maximize"
                @click="winMax"
              ></div>
              <div
                class="traffic-light traffic-light-minimize"
                @click="winMin"
              ></div>
              <div
                class="traffic-light traffic-light-close"
                @click="winClose"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="launch-area-wrapper">
      <h1 class="title-text font-gs" style="margin-bottom: 10px">
        {{ $t('mainpage_title') }}
      </h1>
      <button
        v-for="(game, idx) in importedGames"
        @click="launch(game.path)"
        class="game-button"
        :class="{ focus: selectedGameIndex == idx }"
        :key="idx"
      >
        {{
          $t('mainpage_buttonText', { game: $t(`general_${game.game}Short`) })
        }}
      </button>
    </div>
  </div>

  <Transition name="settings" :duration="600">
    <div v-if="mode === 'settings'">
      <div class="outer settings-wrapper" @click="mode = 'main'" />
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
  @apply p-3 mx-2 mt-2 rounded-lg border-4;
  @apply font-bold text-xl bg-yellow-400 border-yellow-400 cursor-default;
  @apply hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;

  &.focus {
    @apply border-4 border-amber-600 shadow-xl;

    .dark & {
      @apply border-amber-500;
    }
  }

  .dark & {
    @apply bg-yellow-700 border-yellow-700 hover:bg-yellow-600 active:bg-yellow-500;
  }
}

.bottom-bar {
  @apply absolute bottom-0 z-[100] bg-white;
  @apply flex flex-row justify-between align-middle;
  @apply w-[97vw] ml-[1vw] py-[6px];
  height: 64px;

  & .left {
    @apply flex flex-row justify-start;
  }

  & .right {
    @apply flex flex-row justify-end;
  }

  .dark & {
    @apply bg-[#222];
  }

  & .bar-item {
    @apply flex flex-row rounded-full my-[4px] py-[1px] px-[6px] mr-1;

    &.hoverable {
      @apply hover:bg-gray-800 hover:text-gray-200 cursor-pointer transition-all;

      .dark & {
        @apply hover:bg-gray-200 hover:text-gray-900;
      }
    }

    > img {
      margin-top: 6px;
      height: 30px;
    }

    span {
      @apply py-[7px] ml-1.5;
    }
    i {
      @apply py-[4px] ml-1.5 text-2xl;
    }
  }
}

.window-actions {
  @apply mt-2.5 px-1;
  @apply rounded-full transition-all;

  &.normal {
    @apply mt-2 border-2 border-yellow-500;
  }
}

.settings-wrapper {
  @apply absolute top-0 z-40 w-full right-0;
  @apply backdrop-blur-3xl;
  background: rgb(255 255 255 / 50%);
  height: calc(100vh - 64px);

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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
