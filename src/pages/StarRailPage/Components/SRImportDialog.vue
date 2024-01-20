<script setup lang="ts">
import StarRailDialog from "./StarRailDialog.vue"
import {translate} from "../../../i18n"
import {ref} from 'vue'
import MyCheckbox from "../../../components/MyCheckbox.vue";
import MyTooltip from "../../../components/MyTooltip.vue";

const props = defineProps({
    onOk: {
        type: Function
    },
    onCancel: {
        type: Function
    }
})

const combinePaths = ref(true)
const dialogRef = ref()
const launcherPath = ref('')
const gamePath = ref('')

const srLauncherImport = async () => {
    window.dialog.show({
        title: translate('general_launcherImportTitle', {game: translate('general_sr')}),
        properties: ['openDirectory']
    }).then((resp) => {
        if (resp.length > 0) {
            launcherPath.value = resp[0]
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error)
    })
}
const srGameImport = async () => {
    window.dialog.show({
        title: translate('general_gameImportTitle', {game: translate('general_sr')}),
        properties: ['openFile'],
        filters: [{name: 'EXE', extensions: ['exe']}]
    }).then((resp) => {
        if (resp.length > 0) {
            gamePath.value = resp[0]
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error)
    })
}

const confirmPaths = async () => {
    if (combinePaths.value) {
        gamePath.value = launcherPath.value + '\\Game\\StarRail.exe'
    }
    launcherPath.value += '\\launcher.exe'
    await window.store.set('srLauncherPath', launcherPath.value, false)
    await window.store.set('srGamePath', gamePath.value, false)
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
    <StarRailDialog :title="`${translate('general_sr')} ${translate('general_import')}`" width="50%" :on-ok="onDialogOk"
                    :on-cancel="onCancel"
                    show-ok show-cancel :close-on-ok="false"
                    ref="dialogRef">
        <div class="px-1 grid grid-cols-2 gap-4">
            <button @click="srLauncherImport" class="import-button-enabled py-1 px-2 rounded-full transition-all">{{
                    translate('general_importLauncher')
                }}
            </button>
            <button @click="srGameImport" class="py-1 px-2 rounded-full transition-all"
                    :class="combinePaths ? 'import-button-disabled' : 'import-button-enabled'">
                {{ translate('general_importGame') }}
            </button>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-bold mr-2">{{ translate('general_launcher') }}</span>
                {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
            </div>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-bold mr-2">{{ translate('general_game') }}</span>
                {{
                    launcherPath === '' ? '' : (combinePaths ? launcherPath + '\\Game\\StarRail.exe' :
                        gamePath)
                }}
            </div>
            <div class="flex flex-row">
                <MyCheckbox v-model="combinePaths" :text="translate('general_defaultStructure')" on-color="#CEA652"/>
                <MyTooltip placement="right" max-width="500px"
                           :content="`<${translate('general_launcherDirectory')}>\\Game\\StarRail.exe`">
                    <div
                        class="ml-2 rounded-full w-5 h-5 bg-gray-400 text-white text-center font-bold text-sm cursor-help"
                        style="margin-top: 5px;">?
                    </div>
                </MyTooltip>
            </div>
        </div>
    </StarRailDialog>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.import-button-enabled {
    @apply border border-gray-400 text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-100 active:bg-blue-300;
}

.import-button-disabled {
    @apply bg-gray-100 text-gray-400 pointer-events-none;
}

.confirm-button-enabled {
    @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
    @apply bg-blue-200 text-white pointer-events-none;
}
</style>