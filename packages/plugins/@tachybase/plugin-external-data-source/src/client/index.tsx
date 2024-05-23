import { Plugin } from '@tachybase/client';
import { PluginDataSourceManagerClient } from '@tachybase/plugin-data-source-manager/client';

import { MysqlDataSourceSettingsForm } from './forms/msql';
import { PgDataSourceSettingsForm } from './forms/pg';
import { tval } from './locale';

export class PluginExternalDataSourceClient extends Plugin {
  async load() {
    this.app.pm
      .get(PluginDataSourceManagerClient)
      .registerType('postgres', { DataSourceSettingsForm: PgDataSourceSettingsForm, label: tval('PostgreSQL') });

    this.app.pm
      .get(PluginDataSourceManagerClient)
      .registerType('mysql', { DataSourceSettingsForm: MysqlDataSourceSettingsForm, label: tval('MySQL') });
  }
}

export default PluginExternalDataSourceClient;
