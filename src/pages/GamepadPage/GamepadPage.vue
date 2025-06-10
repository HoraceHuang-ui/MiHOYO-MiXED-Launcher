<script setup lang="ts">
import { h, inject, onMounted, ref, Ref, VNode, watch } from 'vue'
import GamepadIcon from '../../components/GamepadIcon.vue'
import CustomSwitch from '../../components/CustomSwitch.vue'
import MyTooltip from '../../components/MyTooltip.vue'
import { translate } from '../../i18n'
import GenshinInfoCard from '../GenshinPage/Components/GenshinInfoCard.vue'
import MyCarousel from '../../components/MyCarousel.vue'
import StarRailInfoCard from '../StarRailPage/Components/StarRailInfoCard.vue'
import MyTextSwitch from '../../components/MyTextSwitch.vue'
import { useStore } from '../../store'
import LoadingIcon from '../../components/LoadingIcon.vue'
import { GsRegInfo } from '../../types/genshin/gsRegInfo'
import { SrRegInfo } from '../../types/starrail/srRegInfo'
import MyDropdown from '../../components/MyDropdown.vue'
import ZZZInfoCard from '../ZZZPage/Components/ZZZInfoCard.vue'

type Mode =
  | 'main'
  | 'settings'
  | 'window-action'
  | 'gs-player'
  | 'sr-player'
  | 'zzz-player'
  | 'dialog'
  | 'accounts'
  | 'out'
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
  parent: any
  key: string
  switchTexts?: string[]
  tip?: VNode
}

const store = useStore()

const contentReady = ref(false)
const playerCardCarousel = ref()

const mode = ref<Mode>('main')
const games = ['gs', 'sr', 'hi3', 'zzz']
const importedGames = ref<GamePath[]>([])
const showTooltip = ref(false)
const gpType = inject<Ref<string>>('gpType')
let gp: Gamepad | null = null

const selectedGameIndex = ref(0)
const selectedSettingsCardIndex = ref(0)
const selectedSettingsItemIndex = ref(0)
const selectedAccountIndex = ref(-1)
const showAccountsDropdown = ref(false)
const launchingGame = ref(-1)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')
const leaveGamepad = inject<() => void>('leaveGamepad')

watch(launchingGame, newValue => {
  if (newValue != -1) {
    setTimeout(() => {
      launchingGame.value = -1
    }, 3000)
  }
})

const settingsItems: Ref<SettingsCard[]> = ref([
  {
    title: translate('settings_general'),
    items: [
      {
        text: translate('gamepad_autoEnterGamepad'),
        parent: store.settings.gamepad,
        key: 'autoEnter',
        tip: h(
          'ul',
          {
            style: {
              'padding-left': '20px',
              'list-style-type': 'disc',
              'list-style-position': 'outside',
            },
          },
          [
            h('li', [
              h('span', translate('gamepad_autoEnterTip1_1')),
              h(GamepadIcon, {
                icon: 'Map',
                style: {
                  height: '20px',
                  padding: '0 4px 0 4px',
                  display: 'inline',
                },
              }),
              h('span', translate('gamepad_autoEnterTip1_2')),
            ]),
            h('li', translate('gamepad_autoEnterTip2')),
            h('li', translate('gamepad_autoEnterTip3')),
          ],
        ),
      },
      {
        text: translate('gamepad_quitOnClose'),
        parent: store.settings.general,
        key: 'quitOnClose',
      },
      {
        text: translate('gamepad_disableMouse'),
        parent: store.settings.gamepad,
        key: 'disableMouse',
      },
      {
        text: translate('gamepad_defaultType'),
        parent: store.settings.gamepad,
        key: 'defaultPS',
        switchTexts: ['Xbox', 'PS'],
        tip: h('div', translate('gamepad_defaultTypeTip')),
      },
    ],
  },
  {
    title: translate('settings_appearance'),
    items: [
      {
        text: translate('gamepad_showToolbar'),
        parent: store.settings.gamepad,
        key: 'showToolbar',
      },
      {
        text: translate('settings_gsCostume'),
        parent: store.settings.appearance,
        key: 'gsCostume',
      },
    ],
  },
])

const leaveGamepadClick = () => {
  mode.value = 'out'
  showTooltip.value = false
  leaveGamepad!()
}

const launch = async (game: string, launcher: boolean) => {
  launchingGame.value = selectedGameIndex.value
  if (launcher) {
    await window.child.exec(
      importedGames.value[selectedGameIndex.value].launcherPath,
    )
    return
  }

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
  } else if (game === 'hi3') {
    gameStore = store.game.hi3
    if (gameStore.curAccountId != -1) {
      await window.reg.hi3Set(
        JSON.stringify(gameStore.accounts[gameStore.curAccountId]),
      )
    }
  } else {
    gameStore = store.game.zzz
    // if (gameStore.curAccountId != -1) {
    //   await window.reg.zzzSet(
    //     JSON.stringify(gameStore.accounts[gameStore.curAccountId]),
    //   )
    // }
  }

  await window.child.exec(gameStore.gamePath)
}

const winClose = async () => {
  showTooltip.value = false
  if (store.settings.general.quitOnClose) {
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
  item.parent[item.key] = !item.parent[item.key]

  if (item.key === 'defaultPS') {
    if (
      gp!.id.startsWith('DualSense') ||
      gp!.id.startsWith('DualShock') ||
      gp!.id.startsWith('Xbox')
    ) {
      return
    }
    gpType!.value = item.parent[item.key] ? 'PS' : 'Xbox'
  }
}

const onSettingsHover = (cardIdx: number, itemIdx: number) => {
  showTooltip.value = false
  selectedSettingsCardIndex.value = cardIdx
  selectedSettingsItemIndex.value = itemIdx
}

const rAF = window.requestAnimationFrame

// const rAFStop = window.cancelAnimationFrame

let inThrottle = false
let settingsOldMode: Mode = 'out'
let windowOldMode: Mode = 'out'

const barSettingsClick = () => {
  if (mode.value !== 'settings') {
    settingsOldMode = mode.value
    mode.value = 'settings'
  } else {
    mode.value = settingsOldMode
  }
}

const gameLoop = () => {
  const gamepads = navigator.getGamepads()

  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      gp = gamepads[i]
      break
    }
  }

  if (!gp || mode.value === 'out') {
    return
  }
  if (!document.hasFocus()) {
    rAF(gameLoop)
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

  // [!SETTINGS] Menu: Settings
  if (
    mode.value !== 'settings' &&
    mode.value !== 'dialog' &&
    gp.buttons[9].pressed
  ) {
    if (!inThrottle) {
      settingsOldMode = mode.value
      mode.value = 'settings'
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [!WINDOW-ACTION] Map: Quit Gamepad Mode
  if (
    mode.value !== 'window-action' &&
    mode.value !== 'dialog' &&
    gp.buttons[8].pressed
  ) {
    if (!inThrottle) {
      mode.value = 'out'
      inThrottle = true
      setTimeout(() => {
        leaveGamepad!()
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
      launch(importedGames.value[selectedGameIndex.value].game, false)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] X: Official Launcher
  if (mode.value === 'main' && gp.buttons[2].pressed) {
    if (!inThrottle) {
      launch(importedGames.value[selectedGameIndex.value].game, true)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] Y: Select Accounts
  if (mode.value === 'main' && gp.buttons[3].pressed) {
    if (!inThrottle) {
      if (importedGames.value[selectedGameIndex.value].game !== 'zzz') {
        showAccountsDropdown.value = true
        mode.value = 'accounts'
      }
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [MAIN] LS Press: Player Info
  if (mode.value === 'main' && gp.buttons[10].pressed) {
    if (!inThrottle) {
      mode.value = 'gs-player'
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [!WINDOW-ACTION] LT: Window Actions
  // [WINDOW-ACTION] X/Y/B: Maximize / Minimize / Close
  if (
    mode.value !== 'window-action' &&
    mode.value !== 'dialog' &&
    gp.buttons[6].pressed &&
    gp.buttons[6].value > 0.7
  ) {
    windowOldMode = mode.value
    mode.value = 'window-action'
  }
  if (mode.value === 'window-action' && gp.buttons[6].value <= 0.7) {
    mode.value = windowOldMode
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

  // [SETTINGS / PLAYER] B / Menu: Return to Old
  if (
    mode.value === 'settings' &&
    (gp.buttons[1].pressed || gp.buttons[9].pressed)
  ) {
    if (!inThrottle) {
      showTooltip.value = false
      mode.value = settingsOldMode
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [SETTINGS] LS / DIR_v: Select Settings Item
  if (
    mode.value === 'settings' &&
    (gp.axes[1] < -0.9 || gp.buttons[12].pressed)
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
    mode.value === 'settings' &&
    (gp.axes[1] > 0.9 || gp.buttons[13].pressed)
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

  // [PLAYER] B / LS Press: Back
  if (
    (mode.value === 'gs-player' ||
      mode.value === 'sr-player' ||
      mode.value === 'zzz-player') &&
    (gp.buttons[10].pressed || gp.buttons[1].pressed)
  ) {
    if (!inThrottle) {
      mode.value = 'main'
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [PLAYER] DIR_h: Switch Game
  if (
    (mode.value === 'gs-player' ||
      mode.value === 'sr-player' ||
      mode.value === 'zzz-player') &&
    gp.buttons[14].pressed
  ) {
    if (!inThrottle) {
      playerCardCarousel.value?.prevPane()
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 420)
    }
  }
  if (
    (mode.value === 'gs-player' ||
      mode.value === 'sr-player' ||
      mode.value === 'zzz-player') &&
    gp.buttons[15].pressed
  ) {
    if (!inThrottle) {
      playerCardCarousel.value?.nextPane()
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 420)
    }
  }

  // [ACCOUNTS] Y / B: Back to Main
  if (
    mode.value === 'accounts' &&
    (gp.buttons[1].pressed || gp.buttons[3].pressed)
  ) {
    if (!inThrottle) {
      mode.value = 'main'
      showAccountsDropdown.value = false
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // [ACCOUNTS] LS_v / DIR_v: Select Account
  if (
    mode.value === 'accounts' &&
    (gp.axes[1] < -0.9 || gp.buttons[12].pressed)
  ) {
    if (!inThrottle) {
      selectedAccountIndex.value =
        selectedAccountIndex.value === -1
          ? store.game[importedGames.value[selectedGameIndex.value].game]
              .accounts.length - 1
          : selectedAccountIndex.value - 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (
    mode.value === 'accounts' &&
    (gp.axes[1] > 0.9 || gp.buttons[13].pressed)
  ) {
    if (!inThrottle) {
      selectedAccountIndex.value =
        selectedAccountIndex.value ===
        store.game[importedGames.value[selectedGameIndex.value].game].accounts
          .length -
          1
          ? -1
          : selectedAccountIndex.value + 1
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }

  // [ACCOUNTS] A: Confirm Select Account
  if (mode.value === 'accounts' && gp.buttons[0].pressed) {
    if (!inThrottle) {
      switchAccount(selectedAccountIndex.value + 1)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  rAF(gameLoop)
}

const switchAccount = (idx: number) => {
  store.game[importedGames.value[selectedGameIndex.value].game].curAccountId =
    idx - 1
  selectedAccountIndex.value = idx - 1
  showAccountsDropdown.value = false
  mode.value = 'main'
}

watch(selectedGameIndex, () => {
  switch (importedGames.value[selectedGameIndex.value].game) {
    case 'gs':
      selectedAccountIndex.value = store.game.gs.curAccountId
      break
    case 'sr':
      selectedAccountIndex.value = store.game.sr.curAccountId
      break
    case 'hi3':
      selectedAccountIndex.value = store.game.hi3.curAccountId
      break
  }
})

onMounted(async () => {
  for (const game of games) {
    const path = store.game[game].gamePath
    const launcherPath = store.game[game].launcherPath
    if (path) {
      importedGames.value.push({
        game,
        path,
        launcherPath,
      })
    }
  }

  selectedAccountIndex.value = store.game.gs.curAccountId

  rAF(gameLoop)

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
        <div class="w-full text-xl font-gs">{{ $t('gamepad_init') }}</div>
      </div>
    </div>
  </Transition>
  <div
    class="bg-wrapper drag"
    :class="{
      from: !contentReady,
      'pointer-events-none': store.settings.gamepad.disableMouse,
    }"
  >
    <img
      class="bg-pic no-drag"
      :class="{ toolbar: store.settings.gamepad.showToolbar }"
      :src="
        store.general.mainBgPath
          ? store.general.mainBgPath
          : '../../src/assets/gsbanner.png'
      "
      alt="Background image of Home page"
    />
    <Transition name="swipe-bottom">
      <div class="bottom-bar" v-if="store.settings.gamepad.showToolbar">
        <div class="left" />
        <Transition name="swipe-bottom">
          <div class="absolute left-0 left no-drag" v-if="mode === 'main'">
            <div class="bar-item">
              <GamepadIcon icon="LS_h" />
              <span>{{ $t('gamepad_selectGame') }}</span>
            </div>
            <div
              class="bar-item hoverable"
              @click="launch(importedGames[selectedGameIndex].game, true)"
            >
              <GamepadIcon icon="X" />
              <span>{{ $t('gamepad_officialLauncher') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="Y" />
              <span>{{ $t('general_account') }}</span>
            </div>
            <div class="bar-item hoverable" @click="mode = 'gs-player'">
              <GamepadIcon icon="LS" />
              <span>{{ $t('gamepad_playerInfo') }}</span>
            </div>
          </div>
          <div
            class="absolute left-0 left"
            v-else-if="mode === 'window-action'"
          >
            <div class="bar-item">
              <GamepadIcon icon="LT" />
              <span>{{ $t('gamepad_windowActions') }}</span>
            </div>
          </div>
          <div
            class="absolute left-0 left no-drag"
            v-else-if="mode === 'settings'"
          >
            <div class="bar-item hoverable" @click="mode = 'main'">
              <GamepadIcon icon="B" />
              <span>{{ $t('general_back') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="LS_v" />
              <span>{{ $t('gamepad_selectSettingItem') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="RS_v" />
              <span>{{ $t('gamepad_selectSettingCard') }}</span>
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
              <span>{{ $t('general_confirm') }}</span>
            </div>
          </div>
          <div
            class="absolute left-0 left no-drag"
            v-else-if="
              mode === 'gs-player' ||
              mode === 'sr-player' ||
              mode === 'zzz-player'
            "
          >
            <div class="bar-item hoverable" @click="mode = 'main'">
              <GamepadIcon icon="B" />
              <span>{{ $t('general_back') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="DIR_h" />
              <span>{{ $t('general_game') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="LS_h" />
              <span>{{ $t('gamepad_character') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="RS_h" />
              <span>{{
                (function () {
                  if (mode === 'gs-player') {
                    return $t('gs_artifact')
                  } else if (mode === 'sr-player') {
                    return $t('sr_relic')
                  } else {
                    return $t('zzz_driveDisc')
                  }
                })()
              }}</span>
            </div>
            <div class="bar-item" v-if="mode === 'sr-player'">
              <GamepadIcon icon="RS" />
              <span>{{ $t('sr_memosprite') }}</span>
            </div>
          </div>
          <div
            class="absolute left-0 left no-drag"
            v-else-if="mode === 'accounts'"
          >
            <div
              class="bar-item hoverable"
              @click="
                () => {
                  mode = 'main'
                  showAccountsDropdown = false
                }
              "
            >
              <GamepadIcon icon="B" />
              <span>{{ $t('general_cancel') }}</span>
            </div>
            <div class="bar-item">
              <GamepadIcon icon="LS_v" />
              <span>{{ $t('gamepad_selectAccount') }}</span>
            </div>
            <div
              class="bar-item hoverable"
              @click="switchAccount(selectedAccountIndex)"
            >
              <GamepadIcon icon="A" />
              <span>{{ $t('general_confirm') }}</span>
            </div>
          </div>
        </Transition>
        <Transition name="swipe-bottom">
          <div
            class="absolute right-0 right no-drag"
            v-if="mode !== 'out' && mode !== 'window-action'"
          >
            <div class="bar-item hoverable" @click="leaveGamepadClick">
              <GamepadIcon icon="Map" />
              <i class="bi bi-box-arrow-left" />
            </div>
            <div class="bar-item hoverable" @click="barSettingsClick">
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
          <div class="right no-drag" v-else-if="mode === 'window-action'">
            <div class="bar-item hoverable" @click="winMax">
              <GamepadIcon icon="X" />
              <div class="h-4 w-4 ml-2 mt-3 rounded-full bg-[#28c941]" />
            </div>
            <div class="bar-item hoverable" @click="winMin">
              <GamepadIcon icon="Y" />
              <div class="h-4 w-4 ml-2 mt-3 rounded-full bg-[#ffbd2e]" />
            </div>
            <div class="bar-item hoverable" @click="winClose">
              <GamepadIcon icon="B" />
              <div class="h-4 w-4 ml-2 mt-3 rounded-full bg-[#ff6159]" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        class="account-wrapper"
        :class="{ toolbar: store.settings.gamepad.showToolbar }"
        v-if="
          importedGames.length > 0 &&
          'curAccountId' in store.game[importedGames[selectedGameIndex].game] &&
          store.game[importedGames[selectedGameIndex].game].accounts.length > 0
        "
      >
        <MyDropdown
          :items="[
            $t('general_doNotModify'),
            ...store.game[importedGames[selectedGameIndex].game].accounts.map(
              (acc: GsRegInfo | SrRegInfo) => acc.name,
            ),
          ]"
          class="account-info"
          item-class="text-gray-800 px-2 dark:text-gray-200"
          middle
          placement="bottom"
          @command="switchAccount"
          :selected="selectedAccountIndex + 1"
          v-model="showAccountsDropdown"
        >
          <i class="bi bi-person-circle" />
          <span
            v-if="
              store.game[importedGames[selectedGameIndex].game].curAccountId !=
              -1
            "
          >
            {{
              store.game[importedGames[selectedGameIndex].game].accounts
                .length > 0
                ? store.game[importedGames[selectedGameIndex].game].accounts[
                    store.game[importedGames[selectedGameIndex].game]
                      .curAccountId
                  ].name
                : ''
            }}
          </span>
        </MyDropdown>
      </div>
    </Transition>

    <div
      class="launch-area-wrapper"
      :class="{ toolbar: store.settings.gamepad.showToolbar }"
    >
      <h1 class="title-text font-gs" style="margin-bottom: 10px">
        {{ $t('mainpage_title') }}
      </h1>
      <button
        v-for="(game, idx) in importedGames"
        @click="launch(game.game, false)"
        class="game-button"
        :class="{ focus: selectedGameIndex == idx }"
        :key="idx"
        @mouseenter="selectedGameIndex = idx"
      >
        <div class="flex flex-row transition-all">
          <GamepadIcon
            icon="A"
            v-if="selectedGameIndex == idx && launchingGame != idx"
            style="
              height: 24px;
              border-radius: 999px;
              background: white;
              margin-top: 2px;
              margin-right: 4px;
            "
          />
          <span v-if="launchingGame != idx">
            {{
              $t('mainpage_buttonText', {
                game: $t(`general_${game.game}Short`),
              })
            }}
          </span>
          <LoadingIcon v-if="launchingGame == idx" />
        </div>
      </button>
    </div>
  </div>

  <Transition name="settings" :duration="600">
    <div
      v-if="
        mode === 'settings' ||
        (mode === 'window-action' && windowOldMode === 'settings')
      "
      :class="{
        'pointer-events-none': store.settings.gamepad.disableMouse,
      }"
    >
      <div
        class="outer settings-wrapper"
        @click="mode = settingsOldMode"
        :class="{ toolbar: store.settings.gamepad.showToolbar }"
      />
      <div
        class="inner settings-content"
        :class="{ toolbar: store.settings.gamepad.showToolbar }"
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
                max-width="300px"
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
            <MyTextSwitch
              v-if="item.switchTexts"
              class="bg-gray-100 dark:bg-gray-800"
              :right-text="item.switchTexts[1]"
              :left-text="item.switchTexts[0]"
              v-model="item.parent[item.key]"
              @change="onSettingsChange(cardIdx, itemIdx)"
            />
            <CustomSwitch
              v-else
              v-model="item.parent[item.key]"
              @change="onSettingsChange(cardIdx, itemIdx)"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="player" :duration="600">
    <div
      v-if="
        mode === 'gs-player' ||
        mode === 'sr-player' ||
        mode === 'zzz-player' ||
        mode === 'dialog' ||
        (mode === 'settings' &&
          (settingsOldMode === 'gs-player' ||
            settingsOldMode === 'sr-player' ||
            settingsOldMode === 'zzz-player')) ||
        (mode === 'window-action' &&
          (windowOldMode === 'gs-player' ||
            windowOldMode === 'sr-player' ||
            windowOldMode === 'zzz-player' ||
            (windowOldMode === 'settings' &&
              (settingsOldMode === 'gs-player' ||
                settingsOldMode === 'sr-player' ||
                settingsOldMode === 'zzz-player'))))
      "
      :class="{
        'pointer-events-none': store.settings.gamepad.disableMouse,
      }"
    >
      <div
        class="outer player-wrapper"
        :class="{ toolbar: store.settings.gamepad.showToolbar }"
      />
      <div
        class="inner player-content"
        :class="{ toolbar: store.settings.gamepad.showToolbar }"
      >
        <MyCarousel
          ref="playerCardCarousel"
          class="size-full relative"
          :autoplay="false"
          show-arrow="never"
          show-indicator="always"
          indicator-style="circle"
          indicator-placement="left"
          animation="fade-swipe"
          @update:model-value="
            value => {
              let modes: Mode[] = ['gs-player', 'sr-player', 'zzz-player']
              mode = modes[value]
            }
          "
        >
          <div class="game-info-card-wrapper">
            <GenshinInfoCard
              class="game-info-card"
              :style="`width: calc(984px * min(${hScale}, ${vScale}))`"
              v-model="mode"
            />
          </div>

          <div class="game-info-card-wrapper">
            <StarRailInfoCard
              class="game-info-card"
              :style="`width: calc(888px * min(${hScale}, ${vScale}))`"
              v-model="mode"
            />
          </div>

          <div class="game-info-card-wrapper">
            <ZZZInfoCard
              class="game-info-card"
              :style="`width: calc(888px * min(${hScale}, ${vScale}))`"
              v-model="mode"
            />
          </div>
        </MyCarousel>
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

.account-wrapper {
  @apply absolute top-[0.7vw] left-1/2 -translate-x-1/2;
  @apply flex flex-row justify-end text-white;
  font-size: 22px;

  &.toolbar {
    @apply top-[1.5vw];
  }
}

.account-info {
  @apply rounded-full bg-black bg-opacity-50;
  @apply mx-2 h-min cursor-pointer px-[6px] backdrop-blur-md;
  @apply transition-all hover:bg-gray-600 hover:bg-opacity-50;

  & span {
    @apply ml-2 mr-1 font-sans;
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
      @apply py-[8px] ml-1.5;
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
    @apply mt-0.5 border-2 border-yellow-500;
  }
}

.settings-wrapper {
  @apply absolute top-0 w-full right-0;
  @apply backdrop-blur-3xl transition-all;
  background: rgb(255 255 255 / 0.5);
  height: 100vh;
  z-index: 1999;

  &.toolbar {
    @apply transition-all;
    height: calc(100vh - 64px);
  }

  .dark & {
    background: rgb(0 0 0 / 50%);
  }
}

.settings-content {
  @apply absolute top-[3vh] right-[3vw] rounded-lg transition-all;
  width: 40vw;
  height: 100vh;
  z-index: 2000;

  &.toolbar {
    height: calc(100vh - 70px);
  }
}

.player-wrapper {
  @apply absolute top-0 w-full right-0;
  @apply backdrop-blur-3xl transition-all;
  background: rgb(255 255 255 / 0.5);
  height: 100vh;
  z-index: 49;

  &.toolbar {
    @apply transition-all;
    height: calc(100vh - 64px);
  }

  .dark & {
    background: rgb(0 0 0 / 50%);
  }
}

.player-content {
  @apply absolute top-0 left-0 transition-all;
  width: 100vw;
  height: 100vh;
  z-index: 50;

  &.toolbar {
    height: calc(100vh - 64px);
  }
}

.game-info-card-wrapper {
  @apply relative size-full;
}

.game-info-card {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
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
  @apply text-base text-left flex flex-row justify-between transition-all;
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
  max-width: 30vw;
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

.settings-enter-active .outer,
.player-enter-active .outer {
  transition: opacity 0.5s ease;
}

.settings-leave-active .outer,
.player-leave-active .outer {
  transition: opacity 0.5s ease;
  transition-delay: 0.1s;
}

.settings-enter-from .outer,
.settings-leave-to .outer,
.player-enter-from .outer,
.player-leave-to .outer {
  opacity: 0;
}

.settings-enter-active .inner,
.player-enter-active .inner {
  transition: all 0.3s ease;
  transition-delay: 0.2s;
}

.settings-leave-active .inner,
.player-leave-active .inner {
  transition: all 0.3s ease;
}

.settings-enter-from .inner,
.settings-leave-to .inner {
  opacity: 0;
  transform: translateX(100%);
}

.player-enter-from .inner,
.player-leave-to .inner {
  opacity: 0;
  transform: translateY(100px);
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
