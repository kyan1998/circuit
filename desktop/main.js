// 电路可视化实验室 —— Electron 桌面版入口
// 打包方式见 desktop/README-打包.md
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 900,
    minHeight: 620,
    title: '电路可视化实验室',
    backgroundColor: '#f4f6fb',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  Menu.setApplicationMenu(null);   // 隐藏默认菜单栏，界面更干净
  win.loadFile(path.join(__dirname, 'app', '电路可视化-演示-v1.6.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
