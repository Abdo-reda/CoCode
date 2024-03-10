import { InjectionKey } from "vue";
import { type ElectronService } from "../services/electronService";

export const ElectronServiceKey = Symbol() as InjectionKey<ElectronService>;