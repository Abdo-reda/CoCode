import {createApp} from 'vue';
import App from '/@/App.vue';
import '../style/app.css';
//---- Vuetify
import 'vuetify/styles';
import vuetify from '/@/plugins/vuetify';
//---- Vue Router
import {createRouter, createWebHistory} from 'vue-router';
import routes from '/@/plugins/routes';

const vueRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
});

const app = createApp(App);
app.use(vuetify);
app.use(vueRouter);
app.mount('#app');


