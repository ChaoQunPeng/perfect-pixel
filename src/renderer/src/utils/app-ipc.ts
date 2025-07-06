/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-07-06 00:27:55
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:26:31
 * @FilePath: /perfect-pixel/src/renderer/src/app-ipc.ts
 * @Description: 
 */
export const AppIpcRenderer = {
  send: (event: string, source?: string, payload?: object) => {
    window.electronApi.ipcRenderer.send(event, source, payload);
  },
  on: (event: string, callback) => {
    window.electronApi.ipcRenderer.on(event, callback);
  }
};