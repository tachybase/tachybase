import { Plugin, SchemaInitializerItemType } from '@tachybase/client';

import { ApiLogsProvider } from './ApiLogsProvider';
import { apiLogsConfigProvider } from './configuration/apiLogsConfigProvider';
import { apiLogsTableActionColumnInitializers } from './initializers/ApiLogsTableActionColumnInitializers';
import { apiLogsTableActionInitializers } from './initializers/ApiLogsTableActionInitializers';
import { apiLogsTableColumnInitializers } from './initializers/ApiLogsTableColumnInitializers';
import { lang, tval } from './locale';

class PluginApiLogsClient extends Plugin {
  // You can get and modify the app instance here
  async load() {
    this.app.use(ApiLogsProvider);
    this.app.schemaInitializerManager.add(apiLogsTableActionInitializers);
    this.app.schemaInitializerManager.add(apiLogsTableActionColumnInitializers);
    this.app.schemaInitializerManager.add(apiLogsTableColumnInitializers);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    const recordBlockInitializers = this.app.schemaInitializerManager.get('popup:common:addBlock');
    const apiLogs: Omit<SchemaInitializerItemType, 'name'> = {
      title: tval('Api logs'),
      Component: 'ApiLogsBlockInitializer',
    };
    blockInitializers.add('otherBlocks.apiLogs', apiLogs);
    recordBlockInitializers.add('otherBlocks.apiLogs', apiLogs);

    this.app.systemSettingsManager.add('system-services.apilogs-config', {
      icon: 'SettingOutlined',
      title: lang('Api logs configuration'),
      aclSnippet: `pm.system-services.apiLogsConfig`,
      Component: apiLogsConfigProvider,
    });
  }
}

export default PluginApiLogsClient;
