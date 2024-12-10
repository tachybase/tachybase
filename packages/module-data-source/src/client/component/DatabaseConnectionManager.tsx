import React, { useCallback, useEffect } from 'react';
import {
  SchemaComponent,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useDataSourceManager,
  usePlugin,
} from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { Card } from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import PluginDatabaseConnectionsClient from '..';
import { databaseConnectionSchema } from '../schema';
import { ThirdDataSource } from '../ThridDataSource';
import { CreateDatabaseConnectAction } from './CreateDatabaseConnectAction';
import { EditDatabaseConnectionAction } from './EditDatabaseConnectionAction';
import { ViewDatabaseConnectionAction } from './ViewDatabaseConnectionAction';

export const DatabaseConnectionManagerPane = () => {
  const { t } = useTranslation();
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const types = [...plugin.types.keys()]
    .map((key) => {
      const type = plugin.types.get(key);
      return {
        value: key,
        label: t(type?.label),
      };
    })
    .concat([{ value: 'main', label: t('Main') }]);
  const dm = useDataSourceManager();

  const reloadKeys = React.useRef<string[]>([]);

  useEffect(() => {
    return () => {
      dm.getDataSources().forEach((dataSource) => {
        if (reloadKeys.current.includes(dataSource.key)) {
          dataSource.reload();
        }
      });
    };
  }, [reloadKeys]);

  const dataSourceDeleteCallback = useCallback(
    (keys: string[]) => {
      dm.removeDataSources(keys);
    },
    [dm],
  );

  const dataSourceCreateCallback = useCallback((data: any) => {
    dm.addDataSource(ThirdDataSource, data);
    reloadKeys.current = [...reloadKeys.current, data.key];
  }, []);

  const useRefreshActionProps = () => {
    const service = useDataBlockRequest();
    return {
      async onClick() {
        const needReloadDataSources = service?.data?.data.filter((item) => item.status !== 'loaded');
        if (needReloadDataSources?.length) {
          const dataSources = dm.getDataSources();
          const needLoadDataSourceKeys = needReloadDataSources.map((item) => item.key);
          const needLoadDataSourcesInstance = dataSources.filter((item) => needLoadDataSourceKeys.includes(item.key));
          await Promise.all(needLoadDataSourcesInstance.map((item) => item.reload()));
        }
        service?.refresh?.();
      },
    };
  };
  const useDestroyAction = () => {
    const { refresh } = useDataBlockRequest();
    const resource = useDataBlockResource();
    const { key: filterByTk } = useCollectionRecordData();
    return {
      async run() {
        await resource.destroy({ filterByTk });
        dataSourceDeleteCallback([filterByTk]);
        refresh();
      },
    };
  };
  const useIsAbleDelete = ($self) => {
    const { key } = useCollectionRecordData();
    $self.visible = key !== 'main';
  };
  return (
    <Card bordered={false}>
      <SchemaComponent
        components={{
          CreateDatabaseConnectAction,
          EditDatabaseConnectionAction,
          ViewDatabaseConnectionAction,
        }}
        scope={{
          useNewId: (prefix) => `${prefix}${uid()}`,
          types,
          useRefreshActionProps,
          useDestroyAction,
          dataSourceDeleteCallback,
          dataSourceCreateCallback,
          useIsAbleDelete,
        }}
        schema={databaseConnectionSchema}
      />
    </Card>
  );
};
