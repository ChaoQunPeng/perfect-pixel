import { ElectronAPI } from '@electron-toolkit/preload';

interface ImageFile {
  path: string;
  width?: number;
  height?: number;
}

declare interface CustomAPI {
  setWindowSize: (width: number, height: number) => Promise<void>;
  openFileDialog: (options?: Electron.OpenDialogOptions) => Promise<List<ImageFile>>;
  getImageSize: (filePath: string) => { width: number; height: number };
  fileToPath: (file) => Promise<any>;
  getPathForFile: (file) => Promise<string>;
  setWindowOpacity: (value: number) => Promise<void>;
  setPanelWidthHeightValue: (width: number, height: number) => Promise<void>;
  getMainWindowPosition: () => Promise<Array<number>>;
}

declare global {
  interface Window {
    electronApi: ElectronAPI;
    api: CustomAPI;
  }
}
