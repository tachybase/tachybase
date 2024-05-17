import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';
import { HomePageService } from './home-page-service';

export class PluginHomePageServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}

  async install() {
    await Container.get(HomePageService).install();
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginHomePageServer;
