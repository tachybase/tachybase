import React from 'react';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@tachybase/client';

import { tval } from '../locale';

export const ApiLogsTableActionColumnInitializer = () => {
  const schema = {
    type: 'void',
    title: tval('Actions'),
    'x-decorator': 'TableV2.Column.ActionBar',
    'x-component': 'TableV2.Column',
    'x-designer': 'TableV2.ActionColumnDesigner',
    'x-initializer': 'apiLogsTable:configureItemActions',
    'x-action-column': 'actions',
    properties: {
      actions: {
        type: 'void',
        'x-decorator': 'DndContext',
        'x-component': 'Space',
        'x-component-props': {
          split: '|',
        },
        properties: {},
      },
    },
  };
  const itemConfig = useSchemaInitializerItem();
  return <InitializerWithSwitch {...itemConfig} schema={schema} item={itemConfig} type={'x-action-column'} />;
};
