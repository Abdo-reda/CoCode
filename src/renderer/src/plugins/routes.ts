import HomePage from '@renderer/views/HomeView.vue';
import AboutPage from '@renderer/views/AboutView.vue';
import HostPage from '@renderer/views/HostView.vue';
import ClientPage from '@renderer/views/ClientView.vue';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/CoCode',
    component: HomePage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/host',
    component: HostPage,
  },
  {
    path: '/client',
    component: ClientPage,
  },
];
