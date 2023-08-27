import type {ThemeDefinition} from 'vuetify';
import { createVuetify} from 'vuetify';

const defualtDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
      background: '#121212',
      surface: '#121212',
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
  
  const defaultLightTheme: ThemeDefinition = {
      dark: true,
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
    theme: {
      defaultTheme: 'defualtDarkTheme',
      themes: {
        defualtDarkTheme,
        defaultLightTheme,
      },
    },
  });
  
