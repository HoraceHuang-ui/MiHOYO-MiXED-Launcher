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
// const Store = require('electron-store')
import Store from 'electron-store'
// const child = require('child_process')
import child from 'child_process'
// const {EnkaClient, TextAssets, DynamicTextAssets} = require("enka-network-api");
import { DynamicTextAssets, EnkaClient, TextAssets } from 'enka-network-api'
import { promises as fs } from 'fs'

// const fs = require('fs').promises
// var path = require('path')
import path from 'path'

const enka = new EnkaClient({
  requestTimeout: 10000,
})

const store = new Store()

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
const imageFolder = path.join(app.getPath('userData'), 'images')

// if (!fs.existsSync(imageFolder)) {
//   fs.mkdir(imageFolder);
// }

const iconPath = path.join(process.env.PUBLIC, 'favicon.ico')
const assetsPath = process.env.VITE_DEV_SERVER_URL
  ? '../../src/assets'
  : path.join(__dirname, '../../../src/assets')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: iconPath,
    width: 1200,
    height: 700,
    resizable: false,
    maximizable: false,
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

  // ---------- custom IPCs ----------

  ipcMain.handle('store:get', (_event, key) => {
    return store.get(key)
  })
  ipcMain.on('store:set', (_event, key, value, json) => {
    store.set(key, json ? JSON.parse(value) : value)
  })
  ipcMain.on('store:delete', (_event, key) => {
    store.delete(key)
  })
  ipcMain.on('store:clear', () => {
    store.clear()
  })

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
      return convertObjectToJson(await enka.fetchUser(uid, false))
    } catch {
      return convertObjectToJson(await enka.fetchUser(uid, true))
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

  const { Octokit } = require('@octokit/core')
  const octokit = new Octokit({
    auth: '<YOUR TOKEN HERE>',
  })
  ipcMain.handle('github:getLatestRelease', async _event => {
    const result = await octokit.request(
      'GET /repos/horacehuang-ui/mihoyo-mixed-launcher/releases/latest',
      {
        owner: 'HoraceHuang-ui',
        repo: 'MiHOYO-MiXED-Launcher',
      },
    )
    return result
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
  tray = new Tray(path.join(process.env.PUBLIC, 'favicon.ico'))
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
