import { Plugin, SchemaInitializerItemType } from '@tachybase/client';

import { ApiLogsProvider } from './ApiLogsProvider';
import { apiLogsTableActionColumnInitializers } from './initializers/ApiLogsTableActionColumnInitializers';
import { apiLogsTableActionInitializers } from './initializers/ApiLogsTableActionInitializers';
import { apiLogsTableColumnInitializers } from './initializers/ApiLogsTableColumnInitializers';
import { tval } from './locale';

class PluginApiLogsClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

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
  }
}

export default PluginApiLogsClient;
