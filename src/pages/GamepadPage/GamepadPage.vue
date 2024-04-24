<script setup lang="ts">
import { h, inject, onMounted, ref, Ref, VNode } from 'vue'
import GamepadIcon from '../../components/GamepadIcon.vue'
import CustomSwitch from '../../components/CustomSwitch.vue'
import MyTooltip from '../../components/MyTooltip.vue'

type Mode = 'main' | 'settings' | 'window-action' | 'out'
type GamePath = {
  game: string
  path: string
  launcherPath: string
}
type SettingsCard = {
  title: string
  items: SettingsItem[]
}
type SettingsItem = {
  text: string
  value: boolean
  key: string
  tip?: string | VNode
}

const contentReady = ref(false)

const mode = ref<Mode>('main')
const games = ['gs', 'sr', 'hi3']
const importedGames = ref<GamePath[]>([])
const showTooltip = ref(false)

const bgPath = ref('')
// const autoEnterGamepad = ref(true)
// const showToolbar = ref(true)

const selectedGameIndex = ref(0)
const selectedSettingsCardIndex = ref(0)
const selectedSettingsItemIndex = ref(0)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')
const leaveGamepad = inject<() => void>('leaveGamepad')

const settingsItems: Ref<SettingsCard[]> = ref([
  {
    title: '通用',
    items: [
      {
        text: '连接手柄时自动进入手柄模式',
        value: true,
        key: 'autoEnterGamepad',
        tip: h('div', [
          h('span', '关闭后，您仍能通过按下'),
          h(GamepadIcon, {
            icon: 'Map',
            style: {
              height: '20px',
              padding: '0 4px 0 4px',
              display: 'inline',
            },
          }),
          h('span', '键进入手柄模式。'),
        ]),
      },
      {
        text: '关闭窗口时退出应用',
        value: false,
        key: 'quitOnClose',
      },
      {
        text: '禁用鼠标操作',
        value: false,
        key: 'gamepadDisableMouse',
      },
    ],
  },
  {
    title: '外观',
    items: [
      {
        text: '显示底部工具栏',
        value: true,
        key: 'showGamepadToolbar',
      },
    ],
  },
])

const searchSettingByKey = (key: string) => {
  for (const card of settingsItems.value) {
    for (const item of card.items) {
      if (item.key === key) {
        return item
      }
    }
  }
  return undefined
}

const leaveGamepadClick = () => {
  mode.value = 'out'
  showTooltip.value = false
  leaveGamepad()
}

const launch = async (path: string) => {
  await window.child.exec(path)
}

const winClose = async () => {
  showTooltip.value = false
  const quitOnClose = await window.store.get('quitOnClose')
  if (quitOnClose) {
    await window.win.close()
  } else {
    await window.win.tray()
  }
}
const winMin = () => {
  showTooltip.value = false
  window.win.min()
}
const winMax = () => {
  showTooltip.value = false
  window.win.max()
}

const onSettingsChange = (cardIdx: number, itemIdx: number) => {
  showTooltip.value = false
  const item = settingsItems.value[cardIdx].items[itemIdx]
  window.store.set(item.key, !item.value, false)
  item.value = !item.value
}

const onSettingsHover = (cardIdx: number, itemIdx: number) => {
  showTooltip.value = false
  selectedSettingsCardIndex.value = cardIdx
  selectedSettingsItemIndex.value = itemIdx
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
        showTooltip.value = false
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
  if (mode.value === 'main' && (gp.axes[0] < -0.9 || gp.buttons[14].pressed)) {
    if (!inThrottle) {
      selectedGameIndex.value =
        selectedGameIndex.value === 0
          ? importedGames.value.length - 1
          : selectedGameIndex.value - 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (mode.value === 'main' && (gp.axes[0] > 0.9 || gp.buttons[15].pressed)) {
    if (!inThrottle) {
      selectedGameIndex.value =
        selectedGameIndex.value === importedGames.value.length - 1
          ? 0
          : selectedGameIndex.value + 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
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

  // [MAIN] X: Official Launcher
  if (mode.value === 'main' && gp.buttons[2].pressed) {
    if (!inThrottle) {
      launch(importedGames.value[selectedGameIndex.value].launcherPath)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN / SETTINGS] LT: Window Actions
  // [WINDOW-ACTIONS] X/Y/B: Maximize / Minimize / Close
  if (
    (mode.value === 'main' || mode.value === 'settings') &&
    gp.buttons[6].pressed &&
    gp.buttons[6].value > 0.7
  ) {
    mode.value = 'window-action'
  }
  if (mode.value === 'window-action' && gp.buttons[6].value <= 0.7) {
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

  // [SETTINGS] B: Return to Main
  if (mode.value === 'settings' && gp.buttons[1].pressed) {
    if (!inThrottle) {
      showTooltip.value = false
      mode.value = 'main'
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [SETTINGS] LS / DIR_v: Select Settings Item
  if (
    (mode.value === 'settings' && gp.axes[1] < -0.9) ||
    gp.buttons[12].pressed
  ) {
    if (!inThrottle) {
      if (selectedSettingsItemIndex.value === 0) {
        const targetCardIdx =
          selectedSettingsCardIndex.value === 0
            ? settingsItems.value.length - 1
            : selectedSettingsCardIndex.value - 1
        selectedSettingsItemIndex.value =
          settingsItems.value[targetCardIdx].items.length - 1
        selectedSettingsCardIndex.value = targetCardIdx
      } else {
        selectedSettingsItemIndex.value--
      }
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (
    (mode.value === 'settings' && gp.axes[1] > 0.9) ||
    gp.buttons[13].pressed
  ) {
    if (!inThrottle) {
      if (
        selectedSettingsItemIndex.value ===
        settingsItems.value[selectedSettingsCardIndex.value].items.length - 1
      ) {
        selectedSettingsItemIndex.value = 0
        selectedSettingsCardIndex.value =
          selectedSettingsCardIndex.value === settingsItems.value.length - 1
            ? 0
            : selectedSettingsCardIndex.value + 1
      } else {
        selectedSettingsItemIndex.value++
      }
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }

  // [SETTINGS] RS: Select Settings Card
  if (mode.value === 'settings' && gp.axes[3] < -0.9) {
    if (!inThrottle) {
      selectedSettingsItemIndex.value = 0
      selectedSettingsCardIndex.value =
        selectedSettingsCardIndex.value === 0
          ? settingsItems.value.length - 1
          : selectedSettingsCardIndex.value - 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (mode.value === 'settings' && gp.axes[3] > 0.9) {
    if (!inThrottle) {
      selectedSettingsItemIndex.value = 0
      selectedSettingsCardIndex.value =
        selectedSettingsCardIndex.value === settingsItems.value.length - 1
          ? 0
          : selectedSettingsCardIndex.value + 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }

  // [SETTINGS] A: Select Item
  if (mode.value === 'settings' && gp.buttons[0].pressed) {
    if (!inThrottle) {
      onSettingsChange(
        selectedSettingsCardIndex.value,
        selectedSettingsItemIndex.value,
      )
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [SETTINGS] LS Press: Show Tooltip
  if (mode.value === 'settings' && gp.buttons[10].pressed) {
    if (!inThrottle) {
      showTooltip.value = !showTooltip.value
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  rAF(gameLoop)
}

onMounted(async () => {
  bgPath.value = await window.store.get('mainBgPath')

  for (const card of settingsItems.value) {
    for (const item of card.items) {
      const value = await window.store.get(item.key)
      if (value !== undefined) {
        item.value = value
      }
    }
  }

  for (const game of games) {
    const path = await window.store.get(`${game}GamePath`)
    const launcherPath = await window.store.get(`${game}LauncherPath`)
    if (path) {
      importedGames.value.push({
        game,
        path,
        launcherPath,
      })
    }
  }

  gameLoop()

  setInterval(() => {
    contentReady.value = true
  }, 500)

  // window.addEventListener('gamepaddisconnected', function () {
  //   rAFStop(requestedAFNumber)
  // })
})
</script>

<template>
  <Transition name="fade">
    <div class="loading-wrapper" v-if="!contentReady">
      <div class="loading-content">
        <GamepadIcon icon="Whole" />
        <div class="w-full text-xl font-gs">Gamepad Mode</div>
      </div>
    </div>
  </Transition>
  <div
    class="bg-wrapper drag"
    :class="{
      from: !contentReady,
      'pointer-events-none': searchSettingByKey('gamepadDisableMouse')?.value,
    }"
  >
    <img
      class="bg-pic no-drag"
      :class="{ toolbar: searchSettingByKey('showGamepadToolbar')?.value }"
      :src="bgPath ? bgPath : '../../src/assets/gsbanner.png'"
      alt="Background image of Home page"
    />
    <Transition name="swipe-bottom">
      <div
        class="bottom-bar"
        v-if="
          mode === 'main' && searchSettingByKey('showGamepadToolbar')?.value
        "
      >
        <div class="left no-drag">
          <div class="bar-item">
            <GamepadIcon icon="LS_h" />
            <span>选择游戏</span>
          </div>
          <div
            class="bar-item hoverable"
            @click="launch(importedGames[selectedGameIndex].launcherPath)"
          >
            <GamepadIcon icon="X" />
            <span>官方启动器</span>
          </div>
        </div>
        <div class="right no-drag">
          <div class="bar-item hoverable" @click="leaveGamepadClick">
            <GamepadIcon icon="Map" />
            <i class="bi bi-box-arrow-left" />
          </div>
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

    <Transition name="swipe-bottom">
      <div
        class="bottom-bar"
        v-if="
          mode === 'window-action' &&
          searchSettingByKey('showGamepadToolbar')?.value
        "
      >
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

    <Transition name="swipe-bottom">
      <div
        class="bottom-bar"
        v-if="
          mode === 'settings' && searchSettingByKey('showGamepadToolbar')?.value
        "
      >
        <div class="left no-drag">
          <div class="bar-item hoverable" @click="mode = 'main'">
            <GamepadIcon icon="B" />
            <span>返回</span>
          </div>
          <div class="bar-item">
            <GamepadIcon icon="LS_v" />
            <span>选择设置项</span>
          </div>
          <div class="bar-item">
            <GamepadIcon icon="RS_v" />
            <span>选择设置卡片</span>
          </div>
          <div
            class="bar-item hoverable"
            @click="
              onSettingsChange(
                selectedSettingsCardIndex,
                selectedSettingsItemIndex,
              )
            "
          >
            <GamepadIcon icon="A" />
            <span>选定</span>
          </div>
        </div>
        <div class="right no-drag">
          <div class="bar-item hoverable" @click="mode = 'main'">
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

    <div
      class="launch-area-wrapper"
      :class="{ toolbar: searchSettingByKey('showGamepadToolbar')?.value }"
    >
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
        <div class="flex flex-row transition-all">
          <GamepadIcon
            icon="A"
            v-if="selectedGameIndex == idx"
            style="
              height: 24px;
              border-radius: 999px;
              background: white;
              margin-top: 2px;
              margin-right: 4px;
            "
          />
          {{
            $t('mainpage_buttonText', { game: $t(`general_${game.game}Short`) })
          }}
        </div>
      </button>
    </div>
  </div>

  <Transition name="settings" :duration="600">
    <div
      v-if="mode === 'settings'"
      :class="{
        'pointer-events-none': searchSettingByKey('gamepadDisableMouse')?.value,
      }"
    >
      <div
        class="outer settings-wrapper"
        @click="mode = 'main'"
        :class="{ toolbar: searchSettingByKey('showGamepadToolbar')?.value }"
      />
      <div
        class="inner settings-content"
        :class="{ toolbar: searchSettingByKey('showGamepadToolbar')?.value }"
      >
        <div
          class="settings-title"
          :style="`font-size: calc(36px * min(${hScale}, ${vScale}))`"
        >
          {{ $t('general_settings') }}
        </div>
        <div
          v-for="(card, cardIdx) in settingsItems"
          class="settings-card"
          :class="{ selected: selectedSettingsCardIndex == cardIdx }"
          :key="cardIdx"
        >
          <div class="settings-subtitle font-gs">{{ card.title }}</div>
          <div
            v-for="(item, itemIdx) in card.items"
            class="settings-item"
            :class="{
              selected:
                selectedSettingsCardIndex == cardIdx &&
                selectedSettingsItemIndex == itemIdx,
            }"
            :key="itemIdx"
            @mouseenter="onSettingsHover(cardIdx, itemIdx)"
            @click="onSettingsChange(cardIdx, itemIdx)"
          >
            <div class="flex flex-row">
              <div class="settings-item-text mr-2">{{ item.text }}</div>
              <MyTooltip
                v-if="item.tip"
                max-width="200px"
                middle
                placement="bottom"
                v-model="showTooltip"
                :disabled="
                  selectedSettingsCardIndex != cardIdx ||
                  selectedSettingsItemIndex != itemIdx
                "
              >
                <template #content>
                  <component :is="item.tip" />
                </template>
                <div class="flex flex-row">
                  <GamepadIcon
                    icon="LS"
                    v-if="
                      selectedSettingsCardIndex == cardIdx &&
                      selectedSettingsItemIndex == itemIdx
                    "
                    class="mt-1 mr-0.5 h-[24px]"
                  />
                  <div class="help">?</div>
                </div>
              </MyTooltip>
            </div>
            <CustomSwitch
              v-model="item.value"
              @change="onSettingsChange(cardIdx, itemIdx)"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.loading-wrapper {
  @apply absolute z-0 size-full;
  @apply pointer-events-none;
}

@keyframes fade-blur {
  0% {
    opacity: 0;
    filter: blur(30px);
  }
  50% {
    opacity: 1;
  }
  100% {
    filter: blur(0);
  }
}

.loading-content {
  @apply absolute w-1/3;
  @apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  animation: fade-blur 800ms forwards;

  & > img {
    @apply opacity-50;

    .dark & {
      @apply invert;
    }
  }
}

.bg-wrapper {
  @apply absolute z-0 size-full transition-all;

  &.from {
    @apply blur-lg scale-90 opacity-0;
  }
}

.bg-pic {
  @apply object-cover transition-all;
  width: 100vw;
  margin-left: -1vw;
  height: 100vh;

  &.toolbar {
    border-radius: 24px;
    margin-top: 1vw;
    margin-left: 0;
    width: 98vw;
    height: calc(100vh - 1vw - 64px);
  }
}

.launch-area-wrapper {
  @apply absolute z-10 left-1/2 -translate-x-1/2;
  @apply backdrop-blur-xl p-6 rounded-2xl;
  @apply text-nowrap;
  background: rgb(255 255 255 / 0.6);
  bottom: 16px;

  &.toolbar {
    bottom: 70px;
  }

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
      @apply hover:bg-amber-100 hover:text-yellow-700 cursor-pointer transition-all;

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
  @apply backdrop-blur-3xl transition-all;
  background: rgb(255 255 255 / 0.5);
  height: 100vh;

  &.toolbar {
    @apply transition-all;
    height: calc(100vh - 64px);
  }

  .dark & {
    background: rgb(0 0 0 / 50%);
  }
}

.settings-content {
  @apply absolute z-50 top-[3vh] right-[3vw] rounded-lg transition-all;
  width: 40vw;
  height: 100vh;

  &.toolbar {
    height: calc(100vh - 70px);
  }
}

.settings-title {
  @apply w-full text-right font-bold;
  @apply pb-2;
}

.settings-card {
  @apply bg-white transition-all;
  @apply rounded-lg p-4 mt-3 w-full;
  transform-origin: right center;

  &.selected {
    @apply scale-105 shadow-xl;
  }

  .dark & {
    @apply bg-[#222];
  }
}

.settings-subtitle {
  @apply text-2xl text-left mb-2;
}

.settings-item {
  @apply text-base flex flex-row justify-between transition-all;
  @apply p-1 pl-3 border-2 border-white rounded-full cursor-pointer;

  .dark & {
    @apply border-[#222];
  }

  &.selected {
    @apply border-amber-500;
  }
}

.settings-item-text {
  @apply pt-1;
}

.help {
  @apply mt-[6px] w-5 h-5 rounded-full;
  @apply text-center font-bold text-sm;
  @apply bg-gray-400 text-white cursor-help;
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
.fade-leave-active,
.swipe-bottom-enter-active,
.swipe-bottom-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.swipe-bottom-enter-from,
.swipe-bottom-leave-to {
  transform: translateY(100%);
}
</style>
