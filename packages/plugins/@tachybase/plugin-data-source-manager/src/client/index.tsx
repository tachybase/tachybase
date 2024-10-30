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
    this.app.systemSettingsManager.add(NAMESPACE, {
      title: `{{t("Data sources", { ns: "${NAMESPACE}" })}}`,
      icon: 'ClusterOutlined',
      showTabs: false,
      aclSnippet: 'pm.database-connections.manager',
      sort: -70,
    });
    this.app.systemSettingsManager.add(`${NAMESPACE}.list`, {
      title: `{{t("Data sources", { ns: "${NAMESPACE}" })}}`,
      Component: DatabaseConnectionManagerPane,
      sort: 1,
    });
    this.app.systemSettingsManager.add(`${NAMESPACE}/:name`, {
      title: <BreadcumbTitle />,
      icon: 'ClusterOutlined',
      isTopLevel: false,
      sort: 100,
    });
    this.app.systemSettingsManager.add(`${NAMESPACE}/main`, {
      title: <BreadcumbTitle />,
      icon: 'ClusterOutlined',
      isTopLevel: false,
      sort: 100,
    });
    // keep it for now
    this.app.systemSettingsManager.add(`${NAMESPACE}/main.collections`, {
      title: `{{t("Collections", { ns: "${NAMESPACE}" })}}`,
      Component: MainDataSourceManager,
      topLevelName: `${NAMESPACE}/main`,
      pluginKey: NAMESPACE,
    });
    this.app.systemSettingsManager.add('collections', {
      title: `{{t("Collections", { ns: "${NAMESPACE}" })}}`,
      icon: 'DatabaseOutlined',
      Component: MainDataSourceManager,
      pluginKey: 'collections',
      sort: -70,
    });
    this.app.systemSettingsManager.add(`${NAMESPACE}/:name.collections`, {
      title: `{{t("Collections", { ns: "${NAMESPACE}" })}}`,
      Component: CollectionManagerPage,
      topLevelName: `${NAMESPACE}/:name`,
      pluginKey: NAMESPACE,
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
