import { contextBridge } from 'electron'
import ElectronAPI from './electronAPI';

const electronAPI = new ElectronAPI();

contextBridge.exposeInMainWorld('electronAPI', {
    openNewWindow: electronAPI.openNewWindow,
    hostServer: electronAPI.hostServer,
    onClientJoined: electronAPI.onClientJoined,
    onClientType: electronAPI.onClientType,
    getAddress: electronAPI.getAddress,
    copyToClipboard: electronAPI.copyToClipboard,
})