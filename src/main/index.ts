import { app, shell, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { ImageFile } from '@entities/index';
import { Events } from '@events/index';
import { INIT_IMAGE_SIZE } from '@constant/index';

// 创建主窗口
let imageWindow: BrowserWindow;
let handleWindow: BrowserWindow;

const commonWindowConfig = {
  show: false,
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
};

function createImageWindow(): void {
  imageWindow = new BrowserWindow({
    ...commonWindowConfig,
    width: INIT_IMAGE_SIZE.width,
    height: INIT_IMAGE_SIZE.height,
    opacity: 0.96,
    center: true,
    frame: false // 关键代码：隐藏标题栏和边框
  });

  imageWindow.on('ready-to-show', () => {
    imageWindow.show();
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    imageWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    imageWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createHandleWindow(): void {
  handleWindow = new BrowserWindow({
    ...commonWindowConfig,
    width: 280,
    height: 400,
    x: 160,
    y: 300
  });

  handleWindow.on('ready-to-show', () => {
    handleWindow.show();
  });

  handleWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    handleWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/handle.html`);
  } else {
    handleWindow.loadFile(join(__dirname, '../renderer/handle.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createImageWindow();
  createHandleWindow();

  imageWindowEventListener();
  setupIPCHandlers();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createImageWindow();
      createHandleWindow();
    }
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

function imageWindowEventListener() {
  // 监听窗口移动事件
  imageWindow.on('move', () => {
    const [x, y] = imageWindow.getPosition();
    handleWindow.webContents.send(Events.IMAGE_WINDOW_MOVED, { x, y });
  });

  // 监听窗口大小变化事件
  imageWindow.on('resize', () => {
    const [width, height] = imageWindow.getSize();
    handleWindow.webContents.send(Events.IMAGE_WINDOW_RESIZED, { width, height });
  });

  //清空图片
  ipcMain.on(Events.CLEAR_IMAGE, _ => {
    imageWindow.webContents.send(Events.CLEAR_IMAGE);
  });

  // 修改image window 透明度
  ipcMain.on(Events.UPDATE_IMAGE_WINDOW_OPACITY, (_, _source, payload) => {
    imageWindow.setOpacity(payload.opacity);
  });

  // 改变image window 大小
  ipcMain.on(Events.UPDATE_IMAGE_WINDOW_SIZE, (_, _source, payload) => {
    imageWindow.setSize(payload.width, payload.height);
  });

  // 改变image window 位置
  ipcMain.on(Events.UPDATE_IMAGE_WINDOW_POSITION, (_, _source, payload) => {
    imageWindow.setPosition(payload.x, payload.y);
  });

  // 监听修改Handle Window 显示的值的事件
  ipcMain.on(Events.UPDATE_HANDLE_WINDOW_SIZE_VALUE, (_, _source, payload) => {
    handleWindow.webContents.send(Events.UPDATE_HANDLE_WINDOW_SIZE_VALUE, payload);
  });
}

function setupIPCHandlers() {
  // 获取image window位置
  ipcMain.handle(Events.GET_IMAGE_WINDOW_POSITION, _ => {
    return imageWindow.getPosition();
  });

  // 打开文件选择
  ipcMain.handle('open-file-dialog', async (_, options: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(imageWindow, options);
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
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
