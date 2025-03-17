import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { HomePageService } from './home-page-service';

export class PluginHomePageServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}

  async install() {
    await Container.get(HomePageService).install();
    this.app.acl.registerSnippet({
      name: `pm.system-services.homepage`,
      actions: ['home_page_presentations:*'],
    });
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginHomePageServer;
