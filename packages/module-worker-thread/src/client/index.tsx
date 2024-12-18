import { Plugin } from '@tachybase/client';

import { NAMESPACE } from '../constants';
import { WorkerInfoPane } from './WorkerInfoPane';

export class ModuleWorkerThreadClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.addComponents({
      WorkerInfoPane,
    });
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE, {
      title: this.t('Worker thread'),
      icon: 'ControlOutlined',
      Component: WorkerInfoPane,
      aclSnippet: `pm.system-services.${NAMESPACE}`,
      sort: 10,
    });
  }
}

export default ModuleWorkerThreadClient;
