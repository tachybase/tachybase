import React from 'react';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { useDesignable } from '../../schema-component';
import { SchemaSettingsModalItem } from '../../schema-settings';

export function CustomSchemaSettingsBlockTitleItem() {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { t } = useTranslation();

  return (
    <SchemaSettingsModalItem
      title={t('Edit block title')}
      schema={
        {
          type: 'object',
          title: t('Edit block title'),
          properties: {
            title: {
              title: t('Block title'),
              type: 'string',
              default: fieldSchema?.['x-decorator-props']?.['title'],
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        } as ISchema
      }
      onSubmit={({ title }) => {
        console.log('titleSchemaTest', fieldSchema, field);

        const componentProps = fieldSchema['x-decorator-props'] || {};
        componentProps.title = title;
        fieldSchema['x-decorator-props'] = componentProps;
        field.decoratorProps.title = title;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-decorator-props': fieldSchema['x-decorator-props'],
          },
        });
        dn.refresh();
      }}
    />
  );
}
