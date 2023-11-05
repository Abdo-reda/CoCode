/**
 * @module preload
 */

import { contextBridge } from 'electron';
import ElectronAPI from './electronAPI';

contextBridge.exposeInMainWorld('ElectronAPI', ElectronAPI);
