import { TableOutlined } from '@ant-design/icons';
import { ISchema } from '@tachybase/schema';
import {
  createTableBlockSchema,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import React from 'react';
import { useAuditLogsTranslation } from './locale';

export const AuditLogsBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useAuditLogsTranslation();
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
