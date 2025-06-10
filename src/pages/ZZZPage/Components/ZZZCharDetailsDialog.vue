<script setup lang="ts">
import ZZZDialog from './ZZZDialog.vue'
import StatIcon from '../../../components/StatIcon.vue'
import DialogListItem from '../../../components/DialogListItem.vue'
import { onMounted, PropType, Ref, ref } from 'vue'
import GamepadIcon from '../../../components/GamepadIcon.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Character Details',
  },
  character: {
    type: Object,
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
  gpType: {
    type: String as PropType<'Xbox' | 'PS'>,
    required: false,
  },
})

const dialogRef = ref<typeof ZZZDialog>()

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

  // B: dispose dialog
  if (gp.buttons[1].pressed) {
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => {
        rAFId = null
        dialogRef.value?.cancelClick?.()
        inThrottle = false
      }, 150)
    }
  }

  if (rAFId) {
    rAFId = rAF(gameLoop)
  }
}

const transElement = (el: string) => {
  switch (el) {
    case 'FireFrost':
      return 'Ice'
    case 'AuricEther':
      return 'Ether'
    default:
      return el
  }
}

const statOrder = [
  'HpMax',
  'Atk',
  'Def',
  'BreakStun',
  'Crit',
  'CritDmg',
  'ElementAbnormalPower',
  'ElementMystery',
  'PenRatio',
  'PenDelta',
  'SpRecover',
  `AddedDamageRatio_${transElement(props.character.Element)}`,
]

onMounted(() => {
  if (props.gamepadMode) {
    rAFId = rAF(gameLoop)
  }

  if (props.character.ProfessionType === 6) {
    statOrder.push('SkipDefAtk', 'RpRecover')
  }
})
</script>

<template>
  <ZZZDialog
    ref="dialogRef"
    :title="title"
    :h-scale="hScale"
    :v-scale="vScale"
    :show-cancel="false"
    :show-ok="false"
    :gamepad-mode="gamepadMode"
    :gp-type="gpType"
    style-type="normal"
  >
    <div class="list-items-wrapper font-zzz-bold">
      <DialogListItem
        :name="character.FinalStats[stat].statName"
        v-for="stat in statOrder"
        :key="stat"
      >
        <template #icon>
          <StatIcon
            game="zzz"
            :stat="stat"
            fill="#ccc"
            class="w-4 h-4 mr-1 mt-[2px]"
          />
        </template>
        <div>
          <span>{{
            ['HpMax', 'Atk', 'Def'].includes(stat)
              ? character.BaseStats[stat]
              : character.FinalStats[stat].statValue.final
          }}</span>
          <span
            v-if="['HpMax', 'Atk', 'Def'].includes(stat)"
            class="stat-addition"
            >+{{ character.FinalStats[stat].statValue.added }}</span
          >
        </div>
      </DialogListItem>
    </div>

    <div
      class="gamepad-op-wrapper"
      :style="`margin-top: calc(10px * ${hScale.value})`"
      v-if="gamepadMode"
    >
      <GamepadIcon icon="B" class="gamepad-icon h-[30px]" :gp-type="gpType" />
      <div class="font-zzz-bold ml-2" style="font-size: 18px; margin-top: 2px">
        {{ translate('general_back') }}
      </div>
    </div>
  </ZZZDialog>
</template>

<style scoped>
.list-items-wrapper {
  @apply flex flex-col content-center justify-center;
  @apply w-full px-5;
}

.stat-addition {
  @apply ml-1 text-blue-500;
}

.gamepad-op-wrapper {
  @apply flex flex-row justify-center align-middle;
}

.gamepad-icon {
  @apply rounded-full bg-gray-100;
}
</style>
