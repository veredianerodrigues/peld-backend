// Seed de Notícias a partir de scripts/data/noticias.json.
// Uso (de dentro da pasta backend):
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-noticias.mjs          # simulação
//   STRAPI_URL="https://painel.peldiguacu.com.br" STRAPI_API_TOKEN="..." node scripts/seed-noticias.mjs --apply  # grava
// Idempotente pelo slug (gerado do título). Notícias sem `data` são puladas (campo obrigatório).
// `corpo` no JSON usa marcação simples, convertida para o formato blocks do Strapi:
// parágrafos separados por linha em branco, "## " = subtítulo, *itálico*, **negrito**, [texto](url).

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
  if (!res.ok) throw new Error(`${method} ${path} falhou (${res.status}): ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "texto *itálico* e [link](url)" -> nós inline do formato blocks. */
function inline(text) {
  const nodes = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) nodes.push({ type: "text", text: text.slice(last, m.index) });
    if (m[1]) nodes.push({ type: "text", text: m[1], bold: true });
    else if (m[2]) nodes.push({ type: "text", text: m[2], italic: true });
    else nodes.push({ type: "link", url: m[4], children: [{ type: "text", text: m[3] }] });
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push({ type: "text", text: text.slice(last) });
  return nodes;
}

const toBlocks = (corpo) =>
  corpo
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p.startsWith("## ")
        ? { type: "heading", level: 2, children: inline(p.slice(3)) }
        : { type: "paragraph", children: inline(p) }
    );

const noticias = JSON.parse(await readFile(new URL("./data/noticias.json", import.meta.url), "utf8"));

console.log(`${APPLY ? "GRAVANDO" : "SIMULAÇÃO (use --apply para gravar)"} em ${STRAPI_URL}\n`);

let criadas = 0;
for (const { corpo, ...n } of noticias) {
  const slug = slugify(n.titulo);
  if (!n.data) {
    console.log(`  ! pulada (sem data): ${n.titulo}`);
    continue;
  }
  const q = new URLSearchParams({ "filters[slug][$eq]": slug, status: "draft", "fields[0]": "slug" });
  if ((await api("GET", `/noticias?${q}`)).data.length) {
    console.log(`  = já existe: ${slug}`);
    continue;
  }
  if (APPLY) await api("POST", "/noticias", { data: { ...n, slug, corpo: toBlocks(corpo) } });
  criadas++;
  console.log(`  + ${APPLY ? "criada" : "seria criada"}: [${n.data}] /noticias/${slug}`);
}

console.log(`\n${criadas} ${APPLY ? "criadas" : "a criar"} de ${noticias.length} no arquivo.`);
