import {app, BrowserWindow, ipcMain} from 'electron';
import {join, resolve} from 'node:path';
import createWebSocketServer from './server/wsServer';
import type {Server} from 'socket.io';
import {writeFile, appendFile, truncate, statSync } from 'node:fs';
import {diff_match_patch} from 'diff-match-patch';

const DMP = new diff_match_patch();
const clientsText = new Map<string, string>();



async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0, 0, 0, 0.0)',
      symbolColor: '#f5a81b',
    },
    transparent: true,
    resizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  });

 
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await browserWindow.loadFile(resolve(__dirname, '../../renderer/dist/index.html'));
  }

  return browserWindow;
}


function webSocketServerSubscribeEvents(wsServer: Server) {
  wsServer.on('connection', socket => {
    console.log('a user connected', socket.id);

    socket.on('client-join', (client, _) => {
      console.log('--- host received client name', client.name);
      clientsText.set(client.uuid, '');
      BrowserWindow.getAllWindows().find(w => w.webContents.send('on-client-joined', client)); //Temp solution, in reality there will only be one instance which we will send to.
    });

    socket.on('client-add', (content, _) => {
      console.log('client-add', content);
      appendFile('test.txt', content, _ => {});
    });

    socket.on('client-del', (content, _) => {
      console.log('client-del', content);
      const numBytes = statSync('test.txt').size - Buffer.byteLength(content, 'utf8');
      truncate('test.txt', numBytes, _ => {});
    });

    socket.on('client-diff', (clientId: string, patches, _) => {
      clientsText.set(clientId, DMP.patch_apply(patches, clientsText.get(clientId)!)[0]);
      //I can either send uuid for the client text or have each client has a room.
      BrowserWindow.getAllWindows().find(w => w.webContents.send('on-client-type', clientId, clientsText.get(clientId))); //Temp solution, in reality there will only be one instance which we will send to. 
      writeFile(`clients_texts/client_${clientId}`, clientsText.get(clientId)!, _ => {});
    });

  });
}


function windowSubscribeEvents() {
  ipcMain.on('open-new-window', () => {
    createWindow();
  });

  ipcMain.once(('host-server'), () => {
    console.log('hosting websocket server ...');
    const wsServer = createWebSocketServer();
    webSocketServerSubscribeEvents(wsServer);
  });
}


/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
    windowSubscribeEvents();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
