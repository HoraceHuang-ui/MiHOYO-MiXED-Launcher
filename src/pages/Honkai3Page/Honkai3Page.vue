<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { translate } from '../../i18n'
import { LauncherInfo, PostInfo } from '../../types/launcher/launcherInfo'
import { useDialog } from '../../utils/template-dialog'
import HI3ImportDialog from './Components/HI3ImportDialog.vue'
import Honkai3Dialog from './Components/Honkai3Dialog.vue'
import MyDropdown from '../../components/MyDropdown.vue'
import ScrollWrapper from '../../components/ScrollWrapper.vue'

const gameName = translate('general_hi3')

const hiLauncherPath = ref('')
const hiGamePath = ref('')
const launcherPath = ref('')
const gamePath = ref('')
const timeUpd6_8 = Date.parse('2023/07/06 12:00:00 UTC+8')
const timeNow = Date.now()
const timeDelta = computed(
  () => Math.ceil((timeNow - timeUpd6_8) / 1000 / 3600 / 24 - 0.5) % 42,
)
const launcherInfo = ref<LauncherInfo>({
  banner: [],
  icon: [],
  post: [],
  qq: [],
})
const launcherInfoReady = ref(false)
const launcherInfoFailed = ref(false)
const errMsg = ref('')
const hideElements = ref(false)
const scrollBarRef = ref()

const postTypeMap = new Map()

onMounted(async () => {
  // 获取崩3启动器信息
  window.axios
    .post(translate('hi3_launcherContentsUrl'))
    .then(value => {
      launcherInfo.value = value.data
      launcherInfo.value.post.forEach((post: PostInfo) => {
        let tmp = postTypeMap.get(post.type)
        if (tmp) {
          tmp.push(post)
          postTypeMap.set(post.type, tmp)
        } else {
          postTypeMap.set(post.type, [post])
        }
      })
      launcherInfoReady.value = true
      console.log(launcherInfo.value)
    })
    .catch(err => {
      launcherInfoFailed.value = true
      errMsg.value = err.toString()
    })
  hiLauncherPath.value = await window.store.get('hi3LauncherPath')
  hiGamePath.value = await window.store.get('hi3GamePath')
  window.store
    .get('honkai3Upd')
    .then(resp => {
      if (hiLauncherPath.value && !resp) {
        if (timeDelta.value > 40) {
          useDialog(
            Honkai3Dialog,
            {
              onOk(dispose: () => void) {
                window.child.exec(hiLauncherPath.value)
                window.store.set('honkai3Upd', true, false)
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
            Honkai3Dialog,
            {
              onOk(dispose: () => void) {
                window.child.exec(hiLauncherPath.value)
                window.store.set('honkai3Upd', true, false)
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
            Honkai3Dialog,
            {
              onOk(dispose: () => void) {
                window.child.exec(hiLauncherPath.value)
                window.store.set('honkai3Upd', true, false)
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
        hiLauncherPath.value &&
        timeDelta.value > 2 &&
        timeDelta.value < 37
      ) {
        window.store.set('honkai3Upd', false, false)
      }
    })
    .catch(err => {
      console.error(err)
    })
})

const importButtonClick = () => {
  useDialog(HI3ImportDialog, {
    onOk(dispose: () => void) {
      refresh()
      dispose()
    },
    onCancel(dispose: () => void) {
      gamePath.value = ''
      launcherPath.value = ''
      dispose()
    },
  })
}
const hiLaunch = async () => {
  await window.child.exec(hiGamePath.value)
  const trayOnLaunch = await window.store.get('trayOnLaunch')
  if (trayOnLaunch) {
    window.win.tray()
  }
}

const handleCommand = (idx: number) => {
  const commands = ['openLauncher', 'clearPath', 'clearPlayerinfo']

  switch (commands[idx]) {
    case 'openLauncher':
      window.child.exec(hiLauncherPath.value)
      break
    case 'clearPath':
      window.store.delete('hi3LauncherPath')
      window.store.delete('hi3GamePath')
      window.store.delete('honkai3Upd')
      hiLauncherPath.value = ''
      hiGamePath.value = ''
      break
    // case 'clearPlayerinfo':
    //     window.store.delete('honkai3Info')
    // router.push({
    //     name: 'tempPage',
    //     query: {
    //         from: '/hipage'
    //     }
    // })
    //     break
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
      from: '/hipage',
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
    <div class="mt-3 text-xl">{{ $t('general_loading') }}</div>
  </div>
  <LoadFailedBlock
    v-else-if="launcherInfoFailed"
    class="absolute z-10 -translate-x-1/2"
    style="margin-left: 50%; margin-top: 25vh"
    :gameNo="2"
    :errMsg="errMsg"
  >
  </LoadFailedBlock>
  <div
    class="transition-all relative"
    :class="launcherInfoReady ? 'opacity-100' : 'opacity-0 blur-lg scale-90'"
    style="width: 98vw; height: 92vh; transition-duration: 400ms"
  >
    <div
      class="bg-pic"
      style="transition-duration: 500ms; border-radius: 1.5rem 1.5rem 0 0"
      :class="{ 'scale-95': hideElements }"
    >
      <img
        class="top-0 rounded-3xl transition-all h-full w-full object-cover"
        :class="hideElements ? 'blur-md scale-125 brightness-75' : ''"
        style="transition-duration: 500ms"
        :src="
          launcherInfo.adv && launcherInfoReady
            ? launcherInfo.adv.background
            : '../../src/assets/hi3banner.webp'
        "
        @touchmove.prevent
        @mousewheel.prevent
      />
    </div>
    <Transition name="banner">
      <LauncherBanner
        class="absolute left-16 top-48 z-50 rounded-xl transition-all"
        v-if="
          launcherInfoReady &&
          'banner' in launcherInfo &&
          launcherInfo.banner.length > 0 &&
          !hideElements
        "
        :banners="launcherInfo.banner"
        style="height: 182px; width: 396px; transition-duration: 500ms"
      />
    </Transition>
    <Transition name="posts">
      <LauncherPosts
        :postTypeMap="postTypeMap"
        v-if="
          launcherInfoReady &&
          'post' in launcherInfo &&
          launcherInfo.post.length > 0 &&
          !hideElements
        "
        class="absolute left-16 top-96 z-50 rounded-xl transition-all backdrop-blur-md pl-3 pr-1 font-bold"
        style="
          height: 112px;
          width: 396px;
          background-color: rgb(255 255 255 / 0.7);
          transition-duration: 500ms;
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
        <div class="w-full flex flex-row justify-between">
          <div class="w-1"></div>
          <div
            v-if="hiGamePath"
            class="transition-all"
            :class="hideElements ? ' -translate-x-96' : ''"
            style="transition-duration: 500ms"
          >
            <div class="mx-2 my-3 flex flex-row rounded-full bg-yellow-400">
              <button
                @click="hiLaunch"
                class="pl-4 px-4 text-2xl rounded-full h-16 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all font-bold"
              >
                {{ $t('general_launchGame') }}
              </button>
              <MyDropdown
                class="h-full px-1"
                @command="handleCommand"
                item-class="text-sm"
                placement="top"
                width="200px"
                :items="[
                  $t('general_openOfficialLauncher'),
                  $t('general_clearGamePath'),
                ]"
              >
                <button
                  class="text-xl font-sr text-gray-900 px-2 mt-1 h-14 rounded-full hover:bg-yellow-500 transition-all"
                >
                  …
                </button>
              </MyDropdown>
            </div>
          </div>
          <div v-else>
            <div class="justify-between flex flex-row">
              <div class="w-1"></div>
              <div class="flex flex-row">
                <button
                  @click="importButtonClick"
                  class="mx-2 my-3 rounded-full h-16 text-2xl bg-yellow-400 font-bold w-48 hover:bg-yellow-500 active:bg-yellow-800 active:scale-90 transition-all cursor-default"
                  :class="hideElements ? ' -translate-x-96' : ''"
                  style="transition-duration: 500ms"
                >
                  {{ $t('general_importGame') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- <div
                    class="my-2 h-36 w-full mb-4 shadow-md text-center rounded-2xl bg-white bg-opacity-40 backdrop-blur-md">
                    崩坏3玩家信息尚未支持，敬请期待</div> -->
      </div>
    </ScrollWrapper>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-pic {
  width: 98vw;
  height: 96.5vh;
  /* -webkit-mask: linear-gradient(white 50%, transparent) */
  -webkit-mask: linear-gradient(white, white);
}

.scroll-wrapper {
  top: 2vh;
  left: 8vw;
}

.items-scroll {
  margin-top: 67vh;
  width: 82vw;
}

.import-button-enabled {
  @apply border border-gray-400 text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-100 active:bg-blue-300;
}

.import-button-disabled {
  @apply bg-gray-100 text-gray-400 pointer-events-none;
}

.confirm-button-enabled {
  @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
  @apply bg-blue-200 text-white pointer-events-none;
}

.font-sr {
  font-family: sr-font, sans-serif;
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
