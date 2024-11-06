import { Plugin } from '@tachybase/client';

import microApp from '@micro-zoe/micro-app';

import LibEditor from './component-editor/LibEditor';
import { Subapp } from './Subapp';

export class PluginCloudComponentClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    microApp.start();
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.app.router.add('editor', {
      path: '/editor',
      Component: LibEditor,
    });
    this.app.router.add('apps', {
      path: '/apps',
      Component: Subapp,
    });
  }
}

export default PluginCloudComponentClient;
