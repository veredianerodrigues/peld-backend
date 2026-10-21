// Roda `strapi build` ao final do `npm install` quando o build está ausente ou desatualizado.
// O preset Express da Hostinger não tem campo de comando de build — só roda
// `npm install` e sobe o server.js —, então o build do deploy acontece aqui.
// Como não temos acesso ao diretório no servidor para apagar o dist/ à mão,
// guardamos um hash das fontes em dist/.build-hash: se alguma coisa em src/,
// config/ ou nas dependências mudou, o dist/ é apagado e reconstruído.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const appDir = path.join(__dirname, '..');
const distDir = path.join(appDir, 'dist');
const hashFile = path.join(distDir, '.build-hash');

// Tudo que entra no build: código do servidor, admin, config e versões das dependências.
const sources = ['src', 'config', 'types', 'tsconfig.json', 'package.json', 'package-lock.json'];

function listFiles(p) {
  if (!fs.existsSync(p)) return [];
  if (fs.statSync(p).isFile()) return [p];
  return fs
    .readdirSync(p)
    .sort()
    .flatMap((name) => listFiles(path.join(p, name)));
}

function sourcesHash() {
  const hash = crypto.createHash('sha256');
  for (const file of sources.flatMap((s) => listFiles(path.join(appDir, s)))) {
    hash.update(path.relative(appDir, file).split(path.sep).join('/'));
    // Normaliza fim de linha para o hash não mudar entre Windows e Linux.
    hash.update(fs.readFileSync(file).toString('binary').replace(/\r\n/g, '\n'));
  }
  return hash.digest('hex');
}

const currentHash = sourcesHash();
const builtHash = fs.existsSync(hashFile) ? fs.readFileSync(hashFile, 'utf8').trim() : null;

if (builtHash === currentHash && fs.existsSync(path.join(distDir, 'build', 'index.html'))) {
  console.log('postinstall: dist/ está atualizado, pulando strapi build.');
  process.exit(0);
}

console.log(
  builtHash
    ? 'postinstall: fontes mudaram desde o último build, apagando dist/ e reconstruindo...'
    : 'postinstall: sem build anterior registrado, rodando strapi build...'
);
fs.rmSync(distDir, { recursive: true, force: true });

const strapiBin = path.join(appDir, 'node_modules', '@strapi', 'strapi', 'bin', 'strapi.js');
execFileSync(process.execPath, [strapiBin, 'build'], { cwd: appDir, stdio: 'inherit' });

// Só grava o hash depois de um build bem-sucedido (execFileSync lança se falhar).
fs.writeFileSync(hashFile, currentHash);
