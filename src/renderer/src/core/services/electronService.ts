import { IpcRendererEvent } from "electron/renderer";

export class ElectronService {

  isDesktop() {
    return !!window.electronAPI;
  };

  openNewWindow() {
    window.electronAPI.openNewWindow();
  }

  hostServer() {
    window.electronAPI.hostServer();
  }

  onClientJoined(listener: (event: IpcRendererEvent, text: string) => void): void{
    window.electronAPI.onClientJoined(listener);
  }


  onClientType(listener: (event: IpcRendererEvent, text: string) => void): void{
    window.electronAPI.onClientType(listener);
  }

  getAddress(): string {
    return window.electronAPI.getAddress();
  };

  copyToClipboard(text: string): void {
    window.electronAPI.copyToClipboard(text);
  };
}
