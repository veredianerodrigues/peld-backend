import type { Core } from '@strapi/strapi';

type FieldLabel = string | { label: string; description?: string };

// Labels por nome de atributo, compartilhados entre os content-types.
const COMMON: Record<string, FieldLabel> = {
  nome: 'Nome',
  titulo: 'Título',
  slug: { label: 'Slug (endereço)', description: 'Use o botão de gerar a partir do título.' },
  descricao: 'Descrição',
  resumo: 'Resumo',
  data: 'Data',
  logo: 'Logo',
  link: 'Site',
  foto: 'Foto',
  imagem: 'Imagem',
  icone: 'Ícone',
  introducao: 'Introdução',
  ordem: { label: 'Ordem', description: 'Posição na lista: 1 aparece primeiro.' },
  createdAt: 'Criado em',
  updatedAt: 'Atualizado em',
  publishedAt: 'Publicado em',
  createdBy: 'Criado por',
  updatedBy: 'Atualizado por',
};

// Overrides por uid (content-types e components).
const BY_UID: Record<string, Record<string, FieldLabel>> = {
  'api::configuracao-global.configuracao-global': {
    texto_footer: 'Texto do rodapé',
    footer_localidade: 'Localidade (rodapé)',
    footer_email: 'E-mail (rodapé)',
  },
  'api::contato-page.contato-page': {},
  'api::eixo.eixo': {
    descricao_curta: 'Descrição curta',
    descricao_completa: 'Descrição completa',
    objetivos: 'Objetivos',
    metas: 'Metas',
    icone_venn: 'Ícone do diagrama de Venn',
    cor: { label: 'Cor', description: 'Hexadecimal, ex.: #1A9E96.' },
  },
  'api::evento.evento': {
    data: 'Data de início',
    data_fim: { label: 'Data de término', description: 'Opcional. Preencha para eventos de mais de um dia.' },
    local: 'Local',
    imagem: { label: 'Imagem / folder', description: 'Opcional. No site, clicar na imagem abre em tamanho original.' },
  },
  'api::fopea-page.fopea-page': {
    corpo: 'Texto principal',
    galeria: 'Galeria de fotos',
    link_youtube: { label: 'Canal no YouTube', description: 'Endereço completo, começando com https://' },
  },
  'api::home-page.home-page': {
    slogan: 'Slogan',
    imagem_fundo: 'Imagem de fundo',
  },
  'api::instituicao.instituicao': {},
  'api::membro.membro': {
    cargo: 'Cargo',
    instituicao_vinculo: 'Instituição de vínculo',
    categoria: 'Categoria',
  },
  'api::noticia.noticia': {
    corpo: 'Texto da notícia',
    destaque: { label: 'Destaque', description: 'Exibe na página inicial (máximo de 3).' },
  },
  'api::pesquisa-page.pesquisa-page': {},
  'api::publicacoes-page.publicacoes-page': {
    ebook_titulo: { label: 'E-book: título', description: 'Destaque no topo da página. Deixe vazio para ocultar.' },
    ebook_descricao: 'E-book: descrição',
    ebook_capa: 'E-book: capa',
    ebook_link: { label: 'E-book: link', description: 'Endereço completo, começando com https://' },
    ebook_arquivo: { label: 'E-book: arquivo (PDF)', description: 'Usado quando não houver link.' },
  },
  'api::publicacao.publicacao': {
    titulo: { label: 'Título', description: 'Use *asteriscos* para itálico, ex.: nomes científicos.' },
    tipo: { label: 'Tipo', description: 'Seção da página: artigo científico ou livro/capítulo/guia.' },
    periodico: { label: 'Periódico / livro', description: 'Ex.: Journal of Insect Conservation.' },
    ano: { label: 'Ano', description: 'Artigos são agrupados por ano.' },
    link: { label: 'Link (DOI ou URL)', description: 'Botão "Leia o artigo". Ex.: https://doi.org/10.1007/...' },
    dossie: { label: 'Dossiê', description: 'Opcional. Publicações com o mesmo texto aqui aparecem agrupadas.' },
    autores: 'Autores',
    arquivo: { label: 'Arquivo (PDF)', description: 'Usado quando não houver link.' },
    eixo: 'Eixo de atuação',
  },
  'api::sobre-page.sobre-page': {
    o_que_e_peld: 'O que é o PELD',
    parque_nacional: 'O Parque Nacional do Iguaçu',
    historia_projeto: 'História do projeto',
    elementos_marca: 'Elementos da marca',
    estatisticas: 'Estatísticas da equipe',
  },
  'shared.elemento-marca': {},
  'shared.estatisticas': {
    professores: 'Professores',
    doutores: 'Doutores',
    mestres: 'Mestres',
    alunos: 'Alunos',
  },
};

// Single types usam 'id' para o header cair no fallback schema.info.displayName
// (useDocument.getTitle); o default 'documentId' exibe o hash.
const MAIN_FIELD: Record<string, string> = {
  'api::eixo.eixo': 'nome',
  'api::evento.evento': 'titulo',
  'api::instituicao.instituicao': 'nome',
  'api::membro.membro': 'nome',
  'api::noticia.noticia': 'titulo',
  'api::publicacao.publicacao': 'titulo',
};

type Configuration = {
  settings: Record<string, unknown> & { mainField?: string };
  metadatas: Record<string, { edit?: Record<string, unknown>; list?: Record<string, unknown> }>;
  layouts: Record<string, unknown>;
};

const apply = (uid: string, conf: Configuration, mainField?: string) => {
  const labels = { ...COMMON, ...BY_UID[uid] };
  for (const [field, meta] of Object.entries(conf.metadatas)) {
    const entry = labels[field];
    if (!entry) continue;
    const { label, description } = typeof entry === 'string' ? { label: entry, description: undefined } : entry;
    if (meta.edit) {
      meta.edit.label = label;
      if (description) meta.edit.description = description;
    }
    if (meta.list) meta.list.label = label;
  }
  if (mainField) conf.settings.mainField = mainField;
  return { settings: conf.settings, metadatas: conf.metadatas, layouts: conf.layouts };
};

/**
 * Aplica labels pt-BR e mainField na configuração do content-manager
 * (core store plugin_content_manager_configuration_*). Roda no bootstrap,
 * então sobrescreve edições de label feitas pela UI em "Configurar a visualização".
 */
export async function applyContentManagerLabels(strapi: Core.Strapi) {
  const contentTypes = strapi.plugin('content-manager').service('content-types');
  const components = strapi.plugin('content-manager').service('components');

  for (const uid of Object.keys(BY_UID)) {
    try {
      if (uid.startsWith('api::')) {
        const ct = strapi.contentType(uid as any);
        if (!ct) continue;
        const conf = await contentTypes.findConfiguration(ct);
        const mainField = ct.kind === 'singleType' ? 'id' : MAIN_FIELD[uid];
        await contentTypes.updateConfiguration(ct, apply(uid, conf, mainField));
      } else {
        const component = strapi.components[uid as keyof typeof strapi.components];
        if (!component) continue;
        const conf = await components.findConfiguration(component);
        await components.updateConfiguration(component, apply(uid, conf));
      }
    } catch (err) {
      strapi.log.warn(`content-manager labels: falha em ${uid}: ${(err as Error).message}`);
    }
  }
}
