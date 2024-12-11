import { Plugin } from '@tachybase/client';
import { PluginDataSourceManagerClient } from '@tachybase/module-data-source/client';

import { KitHttpDatasource } from './features/rest-api/kit';
import { MysqlDataSourceSettingsForm } from './forms/msql';
import { PgDataSourceSettingsForm } from './forms/pg';
import { tval } from './locale';

export class PluginExternalDataSourceClient extends Plugin {
  async afterAdd() {
    // 注册 REST API 数据源
    this.app.pm.add(KitHttpDatasource);
  }
  async load() {
    // 注册 PostgreSQL 数据源
    this.app.pm.get(PluginDataSourceManagerClient).registerType('postgres', {
      DataSourceSettingsForm: PgDataSourceSettingsForm,
      label: tval('PostgreSQL'),
    });

    // 注册 MySQL 数据源
    this.app.pm.get(PluginDataSourceManagerClient).registerType('mysql', {
      DataSourceSettingsForm: MysqlDataSourceSettingsForm,
      label: tval('MySQL'),
    });
  }
}

export default PluginExternalDataSourceClient;
