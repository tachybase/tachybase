import { Plugin } from '@tachybase/client';

import LibEditor from './component-editor/LibEditor';

export class PluginCloudComponentClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('cloud-component-edit', {
      title: 'Cloud component',
      icon: 'deploymentunitoutlined',
      Component: LibEditor,
      sort: 201,
    });
  }
}

export default PluginCloudComponentClient;
