const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

const distDir = path.join(__dirname, 'dist');

// O build (`npm run build`) roda no passo de build do deploy da Hostinger
// (hPanel → Node.js → comando de build). Não buildamos aqui no start: dentro do
// processo do app o esbuild é derrubado pelo limite de processos/memória
// (EAGAIN/EPIPE) e o app entra em loop de reinício tentando buildar.
if (!fs.existsSync(path.join(distDir, 'build', 'index.html'))) {
  console.error(
    'dist/build não encontrado. Configure o comando de build `npm run build` no hPanel e publique de novo.',
  );
  process.exit(1);
}

createStrapi({
  appDir: __dirname,
  distDir,
}).start();
