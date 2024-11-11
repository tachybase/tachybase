/**
 * title: DatePicker.RangePicker
 */
import React from 'react';
import { DatePicker, Input, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'boolean',
      title: `Editable`,
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
      'x-component-props': {
        gmt: true,
      },
      'x-reactions': [
        {
          target: 'read1',
          fulfill: {
            state: {
              value: '{{$self.value}}',
            },
          },
        },
        {
          target: 'read2',
          fulfill: {
            state: {
              value: '{{$self.value && $self.value.join(" ~ ")}}',
            },
          },
        },
      ],
    },
    read1: {
      type: 'boolean',
      title: `Read pretty`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
      'x-component-props': {
        gmt: true,
      },
    },
    read2: {
      type: 'string',
      title: `Value`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Input, DatePicker, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};