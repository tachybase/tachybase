import { Plugin } from '@tachybase/client';
import { PluginDataSourceManagerClient } from '@nocobase/plugin-data-source-manager/client';
import { tval } from './locale';
import { PgDataSourceSettingsForm } from './forms/pg';
import { MysqlDataSourceSettingsForm } from './forms/msql';

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
