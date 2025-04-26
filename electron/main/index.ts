// const {dialog} = require('electron');
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  shell,
  Tray,
} from 'electron'
import axios from 'axios'
import { release } from 'node:os'
import child from 'child_process'
import { DynamicTextAssets, EnkaClient, TextAssets } from 'enka-network-api'
import { promises as fs } from 'fs'
import path from 'path'
import regedit, { promisified as reg } from 'regedit'
import { SrRegInfo } from '../../src/types/starrail/srRegInfo'
import { GsRegInfo } from '../../src/types/genshin/gsRegInfo'
import { Hi3RegInfo } from '../../src/types/honkai3/hi3RegInfo'
import { ZZZRegInfo } from '../../src/types/zenless/zzzRegInfo'

regedit.setExternalVBSLocation('resources/regedit/vbs')

const enka = new EnkaClient({
  requestTimeout: 10000,
})

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = path.join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = path.join(process.env.DIST, 'index.html')
let tray = null

// if (!fs.existsSync(imageFolder)) {
//   fs.mkdir(imageFolder);
// }

const iconPath = path.join(process.env.PUBLIC, 'favicon.ico')
const assetsPath = process.env.VITE_DEV_SERVER_URL
  ? '../../src/assets'
  : path.join(__dirname, '../../../src/assets')

async function createWindow() {
  let windowSize: any = undefined
  let windowPos: any = undefined
  win = new BrowserWindow({
    title: 'miXeD',
    icon: iconPath,
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    // transparent: true,
    frame: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.webContents
    .executeJavaScript('localStorage.getItem("windowSize");', true)
    .then(result => {
      windowSize = JSON.parse(result)

      if (windowSize) {
        win.setSize(windowSize.width, windowSize.height, true)
        if (windowSize.isMax) {
          win.maximize()
        }
      } else {
        windowSize = {
          width: 1200,
          height: 700,
          isMax: false,
        }
        win.webContents.executeJavaScript(
          `localStorage.setItem("windowSize", '${JSON.stringify(windowSize)}');`,
        )
      }
    })

  win.webContents
    .executeJavaScript('localStorage.getItem("windowPos");', true)
    .then(result => {
      windowPos = JSON.parse(result)
      if (windowPos) {
        win.setPosition(windowPos.x, windowPos.y, true)
      } else {
        const [x, y] = win.getPosition()
        windowPos = { x, y }
        win.webContents.executeJavaScript(
          `localStorage.setItem("windowPos", '${JSON.stringify(windowPos)}');`,
        )
      }
    })

  win.on('resized', () => {
    if (win.isMinimized()) {
      return
    }
    const [width, height] = win.getSize()
    // store.set('windowState', { width, height, isMax: false })
    windowSize = {
      width,
      height,
      isMax: false,
    }
    win.webContents.executeJavaScript(
      `localStorage.setItem("windowSize", '${JSON.stringify(windowSize)}');`,
    )
  })
  win.on('moved', () => {
    if (win.isMaximized() || win.isMinimized()) {
      return
    }
    const [x, y] = win.getPosition()
    windowPos = { x, y }
    win.webContents.executeJavaScript(
      `localStorage.setItem("windowPos", '${JSON.stringify(windowPos)}');`,
    )
  })
  win.on('maximize', () => {
    win.webContents.executeJavaScript(
      `localStorage.setItem("windowSize", '${JSON.stringify({
        width: windowSize.width,
        height: windowSize.height,
        isMax: true,
      })}');`,
    )
  })
  win.on('unmaximize', () => {
    console.log('unmaximize')
    win.webContents.executeJavaScript(
      `localStorage.setItem("windowSize", '${JSON.stringify({
        width: windowSize.width,
        height: windowSize.height,
        isMax: false,
      })}');`,
    )
  })

  // ---------- Window actions ----------
  ipcMain.on('win:close', () => {
    win.close()
  })
  ipcMain.on('win:min', () => {
    win.minimize()
  })
  ipcMain.on('win:tray', () => {
    win.hide()
    win.setSkipTaskbar(true)
  })
  ipcMain.on('win:max', (_event, toMax: boolean) => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
  ipcMain.on('win:relaunch', () => {
    app.relaunch()
    app.quit()
  })

  // ---------- custom IPCs ----------
  ipcMain.on('child:exec', (_event, path) => {
    child.execFile(path, function (err, data) {
      if (err) {
        console.error(err)
        return
      }
      console.log(data.toString())
    })
  })

  ipcMain.handle('dialog:show', async (_event, options) => {
    const result = await dialog.showOpenDialog(win, options)
    if (!result.canceled) {
      return result.filePaths
    } else {
      return []
    }
  })

  ipcMain.handle('dialog:showAndCopy', async (_event, options) => {
    try {
      const result = await dialog.showOpenDialog(win, options)
      if (!result.canceled && result.filePaths.length > 0) {
        const sourcePath = result.filePaths[0]
        const dataURL = await fs
          .readFile(sourcePath, 'base64')
          .then(data => `data:image/png;base64,${data}`)

        return dataURL
      } else {
        return ''
      }
    } catch (err) {
      console.error('Error copying image:', err)
      throw err
    }
  })

  ipcMain.handle('enka:getGenshinPlayer', async (_event, uid, lang) => {
    function convertObjectToJson(obj: any) {
      if (typeof obj !== 'object' || obj === null || obj === undefined)
        return obj
      const entries = Object.entries(obj)
        // filter out private properties and EnkaClient instance, which has circular object
        .filter(
          ([key, value]) =>
            !key.startsWith('_') && !(value instanceof EnkaClient),
        )
        .map(([key, value]) => [key, convertObjectToJson(value)])
      if (obj instanceof TextAssets) {
        // convert TextAssets to string
        entries.push([
          'text',
          obj instanceof DynamicTextAssets
            ? obj.getNullableReplacedText()
            : obj.getNullable(),
        ])
      }
      if (obj instanceof Array) {
        const arr = []
        for (const [_, entry] of entries) {
          arr.push(entry)
        }
        return arr
      }
      return Object.fromEntries(entries)
    }

    enka.options.defaultLanguage = lang

    try {
      return JSON.stringify(convertObjectToJson(await enka.fetchUser(uid)))
    } catch {
      return convertObjectToJson(await enka.fetchCollapsedUser(uid))
    }
  })

  ipcMain.handle('enka:updateCache', () => {
    return enka.cachedAssetsManager.fetchAllContents()
  })

  ipcMain.handle('path:joinDirnameAsset', (_event, arg) => {
    return path.join(assetsPath, arg)
  })

  ipcMain.handle('axios:post', async (_event, url) => {
    const result = await axios.post(url)
    return result.data
  })
  ipcMain.handle('axios:get', async (_event, url) => {
    const result = await axios.get(url)
    return result.data
  })

  ipcMain.on('elec:openExtLink', (_event, url) => {
    shell.openExternal(url)
  })

  ipcMain.on('reg:gsSet', (_event, acc: string) => {
    // await reg.deleteKey(['HKCU\\Software\\miHoYo\\原神'])
    // await reg.createKey(['HKCU\\Software\\miHoYo\\原神'])
    const account = JSON.parse(acc)

    reg.putValue({
      'HKCU\\Software\\miHoYo\\原神': {
        // GENERAL_DATA_h2389025596: {
        //   value: account.generalData,
        //   type: 'REG_BINARY',
        // },
        MIHOYOSDK_ADL_PROD_CN_h3123967166: {
          value: account.mihoyoSdk,
          type: 'REG_BINARY',
        },
      },
    })
  })

  ipcMain.on('reg:srSet', (_event, acc: string) => {
    // await reg.deleteKey(['HKCU\\Software\\miHoYo\\崩坏：星穹铁道'])
    // await reg.createKey(['HKCU\\Software\\miHoYo\\崩坏：星穹铁道'])
    const account = JSON.parse(acc)

    reg.putValue({
      'HKCU\\Software\\miHoYo\\崩坏：星穹铁道': {
        MIHOYOSDK_ADL_PROD_CN_h3123967166: {
          value: account.mihoyoSdk,
          type: 'REG_BINARY',
        },
        // App_LastUserID_h2841727341: {
        //   value: account.lastUserId,
        //   type: 'REG_DWORD',
        // },
      },
    })
  })

  ipcMain.handle('reg:gsGet', async (): Promise<GsRegInfo> => {
    return new Promise(resolve => {
      regedit.list(['HKCU\\Software\\miHoYo\\原神']).on('data', entry => {
        if (entry.data.exists && entry.data.values) {
          resolve({
            name: '',
            // generalData: result.values.GENERAL_DATA_h2389025596.value as number[],
            mihoyoSdk: entry.data.values.MIHOYOSDK_ADL_PROD_CN_h3123967166
              .value as number[],
          })
        }
      })
    })
  })

  ipcMain.on('reg:hi3Set', (_event, acc: string) => {
    const account = JSON.parse(acc)

    reg.putValue({
      'HKCU\\Software\\miHoYo\\崩坏3': {
        MIHOYOSDK_ADL_PROD_CN_h3123967166: {
          value: account.mihoyoSdk,
          type: 'REG_BINARY',
        },
      },
    })
  })

  ipcMain.handle('reg:hi3Get', async (): Promise<Hi3RegInfo> => {
    return new Promise(resolve => {
      regedit.list(['HKCU\\Software\\miHoYo\\崩坏3']).on('data', entry => {
        if (entry.data.exists && entry.data.values) {
          resolve({
            name: '',
            // generalData: result.values.GENERAL_DATA_h2389025596.value as number[],
            mihoyoSdk: entry.data.values.MIHOYOSDK_ADL_PROD_CN_h3123967166
              .value as number[],
          })
        }
      })
    })
  })

  ipcMain.on('reg:zzzSet', (_event, acc: string) => {
    const account = JSON.parse(acc)

    reg.putValue({
      'HKCU\\Software\\miHoYo\\绝区零': {
        MIHOYOSDK_ADL_PROD_CN_h3123967166: {
          value: account.mihoyoSdk,
          type: 'REG_BINARY',
        },
      },
    })
  })

  ipcMain.handle('reg:zzzGet', async (): Promise<ZZZRegInfo> => {
    console.log('get111')
    return new Promise(resolve => {
      console.log('get222')
      regedit.list(['HKCU\\Software\\miHoYo\\绝区零']).on('data', entry => {
        console.log('get333')
        if (entry.data.exists && entry.data.values) {
          resolve({
            name: '',
            // generalData: result.values.GENERAL_DATA_h2389025596.value as number[],
            mihoyoSdk: entry.data.values.MIHOYOSDK_ADL_PROD_CN_h3123967166
              .value as number[],
          })
        }
      })
    })
  })

  ipcMain.handle('reg:srGet', async (): Promise<SrRegInfo> => {
    return new Promise(resolve => {
      regedit
        .list(['HKCU\\Software\\miHoYo\\崩坏：星穹铁道'])
        .on('data', entry => {
          if (entry.data.exists && entry.data.values) {
            resolve({
              name: '',
              // generalData: result.values.GENERAL_DATA_h2389025596.value as number[],
              mihoyoSdk: entry.data.values.MIHOYOSDK_ADL_PROD_CN_h3123967166
                .value as number[],
            })
          }
        })
    })
  })

  // --------- Window configs ------------
  // win.setWindowButtonVisibility(true)
  // nativeTheme.themeSource = 'light'
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    //win.loadFile('./dist/index.html')
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        win.destroy()
      },
    },
  ])
  tray = new Tray(iconPath)
  tray.setToolTip('miXeD')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true)
  })

  // Test actively push message to the Electron-Renderer
  // win.webContents.on('did-finish-load', () => {
  //   win?.webContents.send('main-process-message', new Date().toLocaleString())
  // })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
