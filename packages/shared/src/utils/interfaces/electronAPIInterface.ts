import { type IpcRendererEvent } from "electron";

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type ElectronCallbackFunc = (event: IpcRendererEvent, ...args: any[]) => void;

export interface IElectronAPI {
  isDesktop: boolean;
  hello(): void;
  openNewWindow(): void;
  hostServer(): void;
  onClientJoined(callback: ElectronCallbackFunc): void;
  onClientType(callback: ElectronCallbackFunc): void;
  getAddress(): string;
  copyToClipboard(text: string): void;
}
