import { CollectionOptions, tval } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

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
      interface: 'radioGroup',
      uiSchema: {
        title: tval('Type'),
        type: 'string',
        required: true,
        enum: [
          { label: tval('HTTP endpoint'), value: 'code' },
          { label: tval('Scheduler'), value: 'cron' },
          { label: tval('API action'), value: 'action' },
        ],
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        default: 'code',
      } as ISchema,
    },
    {
      type: 'string',
      name: 'resourceName',
      interface: 'input',
      uiSchema: {
        title: tval('Resource'),
        type: 'string',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'actionName',
      interface: 'input',
      uiSchema: {
        title: tval('Action'),
        type: 'string',
        'x-component': 'Input',
        required: true,
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
            '// ctx.action.params can get user query\n// ctx.action.params.values can get user body\n// const { changed, data, error } = await ctx.getChanged(); can get changed fields and raw data\n// ctx.body to pass your data to workflow or to client who invoke this.',
        },
      } as ISchema,
    },
  ],
};
