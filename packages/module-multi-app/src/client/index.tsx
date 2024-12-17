import React from 'react';
import { Plugin } from '@tachybase/client';

import { AppstoreOutlined } from '@ant-design/icons';

import { NAMESPACE } from '../constants';
import { AppManager } from './AppManager';
import { MultiAppBlockInitializer } from './MultiAppBlockInitializer';
import { MultiAppManagerProvider } from './MultiAppManagerProvider';
import { i18nText } from './utils';

export class MultiAppManagerPlugin extends Plugin {
  async load() {
    this.app.addComponents({
      AppManager,
    });
    this.app.use(MultiAppManagerProvider);

    this.app.systemSettingsManager.add(`system-services.${NAMESPACE}`, {
      title: i18nText('Multi-app manager'),
      icon: 'AppstoreOutlined',
      Component: AppManager,
      aclSnippet: 'pm.multi-app-manager.applications',
    });

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');

    blockInitializers.add('otherBlocks.multiApp', {
      name: 'multiApp',
      title: i18nText('Multi-app manager'),
      icon: <AppstoreOutlined />,
      Component: MultiAppBlockInitializer,
    });
  }
}

export default MultiAppManagerPlugin;
export { formSchema, tableActionColumnSchema } from './settings/schemas/applications';
