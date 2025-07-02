import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  openFileDialog: options => ipcRenderer.invoke('open-file-dialog', options),
  setWindowSize: (options, width, height) => {
    ipcRenderer.invoke('set-window-size', options, width, height);
  },
  setWindowOpacity: value => ipcRenderer.invoke('set-window-opacity', value),
  getImageSize: path => ipcRenderer.invoke('get-image-size', path),
  fileToPath: arrayBuffer => ipcRenderer.invoke('file-to-path', arrayBuffer),
  getPathForFile: file => {
    return webUtils.getPathForFile(file);
  },
  getMainWindowPosition: () => ipcRenderer.invoke('get-main-window-position')
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electronApi = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
