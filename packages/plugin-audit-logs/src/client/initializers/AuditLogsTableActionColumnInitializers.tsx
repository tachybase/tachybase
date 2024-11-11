import React from 'react';
import { createDesignable, Resizable, SchemaInitializer, useAPIClient, useDesignable } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { MenuOutlined } from '@ant-design/icons';

import { tval, useAuditLogsTranslation } from '../locale';

export const auditLogsTableActionColumnInitializers = new SchemaInitializer({
  name: 'auditLogsTable:configureItemActions',
  insertPosition: 'beforeEnd',
  Component: (props: any) => <MenuOutlined {...props} style={{ cursor: 'pointer' }} />,
  useInsert() {
    const fieldSchema = useFieldSchema();
    const api = useAPIClient();
    const { refresh } = useDesignable();
    const { t } = useAuditLogsTranslation();

    return (schema) => {
      const spaceSchema = fieldSchema.reduceProperties((buf, schema) => {
        if (schema['x-component'] === 'Space') {
          return schema;
        }
        return buf;
      }, null);
      if (!spaceSchema) {
        return;
      }
      const dn = createDesignable({
        t,
        api,
        refresh,
        current: spaceSchema,
      });
      dn.loadAPIClientEvents();
      dn.insertBeforeEnd(schema);
    };
  },
  items: [
    {
      name: 'enableActions',
      type: 'itemGroup',
      title: tval('Enable actions'),
      children: [
        {
          name: 'view',
          type: 'item',
          title: tval('View'),
          Component: 'AuditLogsViewActionInitializer',
          schema: {
            'x-component': 'Action.Link',
            'x-action': 'view',
            'x-decorator': 'ACLActionProvider',
          },
        },
      ],
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'columnWidth',
      type: 'item',
      title: tval('Column width'),
      Component: Resizable,
    },
  ],
});
