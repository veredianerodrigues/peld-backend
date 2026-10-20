const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

const distDir = path.join(__dirname, 'dist');

// O build roda no `npm install` do deploy (scripts/postinstall.js). Não buildamos
// aqui no start: dentro do processo do app o esbuild é derrubado pelo limite de
// processos/memória da Hostinger (EAGAIN/EPIPE) e o app entra em loop de
// reinício tentando buildar.
if (!fs.existsSync(path.join(distDir, 'build', 'index.html'))) {
  console.error(
    'dist/build não encontrado: o build do postinstall falhou ou não rodou. Veja o log do deploy.',
  );
  process.exit(1);
}

createStrapi({
  appDir: __dirname,
  distDir,
}).start();
