import { Field, useField, useFieldSchema } from '@tachybase/schema';
import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { useDesignable } from '../../../../schema-component';
import { useTranslation } from 'react-i18next';
export const checkboxComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:Checkbox',
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
        ];
        const { dn } = useDesignable();
        return {
          title: t('Field component'),
          options: fieldModeOptions,
          value: fieldSchema['x-component-props'].mode || 'Checkbox',
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
