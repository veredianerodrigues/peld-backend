// Atualiza os 4 eixos (objetivo geral + objetivos específicos) e a Infraestrutura de pesquisa
// da Página de Pesquisa a partir de scripts/data/pesquisa.json.
// Uso (de dentro da pasta backend):
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-pesquisa.mjs          # simulação
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-pesquisa.mjs --apply  # grava
// Eixos são localizados pelo nome e SOBRESCRITOS nos campos presentes no JSON; `metas` é limpo
// (o projeto não define metas). Campos ausentes no JSON (ex.: descricao_completa de Educomunicação) ficam como estão.
// Imagens (diagrama, mapa RAPELD) não são enviadas: suba pelo painel.

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

const { pagina, eixos } = JSON.parse(
  await readFile(new URL("./data/pesquisa.json", import.meta.url), "utf8")
);

console.log(`${APPLY ? "GRAVANDO" : "SIMULAÇÃO (use --apply para gravar)"} em ${STRAPI_URL}\n`);

for (const { nome, ...campos } of eixos) {
  const q = new URLSearchParams({ "filters[nome][$eq]": nome, status: "draft" });
  const doc = (await api("GET", `/eixos?${q}`))?.data?.[0];
  if (!doc) {
    console.log(`  ! eixo não encontrado: ${nome}`);
    continue;
  }
  const data = { ...campos, metas: null };
  if (APPLY) await api("PUT", `/eixos/${doc.documentId}`, { data });
  console.log(`  ${APPLY ? "atualizado" : "seria atualizado"}: ${nome} (${Object.keys(data).join(", ")})`);
}

if (APPLY) await api("PUT", "/pesquisa-page", { data: pagina });
console.log(
  `\nPágina de Pesquisa: ${APPLY ? "atualizada" : "seria atualizada"} (${Object.keys(pagina).join(", ")}); introdução mantida.`
);
