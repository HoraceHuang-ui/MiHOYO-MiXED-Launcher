import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('child', {
  exec: (path: string) => ipcRenderer.send('child:exec', path),
})
contextBridge.exposeInMainWorld('dialog', {
  show: async options => {
    return await ipcRenderer.invoke('dialog:show', options)
  },
  showAndCopy: async options => {
    return await ipcRenderer.invoke('dialog:showAndCopy', options)
  },
})
contextBridge.exposeInMainWorld('enka', {
  getGenshinPlayer: async (uid: string, lang: string) => {
    return await ipcRenderer.invoke('enka:getGenshinPlayer', uid, lang)
  },
  updateCache: () => {
    return ipcRenderer.invoke('enka:updateCache')
  },
})
contextBridge.exposeInMainWorld('win', {
  close: () => {
    ipcRenderer.send('win:close')
  },
  min: () => {
    ipcRenderer.send('win:min')
  },
  tray: () => {
    ipcRenderer.send('win:tray')
  },
  max: () => {
    ipcRenderer.send('win:max')
  },
  relaunch: () => {
    ipcRenderer.send('win:relaunch')
  },
})
contextBridge.exposeInMainWorld('path', {
  joinDirnameAsset: (arg: string) =>
    ipcRenderer.invoke('path:joinDirnameAsset', arg),
})
contextBridge.exposeInMainWorld('axios', {
  post: async (url: string) => {
    return await ipcRenderer.invoke('axios:post', url)
  },
  get: async (url: string) => {
    return await ipcRenderer.invoke('axios:get', url)
  },
})
contextBridge.exposeInMainWorld('electron', {
  openExtLink: (url: string) => {
    ipcRenderer.send('elec:openExtLink', url)
  },
})
contextBridge.exposeInMainWorld('reg', {
  gsGet: async () => {
    return await ipcRenderer.invoke('reg:gsGet')
  },
  srGet: async () => {
    return await ipcRenderer.invoke('reg:srGet')
  },
  hi3Get: async () => {
    return await ipcRenderer.invoke('reg:hi3Get')
  },
  zzzGet: async () => {
    return await ipcRenderer.invoke('reg:zzzGet')
  },
  gsSet: (account: string) => {
    ipcRenderer.send('reg:gsSet', account)
  },
  srSet: (account: string) => {
    ipcRenderer.send('reg:srSet', account)
  },
  hi3Set: (account: string) => {
    ipcRenderer.send('reg:hi3Set', account)
  },
  zzzSet: (account: string) => {
    ipcRenderer.send('reg:zzzSet', account)
  },
})

function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive'],
) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

function useLoading() {
  const styleContent = `
    .klee-loading {
      width: 120px;
      height: 120px;
    }
    .app-loading-wrap {
      position: fixed;
      color: #eee;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #222;
      z-index: 9;
    }
    .font-genshin {
      font-family: genshin-font;
    }
    .inner-wrapper {
      display: flex;
      flex-direction: column;
    }
    .below-text {
      text-align: center;
      margin-top: 1rem;
      font-size: 20px;
    }
  `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')
  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="font-genshin inner-wrapper">
    <img class="klee-loading" src="../../src/assets/kleeLoading.gif" />
    <div class="below-text">Loading...</div>
  </div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
