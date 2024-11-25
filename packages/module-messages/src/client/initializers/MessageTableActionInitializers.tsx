import { SchemaInitializer } from '@tachybase/client';

import { tval } from '../locale';

export type { ButtonProps } from 'antd';

export const MessageTableActionInitializers = new SchemaInitializer({
  name: 'MessageTable:configureActions',
  title: tval('Configure actions'),
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      type: 'itemGroup',
      title: tval('Enable actions'),
      name: 'enableActions',
      children: [
        {
          name: 'filter',
          title: tval('Filter'),
          Component: 'FilterActionInitializer',
          schema: {
            'x-align': 'left',
          },
        },
        {
          name: 'refresh',
          title: tval('Refresh'),
          Component: 'RefreshActionInitializer',
          schema: {
            'x-align': 'right',
          },
        },
        {
          name: 'Delete',
          title: tval('Delete'),
          Component: 'BulkDestroyActionInitializer',
          schema: {
            'x-align': 'right',
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
          },
        },
      ],
    },
  ],
});
