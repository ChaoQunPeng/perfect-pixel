/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-30 20:34:47
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:06:39
 * @FilePath: /perfect-pixel/src/preload/index.d.ts
 * @Description:
 */
import { ElectronAPI } from '@electron-toolkit/preload';
import { BrowserWindow } from 'electron';

interface ImageFile {
  path: string;
  width?: number;
  height?: number;
}

declare interface CustomAPI {
  openFileDialog: (options?: Electron.OpenDialogOptions) => Promise<List<ImageFile>>;
  getImageSize: (filePath: string) => { width: number; height: number };
  getPathForFile: (file) => Promise<string>;
  getImageWindowPosition: () => Promise<Array<number>>;
}

declare global {
  interface Window {
    electronApi: ElectronAPI;
    api: CustomAPI;
  }
}
