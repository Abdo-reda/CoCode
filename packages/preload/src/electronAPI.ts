import type {IpcRendererEvent} from 'electron';

//find another way to disable eslint for any, too lazy to do this now.
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type ElectronCallbackFunc = (event: IpcRendererEvent, ...args: any[]) => void;

export default class ElectronAPI {
  public isDesktop = true;
  constructor() {}
}
