import type { InjectionKey } from 'vue';
import { type IElectronAPI} from '/@shared/utils/interfaces/electronAPIInterface';

export const ToastEventKey = Symbol() as InjectionKey<(text: string, color: string)=> void>;
export const ElectronServiceKey = Symbol() as InjectionKey<IElectronAPI>;
