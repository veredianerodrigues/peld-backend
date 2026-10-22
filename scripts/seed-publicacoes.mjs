// Seed de Publicações + Página de Publicações a partir de scripts/data/publicacoes.json.
// Uso (de dentro da pasta backend):
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-publicacoes.mjs          # simulação
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-publicacoes.mjs --apply  # grava
// Idempotente: publicações com o mesmo título já cadastradas (rascunho ou publicadas) são puladas.
// A Página de Publicações só é preenchida se ainda não existir.

import { readFile } from "node:fs/promises";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;
const APPLY = process.argv.includes("--apply");

if (!TOKEN) {
  console.error("Defina STRAPI_API_TOKEN antes de rodar (token 'Full access' criado em Settings > API Tokens).");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function api(method, path, body) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 404 && method === "GET") return null;
  if (!res.ok) throw new Error(`${method} ${path} falhou (${res.status}): ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function existeTitulo(titulo) {
  const q = new URLSearchParams({ "filters[titulo][$eq]": titulo, status: "draft", "fields[0]": "titulo" });
  const json = await api("GET", `/publicacoes?${q}`);
  return (json?.data?.length ?? 0) > 0;
}

const { pagina, publicacoes } = JSON.parse(
  await readFile(new URL("./data/publicacoes.json", import.meta.url), "utf8")
);

console.log(`${APPLY ? "GRAVANDO" : "SIMULAÇÃO (use --apply para gravar)"} em ${STRAPI_URL}\n`);

const paginaAtual = await api("GET", "/publicacoes-page?status=draft");
if (paginaAtual?.data) {
  console.log("Página de Publicações: já existe, mantida como está.");
} else {
  if (APPLY) await api("PUT", "/publicacoes-page", { data: pagina });
  console.log(`Página de Publicações: ${APPLY ? "criada e publicada" : "seria criada"}.`);
}

let criadas = 0;
let puladas = 0;
for (const pub of publicacoes) {
  if (await existeTitulo(pub.titulo)) {
    puladas++;
    console.log(`  = já existe: ${pub.titulo}`);
    continue;
  }
  if (APPLY) await api("POST", "/publicacoes", { data: pub });
  criadas++;
  console.log(`  + ${APPLY ? "criada" : "seria criada"}: [${pub.ano ?? "s/ ano"}] ${pub.titulo}`);
}

console.log(`\n${criadas} ${APPLY ? "criadas" : "a criar"}, ${puladas} já existentes, ${publicacoes.length} no arquivo.`);
