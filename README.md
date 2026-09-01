# PELD Iguaçu — Backend (Strapi)

Projeto montado manualmente (arquivos de config + schemas dos content-types),
já que o `npx create-strapi-app` faz download/instalação de centenas de
pacotes — mais rápido rodar isso direto no seu terminal do que pela sessão.

## Setup

```bash
cd backend
npm install
npm run develop
```

O `npm install` resolve as versões mais recentes do Strapi 5.x. Na primeira
vez que rodar `npm run develop`, o Strapi builda o admin panel e cria o
usuário administrador (primeiro acesso em http://localhost:1337/admin).

## Content-Types

Já modelados em `src/api/` e `src/components/shared/` — ver
`../docs/data-model.md` para o racional de cada um. O Strapi vai detectá-los
automaticamente ao subir (não precisa recriar nada pela UI).

## Variáveis de ambiente

`.env` já vem preenchido com secrets gerados (uso local/dev). Para produção,
gere novos valores e nunca reutilize os deste arquivo.
