import { Plugin } from '@tachybase/client';

import { CloudLibraryManager } from './cloud-library-manager/CloudLibraryManager';
import { ProviderCloudComponent } from './CloudComponent.provider';

export class ModuleCloudComponentClient extends Plugin {
  async afterAdd() {
    await this.initLibraries();
  }

  async load() {
    this.app.systemSettingsManager.add('cloud-component', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      Component: CloudLibraryManager,
      sort: 201,
    });
    this.app.use(ProviderCloudComponent);
  }

  async initLibraries() {
    const { data } = await this.app.apiClient.request({
      resource: 'effectLibraries',
      action: 'list',
      params: {
        paginate: false,
        filter: {
          isClient: true,
          enabled: true,
        },
      },
    });
    const libraries = data?.data || [];
    for (const library of libraries) {
      const blob = new Blob([library.client], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      this.app.requirejs.require.config({
        paths: {
          [library.module]: url,
        },
      });
    }

    // 加载客户端插件
    for (const library of libraries) {
      if (!library.clientPlugin) {
        continue;
      }
      this.app.requirejs.require([library.module], (m) => {
        this.app.pm.add(m[library.clientPlugin]);
      });
    }
  }
}

export default ModuleCloudComponentClient;
