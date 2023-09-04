/**
 * @module preload
 */

import { contextBridge } from 'electron';
import ElectronAPI from './electronAPI';
import type {ElectronCallbackFunc} from './electronAPI';

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

const electronAPI = new ElectronAPI();

contextBridge.exposeInMainWorld('ElectronAPI', {
    isDesktop: electronAPI.isDesktop,
    openNewWindow: () => electronAPI.openNewWindow(),
    hostServer: () => electronAPI.hostServer(),
    onClientJoined: (callback: ElectronCallbackFunc) => electronAPI.onClientJoined(callback),
    onClientType: (callback: ElectronCallbackFunc) => electronAPI.onClientType(callback),
    getAddress: () => electronAPI.getAddress(),
    copyToClipboard: (text :string) => electronAPI.copyToClipboard(text),
});
  
