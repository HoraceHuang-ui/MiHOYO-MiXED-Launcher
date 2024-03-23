<script setup lang="ts">
import { Component, computed, onMounted, ref } from 'vue'
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
      return 'gs'
    case 'sr':
      return 'sr-sans'
    case 'hi3':
      return 'normal'
  }
  return 'normal'
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
  <div
    v-if="!launcherInfoFailed && !launcherInfoReady"
    class="absolute pointer-events-none z-0 align-middle justify-center text-center"
    style="top: 45%; left: 45%"
  >
    <img
      :src="'../../src/assets/kleeLoading.gif'"
      class="align-middle self-center object-scale-down"
      loading="eager"
      height="120"
      width="120"
    />
    <div class="mt-3 text-xl" :class="`font-${game}`">
      {{ $t('general_loading') }}
    </div>
  </div>
  <LoadFailedBlock
    v-else-if="launcherInfoFailed"
    class="absolute z-10 -translate-x-1/2"
    style="margin-left: 50%; margin-top: 25vh"
    :gameNo="gameNo"
    :errMsg="errMsg"
  >
  </LoadFailedBlock>
  <div
    class="transition-all relative"
    :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
    style="width: 98vw; height: 92vh; transition-duration: 400ms"
  >
    <div
      class="bg-pic rounded-3xl"
      style="transition-duration: 500ms"
      :class="hideElements ? 'scale-x-95 translate-y-3' : ''"
    >
      <img
        class="top-0 rounded-3xl transition-all w-full h-full object-cover"
        :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
        style="transition-duration: 500ms"
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
        class="absolute left-16 top-48 z-50 rounded-xl"
        :banners="launcherInfo.banner"
        style="height: 182px; width: 396px"
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
        class="absolute left-16 top-96 z-50 rounded-xl backdrop-blur-md pl-3 pr-1"
        :class="`font-${prefFont}`"
        style="
          height: 112px;
          width: 396px;
          background-color: rgb(255 255 255 / 0.7);
        "
      />
    </Transition>
    <ScrollWrapper
      ref="scrollBarRef"
      height="91vh"
      class="scroll-wrapper absolute z-40"
      @scroll="handleScroll"
      show-bar="never"
    >
      <div
        class="items-scroll flex flex-col content-center items-center w-full"
      >
        <div class="w-full flex flex-row relative">
          <div class="h-16 my-3" />
          <div
            v-if="gamePath"
            class="absolute right-0 transition-all"
            :class="hideElements ? 'right-1/2 translate-x-1/2' : ''"
            style="transition-duration: 500ms"
          >
            <div
              class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400"
              :class="`font-${prefFont}`"
            >
              <button
                @click="launchGame"
                class="pl-4 px-4 text-2xl font-bold rounded-full h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all"
              >
                {{ $t('general_launchGame') }}
              </button>
              <MyDropdown
                class="h-full px-1 text-sm"
                @command="handleCommand"
                placement="top"
                width="200px"
                :items="[
                  $t('general_openOfficialLauncher'),
                  $t('general_clearGamePath'),
                  $t('general_clearProfileInfo'),
                ]"
                middle
              >
                <button
                  class="text-xl text-gray-900 px-2 h-16 rounded-full hover:bg-yellow-500 transition-all"
                >
                  …
                </button>
              </MyDropdown>
            </div>
          </div>
          <button
            v-else
            @click="importButtonClick"
            class="absolute right-0 mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
            :class="
              hideElements
                ? `font-${prefFont} right-1/2 translate-x-1/2`
                : `font-${prefFont}`
            "
            style="transition-duration: 500ms"
          >
            {{ $t('general_importGame') }}
          </button>
        </div>
        <GenshinInfoCard
          v-if="game === 'gs'"
          class="my-2 w-full mb-4 shadow-md"
        />
        <StarRailInfoCard
          v-else-if="game === 'sr'"
          class="my-2 w-full mb-4 shadow-md"
        />
      </div>
    </ScrollWrapper>
  </div>
</template>

<style scoped>
.bg-pic {
  width: 98vw;
  height: 96.5vh;
  -webkit-mask: linear-gradient(white 50%, transparent);
}

.scroll-wrapper {
  top: 2vh;
  left: 8vw;
}

.items-scroll {
  margin-top: 67vh;
  width: 82vw;
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
