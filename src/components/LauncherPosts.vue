<script setup lang="ts">
import {ref} from 'vue'
import {PostInfo} from "../types/launcher/launcherInfo";

const props = defineProps({
    postTypeMap: {
        type: Map<string, PostInfo[]>,
        required: true
    }
})

const tabsModel = ref('aaa')

const openLink = (url: string) => {
    window.electron.openExtLink(url)
}
</script>

<template>
    <el-tabs v-model="tabsModel">
        <el-tab-pane :label="$t('POST_TYPE_INFO')" name="aaa">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('POST_TYPE_INFO')"
                         class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-default"
                         style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{
                                post['tittle']
                            }}
                        </el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post['show_time'] }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="$t('POST_TYPE_ACTIVITY')" name="bbb">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('POST_TYPE_ACTIVITY')"
                         class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-default"
                         style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{
                                post['tittle']
                            }}
                        </el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post['show_time'] }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="$t('POST_TYPE_ANNOUNCE')" name="ccc">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('POST_TYPE_ANNOUNCE')"
                         class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-default"
                         style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{
                                post['tittle']
                            }}
                        </el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post['show_time'] }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
