import React, { useEffect, useState } from 'react';
import {
  Action,
  ActionContextProvider,
  Form,
  Input,
  SchemaComponent,
  SchemaComponentProvider,
  useActionContext,
  useCloseAction,
  useRequest,
} from '@tachybase/client';
import { FormItem } from '@tachybase/components';
import { ISchema, observer } from '@tachybase/schema';

import { Button } from 'antd';

const useValues = (options) => {
  const { visible } = useActionContext();
  const result = useRequest(
    () =>
      Promise.resolve({
        data: {
          id: 1,
          name: 'hello tachybase',
        },
      }),
    { ...options, manual: true },
  );
  useEffect(() => {
    // 默认 manual: true，点击弹窗之后才处理
    if (visible) {
      result.run();
    }
  }, [visible]);
  return result;
};

const schema: ISchema = {
  type: 'void',
  name: 'drawer1',
  'x-component': 'Action.Drawer',
  'x-decorator': 'Form',
  'x-decorator-props': {
    useValues,
  },
  title: 'Drawer Title',
  properties: {
    name: {
      title: 'T1',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    f1: {
      type: 'void',
      'x-component': 'Action.Drawer.Footer',
      properties: {
        a1: {
          'x-component': 'Action',
          title: 'Close',
          'x-component-props': {
            useAction: '{{ useCloseAction }}',
          },
        },
      },
    },
  },
};

export default observer(() => {
  const [visible, setVisible] = useState(false);

  return (
    <SchemaComponentProvider components={{ Action, Input, FormItem, Form }} scope={{ useCloseAction }}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          Edit
        </Button>
        <SchemaComponent schema={schema} />
      </ActionContextProvider>
    </SchemaComponentProvider>
  );
});
