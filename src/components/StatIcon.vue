<script setup lang="ts">
import gs_hpIcon from '../assets/statIcons/gs/hpIcon.vue'
import gs_atkIcon from '../assets/statIcons/gs/atkIcon.vue'
import gs_defIcon from '../assets/statIcons/gs/defIcon.vue'
import gs_hpPercentIcon from '../assets/statIcons/gs/hpPercentIcon.vue'
import gs_atkPercentIcon from '../assets/statIcons/gs/atkPercentIcon.vue'
import gs_defPercentIcon from '../assets/statIcons/gs/defPercentIcon.vue'
import gs_rechargeIcon from '../assets/statIcons/gs/rechargeIcon.vue'
import gs_masteryIcon from '../assets/statIcons/gs/masteryIcon.vue'
import gs_crtrtIcon from '../assets/statIcons/gs/crtrtIcon.vue'
import gs_crtdmgIcon from '../assets/statIcons/gs/crtdmgIcon.vue'
import gs_energyIcon from '../assets/statIcons/gs/energyIcon.vue'
import gs_anemoIcon from '../assets/statIcons/gs/anemoIcon.vue'
import gs_cryoIcon from '../assets/statIcons/gs/cryoIcon.vue'
import gs_dendroIcon from '../assets/statIcons/gs/dendroIcon.vue'
import gs_electroIcon from '../assets/statIcons/gs/electroIcon.vue'
import gs_hydroIcon from '../assets/statIcons/gs/hydroIcon.vue'
import gs_pyroIcon from '../assets/statIcons/gs/pyroIcon.vue'
import gs_geoIcon from '../assets/statIcons/gs/geoIcon.vue'
import gs_physicalIcon from '../assets/statIcons/gs/physicalIcon.vue'
import gs_healingIcon from '../assets/statIcons/gs/healingIcon.vue'
import gs_shieldIcon from '../assets/statIcons/gs/shieldIcon.vue'
import gs_friendshipIcon from '../assets/statIcons/gs/friendshipIcon.vue'

import sr_hpIcon from '../assets/statIcons/sr/hpIcon.vue'
import sr_breakEffIcon from '../assets/statIcons/sr/breakEffIcon.vue'
import sr_crtdmgIcon from '../assets/statIcons/sr/crtdmgIcon.vue'
import sr_crtrtIcon from '../assets/statIcons/sr/crtrtIcon.vue'
import sr_defIcon from '../assets/statIcons/sr/defIcon.vue'
import sr_effHitIcon from '../assets/statIcons/sr/effHitIcon.vue'
import sr_effResIcon from '../assets/statIcons/sr/effResIcon.vue'
import sr_atkIcon from '../assets/statIcons/sr/atkIcon.vue'
import sr_iceIcon from '../assets/statIcons/sr/iceIcon.vue'
import sr_imaginaryIcon from '../assets/statIcons/sr/imaginaryIcon.vue'
import sr_regenIcon from '../assets/statIcons/sr/regenIcon.vue'
import sr_spdIcon from '../assets/statIcons/sr/spdIcon.vue'
import sr_windIcon from '../assets/statIcons/sr/windIcon.vue'
import sr_fireIcon from '../assets/statIcons/sr/fireIcon.vue'
import sr_quantumIcon from '../assets/statIcons/sr/quantumIcon.vue'
import sr_physicalIcon from '../assets/statIcons/sr/physicalIcon.vue'
import sr_lightningIcon from '../assets/statIcons/sr/lightningIcon.vue'
import sr_outHealingIcon from '../assets/statIcons/sr/outHealingIcon.vue'

import zzz_elecIcon from '../assets/zzzCard/elementIcons/elecIcon.vue'
import zzz_fireIcon from '../assets/zzzCard/elementIcons/fireIcon.vue'
import zzz_iceIcon from '../assets/zzzCard/elementIcons/iceIcon.vue'
import zzz_physIcon from '../assets/zzzCard/elementIcons/physIcon.vue'
import zzz_etherIcon from '../assets/zzzCard/elementIcons/etherIcon.vue'
import zzz_hpIcon from '../assets/statIcons/zzz/hpIcon.vue'
import zzz_atkIcon from '../assets/statIcons/zzz/atkIcon.vue'
import zzz_defIcon from '../assets/statIcons/zzz/defIcon.vue'
import zzz_crtrtIcon from '../assets/statIcons/zzz/crtrtIcon.vue'
import zzz_crtdmgIcon from '../assets/statIcons/zzz/crtdmgIcon.vue'
import zzz_anoMasIcon from '../assets/statIcons/zzz/anoMasIcon.vue'
import zzz_anoProfIcon from '../assets/statIcons/zzz/anoProfIcon.vue'
import zzz_energyRegenIcon from '../assets/statIcons/zzz/energyRegenIcon.vue'
import zzz_penRatioIcon from '../assets/statIcons/zzz/penRatioIcon.vue'
import zzz_penIcon from '../assets/statIcons/zzz/penIcon.vue'
import zzz_impactIcon from '../assets/statIcons/zzz/impactIcon.vue'
import zzz_coreAIcon from '../assets/zzzCard/coreSkillIcons/coreAIcon.vue'
import zzz_coreBIcon from '../assets/zzzCard/coreSkillIcons/coreBIcon.vue'
import zzz_coreCIcon from '../assets/zzzCard/coreSkillIcons/coreCIcon.vue'
import zzz_coreDIcon from '../assets/zzzCard/coreSkillIcons/coreDIcon.vue'
import zzz_coreEIcon from '../assets/zzzCard/coreSkillIcons/coreEIcon.vue'
import zzz_coreFIcon from '../assets/zzzCard/coreSkillIcons/coreFIcon.vue'

import { PropType } from 'vue'

const props = defineProps({
  game: {
    type: String as PropType<'gs' | 'sr' | 'zzz'>,
    required: true,
  },
  stat: {
    type: String,
    required: true,
  },
  fill: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div>
    <div v-if="props.game == 'gs'">
      <gs_hpIcon
        v-if="props.stat === 'FIGHT_PROP_HP'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_atkIcon
        v-if="props.stat === 'FIGHT_PROP_ATTACK'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_defIcon
        v-if="props.stat === 'FIGHT_PROP_DEFENSE'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_hpPercentIcon
        v-if="props.stat === 'FIGHT_PROP_HP_PERCENT'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_atkPercentIcon
        v-if="props.stat === 'FIGHT_PROP_ATTACK_PERCENT'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_defPercentIcon
        v-if="props.stat === 'FIGHT_PROP_DEFENSE_PERCENT'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_rechargeIcon
        v-if="
          props.stat === 'energyRecharge' ||
          props.stat === 'FIGHT_PROP_CHARGE_EFFICIENCY'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_masteryIcon
        v-if="props.stat === 'FIGHT_PROP_ELEMENT_MASTERY'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_crtrtIcon
        v-if="props.stat === 'critRate' || props.stat === 'FIGHT_PROP_CRITICAL'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_crtdmgIcon
        v-if="
          props.stat === 'critDamage' ||
          props.stat === 'FIGHT_PROP_CRITICAL_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_energyIcon
        v-if="props.stat === 'CUSTOM_ENERGY_REQUIRED'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_anemoIcon
        v-if="
          props.stat === 'anemoDamageBonus' ||
          props.stat === 'FIGHT_PROP_WIND_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_cryoIcon
        v-if="
          props.stat === 'cryoDamageBonus' ||
          props.stat === 'FIGHT_PROP_ICE_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_dendroIcon
        v-if="
          props.stat === 'dendroDamageBonus' ||
          props.stat === 'FIGHT_PROP_GRASS_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_electroIcon
        v-if="
          props.stat === 'electroDamageBonus' ||
          props.stat === 'FIGHT_PROP_ELEC_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_hydroIcon
        v-if="
          props.stat === 'hydroDamageBonus' ||
          props.stat === 'FIGHT_PROP_WATER_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_pyroIcon
        v-if="
          props.stat === 'pyroDamageBonus' ||
          props.stat === 'FIGHT_PROP_FIRE_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_geoIcon
        v-if="
          props.stat === 'geoDamageBonus' ||
          props.stat === 'FIGHT_PROP_ROCK_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_physicalIcon
        v-if="
          props.stat === 'physicalDamageBonus' ||
          props.stat === 'FIGHT_PROP_PHYSICAL_ADD_HURT'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_healingIcon
        v-if="
          props.stat === 'healingBonus' || props.stat === 'FIGHT_PROP_HEAL_ADD'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <gs_shieldIcon
        v-if="props.stat === 'shieldStrength'"
        :fill="props.fill"
        :class="props.class"
      />
      <gs_friendshipIcon
        v-if="props.stat === 'friendship'"
        :fill="props.fill"
        :class="props.class"
      />
    </div>
    <div v-if="props.game == 'sr'">
      <sr_hpIcon
        v-if="props.stat === 'hp'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_breakEffIcon
        v-if="props.stat === 'break_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_crtdmgIcon
        v-if="props.stat === 'crit_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_crtrtIcon
        v-if="props.stat === 'crit_rate'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_defIcon
        v-if="props.stat === 'def'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_effHitIcon
        v-if="props.stat === 'effect_hit'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_effResIcon
        v-if="props.stat === 'effect_res'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_atkIcon
        v-if="props.stat === 'atk'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_iceIcon
        v-if="props.stat === 'ice_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_imaginaryIcon
        v-if="props.stat === 'imaginary_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_regenIcon
        v-if="props.stat === 'sp_rate'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_spdIcon
        v-if="props.stat === 'spd'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_windIcon
        v-if="props.stat === 'wind_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_fireIcon
        v-if="props.stat === 'fire_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_quantumIcon
        v-if="props.stat === 'quantum_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_physicalIcon
        v-if="props.stat === 'physical_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_lightningIcon
        v-if="props.stat === 'lightning_dmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <sr_outHealingIcon
        v-if="props.stat === 'heal_rate'"
        :fill="props.fill"
        :class="props.class"
      />
    </div>
    <div v-if="props.game == 'zzz'">
      <zzz_elecIcon
        v-if="
          props.stat === 'Electric' ||
          props.stat === 'AddedDamageRatio_Electric'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_fireIcon
        v-if="props.stat === 'Fire' || props.stat === 'AddedDamageRatio_Fire'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_iceIcon
        v-if="props.stat === 'Ice' || props.stat === 'AddedDamageRatio_Ice'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_physIcon
        v-if="
          props.stat === 'Physical' ||
          props.stat === 'AddedDamageRatio_Physical'
        "
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_etherIcon
        v-if="props.stat === 'Ether' || props.stat === 'AddedDamageRatio_Ether'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_hpIcon
        v-if="props.stat === 'HpMax'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_atkIcon
        v-if="props.stat === 'Atk'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_defIcon
        v-if="props.stat === 'Def'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_crtrtIcon
        v-if="props.stat === 'Crit'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_crtdmgIcon
        v-if="props.stat === 'CritDmg'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_anoMasIcon
        v-if="props.stat === 'ElementMystery'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_anoProfIcon
        v-if="props.stat === 'ElementAbnormalPower'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_energyRegenIcon
        v-if="props.stat === 'SpRecover'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_penRatioIcon
        v-if="props.stat === 'PenRatio'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_penIcon
        v-if="props.stat === 'PenDelta'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_impactIcon
        v-if="props.stat === 'BreakStun'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreAIcon
        v-if="props.stat === 'CoreA'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreBIcon
        v-if="props.stat === 'CoreB'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreCIcon
        v-if="props.stat === 'CoreC'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreDIcon
        v-if="props.stat === 'CoreD'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreEIcon
        v-if="props.stat === 'CoreE'"
        :fill="props.fill"
        :class="props.class"
      />
      <zzz_coreFIcon
        v-if="props.stat === 'CoreF'"
        :fill="props.fill"
        :class="props.class"
      />
    </div>
  </div>
</template>
