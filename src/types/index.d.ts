import { GsRegInfo } from './genshin/gsRegInfo'
import { SrRegInfo } from './starrail/srRegInfo'
import { Hi3RegInfo } from './honkai3/hi3RegInfo'
import { ZZZRegInfo } from './zenless/zzzRegInfo'

export {}

// export * from './starrail/srPlayerInfo'
// export * from './starrail/srRankMap'

export interface IChild {
  exec: (path: string) => Promise<void>
}

export interface IDialog {
  show: (options: any) => Promise<any>
  showAndCopy: (options: any) => Promise<any>
}

export interface IEnka {
  getGenshinPlayer: (uid: string, lang: string) => Promise<any>
  updateCache: () => Promise<void>
}

export interface IWin {
  close: () => Promise<void>
  min: () => Promise<void>
  tray: () => Promise<void>
  max: () => Promise<void>
  relaunch: () => Promise<void>
}

export interface IPath {
  joinDirnameAsset: (arg: string) => Promise<string>
}

export interface IAxios {
  post: (url: string, body: any) => Promise<any>
  get: (url: string) => Promise<any>
}

export interface IElectron {
  openExtLink: (url: string) => void
}

export interface IReg {
  gsGet: () => Promise<GsRegInfo | undefined>
  gsSet: (data: string) => Promise<void>
  srGet: () => Promise<SrRegInfo | undefined>
  srSet: (data: string) => Promise<void>
  hi3Get: () => Promise<Hi3RegInfo | undefined>
  hi3Set: (data: string) => Promise<void>
  zzzGet: () => Promise<ZZZRegInfo | undefined>
  zzzSet: (data: string) => Promise<void>
}

declare global {
  interface Window {
    child: IChild
    dialog: IDialog
    enka: IEnka
    win: IWin
    path: IPath
    axios: IAxios
    electron: IElectron
    github: IGithub
    reg: IReg
  }
}
