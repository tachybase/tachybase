import { CollectionOptions, Space, useCompile } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { Tag, Typography } from 'antd';

import { tval } from '../../locale';

export function TriggerOptionRender({ data }) {
  const { label, color, options } = data;
  const compile = useCompile();
  return (
    <Space direction="vertical">
      <Tag color={color}>{compile(label)}</Tag>
      <Typography.Text type="secondary" style={{ whiteSpace: 'normal' }}>
        {compile(options.description)}
      </Typography.Text>
    </Space>
  );
}

export const dispatchers: CollectionOptions = {
  name: 'webhooks',
  title: 'webhooks',
  fields: [
    {
      type: 'string',
      name: 'name',
      interface: 'input',
      uiSchema: {
        title: tval('Name'),
        type: 'string',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'radioGroup',
      uiSchema: {
        title: tval('Enabled'),
        type: 'string',
        required: true,
        enum: [
          { label: tval('On'), value: true, color: '#52c41a' },
          { label: tval('Off'), value: false },
        ],
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        default: false,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'workflowKey',
      interface: 'select',
      uiSchema: {
        title: tval('Workflow'),
        type: 'string',
        'x-component': 'WorkflowSelect',
        'x-component-props': {
          buttonAction: 'customize:triggerWorkflows',
          noCollection: true,
          label: 'title',
          value: 'key',
        },
      } as ISchema,
    },
    {
      type: 'string',
      name: 'type',
      uiSchema: {
        title: tval('Type'),
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        enum: '{{useTriggersOptions()}}',
        'x-component-props': {
          optionRender: TriggerOptionRender,
          popupMatchSelectWidth: true,
          listHeight: 300,
        },
      },
    },
    {
      type: 'json',
      name: 'options',
      interface: 'object',
      uiSchema: {
        type: 'object',
        title: tval('Options'),
        'x-component': 'TypeContainer',
      } as ISchema,
    },
    {
      type: 'text',
      name: 'code',
      interface: 'textarea',
      uiSchema: {
        title: tval('Code'),
        type: 'string',
        'x-component': 'CodeMirror',
        'x-component-props': {
          defaultValue:
            '// ctx.action.params can get user query\n// ctx.action.params.values can get user body\n// const { changed, data, error } = await ctx.getChanged(); can get changed fields and raw data\n// ctx.body to pass your data to workflow or to client who invoke this.\n// ctx.body = ctx.action.params.values',
        },
      } as ISchema,
    },
  ],
};
