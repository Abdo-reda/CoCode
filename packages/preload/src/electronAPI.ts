import {ipcRenderer, clipboard} from 'electron';
import { address } from 'ip';
import type { ElectronCallbackFunc, IElectronAPI } from '/@shared/utils/interfaces/electronAPIInterface';

const ElectronAPI: IElectronAPI = {
  isDesktop: true,
  hello() {
      console.log('0-0');
  },
  openNewWindow() {
    ipcRenderer.send('open-new-window');
  },
  hostServer() {
    ipcRenderer.send('host-server');
  },
  onClientJoined(callback: ElectronCallbackFunc) {
    ipcRenderer.on('on-client-joined', callback);
  },
  onClientType(callback: ElectronCallbackFunc) {
    ipcRenderer.on('on-client-type', callback);
  },
  getAddress(): string {
    return address();
  },
  copyToClipboard(text: string) {
    clipboard.writeText(text);
  },
};

export default ElectronAPI;

