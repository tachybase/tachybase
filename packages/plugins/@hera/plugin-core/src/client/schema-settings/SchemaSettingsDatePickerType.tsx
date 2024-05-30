import React from 'react';
import { SchemaSettingsModalItem, useCollectionManager, useDesignable } from '@tachybase/client';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { tval, useTranslation } from '../locale';

export const SchemaSettingsDatePickerType: React.FC = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const cm = useCollectionManager();
  const collectionField = cm.getCollectionField(fieldSchema?.['x-collection-field']) || {};
  const defaultPicker =
    fieldSchema?.['x-component-props']?.picker || collectionField?.uiSchema?.['x-component-props']?.picker || '';
  return (
    <SchemaSettingsModalItem
      title={t('Date picker type')}
      schema={
        {
          type: 'object',
          properties: {
            picker: {
              type: 'string',
              title: tval('Picker type'),
              'x-component': 'Select',
              'x-decorator': 'FormItem',
              'x-decorator-props': {},
              default: defaultPicker,
              enum: [
                {
                  label: t('default'),
                  value: '',
                },
                {
                  label: t('year'),
                  value: 'year',
                },
                {
                  label: t('quarter'),
                  value: 'quarter',
                },
                {
                  label: t('month'),
                  value: 'month',
                },
                {
                  label: t('week'),
                  value: 'week',
                },
              ],
            },
          },
        } as ISchema
      }
      onSubmit={(data) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        schema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'] = {
          ...(fieldSchema['x-component-props'] || {}),
          ...data,
        };
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = fieldSchema['x-component-props'];
        //子表格/表格区块
        const parts = (field.path.entire as string).split('.');
        parts.pop();
        const modifiedString = parts.join('.');
        field.query(`${modifiedString}.*[0:].${fieldSchema.name}`).forEach((f) => {
          if (f.props.name === fieldSchema.name) {
            f.setComponentProps({ ...data });
          }
        });
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  );
};

SchemaSettingsDatePickerType.displayName = 'SchemaSettingsDatePickerType';
