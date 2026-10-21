import type { StrapiApp } from '@strapi/strapi/admin';

import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';

import logoLogin from './extensions/logo-login.png';
import logoMenu from './extensions/logo-menu.png';
import favicon from './extensions/favicon.ico';

// Defaults de tema e locale: StrapiApp.render() lê STRAPI_THEME e strapi-admin-language
// do localStorage na criação do store, então o seed roda no import do módulo.
try {
  if (!localStorage.getItem('STRAPI_THEME')) localStorage.setItem('STRAPI_THEME', 'light');
  if (!localStorage.getItem('strapi-admin-language')) localStorage.setItem('strapi-admin-language', 'pt-BR');
} catch {
  // localStorage indisponível: mantém os defaults do Strapi
}

// font-family é definida no GlobalStyle do design-system, fora do theme; override via CSS injetado.
const FONT_CSS = `
  body, button, input, textarea, select {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
`;

// Mesmo formato de shadows.focus do design-system, com a cor primária.
const focus = (rgb: string) =>
  `inset 2px 0px 0px ${rgb}, inset 0px 2px 0px ${rgb}, inset -2px 0px 0px ${rgb}, inset 0px -2px 0px ${rgb}`;

// theme.light/dark são deep-merged no theme do design-system (StrapiApp.createCustomConfigurations).
// Paleta primária = frontend/src/app/globals.css (--primary #1A9E96); neutros com hue teal.
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
        borderRadius: '8px',
        spaces: ['0px', '4px', '8px', '12px', '16px', '20px', '28px', '36px', '44px', '52px', '60px', '72px'],
        colors: {
          primary100: '#E8F6F5',
          primary200: '#C3E7E4',
          primary500: '#3FB3AB',
          primary600: '#1A9E96',
          primary700: '#137C76',
          buttonPrimary500: '#3FB3AB',
          buttonPrimary600: '#1A9E96',
          neutral0: '#FFFFFF',
          neutral100: '#F4F7F6',
          neutral150: '#E6EDEB',
          neutral200: '#D6E0DE',
          neutral300: '#B9C6C4',
          neutral400: '#98A8A6',
          neutral500: '#7A8C8A',
          neutral600: '#5C6E6C',
          neutral700: '#445553',
          neutral800: '#2C3B39',
          neutral900: '#1B2928',
          neutral1000: '#101A19',
        },
        shadows: {
          filterShadow: '0px 1px 3px rgba(16, 40, 38, 0.08)',
          focus: focus('rgb(26, 158, 150)'),
          focusShadow: '0px 0px 0px 3px rgba(26, 158, 150, 0.25)',
          popupShadow: '0px 8px 24px rgba(16, 40, 38, 0.12)',
          tableShadow: '0px 1px 2px rgba(16, 40, 38, 0.06)',
        },
      },
      dark: {
        borderRadius: '8px',
        spaces: ['0px', '4px', '8px', '12px', '16px', '20px', '28px', '36px', '44px', '52px', '60px', '72px'],
        colors: {
          primary100: '#0E2B29',
          primary200: '#1D4A47',
          primary500: '#3FB3AB',
          primary600: '#4CC3BA',
          primary700: '#6FD3CB',
          buttonPrimary500: '#4CC3BA',
          buttonPrimary600: '#1A9E96',
          neutral0: '#15201F',
          neutral100: '#0E1716',
          neutral150: '#24302F',
          neutral200: '#33413F',
          neutral300: '#4E5D5B',
          neutral400: '#6F7F7D',
          neutral500: '#8C9B99',
          neutral600: '#A9B6B4',
          neutral700: '#C6D0CF',
          neutral800: '#E6ECEB',
          neutral900: '#F4F7F6',
          neutral1000: '#FFFFFF',
        },
        shadows: {
          focus: focus('rgb(76, 195, 186)'),
          focusShadow: '0px 0px 0px 3px rgba(76, 195, 186, 0.3)',
        },
      },
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {
    const style = document.createElement('style');
    style.textContent = FONT_CSS;
    document.head.appendChild(style);

    // Page.Title hardcoda o sufixo "| Strapi" e o DefaultDocument o título "Strapi Admin";
    // sem opção de config, o observer reescreve document.title a cada mutação no <head>.
    const renameTitle = () => {
      const renamed = document.title.replace(/\| Strapi$/, '| PELD').replace(/^Strapi Admin$/, 'PELD');
      if (renamed !== document.title) document.title = renamed;
    };
    renameTitle();
    new MutationObserver(renameTitle).observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  },
};
