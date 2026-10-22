// Preenche a seção "Marca e elementos da marca" da Página Sobre a partir de scripts/data/sobre.json.
// Uso (de dentro da pasta backend):
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-sobre.mjs          # simulação
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-sobre.mjs --apply  # grava
// SUBSTITUI o campo `marca` e esvazia `elementos_marca` (cartões provisórios, substituídos pelo
// conteúdo do cliente). Os demais campos da página não são alterados.

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

const { marca } = JSON.parse(await readFile(new URL("./data/sobre.json", import.meta.url), "utf8"));

console.log(`${APPLY ? "GRAVANDO" : "SIMULAÇÃO (use --apply para gravar)"} em ${STRAPI_URL}\n`);

const atual = (await api("GET", "/sobre-page?status=draft&populate[elementos_marca]=true&populate[marca]=true"))?.data;
if (!atual) {
  console.log("Página Sobre não existe ainda: crie-a no painel antes de rodar este script.");
  process.exit(1);
}

console.log(`marca: ${atual.marca?.length ?? 0} seção(ões) atuais -> ${marca.length}: ${marca.map((s) => s.titulo).join(" | ")}`);
console.log(
  `elementos_marca: ${atual.elementos_marca?.length ?? 0} cartão(ões) atuais (${(atual.elementos_marca ?? [])
    .map((e) => e.titulo)
    .join(", ")}) -> 0`
);

if (APPLY) await api("PUT", "/sobre-page", { data: { marca, elementos_marca: [] } });
console.log(`\nPágina Sobre: ${APPLY ? "atualizada e publicada" : "seria atualizada"}.`);
