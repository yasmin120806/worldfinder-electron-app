const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Main = require('electron/main');

let MainWindow;
let PlannerWindow;
let ViewDetailWindow;

function createMainWindow() {
  MainWindow = new BrowserWindow({
    width: 1368,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity:false
    }
  });

  MainWindow.loadFile('renderer/index.html');
  MainWindow.maximize();
}

function createPlannerWindow(country) {
  PlannerWindow = new BrowserWindow({
    width: 1368,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  });

  PlannerWindow.loadFile('renderer/planner.html');
  PlannerWindow.maximize();

  PlannerWindow.webContents.on('did-finish-load', () => {
    PlannerWindow.webContents.send('country-selected', country);
  });
}

function createViewDetailWindow(country) {
  ViewDetailWindow = new BrowserWindow({
    width: 1368,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity:false
    }
  });

  ViewDetailWindow.loadFile('renderer/country-details.html');
  ViewDetailWindow.maximize();

  ViewDetailWindow.webContents.on('did-finish-load', () => {
    ViewDetailWindow.webContents.send('country-selected', country);
  });
}

ipcMain.on('open-planner-window', (event, country) => {
  createPlannerWindow(country);
});

ipcMain.on('save-planner', (event, data) => {
  const filePath = path.join(__dirname, 'data', 'planner.json');
  let planners = [];

  if (fs.existsSync(filePath)) {
    planners = JSON.parse(fs.readFileSync(filePath));
  }

  planners.push(data);
  fs.writeFileSync(filePath, JSON.stringify(planners, null, 2));
});

app.whenReady().then(createMainWindow);