import type { InjectionKey } from 'vue';

export const ToastEvent = Symbol() as InjectionKey<(text: string, color: string)=> void>;
