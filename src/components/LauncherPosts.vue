<script setup lang="ts">
import { ref } from 'vue'
import { PostInfo } from '../types/launcher/launcherInfo'
import MyTabs from './MyTabs.vue'
import { translateMultiple } from '../i18n'
import ScrollWrapper from './ScrollWrapper.vue'

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
  <MyTabs v-model="tabsModel" :tabs="tabs" class="text-sm">
    <div v-for="key in keys" :key="key" class="tab-wrapper">
      <ScrollWrapper height="calc(16vh - 48px)">
        <div class="scroll-content-wrapper">
          <div
            v-for="post in postTypeMap.get(key)"
            class="link-item"
            @click="openLink(post.url)"
            :key="post.post_id"
          >
            <div class="left">
              {{ post['tittle'] }}
            </div>
            <div class="right">
              {{ post['show_time'] }}
            </div>
          </div>
        </div>
      </ScrollWrapper>
    </div>
  </MyTabs>
</template>

<style lang="scss" scoped>
.tab-wrapper {
  @apply w-full;
}

.scroll-content-wrapper {
  @apply h-max pr-2 pb-2;
}

.link-item {
  @apply flex flex-row p-1 pl-2 w-full justify-between text-black rounded;
  @apply hover:bg-white hover:shadow-md transition-all cursor-pointer;
  height: 28px;

  .dark & {
    @apply text-gray-300;
    @apply hover:bg-[#001] hover:shadow-gray-600;
  }

  .left {
    @apply mr-1 mt-0.5 truncate;
  }

  .right {
    @apply font-sans font-normal;
  }
}
</style>
