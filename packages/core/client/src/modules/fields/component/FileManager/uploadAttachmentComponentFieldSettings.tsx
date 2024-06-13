import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useDesignable } from '../../../../schema-component';
import { useIsFieldReadPretty } from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';

export const uploadAttachmentComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:Upload.Attachment',
  items: [
    {
      name: 'size',
      type: 'select',
      useVisible() {
        const readPretty = useIsFieldReadPretty();
        return readPretty;
      },
      useComponentProps() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { dn } = useDesignable();
        return {
          title: t('Size'),
          options: [
            { label: t('Large'), value: 'large' },
            { label: t('Default'), value: 'default' },
            { label: t('Small'), value: 'small' },
          ],
          value: field?.componentProps?.size || 'default',
          onChange(size) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['size'] = size;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = field.componentProps || {};
            field.componentProps.size = size;
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          },
        };
      },
    },
    {
      name: 'showCount',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const { fieldSchema: tableColumnSchema } = useColumnSchema();
        const schema = useFieldSchema();
        const showCountSchema = tableColumnSchema || schema;
        const { dn } = useDesignable();

        return {
          title: t('Show Count'),
          schema: {
            type: 'object',
            title: t('Show Count'),
            properties: {
              showCount: {
                default: showCountSchema?.['x-component-props']?.['showCount'] || 1,
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  min: 0,
                  max: 5,
                },
              },
            },
          },
          onSubmit: ({ showCount }) => {
            const props = showCountSchema['x-component-props'] || {};
            props.showCount = showCount;
            const schema = {
              ['x-uid']: showCountSchema['x-uid'],
              ['x-component-props']: props,
            };
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          },
        };
      },
    },
  ],
});
