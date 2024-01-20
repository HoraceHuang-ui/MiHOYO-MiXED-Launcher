<script setup lang="ts">
import {marked} from "marked";
import {translate} from "../i18n";
import MyCheckbox from "./MyCheckbox.vue";
import {computed, ref} from 'vue'
import ScrollWrapper from "./ScrollWrapper.vue";

const props = defineProps({
    appVer: {
        type: String,
        required: true
    },
    updInfo: {
        type: Object,
        required: true
    },
    showSkipCurrent: {
        type: Boolean,
        default: true
    },
    skipCurrent: {
        type: Boolean,
        default: false
    },
    gameStyle: {
        type: String,
        default: 'gs'
    }
})
defineEmits(['update:skipCurrent'])

const skip = ref(props.skipCurrent)

const updDialogContent = marked(props.updInfo.body)

const onColor = computed(() => {
    switch (props.gameStyle) {
        case 'gs':
            return '#b78c22'
        case 'sr':
            return '#CEA652'
        case 'hi3':
            return '#4CC5FE'
    }
})
const offColor = computed(() => {
    switch (props.gameStyle) {
        case 'gs':
            return '#606266'
        case 'sr':
            return '#606266'
        case 'hi3':
            return '#dddddd'
    }
})
</script>

<template>
    <div style="padding-left: 20px; padding-right: 20px;">
        <ScrollWrapper height="40vh" show-bar="always">
            <div v-html="updDialogContent"></div>
        </ScrollWrapper>
        <div :class="gameStyle === 'hi3' ? 'text-red-400' : 'text-red-600'" style="margin-top: 10px;">
            {{ translate('updDialog_version') }}v{{ appVer }} 👉 {{
                updInfo.tag_name
            }}
        </div>
        <div :class="gameStyle === 'hi3' ? 'text-red-400' : 'text-red-600'">{{ translate('updDialog_size') }}{{
                (updInfo.assets[0].size / 1024 / 1024).toFixed(1)
            }}MB
        </div>
        <div :class="gameStyle === 'hi3' ? 'text-red-400' : 'text-red-600'">{{
                translate('updDialog_footerText')
            }}
        </div>
        <MyCheckbox v-if="showSkipCurrent" v-model="skip"
                    :text="translate('updDialog_skipCurrent')" :on-color="onColor" :off-color="offColor"/>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>