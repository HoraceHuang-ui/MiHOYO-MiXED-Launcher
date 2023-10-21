<script setup>
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

const props = defineProps({
    game: "gs" | "sr" | "general",
    stat: typeof "aaa",
    fill: typeof "aaa"
})
</script>

<template>
    <div>
        <div v-if="props.game == 'gs'">
            <gs_hpIcon v-if="props.stat === 'FIGHT_PROP_HP'" :fill="props.fill" />
            <gs_atkIcon v-if="props.stat === 'FIGHT_PROP_ATTACK'" :fill="props.fill" />
            <gs_defIcon v-if="props.stat === 'FIGHT_PROP_DEFENSE'" :fill="props.fill" />
            <gs_hpPercentIcon v-if="props.stat === 'FIGHT_PROP_HP_PERCENT'" :fill="props.fill" />
            <gs_atkPercentIcon v-if="props.stat === 'FIGHT_PROP_ATTACK_PERCENT'" :fill="props.fill" />
            <gs_defPercentIcon v-if="props.stat === 'FIGHT_PROP_DEFENSE_PERCENT'" :fill="props.fill" />
            <gs_rechargeIcon v-if="props.stat === 'FIGHT_PROP_CHARGE_EFFICIENCY'" :fill="props.fill" />
            <gs_masteryIcon v-if="props.stat === 'FIGHT_PROP_ELEMENT_MASTERY'" :fill="props.fill" />
            <gs_crtrtIcon v-if="props.stat === 'FIGHT_PROP_CRITICAL'" :fill="props.fill" />
            <gs_crtdmgIcon v-if="props.stat === 'FIGHT_PROP_CRITICAL_HURT'" :fill="props.fill" />
            <gs_energyIcon v-if="props.stat === 'CUSTOM_ENERGY_REQUIRED'" :fill="props.fill" />
            <gs_anemoIcon v-if="props.stat === 'anemoDamageBonus' || props.stat === 'FIGHT_PROP_WIND_ADD_HURT'"
                :fill="props.fill" />
            <gs_cryoIcon v-if="props.stat === 'cryoDamageBonus' || props.stat === 'FIGHT_PROP_ICE_ADD_HURT'"
                :fill="props.fill" />
            <gs_dendroIcon v-if="props.stat === 'dendroDamageBonus' || props.stat === 'FIGHT_PROP_GRASS_ADD_HURT'"
                :fill="props.fill" />
            <gs_electroIcon v-if="props.stat === 'electroDamageBonus' || props.stat === 'FIGHT_PROP_ELEC_ADD_HURT'"
                :fill="props.fill" />
            <gs_hydroIcon v-if="props.stat === 'hydroDamageBonus' || props.stat === 'FIGHT_PROP_WATER_ADD_HURT'"
                :fill="props.fill" />
            <gs_pyroIcon v-if="props.stat === 'pyroDamageBonus' || props.stat === 'FIGHT_PROP_FIRE_ADD_HURT'"
                :fill="props.fill" />
            <gs_geoIcon v-if="props.stat === 'geoDamageBonus' || props.stat === 'FIGHT_PROP_ROCK_ADD_HURT'"
                :fill="props.fill" />
            <gs_physicalIcon v-if="props.stat === 'physicalDamageBonus' || props.stat === 'FIGHT_PROP_PHYSICAL_ADD_HURT'"
                :fill="props.fill" />
            <gs_healingIcon v-if="props.stat === 'healingBonus' || props.stat === 'FIGHT_PROP_HEAL_ADD'"
                :fill="props.fill" />
        </div>
        <div v-if="props.game == 'sr'">
            <sr_hpIcon v-if="props.stat === 'hp'" :fill="props.fill" />
            <sr_breakEffIcon v-if="props.stat === 'break_dmg'" :fill="props.fill" />
            <sr_crtdmgIcon v-if="props.stat === 'crit_dmg'" :fill="props.fill" />
            <sr_crtrtIcon v-if="props.stat === 'crit_rate'" :fill="props.fill" />
            <sr_defIcon v-if="props.stat === 'def'" :fill="props.fill" />
            <sr_effHitIcon v-if="props.stat === 'effect_hit'" :fill="props.fill" />
            <sr_effResIcon v-if="props.stat === 'effect_res'" :fill="props.fill" />
            <sr_atkIcon v-if="props.stat === 'atk'" :fill="props.fill" />
            <sr_iceIcon v-if="props.stat === 'ice_dmg'" :fill="props.fill" />
            <sr_imaginaryIcon v-if="props.stat === 'imaginary_dmg'" :fill="props.fill" />
            <sr_regenIcon v-if="props.stat === 'sp_rate'" :fill="props.fill" />
            <sr_spdIcon v-if="props.stat === 'spd'" :fill="props.fill" />
            <sr_windIcon v-if="props.stat === 'wind_dmg'" :fill="props.fill" />
            <sr_fireIcon v-if="props.stat === 'fire_dmg'" :fill="props.fill" />
            <sr_quantumIcon v-if="props.stat === 'quantum_dmg'" :fill="props.fill" />
            <sr_physicalIcon v-if="props.stat === 'physical_dmg'" :fill="props.fill" />
            <sr_lightningIcon v-if="props.stat === 'lightning_dmg'" :fill="props.fill" />
        </div>
    </div>
</template>
