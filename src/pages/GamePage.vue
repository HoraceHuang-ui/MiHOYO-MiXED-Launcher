<script setup lang="ts">
import { Component, computed, inject, onMounted, Ref, ref } from 'vue'
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

const game = useRoute().query.game
const gameName = translate(`general_${game}`)

const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')

const launcherPath = ref('')
const gamePath = ref('')
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
  launcherPath.value = await window.store.get(`${game}LauncherPath`)
  gamePath.value = await window.store.get(`${game}GamePath`)
  window.store
    .get(`${game}Upd`)
    .then(resp => {
      if (launcherPath.value && !resp) {
        if (timeDelta.value > 40) {
          useDialog(
            dialogComponent,
            {
              onCancel(dispose: () => void) {
                dispose()
              },
              onOk(dispose: () => void) {
                window.child.exec(launcherPath.value)
                window.store.set(`${game}Upd`, true, false)
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
                window.child.exec(launcherPath.value)
                window.store.set(`${game}Upd`, true, false)
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
                window.child.exec(launcherPath.value)
                window.store.set(`${game}Upd`, true, false)
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
            },
          )
        }
      } else if (
        launcherPath.value &&
        timeDelta.value > 2 &&
        timeDelta.value < 37
      ) {
        window.store.set(`${game}Upd`, false, false)
      }
    })
    .catch(err => {
      console.error(err)
    })
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

  useDialog(importDialogComponent, {
    onOk(dispose: () => void) {
      dispose()
      refresh()
    },
    onCancel(dispose: () => void) {
      gamePath.value = ''
      launcherPath.value = ''
      dispose()
    },
  })
}

const launchGame = async () => {
  await window.child.exec(gamePath.value)
  const trayOnLaunch = await window.store.get('trayOnLaunch')
  if (trayOnLaunch) {
    window.win.tray()
  }
}

const handleCommand = (idx: number) => {
  const commands = ['openLauncher', 'clearPath', 'clearPlayerinfo']

  switch (commands[idx]) {
    case 'openLauncher':
      window.child.exec(launcherPath.value)
      break
    case 'clearPath':
      window.store.delete(`${game}LauncherPath`)
      window.store.delete(`${game}GamePath`)
      window.store.delete(`${game}Upd`)
      launcherPath.value = ''
      gamePath.value = ''
      break
    case 'clearPlayerinfo':
      window.store.delete(`${game}Info`)
      refresh()
      break
  }
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
    <div class="bg-pic-wrapper" :class="{ scrolled: hideElements }">
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
      height="calc(98vh - 56px)"
      class="scroll-wrapper"
      @scroll="handleScroll"
      show-bar="never"
    >
      <div class="items-scroll">
        <div class="launch-area-wrapper">
          <div class="h-[9vh] my-[2vh]" />
          <div
            v-if="gamePath"
            class="launch-button-wrapper"
            :class="[{ scrolled: hideElements }, prefFont]"
          >
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
              :items="[
                $t('general_openOfficialLauncher'),
                $t('general_clearGamePath'),
                $t('general_clearProfileInfo'),
              ]"
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
  -webkit-mask: linear-gradient(white 50%, transparent);
  transition-duration: 500ms;

  &.scrolled {
    @apply scale-x-95 translate-y-3;
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
  top: 2vh;
  left: 8vw;
}

.items-scroll {
  margin-top: calc(76vh - 68px);
  width: 82vw;
}

.launch-area-wrapper {
  @apply w-full flex flex-row relative;
}

.launch-button-wrapper {
  @apply absolute right-0 transition-all;
  @apply flex flex-row mx-[0.67vw] mt-[2vh] rounded-full bg-yellow-400;
  transition-duration: 500ms;

  .dark & {
    @apply bg-yellow-700;
  }

  &.scrolled {
    @apply right-1/2 translate-x-1/2;
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
