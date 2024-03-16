import Application, { PluginManager } from '@nocobase/server';
import { Service, App } from '@nocobase/utils';

@Service()
export class PluginVersionService {
  @App()
  app: Application;

  async get() {
    const pm = this.app.pm as PluginManager;
    return pm.get('@hera/plugin-core').toJSON();
  }
}
