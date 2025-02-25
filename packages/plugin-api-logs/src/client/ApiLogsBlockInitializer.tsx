import React from 'react';
import {
  createTableBlockSchema,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { TableOutlined } from '@ant-design/icons';

import { useApiLogsTranslation } from './locale';

export const ApiLogsBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useApiLogsTranslation();
  const itemConfig = useSchemaInitializerItem();

  const schema = createTableBlockSchema({
    collection: 'apiLogs',
    rowKey: 'id',
    tableActionInitializers: 'apiLogsTable:configureActions',
    tableColumnInitializers: 'apiLogsTable:configureColumns',
    tableActionColumnInitializers: 'apiLogsTable:configureItemActions',
    tableBlockProvider: 'ApiLogsBlockProvider',
    disableTemplate: true,
  });

  return (
    <SchemaInitializerItem
      icon={<TableOutlined />}
      onClick={() => {
        insert(schema as ISchema);
      }}
      title={t('Api Logs')}
      {...itemConfig}
    />
  );
};
