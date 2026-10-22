import type { Core } from '@strapi/strapi';

import { applyContentManagerLabels } from './content-manager-labels';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await applyContentManagerLabels(strapi);
  },
};
