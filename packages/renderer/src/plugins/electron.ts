import {type App} from 'vue';
import { ElectronServiceKey } from '/@/utils/symbols/keys';
import { type IElectronAPI} from '/@shared/utils/interfaces/electronAPIInterface';

declare global {
  interface Window {
    ElectronAPI: IElectronAPI
  }
}

export default {
  install(app: App) {
    app.provide(ElectronServiceKey, window.ElectronAPI);
  }
};
