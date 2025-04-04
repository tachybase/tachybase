/**
 * title: Radio Group with color
 */
import React from 'react';
import { Radio, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const options = [
  {
    label: '男',
    value: '1',
    color: 'blue',
  },
  {
    label: '女',
    value: '2',
    color: 'red',
  },
];

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'number',
      title: `编辑模式`,
      enum: options,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-reactions': {
        target: 'read',
        fulfill: {
          state: {
            value: '{{$self.value}}',
          },
        },
      },
    },
    read: {
      type: 'number',
      title: `阅读模式`,
      enum: options,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Radio, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
