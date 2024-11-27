import { Plugin } from '@tachybase/client';

import { CloudLibraryManager } from './lib-manager/CloudLibraryManager';
import { CloudComponentManager } from './manager/CloudComponentManager';

export class ModuleCloudComponentClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('cloud-component', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      sort: 201,
    });
    this.app.systemSettingsManager.add('cloud-component.component', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      Component: CloudComponentManager,
      sort: 201,
    });
    this.app.systemSettingsManager.add('cloud-component.library', {
      title: this.t('Cloud Library'),
      icon: 'deploymentunitoutlined',
      Component: CloudLibraryManager,
      sort: 202,
    });
  }
}

export default ModuleCloudComponentClient;
