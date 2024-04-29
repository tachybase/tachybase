import {
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockProps,
  useRequest,
} from '@nocobase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { uid } from '@nocobase/utils/client';
import { Spin } from 'antd';
import React, { useContext } from 'react';

//  发起人操作界面-创建区块
export const SchemaAddBlock = ({ value, onChange }) => {
  const api = useAPIClient();
  const { workflow } = useFlowContext();
  const { components } = useContext(SchemaComponentContext);

  // TODO:
  // 获取对应数据表的表单Schema
  const { data, loading } = useRequest(() =>
    E(this, null, function* () {
      let m;
      if (value) {
        const { data: h } = yield api.request({ url: `uiSchemas:getJsonSchema/${value}` });
        if (((m = h.data) == null ? void 0 : m['x-uid']) === value) return h.data;
      }
      const l = uid(),
        d = {
          type: 'void',
          name: l,
          'x-uid': l,
          'x-component': 'Grid',
          'x-initializer': 'ApprovalApplyAddBlockButton',
          properties: {},
        };
      return yield api.resource('uiSchemas').insert({ values: d }), onChange(l), d;
    }),
  );

  if (loading) {
    return <Spin />;
  }

  return (
    <SchemaComponentProvider components={components} designable={!workflow.executed}>
      <SchemaComponent
        memoized={true}
        components={{
          ActionBarProvider,
          ApplyActionStatusProvider,
          WithdrawActionProvider,
        }}
        scope={{
          useSubmit,
          useWithdrawAction,
          useFormBlockProps,
        }}
        // @ts-ignore ugly
        schema={data}
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
// TODO:
const E = (f, o, p) =>
  // eslint-disable-next-line promise/param-names
  new Promise((r, G) => {
    const u = ($) => {
        try {
          A(p.next($));
        } catch (U) {
          G(U);
        }
      },
      y = ($) => {
        try {
          A(p.throw($));
        } catch (U) {
          G(U);
        }
      },
      A = ($) => ($.done ? r($.value) : Promise.resolve($.value).then(u, y));
    A((p = p.apply(f, o)).next());
  });
