import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  // Path to the icon. 
  // IMPORTANT: Users must create a 'public' folder at the root and put 'icon.ico' there.
  const iconPath = path.join(__dirname, 'dist', 'icon.ico');
  const hasIcon = fs.existsSync(iconPath);

  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: "FrameMaster Pro",
    ...(hasIcon ? { icon: iconPath } : {}), 
    backgroundColor: '#09090b',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true // Re-enabled security
    },
    autoHideMenuBar: true
  });

  // Load the built index.html from dist folder
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(indexPath);

  win.once('ready-to-show', () => {
    win.show();
  });

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});