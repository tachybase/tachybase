import React from 'react';
import {
  SchemaComponentOptions,
  SchemaSettingsModalItem,
  useBlockRequestContext,
  useDesignable,
} from '@tachybase/client';
import { ArrayItems, FormItem, Space } from '@tachybase/components';
import { connect, ISchema, useFieldSchema } from '@tachybase/schema';

import { PullRequestOutlined } from '@ant-design/icons';

import { useTranslation } from '../../../locale';
import { useContextGroupBlock } from '../contexts/GroupBlock.context';
import { transformers } from '../tools/transformers';

export const GroupBlockConfigure = connect((props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { service } = useBlockRequestContext();

  const params = fieldSchema['x-decorator-props']?.params;
  const measures = params?.measures;
  const decimal = transformers.option.filter((item) => item.value === 'decimal')[0].childrens;
  const valueOption = measures.map((item) => {
    return {
      label: item.label,
      value: item.field[0],
    };
  });
  const { scope } = useContextGroupBlock();
  const schema = modalSchema(t, params, valueOption, decimal);
  return (
    <SchemaComponentOptions scope={{ ...scope }} components={{ ArrayItems, FormItem, Space, PullRequestOutlined }}>
      <SchemaSettingsModalItem
        title={t('Configure')}
        key="configure"
        onSubmit={(fieldOptionItem) => {
          fieldSchema['x-decorator-props'].params['config'] = [...fieldOptionItem.configField];
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-decorator-props': fieldSchema['x-decorator-props'],
            },
          });
          dn.refresh();
          service?.refresh();
        }}
        schema={schema as ISchema}
      />
    </SchemaComponentOptions>
  );
});

const fieldType = [
  {
    label: '字段配置',
    value: 'field',
  },
  {
    label: '请求配置',
    value: 'custom',
  },
];

const styleOption = [
  {
    label: '描述',
    value: 'describe',
  },
  {
    label: '表格',
    value: 'table',
  },
];

const modalSchema = (t, params, valueOption, decimal) => {
  const schema = {
    title: t('Configure Group'),
    type: 'object',
    properties: {
      configField: {
        title: 'Config Field',
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayItems',
        default: params.config,
        items: {
          type: 'object',
          'x-decorator': 'ArrayItems.Item',
          properties: {
            space: {
              type: 'void',
              'x-component': 'Space',
              properties: {
                sort: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.SortHandle',
                },
                type: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '{{t("type")}}',
                  },
                  enum: fieldType,
                  required: true,
                },
                field: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '{{t("field")}}',
                  },
                  'x-visbile': false,
                  required: false,
                  enum: valueOption,
                  'x-reactions': {
                    dependencies: ['.type'],
                    fulfill: {
                      schema: {
                        required: "{{$deps[0]==='field'}}",
                        'x-visible': "{{$deps[0]==='field'}}",
                      },
                    },
                  },
                },
                reqUrl: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '{{t("reqUrl")}}',
                    addonBefore: <PullRequestOutlined />,
                  },
                  required: false,
                  'x-visible': false,
                  'x-reactions': {
                    dependencies: ['.type'],
                    fulfill: {
                      schema: {
                        required: "{{$deps[0]==='custom'}}",
                        'x-visible': "{{$deps[0]==='custom'}}",
                      },
                    },
                  },
                },
                format: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '{{t("format")}}',
                  },
                  enum: transformers.option,
                  required: true,
                },
                digits: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '{{t("digits")}}',
                  },
                  enum: decimal,
                  'x-visible': false,
                  'x-reactions': {
                    dependencies: ['.format'],
                    fulfill: {
                      schema: {
                        'x-visible': "{{$deps[0]==='decimal'}}",
                      },
                    },
                  },
                },
                style: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '{{t("style")}}',
                  },
                  enum: styleOption,
                  required: true,
                },
                remove: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Remove',
                },
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            title: 'Add',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };
  return schema;
};
