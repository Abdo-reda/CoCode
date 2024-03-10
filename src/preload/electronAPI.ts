import {type IpcRendererEvent, ipcRenderer, clipboard} from 'electron';
import { address } from 'ip';
import { IPC_EVENTS } from '@common/ipcEvents';


//find another way to disable eslint for any, too lazy to do this now.
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type ElectronCallbackFunc = (event: IpcRendererEvent, ...args: any[]) => void;
//TODO: we don't need this

export default class ElectronAPI {
  public isDesktop = true;
  
  public openNewWindow() {
    ipcRenderer.send('open-new-window');
  }

  public hostServer() {
    ipcRenderer.send('host-server');
  }

  public onClientJoined(listener: (event: IpcRendererEvent, text: string) => void) {
    ipcRenderer.on('on-client-joined', listener);
  }

  public onClientType(listener: (event: IpcRendererEvent, text: string) => void) {
    ipcRenderer.on(IPC_EVENTS.ON_CLIENT_TYPE, listener);
  }

  public getAddress() {
    return address();
  }

  public copyToClipboard(text: string) {
    clipboard.writeText(text);
  }
}
