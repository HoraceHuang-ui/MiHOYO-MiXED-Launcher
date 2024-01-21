<script setup lang="ts">
import {translate} from "../../../i18n";
import {PropType} from "vue";

const props = defineProps({
    // 'ok' | 'cancel'
    type: {
        type: String as PropType<'ok' | 'cancel'>,
        default: 'ok'
    },
    text: {
        type: String
    }
})
</script>

<template>
    <div class="button-wrapper font-sr-sans0"
         :style="type === 'cancel' ? 'background: #4CC5FE' : 'background: #FBE05B'">
        <div class="flex flex-row mt-0.5 w-full h-full justify-center"
             v-if="type === 'cancel'">
            <img class="h-2/3 mt-1 mr-2" src="../../../assets/hi3Dialog/hi3DialogCancel.png"/>
            <div class="font-bold mt-0.5">{{ text && text !== '' ? text : translate('general_cancel') }}</div>
        </div>

        <div class="flex flex-row mt-0.5 w-full h-full justify-center"
             v-if="type === 'ok'">
            <img class="h-2/3 mt-1 mr-2" src="../../../assets/hi3Dialog/hi3DialogOk.png"/>
            <div class="font-bold mt-0.5">{{ text && text !== '' ? text : translate('general_confirm') }}</div>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.button-wrapper {
    @apply mx-3 h-9 rounded transition-all cursor-default;
}

.button-wrapper:hover {
    @apply opacity-70;
}

.button-wrapper:active {
    @apply opacity-50;
}

.button-icon {
    @apply text-center rounded-full w-5 h-5 text-orange-200 mr-2;
    background: #262626;
}
</style>