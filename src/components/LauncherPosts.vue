<script setup lang="ts">
import {ref} from 'vue'
import {PostInfo} from "../types/launcher/launcherInfo";
import ScrollWrapper from "./ScrollWrapper.vue";

const props = defineProps({
    postTypeMap: {
        type: Map<string, PostInfo[]>,
        required: true
    }
})

const tabsModel = ref('POST_TYPE_INFO')
const keys = ['POST_TYPE_INFO', 'POST_TYPE_ACTIVITY', 'POST_TYPE_ANNOUNCE']

const openLink = (url: string) => {
    window.electron.openExtLink(url)
}
</script>

<template>
    <el-tabs v-model="tabsModel">
        <el-tab-pane v-for="key in keys" :key="key" :label="$t(key)" :name="key">
            <ScrollWrapper height="62px" :scroll-padding="0">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get(key)"
                         class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-default"
                         style="height: 28px;" @click="openLink(post.url)">
                        <div class="mr-1 truncated text-sm mt-0.5" style="max-width: 320px;">
                            {{ post['tittle'] }}
                        </div>
                        <div class="text-sm font-sans font-normal"> {{ post['show_time'] }}</div>
                    </div>
                </div>
            </ScrollWrapper>
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.truncated {
    @apply inline-block max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden;
}
</style>
