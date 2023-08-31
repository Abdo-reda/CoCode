import type ElectronAPI from '../../../preload/src/electronAPI';

declare global {
  interface Window {
    ElectronAPI: ElectronAPI;
  }
}

export default {
  isDesktop: window.ElectronAPI.isDesktop,
};



