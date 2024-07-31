import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'applicationForms',
  title: '申请表单',
  fields: [
    {
      name: 'application',
      type: 'belongsTo',
      target: 'applications',
      foreignKey: 'applicationName',
      targetKey: 'name',
      onDelete: 'SET NULL',
    },
    {
      name: 'templateName',
      type: 'string',
      interface: 'select',
      uiSchema: {
        title: '模板',
        type: 'string',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
      },
    },
    {
      name: 'url',
      type: 'string',
    },
    {
      name: 'email',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '邮箱',
        'x-component': 'Input',
      },
    },
    {
      name: 'note',
      type: 'string',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        title: '你希望用来做什么',
        'x-component': 'Input.TextArea',
      },
    },
    {
      name: 'industry',
      interface: 'input',
      type: 'string',
      uiSchema: {
        title: '所在行业',
        type: 'string',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
    },
    {
      name: 'isDeveloper',
      interface: 'radioGroup',
      type: 'string',
      uiSchema: {
        title: '你是一名开发者吗？',
        type: 'string',
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        enum: [
          {
            value: 'yes',
            label: '是',
            color: 'geekblue',
          },
          {
            value: 'no',
            label: '不是',
            color: 'cyan',
          },
        ],
      },
    },
  ],
});
