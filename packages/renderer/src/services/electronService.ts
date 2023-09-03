// import ElectronAPI from '../../../preload/src/electronAPI';
import type ElectronAPI from '../../../preload/src/electronAPI';
import type {ElectronCallbackFunc} from '../../../preload/src/electronAPI';

declare global {
  interface Window {
    ElectronAPI: ElectronAPI;
  }
}

export default {
  isDesktop: window.ElectronAPI?.isDesktop,
  openNewWindow() {
    window.ElectronAPI?.openNewWindow();
  },
  hostServer() {
    window.ElectronAPI?.hostServer();
  },
  onClientJoined(callback: ElectronCallbackFunc) {
    window.ElectronAPI?.onClientJoined(callback);
  },
  onClientType(callback: ElectronCallbackFunc) {
    window.ElectronAPI?.onClientType(callback);
  },
};
