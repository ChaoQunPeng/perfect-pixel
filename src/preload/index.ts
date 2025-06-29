import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  setWindowSize: (options, width, height) => {
    ipcRenderer.invoke('set-window-size', options, width, height)
  },
  getImageSize: (path) => ipcRenderer.invoke('get-image-size', path),
  fileToPath: (arrayBuffer) => ipcRenderer.invoke('file-to-path', arrayBuffer)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronApi = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
