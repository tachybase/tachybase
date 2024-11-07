import { Plugin } from '@tachybase/client';

import LibEditor from './component-editor/LibEditor';

export class PluginCloudComponentClient extends Plugin {
  async load() {
    this.app.router.add('editor', {
      path: '/editor',
      Component: LibEditor,
    });
  }
}

export default PluginCloudComponentClient;
