import React from 'react';
import { ISchema, Schema, useField } from '@tachybase/schema';
import { getPickerFormat } from '@tachybase/utils/client';

import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

import { useCollectionManager_deprecated, useDesignable } from '..';
import { DateFormatCom, ExpiresRadio } from '../schema-component';
import { SchemaSettingsModalItem } from './SchemaSettings';

export const SchemaSettingsDateFormat = function DateFormatConfig(props: { fieldSchema: Schema }) {
  const { fieldSchema } = props;
  const field: any = useField();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const { getCollectionJoinField } = useCollectionManager_deprecated();
  const collectionField = getCollectionJoinField(fieldSchema?.['x-collection-field']) || {};
  const isShowTime = fieldSchema?.['x-component-props']?.showTime;
  const dateFormatDefaultValue =
    fieldSchema?.['x-component-props']?.dateFormat ||
    collectionField?.uiSchema?.['x-component-props']?.dateFormat ||
    'YYYY-MM-DD';
  const timeFormatDefaultValue =
    fieldSchema?.['x-component-props']?.timeFormat ||
    collectionField?.uiSchema?.['x-component-props']?.timeFormat ||
    'HH:mm:ss';
  const pickerDefaultValue =
    fieldSchema?.['x-component-props']?.picker || collectionField?.uiSchema?.['x-component-props']?.picker || 'date';
  const isReadPretty = fieldSchema['x-read-pretty'] || field.readOnly || field.readPretty;
  return (
    <SchemaSettingsModalItem
      title={t('Date display format')}
      scope={{ getPickerFormat }}
      schema={
        {
          type: 'object',
          properties: {
            picker: {
              type: 'string',
              title: '{{t("Picker")}}',
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              default: pickerDefaultValue,
              description:
                !isReadPretty && '{{ t("Switching the picker, the value and default value will be cleared") }}',
              enum: [
                {
                  label: '{{t("Date")}}',
                  value: 'date',
                },
                // {
                //   label: '{{t("Week")}}',
                //   value: 'week',
                // },
                {
                  label: '{{t("Month")}}',
                  value: 'month',
                },
                {
                  label: '{{t("Quarter")}}',
                  value: 'quarter',
                },
                {
                  label: '{{t("Year")}}',
                  value: 'year',
                },
              ],
            },
            dateFormat: {
              type: 'string',
              title: '{{t("Date format")}}',
              'x-component': ExpiresRadio,
              'x-decorator': 'FormItem',
              'x-decorator-props': {},
              'x-component-props': {
                className: css`
                  .ant-radio-wrapper {
                    display: flex;
                    margin: 5px 0px;
                  }
                `,
                defaultValue: 'dddd',
                formats: ['MMMM Do YYYY', 'YYYY-MM-DD', 'MM/DD/YY', 'YYYY/MM/DD', 'DD/MM/YYYY'],
              },
              default: dateFormatDefaultValue,
              enum: [
                {
                  label: DateFormatCom({ format: 'MMMM Do YYYY' }),
                  value: 'MMMM Do YYYY',
                },
                {
                  label: DateFormatCom({ format: 'YYYY-MM-DD' }),
                  value: 'YYYY-MM-DD',
                },
                {
                  label: DateFormatCom({ format: 'MM/DD/YY' }),
                  value: 'MM/DD/YY',
                },
                {
                  label: DateFormatCom({ format: 'YYYY/MM/DD' }),
                  value: 'YYYY/MM/DD',
                },
                {
                  label: DateFormatCom({ format: 'DD/MM/YYYY' }),
                  value: 'DD/MM/YYYY',
                },
                {
                  label: 'custom',
                  value: 'custom',
                },
              ],
              'x-reactions': {
                dependencies: ['picker'],
                fulfill: {
                  state: {
                    value: `{{ getPickerFormat($deps[0])}}`,
                    componentProps: { picker: `{{$deps[0]}}` },
                  },
                },
              },
            },
            showTime: {
              default:
                isShowTime === undefined ? collectionField?.uiSchema?.['x-component-props']?.showTime : isShowTime,
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-content': '{{t("Show time")}}',
              'x-hidden': collectionField?.type === 'dateOnly',
              'x-reactions': [
                `{{(field) => {
              field.query('.timeFormat').take(f => {
                f.display = field.value ? 'visible' : 'none';
              });
            }}}`,
                {
                  dependencies: ['picker'],
                  when: '{{$deps[0]!=="date"}}',
                  fulfill: {
                    state: {
                      hidden: true,
                      value: false,
                    },
                  },
                  otherwise: {
                    state: {
                      hidden: collectionField?.type === 'dateOnly',
                    },
                  },
                },
              ],
            },
            timeFormat: {
              type: 'string',
              title: '{{t("Time format")}}',
              'x-component': ExpiresRadio,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                className: css`
                  margin-bottom: 0px;
                `,
              },
              'x-component-props': {
                className: css`
                  color: red;
                  .ant-radio-wrapper {
                    display: flex;
                    margin: 5px 0px;
                  }
                `,
                defaultValue: 'h:mm a',
                formats: ['hh:mm:ss a', 'HH:mm:ss'],
                timeFormat: true,
              },
              default: timeFormatDefaultValue,
              enum: [
                {
                  label: DateFormatCom({ format: 'hh:mm:ss a' }),
                  value: 'hh:mm:ss a',
                },
                {
                  label: DateFormatCom({ format: 'HH:mm:ss' }),
                  value: 'HH:mm:ss',
                },
                {
                  label: 'custom',
                  value: 'custom',
                },
              ],
            },
          },
        } as ISchema
      }
      onSubmit={(data) => {
        const schema: any = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        if ((field.componentProps.picker || 'date') !== data.picker && !isReadPretty && field.value) {
          field.value = undefined;
          field.initialValue = undefined;
          fieldSchema.default = undefined;
          schema.default = undefined;
        }
        schema['x-component-props'] = field.componentProps || {};
        fieldSchema['x-component-props'] = {
          ...(field.componentProps || {}),
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
            if ((field.componentProps.picker || 'date') !== data.picker && !isReadPretty) {
              f.value = undefined;
              f.initialValue = undefined;
            }
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
