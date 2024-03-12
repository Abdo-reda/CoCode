import {createApp} from 'vue';
import App from './App.vue';
import vuetify from '@renderer/plugins/vuetify';
import electron from '@renderer/plugins/electron';
import {createRouter, createWebHistory} from 'vue-router';
import routes from '@renderer/plugins/routes';
import '@renderer/styles/main.scss';

const vueRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
});

const app = createApp(App);
app.use(vuetify);
app.use(vueRouter);
app.use(electron);
app.mount('#app');


