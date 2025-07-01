import { app, shell, BrowserWindow, ipcMain, dialog, nativeImage, protocol, net } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
// import { ImageFile } from '../entities/index';
import { ImageFile } from '@entities/index';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 创建主窗口
let mainWindow: BrowserWindow;
let secondWindow: BrowserWindow;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    opacity: 0.96,
    show: false,
    center: true,
    frame: false, // 关键代码：隐藏标题栏和边框
    titleBarStyle: 'hidden', // macOS 专属样式（可选）
    // transparent: true, // 可选：实现无边框透明效果
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webSecurity: false, // 禁用同源策略（允许加载本地文件）
      allowRunningInsecureContent: true, // 允许加载本地资源
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // nodeIntegration: true, // 启用 Node.js 集成
      contextIsolation: false // 关闭上下文隔离（简化操作）
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createSecondWindow(): void {
  // Create the browser window.
  secondWindow = new BrowserWindow({
    width: 280,
    height: 260,
    x: 160,
    y: 300,
    show: false,
    // resizable: false,
    // frame: false, // 关键代码：隐藏标题栏和边框
    // titleBarStyle: 'hidden', // macOS 专属样式（可选）
    // transparent: true, // 可选：实现无边框透明效果
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webSecurity: false, // 禁用同源策略（允许加载本地文件）
      allowRunningInsecureContent: true, // 允许加载本地资源
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // nodeIntegration: true, // 启用 Node.js 集成
      contextIsolation: false // 关闭上下文隔离（简化操作）
    }
  });

  secondWindow.on('ready-to-show', () => {
    secondWindow.show();
  });

  secondWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    secondWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/second.html`);
  } else {
    secondWindow.loadFile(join(__dirname, '../renderer/second.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('set-width-height', () => {
    if (secondWindow) {
      secondWindow.webContents.send('set-width-height');
    }
  });

  ipcMain.on('clear', () => {
    if (mainWindow) {
      mainWindow.webContents.send('clear');
    }
  });

  ipcMain.handle('open-file-dialog', async (_, options: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result.filePaths.map((path: string) => {
      const img = nativeImage.createFromPath(path);
      const { width, height } = img.getSize();
      return new ImageFile({
        path,
        width,
        height
      });
    });
  });

  // 修改窗口大小
  ipcMain.handle('set-window-size', (_, width, height) => {
    mainWindow.setSize(width, height);
  });

  // 获取图片大小
  ipcMain.handle('get-image-size', (_, filePath) => {
    const img = nativeImage.createFromPath(filePath);
    return img.getSize();
  });

  ipcMain.handle('file-to-path', async (_, arrayBuffer) => {
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const img = nativeImage.createFromBuffer(buffer);
    const { width, height } = img.getSize();

    // 返回临时文件路径（可选）
    const tempPath = path.join(os.tmpdir(), `img_${Date.now()}.png`);
    fs.writeFileSync(tempPath, buffer);
    return {
      width,
      height,
      path: tempPath, // 完整的文件系统路径
      url: `file://${tempPath}` // 可直接用于 <img> 标签
    };
  });

  // 修改透明度
  ipcMain.handle('set-window-opacity', (_, opacity) => {
    mainWindow.setOpacity(opacity);
  });

  createWindow();
  createSecondWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    createSecondWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
