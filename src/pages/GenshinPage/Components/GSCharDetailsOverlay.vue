<script setup lang="ts">
import { onMounted, PropType, Ref, ref } from 'vue'
import StatIcon from '../../../components/StatIcon.vue'
import DialogListItem from '../../../components/DialogListItem.vue'
import TemplateDialog from '../../../components/TemplateDialog.vue'
import ScrollWrapper from '../../../components/ScrollWrapper.vue'
import GamepadIcon from '../../../components/GamepadIcon.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Character Details',
  },
  stats: {
    type: Array as PropType<any[]>,
    required: true,
  },
  gamepadMode: {
    type: Boolean,
    default: false,
  },
  hScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
  vScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
})

const dialogRef = ref<any>(null)
const rAF = window.requestAnimationFrame
let rAFId: number | null = null

const trimStats = (stats: any[]) => {
  const trim = ['HP', 'PERCENT', 'ATTACK', 'DEFENSE', 'BASE_SPEED', 'MASTERY']
  const res: Record<string, any> = {}

  for (const stat of stats) {
    let flag = false
    for (const t of trim) {
      if (stat.fightProp.endsWith(t) || stat.value == 0) {
        flag = true
        break
      }
    }
    if (!flag) {
      res[stat.fightProp] = stat
    }
  }

  return res
}

const displayStat = (stat: any) => {
  if (stat.isPercent) {
    return `${(stat.value * 100).toFixed(1)}%`
  } else {
    return `${stat.value.toFixed(0)}`
  }
}

const closeDialog = () => {
  if (props.gamepadMode) {
    rAFId = null
  }
  dialogRef.value?.cancelClick?.()
}

let inThrottle = false
const gameLoop = () => {
  const gamepads = navigator.getGamepads()
  const gp = gamepads[0]

  if (!gp) {
    return
  }

  // B: dispose dialog
  if (gp.buttons[1].pressed) {
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => {
        closeDialog()
        inThrottle = false
      }, 150)
    }
  }

  if (rAFId) {
    rAFId = rAF(gameLoop)
  }
}

onMounted(() => {
  if (props.gamepadMode) {
    rAFId = rAF(gameLoop)
  }
})
</script>

<template>
  <TemplateDialog
    class="main-wrapper"
    ref="dialogRef"
    :h-scale="hScale"
    :v-scale="vScale"
  >
    <div class="title font-gs">{{ title }}</div>
    <div class="close-button" @click="closeDialog">
      <img src="../../../assets/gsDialog/gsDialogClose.png" />
    </div>
    <div class="divider-wrapper">
      <div class="divider-contents">
        <img
          style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
          src="../../../assets/gsDialog/gsDividerSide.png"
        />
        <div class="divider-bg w-full" style="height: 1px; margin-top: 4px" />
        <img
          style="height: 9px"
          src="../../../assets/gsDialog/gsDividerSide.png"
        />
      </div>
    </div>

    <ScrollWrapper show-bar="always">
      <div class="list-items-wrapper">
        <DialogListItem class="font-gs" :name="stats[1].fightPropName.text">
          <template #icon>
            <StatIcon game="gs" stat="FIGHT_PROP_HP" fill="#eee" class="icon" />
          </template>
          <div>
            <span>{{ stats[0].value.toFixed(0) }}</span>
            <span
              v-if="stats[37].value.toFixed(0) != stats[0].value.toFixed(0)"
              class="stat-addition"
            >
              +{{ stats[37].value.toFixed(0) - stats[0].value.toFixed(0) }}
            </span>
          </div>
        </DialogListItem>
        <DialogListItem class="font-gs" :name="stats[4].fightPropName.text">
          <template #icon>
            <StatIcon
              game="gs"
              stat="FIGHT_PROP_ATTACK"
              fill="#eee"
              class="icon"
            />
          </template>
          <div class="font-gs">
            <span>{{ stats[3].value.toFixed(0) }}</span>
            <span
              v-if="stats[38].value.toFixed(0) != stats[3].value.toFixed(0)"
              class="stat-addition"
              >+{{
                stats[38].value.toFixed(0) - stats[3].value.toFixed(0)
              }}</span
            >
          </div>
        </DialogListItem>
        <DialogListItem class="font-gs" :name="stats[7].fightPropName.text">
          <template #icon>
            <StatIcon
              game="gs"
              stat="FIGHT_PROP_DEFENSE"
              fill="#eee"
              class="icon"
            />
          </template>
          <div class="font-gs">
            <span>{{ stats[6].value.toFixed(0) }}</span>
            <span
              v-if="stats[39].value.toFixed(0) != stats[6].value.toFixed(0)"
              class="stat-addition"
              >+{{
                stats[39].value.toFixed(0) - stats[6].value.toFixed(0)
              }}</span
            >
          </div>
        </DialogListItem>
        <DialogListItem
          class="font-gs"
          :name="stats[16].fightPropName.text"
          :val="stats[16].value.toFixed(0)"
        >
          <template #icon>
            <StatIcon
              game="gs"
              stat="FIGHT_PROP_ELEMENT_MASTERY"
              fill="#eee"
              class="icon"
            />
          </template>
        </DialogListItem>
        <DialogListItem
          v-for="(val, name) in trimStats(stats)"
          class="font-gs"
          :name="val.fightPropName.text"
          :val="displayStat(val)"
        >
          <template #icon>
            <StatIcon game="gs" :stat="name" fill="#eee" class="icon" />
          </template>
        </DialogListItem>
      </div>
    </ScrollWrapper>
    <div
      class="gamepad-op-wrapper"
      :style="`margin-top: calc(40px * ${hScale.value})`"
      v-if="gamepadMode"
    >
      <GamepadIcon icon="B" class="gamepad-icon h-[30px]" />
      <div class="font-gs ml-2" style="font-size: 18px; margin-top: 2px">
        关闭
      </div>
    </div>
  </TemplateDialog>
</template>

<style scoped>
.main-wrapper {
  @apply text-gray-100;
}

.title {
  @apply w-full text-center text-xl mb-2;
}

.close-button {
  @apply absolute z-50 w-6 h-6 p-1 right-1 top-1;
  @apply rounded-full transition-all cursor-pointer;
  @apply hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90;
}

.divider-wrapper {
  @apply w-full flex flex-row justify-center mt-1;
}

.divider-contents {
  @apply w-5/6 flex flex-row justify-center relative;
}

.divider-bg {
  background: #dad2c5;
}

.scroll-wrapper {
  max-height: 80vh;
}

.list-items-wrapper {
  @apply content-center justify-center;
  @apply flex flex-col w-full px-5 mt-5;
}

.icon {
  @apply w-4 h-4;
  margin-top: 2px;
}

.stat-addition {
  @apply ml-1 text-blue-400;
}

.gamepad-op-wrapper {
  @apply flex flex-row justify-center align-middle;
}

.gamepad-icon {
  @apply rounded-full bg-gray-100;
}
</style>
