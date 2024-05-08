import {
  SchemaInitializerItem,
  SchemaInitializerMenu,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import React from 'react';
import { ISchema } from '@tachybase/schema';
import { Toast } from 'antd-mobile';
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
      'x-component-props': {},
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
