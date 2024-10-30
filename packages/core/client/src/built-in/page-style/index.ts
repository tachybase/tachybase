import { Plugin } from '../../application/Plugin';
import { CustomAdminHeader } from './CustomAdminHeader';
import { PageStyleProvider } from './PageStyle.provider';
import { CustomAdminContent } from './TabContent';

export class PluginPageStyle extends Plugin {
  async load() {
    this.app.use(PageStyleProvider);
    this.app.addComponents({
      CustomAdminContent,
      CustomAdminHeader,
    });
  }
}
