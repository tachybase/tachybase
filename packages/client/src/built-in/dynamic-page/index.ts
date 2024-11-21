import { Plugin } from '../../application/Plugin';
import { DynamicPage } from './DynamicPage';

export class PluginDynamicPage extends Plugin {
  async load() {
    this.app.router.add('admin.dynamicPage', {
      path: '/admin/:name/*',
      Component: DynamicPage,
    });
  }
}
