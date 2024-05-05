<script setup lang="ts">
import { Component, computed, h, inject, onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { translate } from '../i18n'
import { LauncherInfo, PostInfo } from '../types/launcher/launcherInfo'
import GenshinInfoCard from './GenshinPage/Components/GenshinInfoCard.vue'
import { useDialog } from '../utils/template-dialog'
import GenshinDialog from './GenshinPage/Components/GenshinDialog.vue'
import GSImportDialog from './GenshinPage/Components/GSImportDialog.vue'
import ScrollWrapper from '../components/ScrollWrapper.vue'
import MyDropdown from '../components/MyDropdown.vue'
import StarRailDialog from './StarRailPage/Components/StarRailDialog.vue'
import Honkai3Dialog from './Honkai3Page/Components/Honkai3Dialog.vue'
import SRImportDialog from './StarRailPage/Components/SRImportDialog.vue'
import HI3ImportDialog from './Honkai3Page/Components/HI3ImportDialog.vue'
import StarRailInfoCard from './StarRailPage/Components/StarRailInfoCard.vue'
import { useStore } from '../store'
import { SrRegInfo } from '../types/starrail/srRegInfo'
import { GsRegInfo } from '../types/genshin/gsRegInfo'

const store = useStore()

const game = useRoute().query.game
const gameName = translate(`general_${game}`)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

const timeNow = Date.now()
const timeDelta = computed(() => {
  let timeUpd = 0
  switch (game) {
    case 'gs':
      timeUpd = Date.parse('2023/07/05 12:00:00 UTC+8')
      break
    case 'sr':
      timeUpd = Date.parse('2023/10/11 12:00:00 UTC+8')
      break
    case 'hi3':
      timeUpd = Date.parse('2023/07/06 12:00:00 UTC+8')
      break
  }
  return Math.ceil((timeNow - timeUpd) / 1000 / 3600 / 24 - 0.5) % 42
})
const gameNo = computed(() => {
  switch (game) {
    case 'gs':
      return 0
    case 'sr':
      return 1
    case 'hi3':
      return 2
  }
  return -1
})
const gameStore = computed(() => store.game[game as string])
const defaultBG = computed(() => {
  switch (game) {
    case 'gs':
      return '../../src/assets/gsbanner.png'
    case 'sr':
      return '../../src/assets/srbanner.jpg'
    case 'hi3':
      return '../../src/assets/hi3banner.webp'
  }
  return '../../src/assets/gsbanner.png'
})
const prefFont = computed(() => {
  switch (game) {
    case 'gs':
      return 'font-gs'
    case 'sr':
      return 'font-sr-sans'
    case 'hi3':
      return 'font-bold'
  }
  return 'font-normal'
})
let dialogComponent: Component = GenshinDialog
const launcherInfo = ref<LauncherInfo>({
  adv: undefined,
  banner: [],
  icon: [],
  links: undefined,
  more: undefined,
  post: [],
  qq: [],
})
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollBarRef = ref()

const postTypeMap = new Map<string, PostInfo[]>()
const newAccountName = ref('')

onMounted(async () => {
  switch (game) {
    case 'gs':
      dialogComponent = GenshinDialog
      break
    case 'sr':
      dialogComponent = StarRailDialog
      break
    case 'hi3':
      dialogComponent = Honkai3Dialog
      break
  }

  // 获取原神启动器信息
  window.axios
    .post(translate(`${game}_launcherContentsUrl`))
    .then(value => {
      launcherInfo.value = value.data
      launcherInfo.value.post.forEach(post => {
        let tmp = postTypeMap.get(post.type)
        if (tmp) {
          tmp.push(post)
          postTypeMap.set(post.type, tmp)
        } else {
          postTypeMap.set(post.type, [post])
        }
      })
      launcherInfoReady.value = true
    })
    .catch(err => {
      launcherInfoFailed.value = true
      errMsg.value = err.toString()
    })

  if (gameStore.value.launcherPath && !gameStore.value.upd) {
    if (timeDelta.value > 40) {
      useDialog(
        dialogComponent,
        {
          onCancel(dispose: () => void) {
            dispose()
          },
          onOk(dispose: () => void) {
            window.child.exec(gameStore.value.launcherPath!)
            gameStore.value.upd = true
            dispose()
          },
        },
        {
          title: translate('general_gameUpdBoxTitle'),
          msg: translate('general_gameUpdBoxText1', {
            game: gameName,
            beDays: translate('general_beDays', {
              n: 42 - timeDelta.value,
            }),
          }),
          msgCenter: false,
          showCancel: true,
          hScale: hScale,
          vScale: vScale,
        },
      )
    } else if (timeDelta.value > 0 && timeDelta.value < 3) {
      useDialog(
        dialogComponent,
        {
          onCancel(dispose: () => void) {
            dispose()
          },
          onOk(dispose: () => void) {
            window.child.exec(gameStore.value.launcherPath!)
            gameStore.value.upd = true
            dispose()
          },
        },
        {
          title: translate('general_gameUpdBoxTitle'),
          msg: translate('general_gameUpdBoxText2', {
            game: gameName,
            days: translate('general_days', { n: timeDelta.value }),
          }),
          msgCenter: false,
          showCancel: true,
          hScale: hScale,
          vScale: vScale,
        },
      )
    } else if (timeDelta.value == 0) {
      useDialog(
        dialogComponent,
        {
          onCancel(dispose: () => void) {
            dispose()
          },
          onOk(dispose: () => void) {
            window.child.exec(gameStore.value.launcherPath!)
            gameStore.value.upd = true
            dispose()
          },
        },
        {
          title: translate('general_gameUpdBoxTitle'),
          msg: translate('general_gameUpdBoxText3', {
            game: gameName,
          }),
          msgCenter: false,
          showCancel: true,
          hScale: hScale,
          vScale: vScale,
        },
      )
    }
  } else if (
    gameStore.value.launcherPath &&
    timeDelta.value > 2 &&
    timeDelta.value < 37
  ) {
    gameStore.value.upd = true
  }
})

const importButtonClick = () => {
  let importDialogComponent: Component = GSImportDialog
  switch (game) {
    case 'gs':
      importDialogComponent = GSImportDialog
      break
    case 'sr':
      importDialogComponent = SRImportDialog
      break
    case 'hi3':
      importDialogComponent = HI3ImportDialog
      break
  }

  useDialog(
    importDialogComponent,
    {
      onOk(dispose: () => void) {
        dispose()
        refresh()
      },
      onCancel(dispose: () => void) {
        dispose()
      },
    },
    {
      hScale: hScale,
      vScale: vScale,
    },
  )
}

const launchGame = async () => {
  if (gameStore.value.curAccountId != -1) {
    if (gameNo.value == 0) {
      await window.reg.gsSet(
        JSON.stringify(gameStore.value.accounts[gameStore.value.curAccountId]),
      )
    } else if (gameNo.value == 1) {
      await window.reg.srSet(
        JSON.stringify(gameStore.value.accounts[gameStore.value.curAccountId]),
      )
    }
  }
  await window.child.exec(gameStore.value.gamePath!)
  if (store.settings.general.trayOnLaunch) {
    window.win.tray()
  }
}

const retrieveAccount = async () => {
  newAccountName.value = ''
  useDialog(
    dialogComponent,
    {
      async onOk(dispose: () => void) {
        if (newAccountName.value === '') {
          return
        }

        if (gameNo.value == 0) {
          const res = await window.reg.gsGet()
          console.log(res)
          if (res) {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: res.mihoyoSdk,
              generalData: res.generalData,
            })
          } else {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: [],
              generalData: [],
            })
          }
        } else if (gameNo.value == 1) {
          const res = await window.reg.srGet()
          console.log(res)
          if (res) {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: res.mihoyoSdk,
              lastUserId: res.lastUserId,
            })
          } else {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: [],
              lastUserId: 0,
            })
          }
        }
        dispose()
      },
    },
    {
      title: translate('general_addAccountTitle'),
      msg: translate('general_addAccountMsg'),
      showCancel: true,
      closeOnOk: false,
      hScale: hScale,
      vScale: vScale,
      vnode: () =>
        h('div', [
          h(
            'div',
            {
              class: 'w-full text-center mt-3 ' + prefFont.value,
              style: {
                fontSize: 'larger',
              },
            },
            translate('general_addAccountWarning'),
          ),
          h(
            'div',
            {
              class: 'flex flex-row justify-center w-full mt-1',
            },
            [
              h('input', {
                type: 'text',
                class: 'rounded-full w-[80%] px-2 py-1 text-center',
                value: newAccountName.value,
                placeholder: translate('general_addAccountPlaceholder'),
                onInput: (e: Event) => {
                  newAccountName.value = (e.target as HTMLInputElement).value
                },
                style:
                  gameNo.value == 1
                    ? {
                        background: 'white',
                        border: '1px solid gray',
                      }
                    : undefined,
              }),
            ],
          ),
        ]),
    },
  )
}

const handleCommand = (idx: number) => {
  const commands = [
    'openLauncher',
    'clearPath',
    'clearPlayerinfo',
    'clearAccounts',
  ]

  switch (commands[idx]) {
    case 'openLauncher':
      window.child.exec(gameStore.value.launcherPath!)
      break
    case 'clearPath':
      gameStore.value.launcherPath = undefined
      gameStore.value.gamePath = undefined
      break
    case 'clearPlayerinfo':
      gameStore.value.playerInfo = undefined
      refresh()
      break
    case 'clearAccounts':
      gameStore.value.accounts = []
      gameStore.value.curAccountId = -1
      break
  }
}

const switchAccount = (idx: number) => {
  gameStore.value.curAccountId = idx - 1
}

const handleScroll = ({ top }: Record<string, number>) => {
  hideElements.value = top > 0
}

const router = useRouter()
const refresh = () => {
  router.push({
    name: 'tempPage',
    query: {
      from: game,
    },
  })
}
</script>

<template>
  <div v-if="!launcherInfoFailed && !launcherInfoReady" class="loading-wrapper">
    <div class="flex flex-row w-full justify-center">
      <img
        :src="'../../src/assets/kleeLoading.gif'"
        class="loading-image"
        loading="eager"
        height="120"
        width="120"
      />
    </div>
    <div class="mt-3 text-xl" :class="`font-${game}`">
      {{ $t('general_loading') }}
    </div>
  </div>
  <LoadFailedBlock
    v-else-if="launcherInfoFailed"
    class="failed-wrapper"
    :gameNo="gameNo"
    :errMsg="errMsg"
  >
  </LoadFailedBlock>
  <div class="content-wrapper" :class="{ from: !launcherInfoReady }">
    <div
      class="bg-pic-wrapper"
      :class="{ scrolled: hideElements, mask: gameNo != 2 }"
    >
      <img
        class="bg-pic"
        :class="{ scrolled: hideElements }"
        :src="
          launcherInfoReady && launcherInfo.adv
            ? launcherInfo.adv.background
            : defaultBG
        "
        @touchmove.prevent
        @mousewheel.prevent
      />
    </div>
    <Transition name="banner">
      <LauncherBanner
        v-if="
          launcherInfoReady &&
          'banner' in launcherInfo &&
          launcherInfo.banner.length > 0 &&
          !hideElements
        "
        class="launcher-banner"
        :banners="launcherInfo.banner"
      />
    </Transition>
    <Transition name="posts">
      <LauncherPosts
        v-if="
          launcherInfoReady &&
          'post' in launcherInfo &&
          launcherInfo.post.length > 0 &&
          !hideElements
        "
        :postTypeMap="postTypeMap"
        class="launcher-posts"
        :class="prefFont"
      />
    </Transition>
    <ScrollWrapper
      ref="scrollBarRef"
      height="calc(100vh - 56px - 1rem)"
      class="scroll-wrapper"
      @scroll="handleScroll"
      show-bar="never"
    >
      <div class="items-scroll">
        <div class="launch-area-wrapper">
          <div class="h-[9vh] my-[2vh]" />
          <div
            class="right"
            v-if="gameStore.gamePath"
            :class="{ scrolled: hideElements }"
          >
            <div
              class="account-wrapper"
              v-if="
                !hideElements && 'accounts' in gameStore && gameStore.gamePath
              "
              :style="`font-size: calc(20px * min(${hScale}, ${vScale}));
                margin-top: calc(10vh - 28px * min(${hScale}, ${vScale}))`"
            >
              <div
                class="retrieve-account"
                :style="`padding: calc(4px * min(${hScale}, ${vScale})) calc(8px * min(${hScale}, ${vScale}))`"
                @click="retrieveAccount"
              >
                <i class="bi bi-plus-lg" />
              </div>
              <MyDropdown
                :items="[
                  $t('general_doNotModify'),
                  ...gameStore.accounts.map(
                    (acc: GsRegInfo | SrRegInfo) => acc.name,
                  ),
                ]"
                class="account-info"
                :class="prefFont"
                item-class="text-gray-800 px-2 dark:text-gray-200"
                :style="`padding: calc(4px * min(${hScale}, ${vScale})) calc(9px * min(${hScale}, ${vScale})) calc(1px * min(${hScale}, ${vScale})) calc(9px * min(${hScale}, ${vScale}))`"
                middle
                placement="top"
                @command="switchAccount"
              >
                <i
                  class="bi bi-person-circle"
                  :style="`font-size: calc(22px * min(${hScale}, ${vScale}))`"
                />
                <span
                  v-if="gameStore.curAccountId != -1"
                  :style="`margin-left: calc(6px * min(${hScale}, ${vScale}))`"
                >
                  {{
                    gameStore.accounts.length > 0
                      ? gameStore.accounts[gameStore.curAccountId].name
                      : ''
                  }}
                </span>
              </MyDropdown>
            </div>
            <div class="launch-button-wrapper" :class="prefFont">
              <button
                @click="launchGame"
                class="launch-button"
                :style="`font-size: calc(min(60px, 25px * min(${hScale}, ${vScale})))`"
              >
                {{ $t('general_launchGame') }}
              </button>
              <MyDropdown
                class="launch-dropdown"
                @command="handleCommand"
                placement="top"
                :items="
                  gameNo == 2
                    ? [
                        $t('general_openOfficialLauncher'),
                        $t('general_clearGamePath'),
                      ]
                    : [
                        $t('general_openOfficialLauncher'),
                        $t('general_clearGamePath'),
                        $t('general_clearProfileInfo'),
                        $t('general_clearAccounts'),
                      ]
                "
                middle
              >
                <button
                  class="font-gs dropdown-trigger"
                  :style="`font-size: calc(min(60px, 25px * min(${hScale}, ${vScale})));`"
                >
                  …
                </button>
              </MyDropdown>
            </div>
          </div>
          <button
            v-else
            @click="importButtonClick"
            class="import-button"
            :class="[{ scrolled: hideElements }, prefFont]"
            :style="`font-size: calc(min(60px, 25px * min(${hScale}, ${vScale})));`"
          >
            {{ $t('general_importGame') }}
          </button>
        </div>
        <GenshinInfoCard v-if="game === 'gs'" class="game-info-card" />
        <StarRailInfoCard v-else-if="game === 'sr'" class="game-info-card" />
      </div>
    </ScrollWrapper>
  </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
  @apply absolute z-0 w-full top-[45%];
  @apply align-middle justify-center text-center;
  @apply pointer-events-none;
}

.loading-image {
  @apply align-middle self-center object-scale-down;
}

.failed-wrapper {
  @apply absolute z-10 -translate-x-1/2 ml-[50%] mt-[25vh];
}

.content-wrapper {
  @apply relative w-[98vw];
  @apply transition-all;
  transition-duration: 400ms;

  &.from {
    @apply opacity-0 blur-lg scale-90;
  }
}

.bg-pic-wrapper {
  @apply rounded-3xl;
  width: 98vw;
  height: calc(100vh - 56px + 1.5rem);
  transition-duration: 500ms;

  &.scrolled {
    @apply scale-x-95 translate-y-3;
  }

  &.mask {
    -webkit-mask: linear-gradient(white 50%, transparent);
  }
}

.bg-pic {
  @apply top-0 rounded-3xl w-full h-full;
  @apply transition-all object-cover;
  transition-duration: 500ms;

  .dark & {
    @apply brightness-[85%];
  }

  &.scrolled {
    @apply blur-md scale-125 brightness-75;
    .dark & {
      @apply brightness-[50%];
    }
  }
}

.launcher-banner {
  @apply absolute left-[5.3vw] top-[27.4vh] z-50 rounded-xl;
  height: 26vh;
  width: 56.5vh;
}

.launcher-posts {
  @apply absolute left-[5.3vw] top-[54.8vh] z-50 rounded-xl pl-3 pr-1;
  @apply backdrop-blur-md bg-white bg-opacity-70;
  height: 16vh;
  width: 56.5vh;

  .dark & {
    @apply bg-black bg-opacity-60;
  }
}

.scroll-wrapper {
  @apply absolute z-40;
  top: 1rem;
  left: 8vw;
}

.items-scroll {
  margin-top: calc(78vh - 68px - 1rem);
  width: 82vw;
}

.launch-area-wrapper {
  @apply w-full flex flex-row relative;

  & .right {
    @apply absolute right-0 transition-all;
    @apply flex flex-row;
    transition-duration: 500ms;

    &.scrolled {
      @apply right-1/2 translate-x-1/2;
    }
  }
}

.account-wrapper {
  @apply flex flex-row justify-end text-white;
}

.retrieve-account {
  @apply rounded-full bg-black bg-opacity-30;
  @apply h-min cursor-pointer;
  @apply transition-all hover:bg-gray-600 hover:bg-opacity-30;
}

.account-info {
  @apply rounded-full bg-black bg-opacity-30;
  @apply mx-2 h-min cursor-pointer;
  @apply transition-all hover:bg-gray-600 hover:bg-opacity-30;

  & span {
    @apply ml-2 mr-1 font-sans;
  }
}

.launch-button-wrapper {
  @apply flex flex-row mx-[0.67vw] mt-[2vh] rounded-full bg-yellow-400;

  .dark & {
    @apply bg-yellow-700;
  }
}

.launch-button {
  @apply px-[1.3vw] py-[2vh] font-bold rounded-full;
  @apply hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;

  @apply dark:bg-yellow-700 dark:hover:bg-yellow-600 dark:active:bg-yellow-500;

  .dark & {
    @apply bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-500;
  }
}

.launch-dropdown {
  @apply h-full text-sm;

  .dropdown-trigger {
    @apply h-[9vh] mr-[0.8vw];
    @apply rounded-full hover:bg-yellow-500 transition-all;

    .dark & {
      @apply hover:bg-yellow-600;
    }
  }
}

.import-button {
  @apply cursor-default;
  @apply absolute right-0 px-[1.3vw] py-[2vh] rounded-full;
  @apply bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all;
  min-width: 160px;
  transition-duration: 500ms;

  .dark & {
    @apply bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-500;
  }

  &.scrolled {
    @apply right-1/2 translate-x-1/2;
  }
}

.game-info-card {
  @apply my-2 w-full shadow-md;
}

.banner-enter-from,
.banner-leave-to {
  @apply opacity-0 -translate-y-10 pointer-events-none blur-md -translate-x-14 scale-110;
}

.posts-enter-from,
.posts-leave-to {
  @apply opacity-0 -translate-y-2 pointer-events-none blur-md -translate-x-14 scale-110;
}

.banner-enter-active,
.banner-leave-active,
.posts-enter-active,
.posts-leave-active {
  transition: all 0.5s ease;
}
</style>
