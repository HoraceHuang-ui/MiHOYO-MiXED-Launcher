<script setup lang="ts">
import {
  Component,
  computed,
  h,
  inject,
  onMounted,
  ref,
  Ref,
  toValue,
} from 'vue'
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
import { BgImageInfo } from '../types/launcher/bgImageInfo'
import ZZZImportDialog from './ZZZPage/Components/ZZZImportDialog.vue'

const store = useStore()

const gameBizMap: Record<string, string> = {
  gs: 'hk4e',
  sr: 'hkrpg',
  hi3: 'bh3',
  zzz: 'nap',
}
const game = useRoute().query.game
const gameName = translate(`general_${game}`)
const gameBiz = gameBizMap[game as string]

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
    case 'zzz':
      timeUpd = Date.parse('2023/07/04 12:00:00 UTC+8')
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
    case 'zzz':
      return 3
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
    case 'zzz':
      return '../../src/assets/zzzbanner.webp'
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
    case 'zzz':
      return 'font-bold'
  }
  return 'font-normal'
})
let dialogComponent: Component = GenshinDialog
const launcherInfo = ref<LauncherInfo>({
  banners: [],
  game: undefined,
  language: '',
  posts: [],
  social_media_list: [],
})
const bgImagesInfo = ref<BgImageInfo[]>()
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const bgImagesReady = ref(false)
const bgImagesFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollBarRef = ref()

const postTypeMap = new Map<string, PostInfo[]>()
const newAccountName = ref('')

const defDialogComponent = (game: string) => {
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
    case 'zzz':
      dialogComponent = ZZZImportDialog
      break
    default:
      defDialogComponent(store.settings.appearance.dialogStyle)
      break
  }
}

onMounted(async () => {
  defDialogComponent(game ? game.toString() : '')
  window.axios
    .get(translate(`${game}_launcherContentsUrl`))
    .then(value => {
      launcherInfo.value = value.data.content
      launcherInfo.value.posts.forEach(post => {
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
  window.axios
    .get(translate(`general_gameBackgroundsUrl`))
    .then(value => {
      bgImagesInfo.value = value.data.game_info_list
      bgImagesReady.value = true
    })
    .catch(() => {
      bgImagesFailed.value = true
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

const findBgImage = () => {
  if (bgImagesInfo.value) {
    const res = bgImagesInfo.value.find(a => a.game.biz.startsWith(gameBiz))
    return res && res.backgrounds && res.backgrounds.length != 0
      ? res.backgrounds[0].background.url
      : undefined
  }
  return undefined
}

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
    case 'zzz':
      importDialogComponent = ZZZImportDialog
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
    } else if (gameNo.value == 2) {
      await window.reg.hi3Set(
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
          if (res) {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: res.mihoyoSdk,
              // generalData: res.generalData,
            })
          } else {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: [],
              // generalData: [],
            })
          }
        } else if (gameNo.value == 1) {
          const res = await window.reg.srGet()
          if (res) {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: res.mihoyoSdk,
              // lastUserId: res.lastUserId,
            })
          } else {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: [],
              // lastUserId: 0,
            })
          }
        } else if (gameNo.value == 2) {
          const res = await window.reg.hi3Get()
          if (res) {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: res.mihoyoSdk,
            })
          } else {
            gameStore.value.accounts.push({
              name: newAccountName.value,
              mihoyoSdk: [],
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
                style: toValue(() => {
                  switch (gameNo.value) {
                    case 0:
                      return undefined
                    case 1:
                      return {
                        background: 'white',
                        border: '1px solid gray',
                      }
                    case 2:
                      return {
                        background: '#222',
                      }
                  }
                }),
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
      :class="{ scrolled: hideElements, mask: gameNo != 2 && gameNo != 3 }"
    >
      <img
        class="bg-pic"
        :class="{ scrolled: hideElements }"
        :src="bgImagesReady && findBgImage() ? findBgImage() : defaultBG"
        @touchmove.prevent
        @mousewheel.prevent
      />
    </div>
    <Transition name="banner">
      <LauncherBanner
        v-if="
          launcherInfoReady &&
          'banners' in launcherInfo &&
          launcherInfo.banners.length > 0 &&
          !hideElements
        "
        class="launcher-banner"
        :class="{ 'extra-sink': gameNo == 2 || gameNo == 3 }"
        :banners="launcherInfo.banners"
      />
    </Transition>
    <Transition name="posts">
      <LauncherPosts
        v-if="
          launcherInfoReady &&
          'posts' in launcherInfo &&
          launcherInfo.posts.length > 0 &&
          !hideElements
        "
        :postTypeMap="postTypeMap"
        class="launcher-posts"
        :class="[prefFont, { 'extra-sink': gameNo == 2 || gameNo == 3 }]"
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
        <div
          class="launch-area-wrapper"
          :class="{ 'extra-sink': gameNo == 2 || gameNo == 3 }"
        >
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
                :selected="gameStore.curAccountId + 1"
                @command="switchAccount"
              >
                <i
                  class="bi bi-person-circle"
                  :style="`font-size: calc(22px * min(${hScale}, ${vScale}))`"
                />
                <span
                  class="font-normal"
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
                  gameNo == 2 || gameNo == 3
                    ? [
                        $t('general_openOfficialLauncher'),
                        $t('general_clearGamePath'),
                        $t('general_clearAccounts'),
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
  -webkit-mask: linear-gradient(white, white);

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
  transform: scale(1.03);

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

.extra-sink {
  transform: translateY(6vh);
}

.launcher-banner {
  @apply absolute left-[8vw] top-[38vh] z-50 rounded-xl;
  height: 26vh;
  width: 56.5vh;
}

.launcher-posts {
  @apply absolute left-[8vw] z-[49] rounded-xl pl-3 pr-1;
  @apply backdrop-blur-md bg-white bg-opacity-70;
  top: calc(64vh - 1.5rem);
  height: calc(16vh + 1.5rem);
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
  @apply h-[9vh] mt-[2vh] absolute right-0 px-[1.3vw] py-[2vh] rounded-full;
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
