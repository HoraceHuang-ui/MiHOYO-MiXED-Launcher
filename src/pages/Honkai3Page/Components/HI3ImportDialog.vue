<script setup lang="ts">
import { translate } from '../../../i18n'
import { ref } from 'vue'
import Honkai3Dialog from './Honkai3Dialog.vue'
import MyCheckbox from '../../../components/MyCheckbox.vue'
import MyTooltip from '../../../components/MyTooltip.vue'

const props = defineProps({
  onOk: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
})

const combinePaths = ref(true)
const dialogRef = ref()
const launcherPath = ref('')
const gamePath = ref('')

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
  await window.store.set('hi3LauncherPath', launcherPath.value, false)
  await window.store.set('hi3GamePath', gamePath.value, false)
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
    width="50%"
    :on-ok="onDialogOk"
    :on-cancel="onCancel"
    show-ok
    show-cancel
    :close-on-ok="false"
    ref="dialogRef"
  >
    <div class="px-1 grid grid-cols-2 gap-4">
      <button
        @click="hiLauncherImport"
        class="import-button-enabled py-1 px-2 rounded-full transition-all"
      >
        {{ translate('general_importLauncher') }}
      </button>
      <button
        @click="hiGameImport"
        class="py-1 px-2 rounded-full transition-all"
        :class="
          combinePaths ? 'import-button-disabled' : 'import-button-enabled'
        "
      >
        {{ translate('general_importGame') }}
      </button>
      <div
        class="ml-3 text-gray-200"
        style="margin-top: 5px; grid-column: 1 / 3"
      >
        <span class="theme-color font-bold mr-2">{{
          translate('general_launcher')
        }}</span>
        {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
      </div>
      <div
        class="ml-3 text-gray-200"
        style="margin-top: 5px; grid-column: 1 / 3"
      >
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
      <div class="flex flex-row">
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
          <div
            class="ml-2 rounded-full w-5 h-5 bg-gray-400 text-white text-center font-bold text-sm cursor-help"
            style="margin-top: 5px"
          >
            ?
          </div>
        </MyTooltip>
      </div>
    </div>
  </Honkai3Dialog>
</template>

<style scoped>
.import-button-enabled {
  border-width: 1px;
  border-color: rgb(72, 107, 161);
  background: rgb(72, 107, 161, 0.5);
  color: #51c3f9;
}

.import-button-enabled:hover {
  @apply border-blue-400;
  background: rgb(72, 107, 161, 0.8);
}

.import-button-enabled:active {
  background: rgb(130, 167, 229);
}

.import-button-disabled {
  @apply text-gray-400 pointer-events-none;
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
</style>
