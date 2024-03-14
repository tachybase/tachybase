import { TableOutlined } from '@ant-design/icons';
import { ISchema } from '@formily/react';
import {
  createTableBlockSchema,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const AuditLogsBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const itemConfig = useSchemaInitializerItem();

  const schema = createTableBlockSchema({
    collection: 'auditLogs',
    rowKey: 'id',
    tableActionInitializers: 'auditLogsTable:configureActions',
    tableColumnInitializers: 'auditLogsTable:configureColumns',
    tableActionColumnInitializers: 'auditLogsTable:configureItemActions',
    tableBlockProvider: 'AuditLogsBlockProvider',
    disableTemplate: true,
  });

  return (
    <SchemaInitializerItem
      icon={<TableOutlined />}
      onClick={() => {
        insert(schema as ISchema);
      }}
      title={t('Audit Logs')}
      {...itemConfig}
    />
  );
};
