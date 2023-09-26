// import ElectronAPI from '../../../preload/src/electronAPI';
import type ElectronAPI from '../../../preload/src/electronAPI';
import type {ElectronCallbackFunc} from '../../../preload/src/electronAPI';

declare global {
  interface Window {
    ElectronAPI: ElectronAPI;
  }
}


//use provide and inject for dependency injection https://vuejs.org/api/composition-api-dependency-injection.html
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
  getAddress() {
    return window.ElectronAPI?.getAddress();
  },
  copyToClipboard(text: string) {
    return window.ElectronAPI?.copyToClipboard(text);
  },
};
