// Roda `strapi build` ao final do `npm install` quando o admin ainda não foi buildado.
// O preset Express da Hostinger não tem campo de comando de build — só roda
// `npm install` e sobe o server.js —, então o build do deploy acontece aqui.
// Localmente, com o dist/ já existente, não rebuilda a cada install.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const appDir = path.join(__dirname, '..');

if (fs.existsSync(path.join(appDir, 'dist', 'build', 'index.html'))) {
  console.log('postinstall: dist/build já existe, pulando strapi build.');
  process.exit(0);
}

console.log('postinstall: rodando strapi build...');
const strapiBin = path.join(appDir, 'node_modules', '@strapi', 'strapi', 'bin', 'strapi.js');
execFileSync(process.execPath, [strapiBin, 'build'], { cwd: appDir, stdio: 'inherit' });
