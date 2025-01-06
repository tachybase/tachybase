import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useDesignable } from '../../../../schema-component';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';

export const radioComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:Radio group',
  items: [
    {
      name: 'fieldComponent',
      type: 'select',
      useComponentProps() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const { fieldSchema: tableColumnSchema } = useColumnSchema();
        const schema = useFieldSchema();
        const fieldSchema = tableColumnSchema || schema;
        const fieldModeOptions = [
          { label: t('Checkbox'), value: 'Checkbox' },
          { label: t('Radio group'), value: 'Radio group' },
          { label: t('Select'), value: 'Select' },
        ];
        const { dn } = useDesignable();
        return {
          title: t('Field component'),
          options: fieldModeOptions,
          value: fieldSchema['x-component-props']?.mode || 'Radio group',
          onChange(mode) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['mode'] = mode;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = field.componentProps || {};
            field.componentProps.mode = mode;

            void dn.emit('patch', {
              schema,
            });
            dn.refresh();
          },
        };
      },
    },
  ],
});
