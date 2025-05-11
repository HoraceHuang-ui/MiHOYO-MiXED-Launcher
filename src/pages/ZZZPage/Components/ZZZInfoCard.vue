<script setup lang="ts">
import {
  computed,
  defineModel,
  inject,
  onBeforeUnmount,
  onMounted,
  PropType,
  Ref,
  ref,
} from 'vue'
import { translate } from '../../../i18n'
import { useDialog } from '../../../utils/template-dialog'
import MyTag from '../../../components/MyTag.vue'
import ScrollWrapper from '../../../components/ScrollWrapper.vue'
import MyCarousel from '../../../components/MyCarousel.vue'
import CustomUIDInput from '../../../components/CustomUIDInput.vue'
import { useStore } from '../../../store'
import TextScroll from '../../../components/TextScroll.vue'
import StatIcon from '../../../components/StatIcon.vue'
import ZZZCharDetailsDialog from './ZZZCharDetailsDialog.vue'
import MyTooltip from '../../../components/MyTooltip.vue'
import GamepadIcon from '../../../components/GamepadIcon.vue' // import rankMap from '../textMaps/character_ranks.json' with { type: 'json' }

// import rankMap from '../textMaps/character_ranks.json' with { type: 'json' }

const gamepadMode = defineModel({
  type: String as PropType<
    | 'main'
    | 'settings'
    | 'window-action'
    | 'gs-player'
    | 'sr-player'
    | 'zzz-player'
    | 'dialog'
    | 'accounts'
    | 'out'
  >,
  required: false,
})

const store = useStore()

const playerInfo = ref(store.game.zzz.playerInfo)
const playerInfoLoading = ref(false)
const playerInfoFailed = ref(false)
const uidInput = ref('')
const uidInputDom = ref()
let uid = ''
const charsPage = ref(0)
const pages = computed(() =>
  playerInfo.value &&
  playerInfo.value.ShowcaseAgents &&
  playerInfo.value.ShowcaseAgents.length > 10
    ? Math.floor((playerInfo.value.ShowcaseAgents.length - 10) / 6 - 0.1) + 1
    : 0,
)
const hScale = inject<Ref<number>>('hScale')
const vScale = inject<Ref<number>>('vScale')
const gpType = inject<Ref<string>>('gpType')

const charsScrollbar = ref()
const cardsCarouselRef = ref()
const showcaseIdx = ref(0)
const relicIdx = ref(0)
const initReady = ref(false)
const headerMode = ref(playerInfo.value ? 0 : 1) // 0: Player info, 1: UID Input

const finalStatsOrder = [
  'HpMax',
  'Atk',
  'Def',
  'Crit',
  'CritDmg',
  'BreakStun',
  'ElementAbnormalPower',
  'ElementMystery',
]

const rAF = window.requestAnimationFrame
let rAFId: number | null = null

let inThrottle = false
const gameLoop = () => {
  const gamepads = navigator.getGamepads()
  let gp: Gamepad | null = null

  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      gp = gamepads[i]
      break
    }
  }

  if (!gp) {
    return
  }
  if (!document.hasFocus()) {
    rAF(gameLoop)
    return
  }

  // A: Request user info
  if (gamepadMode.value === 'zzz-player' && gp.buttons[0].pressed) {
    if (!inThrottle) {
      inThrottle = true
      if (headerMode.value == 1) requestInfo()
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // Y: Focus on CustomUIDInput's input
  if (gamepadMode.value === 'zzz-player' && gp.buttons[3].pressed) {
    if (!inThrottle) {
      inThrottle = true
      if (playerInfo.value) headerMode.value = (headerMode.value + 1) % 2
      setTimeout(() => {
        uidInputDom.value?.focusInput()
      }, 500)
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // X: Open details dialog
  if (
    gamepadMode.value === 'zzz-player' &&
    gp.buttons[2].pressed &&
    playerInfo.value
  ) {
    if (!inThrottle) {
      inThrottle = true
      showCharDetails(showcaseIdx.value)
      setTimeout(() => {
        inThrottle = false
      }, 300)
    }
  }

  // LS Horizontal: Select character
  if (
    gamepadMode.value === 'zzz-player' &&
    gp.axes[0] < -0.9 &&
    playerInfo.value
  ) {
    if (!inThrottle) {
      inThrottle = true
      if (showcaseIdx.value > 0) {
        setShowcase(showcaseIdx.value - 1)
      }
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (
    gamepadMode.value === 'zzz-player' &&
    gp.axes[0] > 0.9 &&
    playerInfo.value
  ) {
    if (!inThrottle) {
      inThrottle = true
      if (showcaseIdx.value < playerInfo.value.ShowcaseAgents.length - 1) {
        setShowcase(showcaseIdx.value + 1)
      }
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }

  // RS Horizontal: Select Relics
  if (
    gamepadMode.value === 'zzz-player' &&
    gp.axes[2] < -0.9 &&
    playerInfo.value
  ) {
    if (!inThrottle) {
      inThrottle = true
      if (relicIdx.value == 0) {
        relicIdx.value =
          playerInfo.value.ShowcaseAgents[showcaseIdx.value].EquippedDiscs
            .length - 1
      } else {
        relicIdx.value--
      }
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }
  if (
    gamepadMode.value === 'zzz-player' &&
    gp.axes[2] > 0.9 &&
    playerInfo.value
  ) {
    if (!inThrottle) {
      inThrottle = true
      if (
        relicIdx.value ==
        playerInfo.value.ShowcaseAgents[showcaseIdx.value].EquippedDiscs
          .length -
          1
      ) {
        relicIdx.value = 0
      } else {
        relicIdx.value++
      }
      setTimeout(() => {
        inThrottle = false
      }, 150)
    }
  }

  if (rAFId) {
    rAFId = rAF(gameLoop)
  }
}

onMounted(() => {
  if (playerInfo.value) {
    uid = playerInfo.value.Uid
    uidInput.value = uid
  } else if (gamepadMode.value) {
    uidInputDom.value?.focusInput()
  }
  initReady.value = true

  if (gamepadMode.value) {
    rAFId = rAF(gameLoop)
  }
})

const mergeToPlayerinfo = (newArr: any[]) => {
  if (!playerInfo.value) {
    return
  }

  for (let i = newArr.length - 1; i >= 0; i--) {
    let newChar = newArr[i]
    let exists = false
    // for (let j = playerInfo.value.ShowcaseAgents.length - 1; j >= 0; j--) {
    for (let j = 0; j < playerInfo.value.ShowcaseAgents.length; j++) {
      let oldChar = playerInfo.value.ShowcaseAgents[j]
      if (oldChar.Id == newChar.Id) {
        playerInfo.value.ShowcaseAgents[j] = newChar
        exists = true
        break
      }
    }
    if (!exists) {
      playerInfo.value.ShowcaseAgents.push(newChar)
    }
  }
}

onBeforeUnmount(() => {
  rAFId = null
})

const requestInfo = () => {
  uid = uidInput.value
  playerInfoFailed.value = false
  window.axios
    .post('http://1.92.84.11:5004/Enka', {
      // .post('http://0.0.0.0:5004/Enka', {
      game: 2,
      lang: translate('zzz_enkaLangCode'),
      uid,
    })
    .then(resp => {
      console.log(resp)
      if (playerInfo.value && playerInfo.value.Uid == resp.playerInfo.Uid) {
        console.log('uid equal')
        const { ShowcaseAgents, ...rest } = resp.playerInfo
        mergeToPlayerinfo(ShowcaseAgents)
        for (const key in rest) {
          playerInfo.value[key] = rest[key]
        }
      } else {
        console.log('uid not equal')
        playerInfo.value = resp.playerInfo
      }

      if (!playerInfo.value) {
        playerInfoLoading.value = false
        return
      }

      playerInfo.value.ShowcaseAgents.sort(function (a: any, b: any) {
        // 等级
        if (a.Level < b.Level) {
          return 1
        } else if (a.Level > b.Level) {
          return -1
        } else {
          // 突破等级
          if (a.PromotionLevel < b.PromotionLevel) {
            return 1
          } else if (a.PromotionLevel > b.PromotionLevel) {
            return -1
          } else {
            // 行迹总等级
            if (totalSkillLvs(a) < totalSkillLvs(b)) {
              return 1
            } else {
              return -1
            }
          }
        }
      })

      store.game.zzz.playerInfo = playerInfo.value
      playerInfoLoading.value = false
      headerMode.value = 0
    })
    .catch(err => {
      console.error(err)
      playerInfoLoading.value = false
      playerInfoFailed.value = true
    })
  playerInfoLoading.value = true
  console.log(uid)
}

const totalSkillLvs = (c: any) => {
  let res = 0
  for (const skill in c.SkillLevels) {
    res += c.SkillLevels[skill]
  }
  return res
}

const setShowcase = (index: number) => {
  relicIdx.value = 0
  charsPage.value = Math.floor(index / 10)
  charsScrollbar.value.scrollTo({
    left: charsPage.value * 48 * 6,
    top: 0,
    behavior: 'smooth',
  })
  cardsCarouselRef.value?.setPane?.(index)
  showcaseIdx.value = index
}

const charsPageNext = () => {
  if (charsPage.value < pages.value) {
    charsPage.value++
    charsScrollbar.value.scrollTo({
      // about 48 for each icon, 8 icons on each page
      left: charsPage.value * 48 * 6,
      top: 0,
      behavior: 'smooth',
    })
  }
}
const charsPagePrev = () => {
  if (charsPage.value > 0) {
    charsPage.value--
    charsScrollbar.value.scrollTo({
      left: charsPage.value * 48 * 6,
      top: 0,
      behavior: 'smooth',
    })
  }
}

const showCharDetails = (index: number) => {
  if (gamepadMode.value) {
    gamepadMode.value = 'dialog'
    rAFId = null
  }
  if (!playerInfo.value) {
    return
  }

  useDialog(
    ZZZCharDetailsDialog,
    {
      onCancel: gamepadMode.value
        ? (dispose: () => void) => {
            gamepadMode.value = 'zzz-player'
            rAFId = rAF(gameLoop)
            dispose()
          }
        : undefined,
    },
    {
      title:
        playerInfo.value.ShowcaseAgents[index].Name +
        ' ' +
        translate('sr_charDetails'),
      character: playerInfo.value.ShowcaseAgents[index],
      showOk: false,
      hScale: hScale,
      vScale: vScale,
      gamepadMode: !!gamepadMode.value,
      gpType: gpType?.value,
    },
  )
}
</script>

<template>
  <div
    class="bg-white dark:bg-[#222] mb-3 transition-all"
    :class="{ loading: !initReady }"
    style="border-radius: 4.5vh 4.5vh 30px 30px"
  >
    <!-- HEADER -->
    <MyCarousel
      class="relative w-full h-[9vh] rounded-[4.5vh]"
      :autoplay="false"
      show-arrow="never"
      show-indicator="never"
      v-model="headerMode"
    >
      <div
        class="flex flex-row w-full relative justify-between z-50"
        style="height: 9vh"
      >
        <img
          v-if="playerInfo"
          :src="playerInfo.NameCardIcon"
          class="namecard-mask h-[9vh] object-cover absolute top-0 left-1/2 -translate-x-1/2 z-0"
        />
        <!-- 左上角头像、昵称 -->
        <div
          v-if="playerInfo"
          class="flex flex-row content-start items-center"
          style="width: 35vw"
        >
          <img
            class="rounded-full bg-slate-200 pointer-events-none"
            :style="`height: 6vh; margin-left: 1.5vh`"
            :src="playerInfo.ProfilePictureIcon"
          />
          <div class="font-zzz-bold ml-[1.5vh]">
            <div
              class="text-left"
              :style="`font-size: calc(max(16px * min(${hScale}, ${vScale}), 20px))`"
            >
              {{ playerInfo.Nickname }}
            </div>
            <div class="flex flex-row">
              <div
                class="opacity-60 mt-[-0.5vh]"
                :style="`font-size: calc(max(16px * min(${hScale}, ${vScale}), 12px))`"
              >
                {{ playerInfo.TitleText }}
              </div>
              <MyTooltip
                placement="right"
                max-width="400px"
                middle
                v-for="medal in playerInfo.Medals"
                :key="medal.Type"
              >
                <template #content>
                  <div class="font-zzz-bold">
                    <span style="font-family: sans-serif"
                      >{{ medal.Name }}
                    </span>
                    <span> · {{ medal.Value }}</span>
                  </div>
                </template>
                <img
                  :src="medal.Icon"
                  class="ml-[1vh]"
                  :style="`height: calc(max(16px * min(${hScale}, ${vScale}), 12px))`"
                />
              </MyTooltip>
            </div>
          </div>
        </div>
        <div v-else style="width: 35vw" />
        <!-- 右侧 WL AR -->
        <div v-if="playerInfo" style="width: 35vw; position: relative">
          <div
            class="h-full flex flex-row justify-end items-center"
            :style="`font-size: calc(16px * min(${hScale}, ${vScale}))`"
          >
            <MyTag class="mr-4">
              <div class="flex flex-row font-zzz-bold">
                {{ $t('zzz_playerLv') }}
                <span style="margin-left: 1ch">
                  {{ playerInfo.Level }}
                </span>
              </div>
            </MyTag>
            <div
              class="mr-4 rounded-full bg-[#66666611] hover:bg-[#66666633] dark:bg-[#ffffff22] dark:hover:bg-[#ffffff55] px-[1vw] py-[1vh] transition-all flex flex-row"
              @click="headerMode = 1"
            >
              <GamepadIcon
                icon="Y"
                v-if="gamepadMode"
                class="inline-block mr-2"
                :style="`height: calc(20px * min(${hScale}, ${vScale}));
          margin-top: calc(2px * min(${hScale}, ${vScale}))`"
              />
              <i class="bi bi-arrow-left-right" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-row w-full relative justify-between z-50"
        style="height: 9vh"
      >
        <!-- 右上角加载提示 / 报错提示 -->
        <div
          v-if="playerInfoLoading"
          class="absolute top-0 right-0 bottom-0 z-0"
          style="margin-left: 1vw; right: 2vw; top: 3vh"
          :style="`font-size: calc(max(14px * min(${hScale}, ${vScale}), 16px))`"
        >
          {{ $t('sr_loadingPlayerInfo') }}
        </div>
        <div
          v-if="playerInfoFailed"
          class="absolute bottom-0 z-0 text-red-500"
          style="margin-left: 1vw; right: 2vw; top: 3vh"
          :style="`font-size: calc(max(14px * min(${hScale}, ${vScale}), 16px))`"
        >
          {{ $t('sr_playerInfoFailed') }}
        </div>

        <div class="w-[35vw]">
          <div
            v-if="playerInfo"
            class="ml-4 mt-[2vh] w-fit px-[1vw] py-[1vh] rounded-full bg-[#66666611] hover:bg-[#66666633] dark:bg-[#ffffff22] dark:hover:bg-[#ffffff55] transition-all flex flex-row"
            @click="headerMode = 0"
            :style="`font-size: calc(16px * min(${hScale}, ${vScale}))`"
          >
            <GamepadIcon
              icon="Y"
              v-if="gamepadMode"
              class="inline-block mr-2"
              :style="`height: calc(20px * min(${hScale}, ${vScale}));
          margin-top: calc(2px * min(${hScale}, ${vScale}))`"
            />
            <i class="bi bi-arrow-left" />
          </div>
        </div>

        <div class="flex flex-row">
          <GamepadIcon
            icon="Y"
            v-if="gamepadMode && !playerInfo"
            class="mt-[2.5vh] mb-[2vh] mb-[1.5vh] mr-2"
          />
          <CustomUIDInput
            ref="uidInputDom"
            v-model="uidInput"
            @submit="requestInfo"
            :gamepad-mode="!!gamepadMode"
            style="margin-top: 2vh; margin-bottom: 1.5vh; z-index: 10"
            :style="`font-size: calc(max(14px * min(${hScale}, ${vScale}), 16px))`"
          />
        </div>

        <div style="width: 35vw" />
      </div>
    </MyCarousel>
    <!-- BODY -->
    <div
      v-if="playerInfo && playerInfo.ShowcaseAgents.length > 0"
      class="relative mt-4"
    >
      <!-- 角色头像列表 10人一页 -->
      <div class="flex flex-row w-full justify-center absolute z-10 top-0">
        <div
          class="flex flex-row justify-between"
          style="width: 690px; transform-origin: center top"
          :style="`transform: scale(${gamepadMode ? `min(${hScale}, ${vScale})` : hScale})`"
        >
          <div class="relative z-50" style="width: 15%">
            <div
              class="absolute right-2 top-3 rounded-full w-9 h-9 pt-1 bg-white hover:bg-gray-200 active:-translate-x-1 transition-all bg-opacity-80 dark:bg-black dark:hover:bg-gray-700 dark:bg-opacity-80"
              @click="charsPagePrev"
              :class="charsPage == 0 ? 'disabled' : ''"
            >
              <i class="bi bi-chevron-left text-lg text-center" />
            </div>
          </div>
          <ScrollWrapper
            ref="charsScrollbar"
            no-resize
            show-bar="never"
            width="auto"
            style="max-width: 70%"
          >
            <div class="flex flex-row flex-nowrap w-max">
              <div
                v-for="(character, index) in playerInfo.ShowcaseAgents"
                :key="character.id"
                class="relative w-12 h-12 z-50"
                @click="setShowcase(index)"
              >
                <div
                  class="absolute bottom-0 w-9 h-9 rounded-full transition-all"
                  :class="{
                    'bg-green-500 dark:bg-yellow-300': showcaseIdx == index,
                  }"
                  style="left: 10px"
                ></div>
                <img
                  class="absolute left-[2px] bottom-[2px] char-side-icon rounded-full ml-[10px] w-8 h-8 hover:transform hover:scale-110 active:scale-100 transition-all object-cover"
                  :src="character.CircleIconUrl"
                />
              </div>
            </div>
          </ScrollWrapper>
          <div class="relative z-50" style="width: 15%">
            <div
              class="absolute left-2 top-3 rounded-full w-9 h-9 pt-1 bg-white hover:bg-gray-200 active:translate-x-1 transition-all bg-opacity-80 dark:bg-black dark:hover:bg-gray-700 dark:bg-opacity-80"
              @click="charsPageNext"
              :class="charsPage == pages ? 'disabled' : ''"
            >
              <i class="bi bi-chevron-right text-lg text-center" />
            </div>
          </div>
        </div>
      </div>

      <!-- 角色详情卡片 -->
      <div
        :style="`height: calc(604px * ${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale})`"
      />
      <MyCarousel
        ref="cardsCarouselRef"
        class="absolute left-0"
        :autoplay="false"
        show-arrow="never"
        animation="fade-swipe"
        style="
          width: 984px;
          height: 545px;
          transform-origin: left top;
          background: #191919;
        "
        :style="`transform: scale(${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale});
          border-radius: calc(30px / ${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale});
          top: calc(64px * ${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale})`"
      >
        <div
          v-for="(character, index) in playerInfo.ShowcaseAgents"
          :key="character.id"
          class="relative w-full"
        >
          <div
            class="w-full absolute top-0 left-0 right-0 transition-all"
            style="transition-duration: 300ms; color: #e0e0e0"
            :style="`border-radius: calc(30px / ${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale})`"
          >
            <!-- absolute 卡片背景及前景遮罩 -->
            <img
              class="w-full"
              src="../../../assets/zzzCard/bgTexture.png"
              :style="`border-radius: calc(30px / ${gamepadMode ? `min(${hScale}, ${vScale})` : hScale}`"
            />

            <img
              class="absolute z-20 h-full top-0 left-0 pointer-events-none"
              src="../../../assets/zzzCard/frame.png"
            />

            <svg
              class="absolute left-2 top-0 z-[5] h-full rounded-3xl"
              viewBox="0 0 822 1250"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.0739935 27C0.0739812 12.0883 12.1623 8.30483e-05 27.074 7.65174e-05L794.901 6.90344e-05C812.315 5.89158e-05 825.175 16.2407 821.182 33.1903L539.475 1229.18C536.603 1241.37 525.722 1249.99 513.195 1249.99L27.0739 1249.99C12.1623 1249.99 0.0738917 1237.9 0.0739172 1222.99L0.0739935 27Z"
                :fill="character.Colors[0].Accent"
                fill-opacity="0.35"
              />
            </svg>
            <img
              src="../../../assets/zzzCard/statsMask.png"
              class="h-[99%] absolute top-[1%] left-[300px] z-[7]"
            />
            <img
              src="../../../assets/zzzCard/fullnameMask.png"
              class="h-[99%] absolute top-[1%] left-[246px] z-[8]"
            />
            <!-- 立绘 -->
            <img
              class="absolute z-[6] h-full"
              :src="character.ImageUrl"
              :style="`left: ${character.Transform.Left}px; top: ${character.Transform.Top}px; transform: scale(${character.Transform.Scale})`"
            />
            <!-- 左上人名、属性、命途 -->
            <div
              class="font-zzz-bold absolute left-4 top-5 z-20 text-3xl text-white justify-between flex flex-row"
              style="width: 334px"
            >
              <div>
                {{ character.Name }}
              </div>
              <div
                class="rounded-full bg-gray-900 flex flex-row h-7 mt-1.5 px-1"
              >
                <StatIcon
                  class="w-5 h-5 my-1 mx-0.5"
                  fill="#fff"
                  :stat="character.Element"
                  game="zzz"
                />
                <img
                  :src="character.ProfessionIcon"
                  class="w-5 h-5 my-1 mx-0.5"
                />
              </div>
            </div>

            <!-- 中间斜着lv、全名 -->
            <TextScroll
              :content="`${character.FullNameEn}&nbsp;&nbsp;`"
              container-width="1000px"
              font-family="zzz-font, sans-serif"
              :text-style="{ color: character.Colors[0].Accent }"
              font-size="50px"
              container-height="70px"
              :duration="15"
              :container-style="{
                position: 'absolute',
                left: '-224px',
                bottom: '10px',
                'z-index': 8,
                transform: 'rotate(-77deg)',
                opacity: 0.35,
              }"
            />
            <div
              class="absolute left-[235px] bottom-[70px] text-white z-[50] font-zzz-bold text-xl"
              style="transform: rotate(-77deg)"
            >
              Lv. {{ character.Level }}
              <span class="text-white opacity-50"
                >/ {{ character.PromotionLevel * 10 }}</span
              >
            </div>

            <!-- 右上命座 -->
            <div
              class="absolute right-[155px] top-[18px] z-10 flex flex-row h-11 w-[400px] skew-x-[-14deg] z-30"
            >
              <div
                v-for="idx in 6"
                :key="idx"
                class="flex flex-row"
                :class="{
                  'mr-[6px]': idx == 1,
                  'ml-[6px]': idx == 6,
                  'mx-[6px]': idx != 1 && idx != 6,
                }"
              >
                <div
                  class="w-[22px] h-11"
                  style="border-radius: 8px 0 0 8px"
                  :style="
                    character.TalentLevel >= idx
                      ? {
                          background: character.Colors[0].Mindscape,
                          border: `2px solid ${character.Colors[0].Mindscape}`,
                        }
                      : {
                          background: '#626262',
                          border: `2px solid #626262`,
                        }
                  "
                ></div>
                <div
                  class="w-[55px] h-11 bg-[#191919] font-zzz-bold text-3xl pt-[1px]"
                  style="border-radius: 0 8px 8px 0"
                  :style="
                    character.TalentLevel >= idx
                      ? {
                          color: '#dfdfdf',
                          border: `2px solid ${character.Colors[0].Mindscape}`,
                        }
                      : {
                          color: '#666',
                          border: `2px solid #626262`,
                        }
                  "
                >
                  <div style="transform: skewX(14deg)">0{{ idx }}</div>
                </div>
              </div>
            </div>

            <!-- 右侧 -->
            <div
              class="absolute right-[102px] top-[62px] z-10 w-[520px] h-[476px] skew-x-[-14deg]"
            >
              <!-- 属性表 -->
              <div
                class="grid grid-cols-3 h-[118px] gap-x-12 z-50 font-zzz-bold px-6 pt-2 pb-2.5 mt-3"
              >
                <div
                  v-for="stat in finalStatsOrder"
                  :key="stat"
                  class="w-full flex flex-row justify-between pt-0.5"
                >
                  <StatIcon
                    class="w-5 h-5 mt-0.5 skew-x-[14deg]"
                    fill="#e0e0e0"
                    :stat="stat"
                    game="zzz"
                  />
                  <!--                <div style="font-size: 10px">{{ stat }}</div>-->
                  <div style="font-size: 18px; transform: skewX(14deg)">
                    {{ character.FinalStats[stat].statValue }}
                  </div>
                </div>
                <div
                  class="bg-white bg-opacity-10 hover:bg-opacity-25 active:bg-opacity-50 active:scale-90 text-[#e0e0e0] rounded my-0.5 text-sm pt-1 transition-all flex flex-row justify-center"
                  @click="showCharDetails(index)"
                >
                  <GamepadIcon
                    icon="X"
                    v-if="gamepadMode"
                    class="h-[20px] mt-[1px] bg-gray-900 rounded-full mr-2 skew-x-[14deg]"
                  />
                  <div class="mt-[1px]">{{ $t('sr_details') }}</div>
                </div>
              </div>
              <div
                class="w-[1px] h-[100px] opacity-50 absolute z-50 top-[18px] right-[344px]"
                :style="{ background: character.Colors[0].Accent }"
              />
              <div
                class="w-[1px] h-[100px] opacity-50 absolute z-50 top-[18px] right-[175px]"
                :style="{ background: character.Colors[0].Accent }"
              />

              <!-- 武器 -->
              <div
                v-if="!character.Weapon"
                class="w-full skew-x-[14deg] mt-3 text-center h-[88px] pt-9 font-zzz-bold opacity-75"
              >
                {{ $t('zzz_noWeapon') }}
              </div>
              <div class="w-full mt-3 flex flex-row relative h-[88px]" v-else>
                <div class="w-20 h-[88px] ml-5 mt-2 relative skew-x-[14deg]">
                  <img class="w-20 h-20" :src="character.Weapon.ImageUrl" />
                  <img
                    class="absolute bottom-0 right-0 w-9 h-9 m-[-2px]"
                    :src="`https://enka.network/ui/zzz/ItemRarity${['C', 'B', 'A', 'S'][character.Weapon.Rarity - 1]}.png`"
                  />
                </div>
                <div
                  class="grid grid-columns-3 font-zzz-bold skew-x-[14deg] ml-4 w-[320px] gap-x-8 translate-y-2.5"
                >
                  <div
                    style="grid-column: 1 / 4"
                    class="truncated text-3xl text-left"
                  >
                    {{ character.Weapon.Name }}
                  </div>
                  <div
                    class="w-[100px] flex flex-row justify-between pt-0.5 px-1"
                  >
                    <StatIcon
                      class="w-5 h-5 mt-0.5"
                      fill="#e0e0e0"
                      :stat="character.Weapon.FormattedMainStat.Key"
                      game="zzz"
                    />
                    <div style="font-size: 18px">
                      {{ character.Weapon.FormattedMainStat.Value }}
                    </div>
                  </div>
                  <div
                    class="w-[100px] flex flex-row justify-between pt-0.5 px-1"
                  >
                    <StatIcon
                      class="w-5 h-5 mt-0.5"
                      fill="#e0e0e0"
                      :stat="character.Weapon.FormattedSecondaryStat.Key"
                      game="zzz"
                    />
                    <div style="font-size: 18px">
                      {{ character.Weapon.FormattedSecondaryStat.Value }}
                    </div>
                  </div>
                </div>
                <div
                  class="absolute right-[-34px] bottom-[8px] rotate-[-89deg]"
                >
                  <div
                    class="w-full flex flex-row justify-center skew-x-[-14deg]"
                  >
                    <img
                      v-for="idx in 5"
                      :key="idx"
                      src="../../../assets/zzzCard/weaponStar.png"
                      class="mx-[-2px] w-5 h-5"
                      :class="
                        5 - character.Weapon.UpgradeLevel < idx
                          ? 'opacity-90'
                          : 'opacity-25'
                      "
                    />
                  </div>
                  <div
                    class="font-zzz-bold text-black text-center px-3.5 py-2 flex flex-row w-[120px]"
                    :style="{ background: character.Colors[0].Accent }"
                  >
                    <div class="opacity-65 skew-x-[-14deg]">
                      Lv. {{ character.Weapon.Level }}&nbsp;
                    </div>
                    <div class="opacity-35 skew-x-[-14deg]">
                      /{{ (character.Weapon.BreakLevel + 1) * 10 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 天赋 -->
              <div
                class="mt-10 w-full flex flex-row justify-between skew-x-[14deg] pl-4 pr-2"
              >
                <div v-for="idx in 5" :key="idx" class="flex flex-row w-1/6">
                  <img
                    :src="character.SkillInfoList[idx - 1].iconUrl"
                    class="w-10 h-10"
                  />
                  <div class="font-zzz-bold text-lg ml-1">
                    <div
                      class="-translate-y-1"
                      :style="{
                        color:
                          character.SkillInfoList[idx - 1].level ===
                          character.SkillInfoList[idx - 1].maxLevel
                            ? '#fdba74'
                            : '#e0e0e0',
                      }"
                    >
                      {{
                        (character.SkillInfoList[idx - 1].level < 10
                          ? '0'
                          : '') + character.SkillInfoList[idx - 1].level
                      }}
                    </div>
                    <div class="text-white opacity-40 -translate-y-3">
                      {{ character.SkillInfoList[idx - 1].maxLevel }}
                    </div>
                  </div>
                </div>
                <div
                  class="h-full rounded-lg skew-x-[-14deg] -translate-y-0.5"
                  :style="{
                    border: `2px solid ${character.CoreSkillEnhancement === 0 ? '#555555' : character.Colors[0].Accent}`,
                  }"
                >
                  <StatIcon
                    :fill="
                      character.CoreSkillEnhancement === 0
                        ? '#555555'
                        : character.Colors[0].Mindscape
                    "
                    :stat="`Core${['A', 'A', 'B', 'C', 'D', 'E', 'F'][character.CoreSkillEnhancement]}`"
                    game="zzz"
                    class="w-10 skew-x-[14deg]"
                  />
                </div>
              </div>

              <!-- 圣遗物 -->
              <div
                v-if="character.EquippedDiscs.length == 0"
                class="w-full skew-x-[14deg] mt-3 text-center h-[88px] pt-12 font-zzz-bold opacity-75"
              >
                {{ $t('zzz_noRelic') }}
              </div>
              <MyCarousel
                v-else
                v-model="relicIdx"
                class="mt-3 h-[130px] relative"
                show-arrow="never"
                show-indicator="always"
                :indicator-bg="false"
                :autoplay="false"
              >
                <div
                  v-for="(disc, idx) in character.EquippedDiscs"
                  :key="idx"
                  class="w-full h-20 flex flex-row py-2 px-1"
                >
                  <div class="ml-5 mt-3 relative h-20">
                    <svg
                      class="h-20 skew-x-[14deg] ml-10"
                      viewBox="0 0 445 220"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 40C0 17.9086 17.9086 0 40 0H404.861C431.47 0 450.661 25.4951 443.301 51.0649L403.001 191.065C398.069 208.199 382.391 220 364.562 220H40C17.9086 220 0 202.091 0 180V40Z"
                        fill="#303030"
                      />
                    </svg>
                    <div class="w-20 h-20 absolute left-0 top-0 skew-x-[14deg]">
                      <img :src="disc.IconUrl" class="w-20 h-20" />
                      <img
                        class="absolute bottom-0 right-0 w-9 h-9 m-[-2px]"
                        :src="`https://enka.network/ui/zzz/ItemRarity${['C', 'B', 'A', 'S'][disc.Rarity - 1]}.png`"
                      />
                    </div>
                    <div
                      class="absolute right-4 top-1 flex flex-row skew-x-[14deg]"
                    >
                      <StatIcon
                        fill="#e0e0e0"
                        :stat="disc.FormattedMainStat.Key"
                        game="zzz"
                        class="w-4 mr-3 mt-1"
                      />
                      <div class="opacity-85 font-zzz-bold">
                        Lv. {{ disc.Level }}
                      </div>
                    </div>
                    <div
                      class="absolute right-4 bottom-1 text-3xl font-zzz-bold"
                    >
                      {{ disc.FormattedMainStat.Value }}
                    </div>
                  </div>
                  <div class="grid grid-cols-2 w-full mt-8 h-16 gap-x-10 px-3">
                    <div
                      v-for="(substat, idx) in disc.SubStats"
                      :key="idx"
                      class="w-full flex flex-row justify-between font-zzz-bold skew-x-[14deg]"
                    >
                      <div class="flex flex-row">
                        <StatIcon
                          fill="#e0e0e0"
                          :stat="substat.Key"
                          game="zzz"
                          class="w-5"
                        />
                        <div
                          v-if="substat.Value[substat.Value.length - 1] !== '1'"
                          class="ml-1 text-center font-zzz-bold text-sm opacity-75"
                          :style="{ color: character.Colors[0].Accent }"
                        >
                          +{{ substat.Value[substat.Value.length - 1] - 1 }}
                        </div>
                      </div>
                      <div>
                        {{
                          substat.Value.substring(0, substat.Value.length - 3)
                        }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="absolute right-3 top-2 text-white font-zzz-bold opacity-50"
                  >
                    {{ disc.SuitName }} [{{ disc.Slot }}]
                  </div>

                  <div
                    class="w-[1px] h-[50px] opacity-50 absolute z-50 top-[42px] right-[147px]"
                    :style="{ background: character.Colors[0].Accent }"
                  />
                </div>
              </MyCarousel>
            </div>

            <!-- 右下首次邂逅 -->
            <svg
              class="absolute z-50 right-3 bottom-3 h-[65%]"
              viewBox="0 0 214 927"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M212.5 2C212.5 253.333 212.5 776.7 212.5 859.5C212.5 905 191.5 925 158.5 925C106.5 925 27.5 925 2 925"
                :stroke="`url(#decoLine_${character.Id})`"
                stroke-width="3"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient
                  :id="`decoLine_${character.Id}`"
                  x1="107.25"
                  y1="2"
                  x2="107.25"
                  y2="925"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop :stop-color="character.Colors[0].Accent + '55'" />
                  <stop
                    offset="0.894231"
                    :stop-color="character.Colors[0].Accent"
                  />
                </linearGradient>
              </defs>
            </svg>
            <div
              class="absolute left-[940px] bottom-[5px] z-50"
              style="transform: rotate(-90deg); transform-origin: top left"
              :style="`width: calc(616px * ${gamepadMode ? `calc(min(${hScale}, ${vScale}) / 616 * 556)` : hScale})`"
            >
              <div class="font-zzz-bold text-left" style="color: #a7a7a7">
                {{ $t('zzz_firstMet')
                }}{{
                  new Date(character.ObtainmentTimestamp)
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '-')
                }}
              </div>
            </div>
          </div>
        </div>
      </MyCarousel>
    </div>
    <div
      v-else
      class="pt-2 pb-4"
      :style="`font-size: calc(max(14px * min(${hScale}, ${vScale}), 16px))`"
    >
      {{ $t('gs_emptyPlayerTip') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.font-zzz-bold {
  font-family: zzz-font, sans-serif;
}

.loading {
  @apply translate-y-[300px] opacity-0;
}

.namecard-mask {
  -webkit-mask: linear-gradient(
    90deg,
    transparent 10%,
    #ffffff55 25%,
    white 45%,
    white 55%,
    #ffffff55 75%,
    transparent 90%
  );
}

.char-side-icon {
  -webkit-mask: radial-gradient(white 80%, transparent);
}

.gacha-mask {
  -webkit-mask: linear-gradient(transparent 1rem, white 3rem);
}

.left-gacha {
  -webkit-mask: linear-gradient(270deg, transparent, white 20%);
}

.artifact-mask {
  -webkit-mask: linear-gradient(270deg, transparent, white 60%);
}

.disabled {
  @apply bg-gray-200 opacity-30 pointer-events-none;

  .dark & {
    @apply bg-gray-600 opacity-20;
  }
}

.truncated {
  @apply inline-block max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
</style>
