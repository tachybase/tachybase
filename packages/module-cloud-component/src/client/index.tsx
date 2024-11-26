import { Plugin } from '@tachybase/client';

import LibEditor from './component-editor/LibEditor';
import { CloudComponentManager } from './manager/CloudComponentManager';

export class PluginCloudComponentClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('cloud-component', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      sort: 201,
    });
    this.app.systemSettingsManager.add('cloud-component.main', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      Component: CloudComponentManager,
      sort: 201,
    });
    // this.app.systemSettingsManager.add('cloud-component.edit', {
    //   title: this.t('Cloud Component'),
    //   icon: 'deploymentunitoutlined',
    //   Component: LibEditor,
    //   sort: 201,
    // });
  }
}

export default PluginCloudComponentClient;
