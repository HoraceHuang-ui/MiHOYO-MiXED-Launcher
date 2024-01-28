<script setup lang="ts">
import {PropType, ref} from 'vue'
import StatIcon from "../../../components/StatIcon.vue";
import DialogListItem from "../../../components/DialogListItem.vue";
import {translate} from "../../../i18n";
import TemplateDialog from "../../../components/TemplateDialog.vue";
import ScrollWrapper from "../../../components/ScrollWrapper.vue";

const props = defineProps({
    title: {
        type: String,
        default: 'Character Details'
    },
    stats: {
        type: Array as PropType<any[]>,
        required: true
    }
})

const dialogRef = ref<any>(null)

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
    dialogRef.value?.cancelClick?.()
}
</script>

<template>
    <TemplateDialog width="50%" class="text-gray-100" ref="dialogRef">
        <div class="w-full font-gs text-center text-xl mb-2">{{
                title
            }}
        </div>
        <div
            class="z-50 w-6 h-6 p-1 absolute right-1 top-1 rounded-full hover:opacity-70 hover:scale-125 active:opacity-50 active:scale-90 transition-all cursor-pointer"
            @click="closeDialog">
            <img src="../../../assets/gsDialog/gsDialogClose.png"/>
        </div>
        <div class="w-full flex flex-row justify-center mt-1">
            <div class="w-full flex flex-row justify-center relative">
                <img style="height: 9px; transform: rotate3d(0, 1, 0, 180deg)"
                     src="../../../assets/gsDialog/gsDividerSide.png"/>
                <div class="divider-bg w-full" style="height: 1px; margin-top: 4px"/>
                <img style="height: 9px" src="../../../assets/gsDialog/gsDividerSide.png"/>
            </div>
        </div>

        <ScrollWrapper show-bar="always" style="max-height: 80vh" :no-resize="false">
            <div class="flex flex-col content-center justify-center w-full px-5 mt-5">
                <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_HP')">
                    <template #icon>
                        <StatIcon game="gs" stat="FIGHT_PROP_HP" fill="#eee" class="w-4 h-4" style="margin-top: 2px;"/>
                    </template>
                    <div class="font-gs">
                        <span>{{ stats[0].value.toFixed(0) }}</span>
                        <span
                            v-if="stats[37].value.toFixed(0) != stats[0].value.toFixed(0)"
                            class="ml-1 text-blue-400">+{{
                                stats[37].value.toFixed(0)
                                - stats[0].value.toFixed(0)
                            }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_ATTACK')">
                    <template #icon>
                        <StatIcon game="gs" stat="FIGHT_PROP_ATTACK" fill="#eee" class="w-4 h-4"
                                  style="margin-top: 2px;"/>
                    </template>
                    <div class="font-gs">
                        <span>{{ stats[3].value.toFixed(0) }}</span>
                        <span
                            v-if="stats[38].value.toFixed(0) != stats[3].value.toFixed(0)"
                            class="ml-1 text-blue-400">+{{
                                stats[38].value.toFixed(0) -
                                stats[3].value.toFixed(0)
                            }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_DEFENSE')">
                    <template #icon>
                        <StatIcon game="gs" stat="FIGHT_PROP_DEFENSE" fill="#eee" class="w-4 h-4"
                                  style="margin-top: 2px;"/>
                    </template>
                    <div class="font-gs">
                        <span>{{ stats[6].value.toFixed(0) }}</span>
                        <span
                            v-if="stats[39].value.toFixed(0) != stats[6].value.toFixed(0)"
                            class="ml-1 text-blue-400">+{{
                                stats[39].value.toFixed(0) -
                                stats[6].value.toFixed(0)
                            }}</span>
                    </div>
                </DialogListItem>
                <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_ELEMENT_MASTERY')"
                                :val="stats[16].value.toFixed(0)">
                    <template #icon>
                        <StatIcon game="gs" stat="FIGHT_PROP_ELEMENT_MASTERY" fill="#eee" class="w-4 h-4"
                                  style="margin-top: 2px;"/>
                    </template>
                </DialogListItem>
                <DialogListItem v-for="(val, name) in trimStats(stats)"
                                class="font-gs" :name="val.fightPropName.text"
                                :val="displayStat(val)">
                    <template #icon>
                        <StatIcon game="gs" :stat="name" fill="#eee" class="w-4 h-4" style="margin-top: 2px;"/>
                    </template>
                </DialogListItem>
            </div>
        </ScrollWrapper>
    </TemplateDialog>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.divider-bg {
    background: #DAD2C5;
}
</style>