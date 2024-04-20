import { Plugin } from '@nocobase/client';
import { usePageSettingsProps } from './usePageSettingsProps';
import { EmbedSchemaComponent } from './EmbedSchemaComponent';
import { EmbedPage } from './EmbedPage';

const keyEmbed = 'embed';
const pathEmbed = `/${keyEmbed}`;
export class EmbedPlugin extends Plugin {
  async load() {
    this.router.add(keyEmbed, { path: pathEmbed, Component: EmbedPage });
    this.router.add(`${keyEmbed}.page`, { path: `${pathEmbed}/:name`, Component: EmbedSchemaComponent });
    this.router.add(`${keyEmbed}.notAuthorized`, { path: `${pathEmbed}/not-authorized`, element: null });
    this.schemaSettingsManager.addItem('PageSettings', keyEmbed, {
      type: 'item',
      useComponentProps: usePageSettingsProps,
    });
  }
}
