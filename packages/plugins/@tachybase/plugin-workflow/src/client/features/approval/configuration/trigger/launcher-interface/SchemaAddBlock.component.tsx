import React, { useContext } from 'react';
import {
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockProps,
  useRequest,
} from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { useFlowContext } from '../../../../../FlowContext';

//  发起人操作界面-添加区块
export const SchemaAddBlock = ({ value, onChange }) => {
  const api = useAPIClient();
  const { workflow } = useFlowContext();
  const { components } = useContext(SchemaComponentContext);

  // 获取对应数据表的表单Schema
  const { data, loading } = useRequest(async () => {
    if (value) {
      const { data } = await api.request({ url: `uiSchemas:getJsonSchema/${value}` });
      if (data.data?.['x-uid'] === value) return data.data;
    }
    const name = uid();
    const values = {
      type: 'void',
      name: name,
      'x-uid': name,
      'x-component': 'Grid',
      'x-initializer': 'ApprovalApplyAddBlockButton',
      properties: {},
    };

    await api.resource('uiSchemas').insert({ values });
    onChange(name);

    return values;
  });

  if (loading) {
    return;
  }

  return (
    <SchemaComponentProvider components={components} designable={true}>
      <SchemaComponent
        memoized={true}
        components={{
          ActionBarProvider,
          ApplyActionStatusProvider,
          WithdrawActionProvider,
          ProviderActionResubmit,
        }}
        scope={{
          useSubmit,
          useWithdrawAction,
          useFormBlockProps,
          useActionResubmit,
        }}
        schema={data as any}
      />
    </SchemaComponentProvider>
  );
};
function useSubmit() {
  return { run() {} };
}
function useWithdrawAction() {
  return { run() {} };
}
function ActionBarProvider(props) {
  return props.children;
}
function ApplyActionStatusProvider(props) {
  return props.children;
}
function WithdrawActionProvider(props) {
  return null;
}

function useActionResubmit() {
  return { run() {} };
}
function ProviderActionResubmit(props) {
  return props.children;
}
