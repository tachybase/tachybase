import { useContext } from 'react';
import {
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockProps,
  useRequest,
} from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

//  发起人操作界面-添加卡片
export const ViewApplyFormAddBlock = ({ value, onChange }) => {
  const api = useAPIClient();
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
      'x-initializer': 'ApplyFormInitializer',
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
        schema={data as any}
        components={{
          ActionBarProvider,
          ApplyActionStatusProvider,
          WithdrawActionProvider,
          ProviderActionResubmit,
          ProviderActionReminder,
        }}
        scope={{
          useSubmit,
          useWithdrawAction,
          useFormBlockProps,
          useActionResubmit,
          useActionReminder,
        }}
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
function useActionReminder() {
  return { run() {} };
}
function ProviderActionResubmit(props) {
  return props.children;
}

function ProviderActionReminder(props) {
  return props.children;
}
