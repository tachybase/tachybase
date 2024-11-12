import React from 'react';
import {
  Plugin,
  SchemaSettings,
  SchemaSettingsModalItem,
  useCollection,
  useColumnSchema,
  useDesignable,
} from '@tachybase/client';
import { ISchema, useFieldSchema } from '@tachybase/schema';

import { get, set } from 'lodash';

import { useTranslation } from '../../locale';

const SchemaSettingsAppends = () => {
  const originFieldSchema = useFieldSchema();
  const { fieldSchema: columnSchema } = useColumnSchema();
  const fieldSchema = columnSchema ?? originFieldSchema;
  const { t } = useTranslation();
  const c = useCollection();
  const { dn } = useDesignable();

  return (
    <SchemaSettingsModalItem
      key="appends"
      title="设置加载关联字段"
      scope={{
        fieldFilter(field) {
          return ['belongsTo', 'hasOne'].includes(field.type);
        },
      }}
      schema={
        {
          type: 'object',
          title: '设置加载关联字段',
          properties: {
            appends: {
              default: get(fieldSchema, 'x-component-props.appends', []),
              'x-decorator': 'FormItem',
              'x-component': 'AppendsTreeSelect',
              'x-component-props': {
                placeholder: t('Select context'),
                popupMatchSelectWidth: false,
                collection: `${c.dataSource && c.dataSource !== 'main' ? `${c.dataSource}:` : ''}${c.name}`,
                multiple: true,
                allowClear: false,
              },
            },
          },
        } as ISchema
      }
      onSubmit={({ appends }) => {
        set(fieldSchema['x-component-props'], 'appends', appends ?? []);
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': fieldSchema['x-component-props'],
          },
        });

        dn.refresh();
      }}
    />
  );
};

export const customFieldComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:CustomField',
  items: [
    {
      name: 'appends',
      Component: SchemaSettingsAppends,
    },
  ],
});

export class PluginCustomComponents extends Plugin {
  async load() {
    this.schemaSettingsManager.add(customFieldComponentFieldSettings);
  }
}
