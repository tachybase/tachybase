import React from 'react';
import {
  SchemaInitializer,
  SchemaInitializerChildren,
  useAssociatedTableColumnInitializerFields,
  useCompile,
  useInheritsTableColumnInitializerFields,
  useTableColumnInitializerFields,
} from '@tachybase/client';

import { tval, useTranslation } from '../locale';

// 表格列配置
const ParentCollectionFields = () => {
  const inheritFields = useInheritsTableColumnInitializerFields();
  const { t } = useTranslation();
  const compile = useCompile();
  if (!inheritFields?.length) return null;
  const res = [];
  inheritFields.forEach((inherit) => {
    Object.values(inherit)[0].length &&
      res.push({
        type: 'itemGroup',
        divider: true,
        title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
        children: Object.values(inherit)[0].filter((v: any) => !v?.field?.isForeignKey),
      });
  });
  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

const AssociatedFields = () => {
  const associatedFields = useAssociatedTableColumnInitializerFields();
  const { t } = useTranslation();

  if (!associatedFields?.length) return null;
  const schema: any = [
    {
      type: 'itemGroup',
      divider: true,
      title: t('Display association fields'),
      children: associatedFields,
    },
  ];
  return <SchemaInitializerChildren>{schema}</SchemaInitializerChildren>;
};

export const MessageTableColumnInitializers = new SchemaInitializer({
  name: 'MessageTable:configureColumns',
  insertPosition: 'beforeEnd',
  icon: 'SettingOutlined',
  title: tval('Configure columns'),
  wrap(s) {
    if (s['x-action-column']) {
      return s;
    }
    return {
      type: 'void',
      'x-toolbar': 'TableColumnSchemaToolbar',
      'x-settings': 'fieldSettings:TableColumn',
      'x-decorator': 'TableV2.Column.Decorator',
      'x-component': 'TableV2.Column',
      properties: {
        [s.name]: {
          ...s,
        },
      },
    };
  },
  items: [
    {
      name: 'displayFields',
      type: 'itemGroup',
      title: tval('Display fields'),
      useChildren: useTableColumnInitializerFields,
    },
    {
      name: 'parentCollectionFields',
      Component: ParentCollectionFields,
    },
    {
      name: 'associationFields',
      Component: AssociatedFields,
    },
    {
      name: 'actionColumn',
      title: tval('Action column'),
      Component: 'MessageTableActionColumnInitializer',
    },
  ],
});
