import { Field, ISchema, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { message } from 'antd';
import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useDesignable } from '../../../../schema-component';
import { useIsFieldReadPretty } from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { SchemaSettingsNumberFormat } from '../../../../schema-settings/SchemaSettingsNumberFormat';

export const inputNumberComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:InputNumber',
  items: [
    {
      name: 'setSliderMAXNumber',
      type: 'modal',
      useVisible() {
        const fieldSchema = useFieldSchema();
        return fieldSchema['x-component'] === 'Slider' || fieldSchema['x-component-props']?.component === 'Slider';
      },
      useComponentProps() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { dn } = useDesignable();
        return {
          title: t('MAX'),
          value: fieldSchema['x-component-props']?.max,
          schema: {
            type: 'object',
            title: t('Edit Slider Max'),
            properties: {
              maxNumber: {
                default: fieldSchema['x-component-props']?.max || 100,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {},
              },
            },
          } as ISchema,
          onSubmit(number) {
            if (Number(number.maxNumber) > (field.componentProps['min'] || 0)) {
              fieldSchema['x-component-props']['max'] = Number(number.maxNumber);
              field.componentProps['max'] = Number(number.maxNumber);
              dn.emit('patch', {
                schema: {
                  'x-uid': fieldSchema['x-uid'],
                  'x-component-props': fieldSchema['x-component-props'],
                },
              });
            } else {
              message.warning(t('Cannot be less than or equal to the minimum value'));
            }
          },
        };
      },
    },
    {
      name: 'setSliderMinNumber',
      type: 'modal',
      useVisible() {
        const fieldSchema = useFieldSchema();
        return fieldSchema['x-component'] === 'Slider' || fieldSchema['x-component-props']?.component === 'Slider';
      },
      useComponentProps() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { dn } = useDesignable();
        return {
          title: t('MIN'),
          value: fieldSchema['x-component-props']?.min,
          schema: {
            type: 'object',
            title: t('Edit Slider Min'),
            properties: {
              minNumber: {
                default: fieldSchema['x-component-props']?.min || 0,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {},
              },
            },
          } as ISchema,
          onSubmit(number) {
            if (Number(number.minNumber) < (field.componentProps['max'] || 0)) {
              fieldSchema['x-component-props']['min'] = Number(number.minNumber);
              field.componentProps['min'] = Number(number.minNumber);
              dn.emit('patch', {
                schema: {
                  'x-uid': fieldSchema['x-uid'],
                  'x-component-props': fieldSchema['x-component-props'],
                },
              });
            } else {
              message.warning(t('Cannot be greater than or equal to the maximum value'));
            }
          },
        };
      },
    },
    {
      name: 'displayFormat',
      Component: SchemaSettingsNumberFormat as any,
      useComponentProps() {
        const schema = useFieldSchema();
        const { fieldSchema: tableColumnSchema } = useColumnSchema();
        const fieldSchema = tableColumnSchema || schema;
        return {
          fieldSchema,
        };
      },
      useVisible() {
        const isFieldReadPretty = useIsFieldReadPretty();
        return isFieldReadPretty;
      },
    },
  ],
});
