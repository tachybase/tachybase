import { Plugin } from '@nocobase/client';
import { PageStyleProvider } from './PageStyle.provider';

export class PluginPageStyle extends Plugin {
  async load() {
    this.app.use(PageStyleProvider);
  }
}
