import type { Schema, Struct } from '@strapi/strapi';

export interface SharedElementoMarca extends Struct.ComponentSchema {
  collectionName: 'components_shared_elemento_marcas';
  info: {
    displayName: 'Elemento da Marca';
    icon: 'star';
  };
  attributes: {
    descricao: Schema.Attribute.Text;
    icone: Schema.Attribute.Media<'images'>;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedEstatisticas extends Struct.ComponentSchema {
  collectionName: 'components_shared_estatisticas';
  info: {
    displayName: 'Estat\u00EDsticas';
    icon: 'chart-bar';
  };
  attributes: {
    alunos: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    doutores: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    mestres: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    professores: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedSecaoTexto extends Struct.ComponentSchema {
  collectionName: 'components_shared_secao_textos';
  info: {
    displayName: 'Se\u00E7\u00E3o de Texto';
    icon: 'file';
  };
  attributes: {
    imagem: Schema.Attribute.Media<'images'>;
    legenda: Schema.Attribute.String;
    texto: Schema.Attribute.RichText;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.elemento-marca': SharedElementoMarca;
      'shared.estatisticas': SharedEstatisticas;
      'shared.link': SharedLink;
      'shared.secao-texto': SharedSecaoTexto;
    }
  }
}
