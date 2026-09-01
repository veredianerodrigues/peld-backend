// Seed inicial: Eixos de Atuação + Home Page.
// Uso: STRAPI_API_TOKEN="..." node scripts/seed.mjs
// (rodar de dentro da pasta backend, com o Strapi já no ar em localhost:1337)

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("Defina STRAPI_API_TOKEN antes de rodar (token 'Full access' criado em Settings > API Tokens).");
  process.exit(1);
}

const headersJson = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function assertOk(res, label) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${label} falhou (${res.status}): ${body}`);
  }
  return res.json();
}

const EIXOS = [
  {
    nome: "Biodiversidade",
    descricao_curta: "Inventário e monitoramento.",
    cor: "#0D4D4A",
    ordem: 1,
  },
  {
    nome: "Qualidade Ambiental",
    descricao_curta: "Biomonitoramento e saúde ambiental.",
    cor: "#1A9E96",
    ordem: 2,
  },
  {
    nome: "Social",
    descricao_curta: "Aspectos históricos, econômicos e socioculturais.",
    cor: "#4F7396",
    ordem: 3,
  },
  {
    nome: "Educomunicação",
    descricao_curta: "Integração, educação e comunicação.",
    cor: "#E8943A",
    ordem: 4,
  },
];

async function seedEixos() {
  for (const eixo of EIXOS) {
    const res = await fetch(`${STRAPI_URL}/api/eixos`, {
      method: "POST",
      headers: headersJson,
      body: JSON.stringify({
        data: { ...eixo, publishedAt: new Date().toISOString() },
      }),
    });
    await assertOk(res, `POST /api/eixos (${eixo.nome})`);
    console.log(`OK: eixo "${eixo.nome}" criado e publicado`);
  }
}

async function uploadHeroImage() {
  // Placeholder temporário (Cataratas do Iguaçu, Unsplash) — troque pela foto
  // real do projeto no Strapi admin quando tiver.
  const imgUrl =
    "https://images.unsplash.com/photo-1765640729600-94dbe6660811?w=1600";
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`Falha ao baixar imagem placeholder: ${imgRes.status}`);
  const buffer = await imgRes.arrayBuffer();

  const form = new FormData();
  form.append(
    "files",
    new Blob([buffer], { type: "image/jpeg" }),
    "hero-cataratas-placeholder.jpg"
  );

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  });
  const uploaded = await assertOk(res, "POST /api/upload");
  console.log("OK: imagem placeholder do hero enviada");
  return uploaded[0].id;
}

async function seedHomePage() {
  const imageId = await uploadHeroImage();

  const res = await fetch(`${STRAPI_URL}/api/home-page`, {
    method: "PUT",
    headers: headersJson,
    body: JSON.stringify({
      data: {
        slogan: "Ciência, conservação e educação no Parque Nacional do Iguaçu.",
        imagem_fundo: imageId,
        publishedAt: new Date().toISOString(),
      },
    }),
  });
  await assertOk(res, "PUT /api/home-page");
  console.log("OK: home-page criada e publicada");
}

await seedEixos();
await seedHomePage();
console.log("Seed concluído.");
