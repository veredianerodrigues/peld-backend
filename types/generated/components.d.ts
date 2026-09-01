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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.elemento-marca': SharedElementoMarca;
      'shared.estatisticas': SharedEstatisticas;
    }
  }
}
