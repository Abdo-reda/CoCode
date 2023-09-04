import {type IpcRendererEvent, ipcRenderer, clipboard} from 'electron';
import { address } from 'ip';


//find another way to disable eslint for any, too lazy to do this now.
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type ElectronCallbackFunc = (event: IpcRendererEvent, ...args: any[]) => void;

export default class ElectronAPI {
  public isDesktop = true;
  
  constructor() {}

  public openNewWindow() {
    ipcRenderer.send('open-new-window');
  }

  public hostServer() {
    ipcRenderer.send('host-server');
  }

  public onClientJoined(callback: ElectronCallbackFunc) {
    ipcRenderer.on('on-client-joined', callback);
  }

  public onClientType(callback: ElectronCallbackFunc) {
    ipcRenderer.on('on-client-type', callback);
  }

  public getAddress() {
    return address();
  }

  public copyToClipboard(text: string) {
    clipboard.writeText(text);
  }
}
