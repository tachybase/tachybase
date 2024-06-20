import { useContext, useEffect } from 'react';
import { useResourceActionContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Table } from 'antd';
import { jsx } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { FilterKeysContext } from '../context/FilterKeysContext';
import { useDepTree2 } from '../hooks/useDepTree2';
import { T } from '../others/T';
import { y } from '../others/y';
import { getDepartmentStr } from '../utils/getDepartmentStr';

const Ze = () => ({ disabled: () => false });
export const InternalDepartmentTable = ({ useDisabled: e = Ze }) => {
  const { t } = useTranslation(),
    o = useResourceActionContext();
  console.log(o);
  const { run: a, data: r, loading: c, defaultRequest: i } = o,
    { resource: x, resourceOf: m, params: g } = i || {},
    { treeData: d, initData: A, loadData: b } = useDepTree2({ resource: x, resourceOf: m, params: g }),
    h = useField(),
    { disabled: F } = e(),
    { hasFilter: C, expandedKeys: v, setExpandedKeys: l } = useContext(FilterKeysContext);
  useEffect(() => {
    C || A(r == null ? void 0 : r.data);
  }, [r, A, c, C]);
  const u = {};
  if ((g != null && g.pageSize && (u.defaultPageSize = g.pageSize), !u.total && r != null && r.meta)) {
    const { count: f, page: S, pageSize: O } = r.meta;
    (u.total = f), (u.current = S), (u.pageSize = O);
  }
  return jsx(Table, {
    rowKey: 'id',
    columns: [{ dataIndex: 'title', title: t('Department name'), render: (f, S) => (C ? getDepartmentStr(S) : f) }],
    rowSelection: {
      selectedRowKeys: ((h == null ? void 0 : h.value) || []).map((f) => f.id),
      onChange: (f, S) => {
        let O;
        return (O = h == null ? void 0 : h.setValue) == null ? void 0 : O.call(h, S);
      },
      getCheckboxProps: (f) => ({ disabled: F(f) }),
    },
    pagination: T(y({ showSizeChanger: true }, u), {
      onChange(f, S) {
        let O;
        a(T(y({}, ((O = o == null ? void 0 : o.params) == null ? void 0 : O[0]) || {}), { page: f, pageSize: S }));
      },
    }),
    dataSource: C ? (r == null ? void 0 : r.data) || [] : d,
    expandable: {
      onExpand: (f, S) => {
        b({ key: S.id, children: S.children });
      },
      expandedRowKeys: v,
      onExpandedRowsChange: (f) => l(f),
    },
  });
};
