import { Plugin } from '@tachybase/client';
import { PageStyleProvider } from './PageStyle.provider';

export class PluginPageStyle extends Plugin {
  async load() {
    this.app.use(PageStyleProvider);
  }
}
