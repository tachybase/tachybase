import { Plugin } from '../../application/Plugin';
import { PageStyleProvider } from './PageStyle.provider';

export class PluginPageStyle extends Plugin {
  async load() {
    this.app.use(PageStyleProvider);
  }
}
