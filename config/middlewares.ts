export default ({ env }) => [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Em produção, defina CORS_ORIGIN com o domínio do site
      // (ex: https://seudominio.com.br). Vários: separe por vírgula.
      origin: env.array('CORS_ORIGIN', ['*']),
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
