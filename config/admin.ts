export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  // enabled: false faz /preview/url responder 204 e o PreviewSidePanel não renderiza
  // (sem a chave, o Strapi exibe o CTA "Set up preview").
  preview: {
    enabled: false,
  },
  flags: {
    // Desligados: sem pesquisa de satisfação e sem os itens pagos (raio) no menu de Configurações.
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
