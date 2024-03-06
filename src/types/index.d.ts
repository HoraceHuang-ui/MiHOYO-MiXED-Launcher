export {}

// export * from './starrail/srPlayerInfo'
// export * from './starrail/srRankMap'

export interface IStore {
  set: (key: string, value: any, json: boolean) => Promise<void>
  get: (key: string) => Promise<any>
  delete: (key: string) => Promise<void>
  clear: () => Promise<void>
}

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
}

export interface IPath {
  joinDirnameAsset: (arg: string) => Promise<string>
}

export interface IAxios {
  post: (url: string) => Promise<any>
  get: (url: string) => Promise<any>
}

export interface IElectron {
  openExtLink: (url: string) => void
}

export interface IGithub {
  getLatestRelease: () => Promise<any>
}

declare global {
  interface Window {
    store: IStore
    child: IChild
    dialog: IDialog
    enka: IEnka
    win: IWin
    path: IPath
    axios: IAxios
    electron: IElectron
    github: IGithub
  }
}
