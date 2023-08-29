import HomePage from '../components/pages/HomePage.vue';
import AboutPage from '../components/pages/AboutPage.vue';
import HostPage from '../components/pages/HostPage.vue';
import ClientPage from '../components/pages/ClientPage.vue';

export default [
  {
    path: '/',
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
