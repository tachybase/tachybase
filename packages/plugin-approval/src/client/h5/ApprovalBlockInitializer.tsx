import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { CalendarOutline } from 'antd-mobile-icons';

export const ApprovalBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const onCreateBlockSchema = async ({ item }) => {
    const schema: ISchema = {
      type: 'void',
      name: item.name,
      title: item.title,
      'x-toolbar': 'BlockSchemaToolbar',
      'x-settings': 'ApprovalSettings',
      'x-component': item.itemComponent,
      'x-component-props': {
        collectionName: item.collectionName,
        settingBlock: item?.settingBlock,
      },
    };
    insert(schema);
  };
  return (
    <SchemaInitializerItem
      {...itemConfig}
      title="Approval"
      icon={<CalendarOutline />}
      items={ApprovalInitializerItem}
      onClick={onCreateBlockSchema}
    ></SchemaInitializerItem>
  );
};

export const ApprovalInitializerItem = [
  {
    type: 'item',
    name: 'initiations',
    title: '发起',
    itemComponent: 'InitiationsBlock',
  },
  {
    type: 'item',
    title: '审批',
    name: 'todos',
    itemComponent: 'TodosBlock',
  },
];
