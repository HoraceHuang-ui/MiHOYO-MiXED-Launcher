import { defineStore } from 'pinia'
import { DialogStyle } from '../types/dialog/dialog'
import { Lang } from '../i18n'
import { FormattedApiInfo } from '../types/starrail/srPlayerInfo'

export const useStore = defineStore('userStore', {
  state: () => ({
    general: {
      targetVersion: undefined as string | undefined,
      mainBgPath: undefined as string | undefined,
      windowState: {
        width: 1200,
        height: 700,
        isMax: false,
      },
    },
    settings: {
      general: {
        lang: undefined as Lang | undefined,
        quitOnClose: true,
        trayOnLaunch: true,
      },
      appearance: {
        colorTheme: 2,
        dialogStyle: 'gs' as DialogStyle,
        gsCostume: false,
      },
      gamepad: {
        autoEnter: true,
        disableMouse: false,
        showToolbar: true,
        defaultPS: false,
      },
    },
    game: {
      gs: {
        // gs
        launcherPath: undefined as string | undefined,
        gamePath: undefined as string | undefined,
        upd: false,
        playerInfo: undefined as any,
      },
      sr: {
        // sr
        launcherPath: undefined as string | undefined,
        gamePath: undefined as string | undefined,
        upd: false,
        playerInfo: undefined as FormattedApiInfo | undefined,
      },
      hi3: {
        // hi3
        launcherPath: undefined as string | undefined,
        gamePath: undefined as string | undefined,
        upd: false,
      },
    } as Record<string, any>,
  }),
  actions: {
    clear() {
      this.$reset()
    },
  },
  persist: true,
})
