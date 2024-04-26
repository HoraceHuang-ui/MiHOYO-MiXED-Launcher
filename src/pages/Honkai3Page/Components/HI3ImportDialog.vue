<script setup lang="ts">
import { translate } from '../../../i18n'
import { PropType, Ref, ref } from 'vue'
import Honkai3Dialog from './Honkai3Dialog.vue'
import MyCheckbox from '../../../components/MyCheckbox.vue'
import MyTooltip from '../../../components/MyTooltip.vue'
import { useStore } from '../../../store'

const props = defineProps({
  onOk: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
  hScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
  vScale: {
    type: Object as PropType<Ref<number>>,
    default: ref(1),
  },
})

const combinePaths = ref(true)
const dialogRef = ref()
const launcherPath = ref('')
const gamePath = ref('')
const store = useStore()

const hiLauncherImport = async () => {
  window.dialog
    .show({
      title: translate('general_launcherImportTitle', {
        game: translate('general_hi3'),
      }),
      properties: ['openDirectory'],
    })
    .then(resp => {
      if (resp.length > 0) {
        launcherPath.value = resp[0]
      }
    })
    .catch(error => {
      console.error('Error in showing dialog:', error)
    })
}
const hiGameImport = async () => {
  window.dialog
    .show({
      title: translate('general_gameImportTitle', {
        game: translate('general_hi3'),
      }),
      properties: ['openFile'],
      filters: [{ name: 'EXE', extensions: ['exe'] }],
    })
    .then(resp => {
      if (resp.length > 0) {
        gamePath.value = resp[0]
      }
    })
    .catch(error => {
      console.error('Error in showing dialog:', error)
    })
}

const confirmPaths = async () => {
  if (combinePaths.value) {
    gamePath.value = launcherPath.value + '\\Games\\BH3.exe'
  }
  launcherPath.value += '\\launcher.exe'
  store.game.hi3.launcherPath = launcherPath.value
  store.game.hi3.gamePath = gamePath.value
}

const onDialogOk = () => {
  if (launcherPath.value && (gamePath.value || combinePaths.value)) {
    confirmPaths()
    dialogRef.value.closeDialog()
    if (props.onOk) {
      props.onOk()
    }
  }
}
</script>

<template>
  <Honkai3Dialog
    :title="`${translate('general_hi3')} ${translate('general_import')}`"
    :on-ok="onDialogOk"
    :on-cancel="onCancel"
    show-ok
    show-cancel
    :close-on-ok="false"
    ref="dialogRef"
    :h-scale="hScale"
    :v-scale="vScale"
  >
    <div class="import-buttons-wrapper">
      <button @click="hiLauncherImport" class="import-button enabled">
        {{ translate('general_importLauncher') }}
      </button>
      <button
        @click="hiGameImport"
        class="import-button"
        :class="combinePaths ? 'disabled' : 'enabled'"
      >
        {{ translate('general_importGame') }}
      </button>
      <div class="path-wrapper">
        <span class="theme-color font-bold mr-2">{{
          translate('general_launcher')
        }}</span>
        {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
      </div>
      <div class="path-wrapper">
        <span class="theme-color font-bold mr-2">{{
          translate('general_game')
        }}</span>
        {{
          launcherPath === ''
            ? gamePath
            : combinePaths
              ? launcherPath + '\\Games\\BH3.exe'
              : gamePath
        }}
      </div>
      <div class="combine-paths-wrapper">
        <MyCheckbox
          v-model="combinePaths"
          :text="translate('general_defaultStructure')"
          on-color="#4CC5FE"
          off-color="#dddddd"
        />
        <MyTooltip
          placement="right"
          max-width="400px"
          middle
          :content="`<${translate('general_launcherDirectory')}>\\Games\\BH3.exe`"
        >
          <div class="combine-paths-help">?</div>
        </MyTooltip>
      </div>
    </div>
  </Honkai3Dialog>
</template>

<style lang="scss" scoped>
.import-buttons-wrapper {
  @apply px-1 grid grid-cols-2 gap-4;
}

.import-button {
  @apply py-1 px-2 rounded-full transition-all;

  &.enabled {
    border-width: 1px;
    border-color: rgb(72, 107, 161);
    background: rgb(72, 107, 161, 0.5);
    color: #51c3f9;

    &:hover {
      @apply border-blue-400;
      background: rgb(72, 107, 161, 0.8);
    }
    &:active {
      background: rgb(130, 167, 229);
    }
  }
  &.disabled {
    @apply text-gray-400 pointer-events-none;
  }
}

.path-wrapper {
  @apply ml-3 mt-[5px] text-gray-200;
  grid-column: 1 / 3;
}

.confirm-button-enabled {
  @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
  @apply bg-blue-200 text-white pointer-events-none;
}

.theme-color {
  color: #51c3f9;
}

.combine-paths-wrapper {
  @apply flex flex-row;
}

.combine-paths-help {
  @apply ml-2 mt-[5px] w-5 h-5 rounded-full;
  @apply text-center font-bold text-sm;
  @apply bg-gray-400 text-white cursor-help;
}
</style>
