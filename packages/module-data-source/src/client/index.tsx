import React from 'react';
import { Plugin } from '@tachybase/client';

import { BreadcumbTitle } from './component/BreadcumbTitle';
import { CollectionManagerPage } from './component/CollectionsManager';
import { DatabaseConnectionManagerPane } from './component/DatabaseConnectionManager';
import { DatasourceLink } from './component/DatasourceLink';
import { MainDataSourceManager } from './component/MainDataSourceManager';
import { DataSourcePermissionManager } from './component/PermissionManager';
import { DatabaseConnectionProvider } from './DatabaseConnectionProvider';
import { NAMESPACE } from './locale';
import { ThirdDataSource } from './ThridDataSource';

export class PluginDataSourceManagerClient extends Plugin {
  types = new Map();
  async load() {
    // 注册组件
    this.app.addComponents({
      DataSourcePermissionManager,
      DatasourceLink,
    });
    this.app.use(DatabaseConnectionProvider);
    // main data source
    this.app.systemSettingsManager.add('data-modeling.collections', {
      title: `{{t("Collections", { ns: "${NAMESPACE}" })}}`,
      icon: 'DatabaseOutlined',
      Component: MainDataSourceManager,
      aclSnippet: 'pm.database-connections.collections',
      pluginKey: 'collections',
      sort: -70,
    });
    // external data source
    this.app.systemSettingsManager.add(`data-modeling.${NAMESPACE}`, {
      title: `{{t("Data sources", { ns: "${NAMESPACE}" })}}`,
      icon: 'ClusterOutlined',
      showTabs: false,
      Component: DatabaseConnectionManagerPane,
      aclSnippet: 'pm.database-connections.manager',
      sort: -70,
    });
    // TODO: 这个子页面也需要配置,但是title会共享,会导致出现在配置页面为"主数据源"
    this.app.systemSettingsManager.add(`data-modeling.${NAMESPACE}/:name`, {
      title: <BreadcumbTitle />,
      Component: CollectionManagerPage,
      groupKey: `data-modeling.${NAMESPACE}`,
      pluginKey: NAMESPACE,
      aclSnippet: 'pm.database-connections.manager',
    });

    this.app.dataSourceManager.addDataSources(this.getThirdDataSource.bind(this), ThirdDataSource);
  }

  async setDataSources() {
    const allDataSources = await this.app.apiClient.request<{
      data: any;
    }>({
      resource: 'dataSources',
      action: 'listEnabled',
      params: {
        paginate: false,
      },
    });

    return allDataSources?.data?.data;
  }

  async getThirdDataSource() {
    const service = await this.app.apiClient.request<{
      data: any;
    }>({
      resource: 'dataSources',
      action: 'listEnabled',
      params: {
        paginate: false,
        appends: ['collections'],
      },
    });

    return service?.data?.data;
  }

  registerType(name: string, options) {
    this.types.set(name, options);
  }
}

export default PluginDataSourceManagerClient;
