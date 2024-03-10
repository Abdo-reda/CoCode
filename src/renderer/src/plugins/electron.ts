import { App } from "vue";
import { ElectronService } from "@renderer/core/services/electronService";
import { ElectronServiceKey } from "@renderer/core/symbols/injectionKeys";

const electron = {
  install(app: App) {
    const electronService = new ElectronService();
    app.provide(ElectronServiceKey, electronService)
  },
};

export default electron;
