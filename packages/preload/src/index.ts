/**
 * @module preload
 */

import { contextBridge } from 'electron';
import ElectronAPI from './electronAPI';

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

const electronAPI = new ElectronAPI();

contextBridge.exposeInMainWorld('ElectronAPI', {
    isDesktop: electronAPI.isDesktop,
});
  
