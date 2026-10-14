export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // URL pública (ex: https://api.seudominio.com.br). Necessária em produção para
  // links de mídia e para o login do /admin atrás de HTTPS.
  url: env('PUBLIC_URL', ''),
  // true quando o Strapi roda atrás de proxy reverso com HTTPS (Hostinger, Caddy, Nginx).
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
