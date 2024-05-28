import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import {
  SchemaComponent,
  ActionContextProvider,
  useAPIClient,
  useRecord,
  useRequest,
  useResourceActionContext,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import { App, Button, Dropdown, Tag } from 'antd';
import { useState, Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from '../../../locale';
import { T } from '../others/T';
import { y } from '../others/y';
import { k } from '../others/k';
import { schemaJe } from '../schema/schemaJe';
import { getDepartmentStr } from '../utils/getDepartmentStr';
import { useDataSourceTtt } from '../hooks/useDataSourceTtt';
import { DepartmentTablePpe } from './DepartmentTablePpe';

export const UserDepartmentsFieldOot = () => {
  const { modal: e, message: t } = App.useApp(),
    { t: o } = useTranslation(),
    [a, r] = useState(false),
    c = useRecord(),
    i = useField(),
    { refresh: x } = useResourceActionContext(),
    m = (l) =>
      l != null && l.length
        ? l.map((u) => {
            var f, S;
            return T(y({}, u), {
              isMain: (f = u.departmentsUsers) == null ? void 0 : f.isMain,
              isOwner: (S = u.departmentsUsers) == null ? void 0 : S.isOwner,
              title: getDepartmentStr(u),
            });
          })
        : [],
    g = useAPIClient();
  useRequest(
    () =>
      g
        .resource('users.departments', c.id)
        .list({ appends: ['parent(recursively=true)'], pagination: false })
        .then((l) => {
          var f;
          const u = m((f = l == null ? void 0 : l.data) == null ? void 0 : f.data);
          i.setValue(u);
        }),
    { ready: c.id },
  );
  const d = () => {
      const l = useAPIClient(),
        u = useForm(),
        { departments: f } = u.values || {};
      return {
        run() {
          return k(this, null, function* () {
            yield l.resource('users.departments', c.id).add({ values: f.map((O) => O.id) }),
              u.reset(),
              i.setValue([
                ...i.value,
                ...f.map((O, $) =>
                  T(y({}, O), { isMain: $ === 0 && i.value.length === 0, title: getDepartmentStr(O) }),
                ),
              ]),
              r(false),
              x();
          });
        },
      };
    },
    A = (l) => {
      e.confirm({
        title: o('Remove department'),
        content: o('Are you sure you want to remove it?'),
        onOk: () =>
          k(this, null, function* () {
            yield g.resource('users.departments', c.id).remove({ values: [l.id] }),
              t.success(o('Deleted successfully')),
              i.setValue(
                i.value
                  .filter((u) => u.id !== l.id)
                  .map((u, f) => T(y({}, u), { isMain: (l.isMain && f === 0) || u.isMain })),
              ),
              x();
          }),
      });
    },
    b = (l) =>
      k(this, null, function* () {
        yield g.resource('users').setMainDepartment({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isMain: u.id === l.id }))),
          x();
      }),
    h = (l) =>
      k(this, null, function* () {
        yield g.resource('departments').setOwner({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? true : u.isOwner }))),
          x();
      }),
    F = (l) =>
      k(this, null, function* () {
        yield g.resource('departments').removeOwner({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? false : u.isOwner }))),
          x();
      }),
    C = (l, u) => {
      switch (l) {
        case 'setMain':
          b(u);
          break;
        case 'setOwner':
          h(u);
          break;
        case 'removeOwner':
          F(u);
          break;
        case 'remove':
          A(u);
      }
    },
    v = () => ({ disabled: (l) => i.value.some((u) => u.id === l.id) });
  return jsxs(ActionContextProvider, {
    value: { visible: a, setVisible: r },
    children: [
      jsxs(Fragment, {
        children: [
          ((i == null ? void 0 : i.value) || []).map((l) =>
            jsxs(
              Tag,
              {
                style: { padding: '5px 8px', background: 'transparent', marginBottom: '5px' },
                children: [
                  jsx('span', { style: { marginRight: '5px' }, children: l.title }),
                  l.isMain ? jsx(Tag, { color: 'processing', bordered: false, children: o('Main') }) : '',
                  jsx(Dropdown, {
                    menu: {
                      items: [
                        ...(l.isMain ? [] : [{ label: o('Set as main department'), key: 'setMain' }]),
                        { label: o('Remove'), key: 'remove' },
                      ],
                      onClick: ({ key: u }) => C(u, l),
                    },
                    children: jsx('div', {
                      style: { float: 'right' },
                      children: jsx(MoreOutlined, {}),
                    }),
                  }),
                ],
              },
              l.id,
            ),
          ),
          jsx(Button, { icon: jsx(PlusOutlined, {}), onClick: () => r(true) }),
        ],
      }),
      jsx(SchemaComponent, {
        schema: schemaJe,
        components: {
          DepartmentTable: DepartmentTablePpe,
        },
        scope: {
          user: c,
          useDataSource: useDataSourceTtt,
          useAddDepartments: d,
          useDisabled: v,
        },
      }),
    ],
  });
};
