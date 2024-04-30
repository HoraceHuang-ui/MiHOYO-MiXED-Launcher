import { defineStore } from 'pinia'
import { DialogStyle } from '../types/dialog/dialog'
import { Lang } from '../i18n'
import { FormattedApiInfo } from '../types/starrail/srPlayerInfo'
import { GsRegInfo } from '../types/genshin/gsRegInfo'
import { SrRegInfo } from '../types/starrail/srRegInfo'

export const useStore = defineStore('userStore', {
  state: () => ({
    general: {
      targetVersion: undefined as string | undefined,
      mainBgPath: undefined as string | undefined,
      windowSize: {
        width: 1200,
        height: 700,
        isMax: false,
      },
      windowPos: undefined as { x: number; y: number } | undefined,
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
        launcherPath: undefined as string | undefined,
        gamePath: undefined as string | undefined,
        upd: false,
        playerInfo: undefined as any,
        accounts: [] as GsRegInfo[],
      },
      sr: {
        launcherPath: undefined as string | undefined,
        gamePath: undefined as string | undefined,
        upd: false,
        playerInfo: undefined as FormattedApiInfo | undefined,
        accounts: [] as SrRegInfo[],
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
