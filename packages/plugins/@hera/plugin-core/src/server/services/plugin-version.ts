import Application, { PluginManager } from '@nocobase/server';
import { Service, App } from '@nocobase/utils';
import { PLUGIN_NAME } from '../../utils/constants';

@Service()
export class PluginVersionService {
  @App()
  app: Application;

  async get() {
    const pm = this.app.pm as PluginManager;
    return pm.get(PLUGIN_NAME).toJSON();
  }
}
