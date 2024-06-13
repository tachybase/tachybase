import React from 'react';
import { Action, Form, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem, Input } from '@tachybase/components';
import { ISchema, observer, useForm } from '@tachybase/schema';

import { Card } from 'antd';

const schema: ISchema = {
  type: 'object',
  properties: {
    form1: {
      type: 'void',
      'x-decorator': 'Card',
      'x-decorator-props': {
        title: 'Form Title',
      },
      'x-component': 'Form',
      properties: {
        field1: {
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          title: 'T1',
          required: true,
        },
        out: {
          'x-component': 'Output',
        },
        action1: {
          // type: 'void',
          'x-component': 'Action',
          title: 'Submit',
          'x-component-props': {
            useAction: '{{ useSubmit }}',
          },
        },
      },
    },
  },
};

export default observer(() => {
  const Output = observer(
    () => {
      const form = useForm();
      return <pre>{JSON.stringify(form.values, null, 2)}</pre>;
    },
    { displayName: 'Output' },
  );

  const useSubmit = () => {
    const form = useForm();
    return {
      async run() {
        await form.submit();
        console.log(form.values);
      },
    };
  };

  return (
    <SchemaComponentProvider scope={{ useSubmit }} components={{ Card, Output, Action, Form, Input, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
});
