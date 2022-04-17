const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const { windows, utils } = require('./utils');
const { isMacOS, isProd } = utils;

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        },
      },
      {
        label: 'Clear Item',
        click() {
          clearItem('mainWindow');
        },
      },
      {
        label: 'Quit',
        accelerator: isMacOS ? 'Command+Q' : 'Ctrl+Q',
        click() {
          onQuitApp();
        },
      },
    ],
  },
];

const createWindow = ({ name, options = {}, cb }) => {
  windows[name] = new BrowserWindow({
    ...options,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  windows[name].loadURL(
    url.format({
      pathname: path.join(__dirname, `${name}.html`),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Garbage Collection
  windows[name].on('close', cb);
};

const createAddWindow = () => {
  createWindow({
    name: 'addWindow',
    options: {
      width: 300,
      height: 200,
      title: 'Add shopping list item',
    },
    cb: () => {
      windows.addWindow = null;
    },
  });
};

const createMainWindow = () => {
  createWindow({
    name: 'mainWindow',
    cb: onQuitApp,
  });
};

const clearItem = name => {
  windows[name].webContents.send('item:clear');
};

const onQuitApp = () => {
  app.quit();
};

const onAppReady = () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

// when item is ADD
ipcMain.on('item:add', (e, item) => {
  windows.mainWindow.webContents.send('item:add', item);
  windows.addWindow.close();
});

if (!isProd) {
  menuTemplate.push({
    label: 'Dev Tool',
    submenu: [
      {
        label: 'Toggle Devtools',
        accelerator: isMacOS ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}

app.on('ready', onAppReady);
