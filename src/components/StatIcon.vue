<script setup>
import hpIcon from '../assets/statIcons/gs/hpIcon.vue'
import atkIcon from '../assets/statIcons/gs/atkIcon.vue'
import defIcon from '../assets/statIcons/gs/defIcon.vue'
import hpPercentIcon from '../assets/statIcons/gs/hpPercentIcon.vue'
import atkPercentIcon from '../assets/statIcons/gs/atkPercentIcon.vue'
import defPercentIcon from '../assets/statIcons/gs/defPercentIcon.vue'
import rechargeIcon from '../assets/statIcons/gs/rechargeIcon.vue'
import masteryIcon from '../assets/statIcons/gs/masteryIcon.vue'
import crtrtIcon from '../assets/statIcons/gs/crtrtIcon.vue'
import crtdmgIcon from '../assets/statIcons/gs/crtdmgIcon.vue'
import energyIcon from '../assets/statIcons/gs/energyIcon.vue'

const props = defineProps({
    game: "gs" | "sr",
    stat: typeof "aaa",
    fill: typeof "aaa"
})
</script>

<template>
    <div>
        <div v-if="props.game == 'gs'">
            <hpIcon v-if="props.stat === 'FIGHT_PROP_HP'" :fill="props.fill" />
            <atkIcon v-if="props.stat === 'FIGHT_PROP_ATTACK'" :fill="props.fill" />
            <defIcon v-if="props.stat === 'FIGHT_PROP_DEFENSE'" :fill="props.fill" />
            <hpPercentIcon v-if="props.stat === 'FIGHT_PROP_HP_PERCENT'" :fill="props.fill" />
            <atkPercentIcon v-if="props.stat === 'FIGHT_PROP_ATTACK_PERCENT'" :fill="props.fill" />
            <defPercentIcon v-if="props.stat === 'FIGHT_PROP_DEFENSE_PERCENT'" :fill="props.fill" />
            <rechargeIcon v-if="props.stat === 'FIGHT_PROP_CHARGE_EFFICIENCY'" :fill="props.fill" />
            <masteryIcon v-if="props.stat === 'FIGHT_PROP_ELEMENT_MASTERY'" :fill="props.fill" />
            <crtrtIcon v-if="props.stat === 'FIGHT_PROP_CRITICAL'" :fill="props.fill" />
            <crtdmgIcon v-if="props.stat === 'FIGHT_PROP_CRITICAL_HURT'" :fill="props.fill" />
            <energyIcon v-if="props.stat === 'CUSTOM_ENERGY_REQUIRED'" :fill="props.fill" />
        </div>
        <div v-if="props.name == 'sr'">
        </div>
    </div>
</template>
