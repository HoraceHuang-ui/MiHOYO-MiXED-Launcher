<script setup lang="ts">
import {translate} from "../../../i18n";

defineProps({
    // 'ok' | 'cancel'
    type: {
        type: String,
        default: 'ok'
    },
    text: {
        type: String
    }
})
</script>

<template>
    <div class="button-wrapper font-gs">
        <div class="rounded-full w-full h-full justify-center text-black">
            <div v-if="type === 'cancel'" class="flex flex-row justify-between">
                <i class="bi bi-x button-icon text-blue-300 text-xl"/>
                <div class="button-text">{{ text && text !== '' ? text : translate('general_cancel') }}</div>
                <div class="w-1"/>
            </div>
            <div v-if="type === 'ok'" class="flex flex-row justify-between">
                <div class="button-icon flex flex-row">
                    <div class="rounded-full w-4 h-4 border-2 border-yellow-400 mt-1"></div>
                </div>
                <div class="button-text">{{ text && text !== '' ? text : translate('general_confirm') }}</div>
                <div class="w-1"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.button-wrapper {
    @apply border-2 mx-3 h-9 p-1 rounded-full bg-white transition-all cursor-default shadow-lg;
    background: #4A5366;
    border-color: #4A5366;
}

.button-wrapper:hover {
    border-color: #FFE7B2;
}

.button-wrapper:active {
    @apply opacity-50;
}

.button-text {
    color: #E5E2DC;
}

.button-icon {
    @apply rounded-full w-6 h-6 mr-2 text-center justify-center;
    background: #313131;
}
</style>