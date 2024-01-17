import {translate} from "../../i18n";
import GenshinDialog from "../../pages/GenshinPage/Components/GenshinDialog.vue";
import StarRailDialog from "../../pages/StarRailPage/Components/StarRailDialog.vue";
import Honkai3Dialog from "../../pages/Honkai3Page/Components/Honkai3Dialog.vue";

export type dialogStyle = 'gs' | 'sr' | 'hi3'
export const availableDialogStyles = ['gs', 'sr', 'hi3']
export const availableDialogStyleDescs = [translate('general_gs'), translate('general_sr'), translate('general_hi3')]

export const dialogComponent = (style: dialogStyle) => {
    switch (style) {
        case 'gs':
            return GenshinDialog
        case 'sr':
            return StarRailDialog
        case 'hi3':
            return Honkai3Dialog
    }
}