export {}

// export * from './starrail/srPlayerInfo'
// export * from './starrail/srRankMap'

export interface IStore {
    set: (key: String, value: any, json: Boolean) => Promise<void>,
    get: (key: String) => Promise<any>,
    delete: (key: String) => Promise<void>,
    clear: () => Promise<void>,
}

export interface IChild {
    exec: (path: String) => Promise<void>,
}

export interface IDialog {
    show: (options: any) => Promise<any>,
    showAndCopy: (options: any) => Promise<any>,
}

export interface IEnka {
    getGenshinPlayer: (uid: String, lang: String) => Promise<any>,
}

export interface IWin {
    close: () => Promise<void>,
    min: () => Promise<void>,
    tray: () => Promise<void>,
}

export interface IPath {
    joinDirnameAsset: (arg: String) => Promise<String>,
}

export interface IAxios {
    post: (url: String) => Promise<any>,
    get: (url: String) => Promise<any>,
}

export interface IElectron {
    openExtLink: (url: String) => void,
}

export interface IGithub {
    getLatestRelease: () => Promise<any>,
}

declare global {
    interface Window {
        store: IStore,
        child: IChild,
        dialog: IDialog,
        enka: IEnka,
        win: IWin,
        path: IPath,
        axios: IAxios,
        electron: IElectron,
        github: IGithub,
    }
}