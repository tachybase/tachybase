import React from 'react';
import {
  createTableBlockSchema,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { BellOutlined } from '@ant-design/icons';

import { useTranslation } from './locale';

export const MessageBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const itemConfig = useSchemaInitializerItem();

  const schema = createTableBlockSchema({
    collection: 'messages',
    rowKey: 'id',
    tableActionInitializers: 'MessageTable:configureActions',
    tableColumnInitializers: 'MessageTable:configureColumns',
    tableActionColumnInitializers: 'MessageTable:configureItemActions',
    tableBlockProvider: 'MessageBlockProvider',
    disableTemplate: true,
  });

  return (
    <SchemaInitializerItem
      icon={<BellOutlined />}
      onClick={() => {
        insert(schema as ISchema);
      }}
      title={t('Messages')}
      {...itemConfig}
    />
  );
};
