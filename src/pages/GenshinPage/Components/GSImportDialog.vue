<script setup lang="ts">
import {translate} from "../../../i18n"
import {ref} from 'vue'
import GenshinDialog from "./GenshinDialog.vue";
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

const gsLauncherImport = async () => {
    window.dialog.show({
        title: translate('general_launcherImportTitle', {game: translate('general_gs')}),
        properties: ['openDirectory']
    }).then((resp) => {
        if (resp.length > 0) {
            launcherPath.value = resp[0]
        }
    }).catch((error) => {
        console.error('Error in showing dialog:', error)
    })
}
const gsGameImport = async () => {
    window.dialog.show({
        title: translate('general_gameImportTitle', {game: translate('general_gs')}),
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
        gamePath.value = launcherPath.value + '\\Genshin Impact Game\\YuanShen.exe'
    }
    launcherPath.value += '\\launcher.exe'
    await window.store.set('gsLauncherPath', launcherPath.value, false)
    await window.store.set('gsGamePath', gamePath.value, false)
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
    <GenshinDialog :title="`${translate('general_gs')} ${translate('general_import')}`" width="50%" :on-ok="onDialogOk"
                   :on-cancel="onCancel"
                   show-ok show-cancel :close-on-ok="false"
                   ref="dialogRef">
        <div class="px-1 grid grid-cols-2 gap-4">
            <button @click="gsLauncherImport"
                    class="import-button-enabled py-1 px-2 rounded-full transition-all">{{
                    translate('general_importLauncher')
                }}
            </button>
            <button @click="gsGameImport" class="py-1 px-2 rounded-full transition-all"
                    :class="combinePaths ? 'import-button-disabled' : 'import-button-enabled'">
                {{ translate('general_importGame') }}
            </button>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-gs mr-2">{{ translate('general_launcher') }}</span>
                {{ launcherPath === '' ? '' : launcherPath + '\\launcher.exe' }}
            </div>
            <div class="ml-3" style="margin-top: 5px; grid-column: 1 / 3;">
                <span class="font-gs mr-2">{{ translate('general_game') }}</span>
                {{
                    launcherPath === '' ? gamePath : (combinePaths ? launcherPath + '\\Genshin Impact Game\\YuanShen.exe' :
                        gamePath)
                }}
            </div>
            <div class="flex flex-row">
                <MyCheckbox v-model="combinePaths" :text="translate('general_defaultStructure')" on-color="#b78c22"/>
                <MyTooltip placement="right"
                           max-width="500px"
                           :content="`<${translate('general_launcherDirectory')}>\\Genshin Impact Game\\YuanShen.exe`">
                    <div
                        class="ml-2 rounded-full w-5 h-5 bg-gray-400 text-white text-center font-bold text-sm cursor-help"
                        style="margin-top: 5px;">?
                    </div>
                </MyTooltip>
            </div>
        </div>
    </GenshinDialog>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.import-button-enabled {
    @apply text-sm border hover:border-yellow-500 active:bg-white hover:shadow;
    color: #cea652;
    font-family: genshin-font, sans-serif;
    background: #ECE5D8;
    border-color: #cea652;
}

.import-button-disabled {
    @apply text-sm text-gray-400 pointer-events-none;
    font-family: genshin-font, sans-serif;
}

.confirm-button-enabled {
    @apply bg-blue-600 text-white hover:bg-blue-500 active:scale-90;
}

.confirm-button-disabled {
    @apply bg-blue-200 text-white pointer-events-none;
}
</style>
