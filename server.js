const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createStrapi } = require('@strapi/strapi');

const distDir = path.join(__dirname, 'dist');

// A Hostinger nem sempre roda `npm run build` no deploy. Sem o build, o
// Strapi não sobe (503). Se o admin ainda não foi buildado, builda aqui.
// Usa o próprio node (process.execPath) porque o `npx` pode não estar no
// PATH do processo em produção.
if (!fs.existsSync(path.join(distDir, 'build', 'index.html'))) {
  console.log('dist/build não encontrado, rodando strapi build...');
  const strapiBin = path.join(__dirname, 'node_modules', '@strapi', 'strapi', 'bin', 'strapi.js');
  execFileSync(process.execPath, [strapiBin, 'build'], { cwd: __dirname, stdio: 'inherit' });
}

createStrapi({
  appDir: __dirname,
  distDir,
}).start();
