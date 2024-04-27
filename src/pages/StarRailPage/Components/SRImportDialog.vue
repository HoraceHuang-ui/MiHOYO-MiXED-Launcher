<script setup lang="ts">
import StarRailDialog from './StarRailDialog.vue'
import { translate } from '../../../i18n'
import { PropType, Ref, ref } from 'vue'
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

const srLauncherImport = async () => {
  window.dialog
    .show({
      title: translate('general_launcherImportTitle', {
        game: translate('general_sr'),
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
const srGameImport = async () => {
  window.dialog
    .show({
      title: translate('general_gameImportTitle', {
        game: translate('general_sr'),
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

const confirmPaths = () => {
  if (combinePaths.value) {
    gamePath.value = launcherPath.value + '\\Game\\StarRail.exe'
  }
  launcherPath.value += '\\launcher.exe'

  store.game.sr.launcherPath = launcherPath.value
  store.game.sr.gamePath = gamePath.value
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
  <StarRailDialog
    :title="`${translate('general_sr')} ${translate('general_import')}`"
    :on-ok="onDialogOk"
    :on-cancel="onCancel"
    show-ok
    show-cancel
    :close-on-ok="false"
    ref="dialogRef"
    :h-scale="hScale"
    :v-scale="vScale"
  >
    <div class="content-wrapper">
      <button @click="srLauncherImport" class="import-button enabled">
        {{ translate('general_importLauncher') }}
      </button>
      <button
        @click="srGameImport"
        class="import-button"
        :class="combinePaths ? 'disabled' : 'enabled'"
      >
        {{ translate('general_importGame') }}
      </button>
      <div class="path-wrapper">
        <span class="font-bold mr-2">{{ translate('general_launcher') }}</span>
        {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
      </div>
      <div class="path-wrapper">
        <span class="font-bold mr-2">{{ translate('general_game') }}</span>
        {{
          launcherPath === ''
            ? gamePath
            : combinePaths
              ? launcherPath + '\\Game\\StarRail.exe'
              : gamePath
        }}
      </div>
      <div class="confirm-paths-wrapper">
        <MyCheckbox
          v-model="combinePaths"
          :text="translate('general_defaultStructure')"
          on-color="#CEA652"
        />
        <MyTooltip
          placement="right"
          max-width="400px"
          middle
          :content="`<${translate('general_launcherDirectory')}>\\Game\\StarRail.exe`"
        >
          <div class="confirm-paths-help">?</div>
        </MyTooltip>
      </div>
    </div>
  </StarRailDialog>
</template>

<style lang="scss" scoped>
.content-wrapper {
  @apply px-1 grid grid-cols-2 gap-4;
}

.import-button {
  @apply py-1 px-2 rounded-full transition-all;

  &.enabled {
    @apply border border-gray-400 text-gray-600;
    @apply hover:border-blue-400 hover:text-blue-500 hover:bg-blue-100 active:bg-blue-300;
  }
  &.disabled {
    @apply bg-gray-100 text-gray-400 pointer-events-none;
  }
}

.path-wrapper {
  @apply ml-3 mt-[5px];
  grid-column: 1 / 3;
}

.confirm-paths-wrapper {
  @apply flex flex-row;
}

.confirm-paths-help {
  @apply ml-2 mt-[5px] w-5 h-5 rounded-full;
  @apply text-center font-bold text-sm;
  @apply bg-gray-400 text-white cursor-help;
}

.confirm-button-enabled {
  @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
  @apply bg-blue-200 text-white pointer-events-none;
}
</style>
