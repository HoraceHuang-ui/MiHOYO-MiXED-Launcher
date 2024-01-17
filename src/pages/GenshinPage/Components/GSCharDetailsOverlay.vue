<script setup lang="ts">
import {ref} from 'vue'
import StatIcon from "../../../components/StatIcon.vue";
import DialogListItem from "../../../components/DialogListItem.vue";
import {Stats} from "enkanetwork.js";
import {translate} from "../../../i18n";
import TemplateDialog from "../../../components/TemplateDialog.vue";

defineProps({
    title: {
        type: String,
        default: 'Character Details'
    },
    character: {
        type: Object,
        required: true
    }
})

const dialogRef = ref<any>(null)

const trimStats = (stats: Stats) => {
    const trim = ['baseHp', 'hpPercentage', 'maxHp', 'currentHp', 'baseAtk', 'atk', 'atkPercentage', 'def', 'baseDef', 'defPercentage', 'Cost', 'Energy', 'Mastery']
    const res = {...stats}
    const entries = Object.entries(stats)

    for (const [stat, val] of entries) {
        let flag = false;
        for (const t of trim) {
            if (stat.endsWith(t) || val.value === '' || val.value === '0') {
                flag = true;
                break
            }
        }
        if (flag) {
            delete (res as any)[stat]
        }
    }

    return res
}

const closeDialog = () => {
    dialogRef.value?.cancelClick?.()
}
</script>

<template>
    <TemplateDialog width="50%" class="text-gray-100" ref="dialogRef">
        <div class="w-full font-gs text-center text-xl mb-2">{{
                character.name + ' ' + translate('gs_charDetails')
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

        <div class="flex flex-col content-center justify-center w-full px-5 mt-5">
            <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_HP')">
                <template #icon>
                    <StatIcon game="gs" stat="FIGHT_PROP_HP" fill="#eee" class="w-4 h-4" style="margin-top: 2px;"/>
                </template>
                <div class="font-gs">
                    <span>{{ parseInt(character.stats.baseHp.value as string) }}</span>
                    <span
                        v-if="character.stats.maxHp.value != character.stats.baseHp.value"
                        class="ml-1 text-blue-400">+{{
                            parseInt(character.stats.maxHp.value as string)
                            - parseInt(character.stats.baseHp.value as string)
                        }}</span>
                </div>
            </DialogListItem>
            <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_ATTACK')">
                <template #icon>
                    <StatIcon game="gs" stat="FIGHT_PROP_ATTACK" fill="#eee" class="w-4 h-4"
                              style="margin-top: 2px;"/>
                </template>
                <div class="font-gs">
                    <span>{{ parseInt(character.stats.baseAtk.value as string) }}</span>
                    <span
                        v-if="parseInt(character.stats.atk.value as string) != parseInt(character.stats.baseAtk.value as string)"
                        class="ml-1 text-blue-400">+{{
                            parseInt(character.stats.atk.value as string) -
                            parseInt(character.stats.baseAtk.value as string)
                        }}</span>
                </div>
            </DialogListItem>
            <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_DEFENSE')">
                <template #icon>
                    <StatIcon game="gs" stat="FIGHT_PROP_DEFENSE" fill="#eee" class="w-4 h-4"
                              style="margin-top: 2px;"/>
                </template>
                <div class="font-gs">
                    <span>{{ parseInt(character.stats.baseDef.value as string) }}</span>
                    <span
                        v-if="parseInt(character.stats.def.value as string) != parseInt(character.stats.baseDef.value as string)"
                        class="ml-1 text-blue-400">+{{
                            parseInt(character.stats.def.value as string) -
                            parseInt(character.stats.baseDef.value as string)
                        }}</span>
                </div>
            </DialogListItem>
            <DialogListItem class="font-gs" :name="translate('gs_FIGHT_PROP_ELEMENT_MASTERY')"
                            :val="character.stats.elementalMastery.value ? parseInt(character.stats.elementalMastery.value as string).toString() : '0'">
                <template #icon>
                    <StatIcon game="gs" stat="FIGHT_PROP_ELEMENT_MASTERY" fill="#eee" class="w-4 h-4"
                              style="margin-top: 2px;"/>
                </template>
            </DialogListItem>
            <DialogListItem v-for="(stat, key) in trimStats(character.stats)"
                            class="font-gs" :name="translate(`gs_${key}`)"
                            :val="(stat.value as number * 100).toFixed(1).toString() + '%'">
                <template #icon>
                    <StatIcon game="gs" :stat="key" fill="#eee" class="w-4 h-4" style="margin-top: 2px;"/>
                </template>
            </DialogListItem>
        </div>
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