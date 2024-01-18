<script setup lang="ts">
import {marked} from "marked";
import {ref} from 'vue'
import {translate} from "../i18n";

const props = defineProps({
    appVer: {
        type: String,
        required: true
    },
    updInfo: {
        type: Object,
        required: true
    }
})

const skipCurrent = ref(false)
const updDialogContent = marked(props.updInfo.body)
</script>

<template>
    <div style="padding-left: 20px; padding-right: 20px;">
        <el-scrollbar height="40vh">
            <div v-html="updDialogContent"></div>
        </el-scrollbar>
        <div class="text-red-400" style="margin-top: 10px;">{{ translate('updDialog_version') }}v{{ appVer }} 👉 {{
                updInfo.tag_name
            }}
        </div>
        <div class="text-red-400">{{ translate('updDialog_size') }}{{
                (updInfo.assets[0].size / 1024 / 1024).toFixed(1)
            }}MB
        </div>
        <div class="text-red-400">{{ translate('updDialog_footerText') }}</div>
        <el-checkbox v-model="skipCurrent">{{ translate("updDialog_skipCurrent") }}</el-checkbox>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>