import type {ThemeDefinition} from 'vuetify';
import {createVuetify} from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1f1f1f',
    primary: '#1c7ef6',
    'primary-darken-1': '#1356a8',
    secondary: '#f5a81b',
    'secondary-darken-1': '#c28515',
    error: '#d9071b',
    info: '#1c7ef6',
    success: '#4db021',
    warning: '#FB8C00',
  },
};

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#1c7ef6',
    'primary-darken-1': '#1356a8',
    secondary: '#f5a81b',
    'secondary-darken-1': '#c28515',
    error: '#B00020',
    info: '#1c7ef6',
    success: '#4db021',
    warning: '#FB8C00',
  },
};

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark,
      light,
    },
  },
});
