import {createApp} from 'vue';
import App from '/@/App.vue';
import '../style/global.css';

//---- Vuetify
import 'vuetify/styles';
import vuetify from '/@/plugins/vuetify';


createApp(App).use(vuetify).mount('#app');
