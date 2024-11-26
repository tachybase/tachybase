import { Plugin } from '@tachybase/client';

import LibEditor from './component-editor/LibEditor';
import { CloudComponentManager } from './manager/CloudComponentManager';

export class PluginCloudComponentClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('cloud-component', {
      title: 'Cloud component',
      icon: 'deploymentunitoutlined',
      sort: 201,
    });
    this.app.systemSettingsManager.add('cloud-component.main', {
      title: 'Cloud component',
      icon: 'deploymentunitoutlined',
      Component: CloudComponentManager,
      sort: 201,
    });
    this.app.systemSettingsManager.add('cloud-component.edit', {
      title: 'Cloud component',
      icon: 'deploymentunitoutlined',
      Component: LibEditor,
      sort: 201,
    });
  }
}

export default PluginCloudComponentClient;
