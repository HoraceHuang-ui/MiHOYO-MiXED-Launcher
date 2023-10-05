const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("store", {
  set: (key, value, json) => ipcRenderer.send("store:set", key, value, json),
  // window.storeAPI.set('genshinPath', 'd:\\...')
  get: (key) => ipcRenderer.invoke("store:get", key),
  delete: (key) => ipcRenderer.send("store:delete", key),
  clear: () => ipcRenderer.send("store:clear"),
});
contextBridge.exposeInMainWorld("child", {
  exec: (path) => ipcRenderer.send("child:exec", path)
})
contextBridge.exposeInMainWorld("dialog", {
  show: async (options) => {
    const result = await ipcRenderer.invoke("dialog:show", options)
    return result
  },
  showAndCopy: async (options) => {
    const result = await ipcRenderer.invoke("dialog:showAndCopy", options)
    return result
  }
})
contextBridge.exposeInMainWorld("enka", {
  getGenshinPlayer: async (uid) => {
    console.log('ipcRenderer')
    const result = await ipcRenderer.invoke("enka:getGenshinPlayer", uid)
    console.log(result)
    return result
  }
})
contextBridge.exposeInMainWorld("win", {
  close: () => {
    ipcRenderer.send("win:close")
  },
  min: () => {
    ipcRenderer.send("win:min")
  },
  tray: () => {
    ipcRenderer.send("win:tray")
  }
})
contextBridge.exposeInMainWorld("path", {
  joinDirnameAsset: (arg) => ipcRenderer.invoke("path:joinDirnameAsset", arg)
})
contextBridge.exposeInMainWorld("axios", {
  post: async (url) => {
    const result = await ipcRenderer.invoke("axios:post", url)
    return result
  },
  get: async (url) => {
    const result = await ipcRenderer.invoke("axios:get", url)
    return result
  }
})
contextBridge.exposeInMainWorld("electron", {
  openExtLink: (url) => {
    ipcRenderer.send("elec:openExtLink", url)
  }
})
contextBridge.exposeInMainWorld("github", {
  getLatestRelease: async () => {
    const result = await ipcRenderer.invoke("github:getLatestRelease")
    return result
  }
})

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  //   const className = `loaders-css__square-spin`;
  //   const styleContent = `
  // @keyframes square-spin {
  //   25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  //   50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  //   75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  //   100% { transform: perspective(100px) rotateX(0) rotateY(0); }
  // }
  // .${className} > div {
  //   animation-fill-mode: both;
  //   width: 50px;
  //   height: 50px;
  //   background: #fff;
  //   animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  // }
  // .app-loading-wrap {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   background: #282c34;
  //   z-index: 9;
  // }
  //     `;
  //   const oStyle = document.createElement("style");
  //   const oDiv = document.createElement("div");

  //   oStyle.id = "app-loading-style";
  //   oStyle.innerHTML = styleContent;
  //   oDiv.className = "app-loading-wrap";
  //   oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  const className = "loaders-css__klee-loading";
  const styleContent = `
    .${className} {
      width: 120px;
      height: 120px;
    }
    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
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
  `;
  const oStyle = document.createElement("style")
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="font-genshin inner-wrapper">
    <img class=${className} src="../../src/assets/kleeLoading.gif" />
    <div class="below-text">加载中…</div>
  </div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
