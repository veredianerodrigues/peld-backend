import type { StrapiApp } from '@strapi/strapi/admin';

import logoLogin from './extensions/logo-login.png';
import logoMenu from './extensions/logo-menu.png';
import favicon from './extensions/favicon.ico';

// Identidade visual do PELD Iguaçu no painel administrativo.
// Cores vêm de frontend/src/app/globals.css (--primary #1A9E96 e tons de teal).
export default {
  config: {
    auth: { logo: logoLogin },
    menu: { logo: logoMenu },
    head: { favicon },
    locales: ['pt-BR'],
    translations: {
      'pt-BR': {
        'Auth.form.welcome.title': 'Bem-vindo(a) ao PELD Iguaçu',
        'Auth.form.welcome.subtitle': 'Entre com sua conta para gerenciar o conteúdo do site',
        'app.components.LeftMenu.navbrand.title': 'PELD Iguaçu',
        'app.components.LeftMenu.navbrand.workplace': 'Painel de conteúdo',
      },
      en: {
        'Auth.form.welcome.title': 'Welcome to PELD Iguaçu',
        'Auth.form.welcome.subtitle': 'Log in to manage the website content',
        'app.components.LeftMenu.navbrand.title': 'PELD Iguaçu',
        'app.components.LeftMenu.navbrand.workplace': 'Content panel',
      },
    },
    theme: {
      light: {
        colors: {
          primary100: '#E8F6F5',
          primary200: '#C3E7E4',
          primary500: '#3FB3AB',
          primary600: '#1A9E96',
          primary700: '#137C76',
          buttonPrimary500: '#3FB3AB',
          buttonPrimary600: '#1A9E96',
        },
      },
      dark: {
        colors: {
          primary100: '#0E2B29',
          primary200: '#1D4A47',
          primary500: '#3FB3AB',
          primary600: '#4CC3BA',
          primary700: '#6FD3CB',
          buttonPrimary500: '#4CC3BA',
          buttonPrimary600: '#1A9E96',
        },
      },
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {},
};
