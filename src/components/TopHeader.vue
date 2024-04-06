<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { translate } from '../i18n'
// const props = defineProps({
//     selection: Number
// })

const pageNames = [
  translate('general_mainpage'),
  translate('general_gs'),
  translate('general_sr'),
  translate('general_hi3'),
  translate('general_settings'),
]
const selection = ref(0)

const router = useRouter()
const home = () => {
  selection.value = 0
  router.push('/')
}
const genshin = () => {
  selection.value = 1
  router.push({
    name: 'tempPage',
    query: {
      from: 'gs',
    },
  })
}
const starRail = () => {
  selection.value = 2
  router.push({
    name: 'tempPage',
    query: {
      from: 'sr',
    },
  })
}
const honkai3 = () => {
  selection.value = 3
  router.push({
    name: 'tempPage',
    query: {
      from: 'hi3',
    },
  })
}
const settings = () => {
  selection.value = 4
  router.push('/settingspage')
}

const winClose = async () => {
  const quitOnClose = await window.store.get('quitOnClose')
  if (quitOnClose) {
    await window.win.close()
  } else {
    await window.win.tray()
  }
}
const winMin = () => {
  window.win.min()
}
</script>

<template>
  <div class="drag main-wrapper">
    <div class="title-wrapper">
      <img src="../../public/favicon.ico" />
      <div class="title">miXeD · {{ pageNames[selection] }}</div>
    </div>
    <div class="no-drag icons-wrapper">
      <div class="header-icon" :class="{ selected: selection == 0 }">
        <img src="../assets/homeicon.png" class="non-game" @click="home" />
      </div>
      <img
        src="../assets/gsicon.webp"
        @click="genshin"
        class="header-icon"
        :class="{ selected: selection == 1 }"
      />
      <img
        src="../assets/sricon.webp"
        @click="starRail"
        class="header-icon"
        :class="{ selected: selection == 2 }"
      />
      <img
        src="../assets/hi3icon.png"
        @click="honkai3"
        class="header-icon"
        :class="{ selected: selection == 3 }"
      />
      <div class="header-icon" :class="{ selected: selection == 4 }">
        <img
          src="../assets/settingsIcon.png"
          @click="settings"
          class="non-game p-[2px]"
        />
      </div>
    </div>
    <div class="drag focus" style="width: 35vw">
      <div class="traffic-lights no-drag mt-2 py-3">
        <div class="traffic-light traffic-light-maximize"></div>
        <div class="traffic-light traffic-light-minimize" @click="winMin"></div>
        <div class="traffic-light traffic-light-close" @click="winClose"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  @apply sticky z-50 top-0 left-0;
  @apply flex flex-row justify-between w-full;
  height: 8vh;
}

.title-wrapper {
  @apply mt-3 ml-2 text-left flex flex-row;
  width: 35vw;

  img {
    @apply h-6 mt-1;
  }
}

.title {
  @apply ml-2 mt-[2px];
}

.icons-wrapper {
  @apply flex flex-row h-full;
  @apply items-center justify-items-center;

  .header-icon {
    @apply mx-2 rounded-lg h-8 transition-all hover:scale-110 active:scale-90;

    & > img {
      @apply size-full rounded-lg;
    }

    & > .non-game {
      @apply opacity-60;

      .dark & {
        @apply invert;
      }
    }

    &.selected {
      @apply hover:scale-100;
      height: 6vh;
      background-color: rgb(135, 182, 249, 0.3);
      border: 5px solid rgb(121, 184, 255);
    }
  }
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
