import { app, BrowserWindow, shell, ipcMain, nativeTheme } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

const Store = require('electron-store');
const store = new Store();
ipcMain.handle('store:get', (_event, key) => {
  return store.get(key)
})
ipcMain.on('store:set', (_event, key, value) => {
  store.set(key, value)
})
ipcMain.on('store:delete', (_event, key) => {
  store.delete(key)
})
ipcMain.on('store:clear', () => {
  store.clear()
})

const child = require('child_process')
ipcMain.on('child:exec', (_event, path) => {
  child.execFile(path, function (err, data) {
    if (err) {
        console.error(err)
        return
    }
    console.log(data.toString())
  })
})

const { dialog } = require('electron');
ipcMain.handle('dialog:show', async (_event, options) => {
  const result = await dialog.showOpenDialog(options);
  if (!result.canceled) {
    return result.filePaths; // 返回选择的目录路径
  } else {
    return []; // 对话框被取消，返回空数组
  }
});

const { Wrapper } = require('enkanetwork.js')
const enka = new Wrapper({
  language: 'zh-CN'
})
ipcMain.handle("enka:getPlayer", async (_event, uid) => {
  // enka.getPlayer(uid, 'zh-CN')
  // .then((value) => {
  //     playerInfo = value
  //     playerInfoReady.value = true
  //     window.store.set('genshinInfo', playerInfo)
  // })
  // .catch((err) => {
  //     console.error(err)
  // })
  console.log('ipcMain invoke')
  const result = await enka.getPlayer(uid)
  return result
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
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
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
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  nativeTheme.themeSource = "light"
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1200,
    height: 700,
    resizable: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  // win.setWindowButtonVisibility(true)

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    //win.loadFile('./dist/index.html')
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

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

