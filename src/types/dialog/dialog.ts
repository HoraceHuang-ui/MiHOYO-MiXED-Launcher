import { translate } from '../../i18n'
import GenshinDialog from '../../pages/GenshinPage/Components/GenshinDialog.vue'
import StarRailDialog from '../../pages/StarRailPage/Components/StarRailDialog.vue'
import Honkai3Dialog from '../../pages/Honkai3Page/Components/Honkai3Dialog.vue'
import ZZZDialog from '../../pages/ZZZPage/Components/ZZZDialog.vue'

export type DialogStyle = 'gs' | 'sr' | 'hi3' | 'zzz'
export const availableDialogStyles: DialogStyle[] = ['gs', 'sr', 'hi3', 'zzz']
export const availableDialogStyleDescs = [
  translate('general_gs'),
  translate('general_sr'),
  translate('general_hi3'),
  translate('general_zzz'),
]

export const dialogComponent = (style: DialogStyle) => {
  switch (style) {
    case 'gs':
      return GenshinDialog
    case 'sr':
      return StarRailDialog
    case 'hi3':
      return Honkai3Dialog
    case 'zzz':
      return ZZZDialog
  }
}
