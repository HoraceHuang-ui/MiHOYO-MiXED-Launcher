<script setup lang="ts">
import { ref } from 'vue'
import { PostInfo } from '../types/launcher/launcherInfo'
import MyTabs from './MyTabs.vue'
import { translateMultiple } from '../i18n'

defineProps({
  postTypeMap: {
    type: Map<string, PostInfo[]>,
    required: true,
  },
})

const tabsModel = ref(0)
const keys = ['POST_TYPE_ACTIVITY', 'POST_TYPE_ANNOUNCE', 'POST_TYPE_INFO']
const tabs = translateMultiple(keys)

const openLink = (url: string) => {
  window.electron.openExtLink(url)
}
</script>

<template>
  <MyTabs class="text-sm" v-model="tabsModel" :tabs="tabs">
    <div v-for="key in keys" :key="key" class="w-full">
      <ScrollWrapper height="64px">
        <div class="h-max pr-2 pb-2">
          <div
            v-for="post in postTypeMap.get(key)"
            class="w-full justify-between flex flex-row p-1 pl-2 hover:bg-white rounded hover:shadow-md transition-all cursor-default"
            style="height: 28px"
            @click="openLink(post.url)"
            :key="post.post_id"
          >
            <div class="mr-1 truncated text-sm mt-0.5" style="max-width: 320px">
              {{ post['tittle'] }}
            </div>
            <div class="text-sm font-sans font-normal">
              {{ post['show_time'] }}
            </div>
          </div>
        </div>
      </ScrollWrapper>
    </div>
  </MyTabs>
</template>

<style scoped>
.truncated {
  @apply inline-block max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden;
}
</style>
