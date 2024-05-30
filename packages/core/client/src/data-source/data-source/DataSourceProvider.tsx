import React, { createContext, ReactNode, useContext } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

import { CardItem, useSchemaComponentContext } from '../../schema-component';
import { CollectionDeletedPlaceholder } from '../components/CollectionDeletedPlaceholder';
import type { DataSource } from './DataSource';
import { useDataSourceManager } from './DataSourceManagerProvider';

export const DataSourceContext = createContext<DataSource>(null);
DataSourceContext.displayName = 'DataSourceContext';

export interface DataSourceProviderProps {
  dataSource?: string;
  children?: ReactNode;
}

export const DataSourceProvider = ({ children, dataSource }: DataSourceProviderProps) => {
  const dataSourceManager = useDataSourceManager();
  const { t } = useTranslation();
  const { refresh } = useSchemaComponentContext();
  const [_, setRandom] = React.useState(0);
  const dataSourceValue = dataSourceManager.getDataSource(dataSource);

  if (!dataSourceValue) {
    return <CollectionDeletedPlaceholder type="DataSource" name={dataSource} />;
  }

  if (dataSourceValue.status === 'loading-failed') {
    return (
      <CollectionDeletedPlaceholder
        type="DataSource"
        name={dataSourceValue.displayName || dataSource}
        message={dataSourceValue.errorMessage || 'loading failed'}
      />
    );
  }

  if (dataSourceValue.status === 'loading' || dataSourceValue.status === 'reloading') {
    return (
      <CardItem>
        <Result
          icon={<LoadingOutlined />}
          title={`${dataSourceValue.displayName || dataSource} ${t('data source')} ${t('loading')}...`}
          extra={
            <Button
              type="primary"
              onClick={() =>
                dataSourceValue.reload().then(() => {
                  refresh();
                  setRandom(Math.random());
                })
              }
            >
              {t('Refresh')}
            </Button>
          }
        />
      </CardItem>
    );
  }

  return <DataSourceContext.Provider value={dataSourceValue}>{children}</DataSourceContext.Provider>;
};

export function useDataSource() {
  const context = useContext<DataSource>(DataSourceContext);
  return context;
}

export function useDataSourceKey() {
  const context = useContext(DataSourceContext);
  return context?.key;
}
