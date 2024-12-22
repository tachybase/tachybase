import Application, { PluginManager } from '@tachybase/server';
import { App, Service } from '@tachybase/utils';

@Service()
export class PluginVersionService {
  @App()
  app: Application;

  async get() {
    const pm = this.app.pm as PluginManager;
    const plugin = pm.get('@tachybase/module-hera') ?? pm.get('hera');
    return plugin.toJSON();
  }
}
