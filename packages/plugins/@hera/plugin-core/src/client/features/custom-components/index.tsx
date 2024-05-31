import React from 'react';
import { Plugin, SchemaSettings, SchemaSettingsModalItem, useCollection, useDesignable } from '@tachybase/client';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { get, set } from 'lodash';

const SchemaSettingsAppends = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const c = useCollection();
  const { dn } = useDesignable();

  return (
    <SchemaSettingsModalItem
      key="appends"
      title="设置加载关联字段"
      schema={
        {
          type: 'object',
          title: '设置加载关联字段',
          properties: {
            appends: {
              default: get(fieldSchema, 'x-component-props.service.params.appends', []),
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                mode: 'multiple',
              },
              enum: c?.fields.map((item) => item.name),
            },
          },
        } as ISchema
      }
      onSubmit={({ appends }) => {
        set(field.componentProps, 'service.params.appends', appends);
        fieldSchema['x-component-props'] = field.componentProps;
        const path = field.path?.splice(field.path?.length - 1, 1);
        field.form.query(`${path.concat(`*.` + fieldSchema.name)}`).forEach((f) => {
          f.componentProps.service = f.componentProps.service || { params: {} };
          f.componentProps.service.params.appends = appends;
        });
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': field.componentProps,
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
