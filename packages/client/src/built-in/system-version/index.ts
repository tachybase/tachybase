import { Plugin } from '../../application/Plugin';
import { SystemVersionProvider } from './SystemVersion.provider';

export class PluginSystemVersion extends Plugin {
  async load() {
    this.app.use(SystemVersionProvider);
  }
}
