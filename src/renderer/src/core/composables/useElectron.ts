import { inject } from "vue";
import { ElectronServiceKey } from "../symbols/injectionKeys";
import { ElectronService } from "../services/electronService";

export default function useElectron(): ElectronService {
    const electronService = inject(ElectronServiceKey)!;
    return electronService;
}
  