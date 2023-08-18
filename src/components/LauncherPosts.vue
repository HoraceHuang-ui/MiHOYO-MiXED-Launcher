<script setup>
import { ref } from 'vue'
const props = defineProps({
    postTypeMap: Map
})

const tabsModel = ref('aaa')

const openLink = (url) => {
    window.electron.openExtLink(url)
}
</script>

<template>
    <el-tabs v-model="tabsModel">
        <el-tab-pane label="资讯" name="aaa">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('资讯')"
                        class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-pointer"
                        style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{ post.tittle
                        }}</el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post.show_time }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="活动" name="bbb">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('活动')"
                        class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-pointer"
                        style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{ post.tittle
                        }}</el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post.show_time }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="公告" name="ccc">
            <el-scrollbar class="w-full h-full" max-height="62px">
                <div class="h-max pr-2 pb-2">
                    <div v-for="post in postTypeMap.get('公告')"
                        class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-pointer"
                        style="height: 28px;" @click="openLink(post.url)">
                        <el-text class=" mr-1" truncated style="max-width: 320px;">{{ post.tittle
                        }}</el-text>
                        <el-text size="small" class=" font-sans font-normal">{{ post.show_time }}</el-text>
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
