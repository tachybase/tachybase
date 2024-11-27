import { Plugin } from '@tachybase/client';

import { CloudComponentManager } from './cloud-component-manager/CloudComponentManager';
import { CloudLibraryManager } from './cloud-library-manager/CloudLibraryManager';

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
