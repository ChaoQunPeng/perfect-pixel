/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-30 20:34:47
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:16:00
 * @FilePath: /perfect-pixel/src/preload/index.ts
 * @Description:
 */
import { contextBridge, ipcRenderer, nativeImage, webUtils } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { Events } from '../events/index';

// Custom APIs for renderer
const api = {
  openFileDialog: options => {
    return ipcRenderer.invoke(Events.OPEN_FILE_DIALOG, options);
  },
  getImageSize: path => {
    const img = nativeImage.createFromPath(path);
    return img.getSize();
  },
  getPathForFile: file => {
    return webUtils.getPathForFile(file);
  },
  getImageWindowPosition: () => {
    return ipcRenderer.invoke(Events.GET_IMAGE_WINDOW_POSITION);
  }
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
