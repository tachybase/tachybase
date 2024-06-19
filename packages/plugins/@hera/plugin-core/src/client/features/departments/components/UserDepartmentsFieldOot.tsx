import React, { Fragment, useState } from 'react';
import {
  ActionContextProvider,
  SchemaComponent,
  useAPIClient,
  useRecord,
  useRequest,
  useResourceActionContext,
} from '@tachybase/client';
import { Field, useField, useForm } from '@tachybase/schema';

import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Tag } from 'antd';
import { jsx, jsxs } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { useDataSource } from '../hooks/useDataSource';
import { k } from '../others/k';
import { T } from '../others/T';
import { y } from '../others/y';
import { schemaJe } from '../schema/schemaJe';
import { getDepartmentStr } from '../utils/getDepartmentStr';
import { DepartmentTablePpe } from './DepartmentTablePpe';

export const UserDepartmentsFieldOot = () => {
  const { modal, message } = App.useApp();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const user = useRecord();
  const field = useField<Field>();
  const { refresh: x } = useResourceActionContext();
  const m = (l) =>
    l != null && l.length
      ? l.map((u) => {
          return {
            ...u,
            isMain: u.departmentsUsers?.isMain,
            isOwner: u.departmentsUsers?.isOwner,
            title: getDepartmentStr(u),
          };
        })
      : [];
  const api = useAPIClient();
  useRequest(
    () =>
      api
        .resource('users.departments', user.id)
        .list({ appends: ['parent(recursively=true)'], pagination: false })
        .then((result) => {
          const u = m(result?.data?.data);
          field.setValue(u);
        }),
    { ready: user.id },
  );
  const useAddDepartments = () => {
    const api = useAPIClient();
    const form = useForm();
    const { departments: f } = form.values || {};
    return {
      run() {
        return k(this, null, function* () {
          yield api.resource('users.departments', user.id).add({ values: f.map((O) => O.id) }),
            form.reset(),
            field.setValue([
              ...field.value,
              ...f.map((O, $) =>
                T(y({}, O), { isMain: $ === 0 && field.value.length === 0, title: getDepartmentStr(O) }),
              ),
            ]),
            setVisible(false),
            x();
        });
      },
    };
  };
  const A = (l) => {
    modal.confirm({
      title: t('Remove department'),
      content: t('Are you sure you want to remove it?'),
      onOk: () =>
        k(this, null, function* () {
          yield api.resource('users.departments', user.id).remove({ values: [l.id] }),
            message.success(t('Deleted successfully')),
            field.setValue(
              field.value
                .filter((u) => u.id !== l.id)
                .map((u, f) => T(y({}, u), { isMain: (l.isMain && f === 0) || u.isMain })),
            ),
            x();
        }),
    });
  };
  const b = (l) =>
    k(this, null, function* () {
      yield api.resource('users').setMainDepartment({ values: { userId: user.id, departmentId: l.id } }),
        message.success(t('Set successfully')),
        field.setValue(field.value.map((u) => T(y({}, u), { isMain: u.id === l.id }))),
        x();
    });
  const h = (l) =>
    k(this, null, function* () {
      yield api.resource('departments').setOwner({ values: { userId: user.id, departmentId: l.id } }),
        message.success(t('Set successfully')),
        field.setValue(field.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? true : u.isOwner }))),
        x();
    });
  const F = (l) =>
    k(this, null, function* () {
      yield api.resource('departments').removeOwner({ values: { userId: user.id, departmentId: l.id } }),
        message.success(t('Set successfully')),
        field.setValue(field.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? false : u.isOwner }))),
        x();
    });
  const C = (l, u) => {
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
  };
  const useDisabled = () => ({ disabled: (l) => field.value.some((u) => u.id === l.id) });
  return jsxs(ActionContextProvider, {
    value: { visible: visible, setVisible: setVisible },
    children: [
      jsxs(Fragment, {
        children: [
          (field?.value || []).map((l) =>
            jsxs(
              Tag,
              {
                style: { padding: '5px 8px', background: 'transparent', marginBottom: '5px' },
                children: [
                  jsx('span', { style: { marginRight: '5px' }, children: l.title }),
                  l.isMain ? jsx(Tag, { color: 'processing', bordered: false, children: t('Main') }) : '',
                  jsx(Dropdown, {
                    menu: {
                      items: [
                        ...(l.isMain ? [] : [{ label: t('Set as main department'), key: 'setMain' }]),
                        { label: t('Remove'), key: 'remove' },
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
          <Button key={1} icon={<PlusOutlined />} onClick={() => setVisible(true)} />,
        ],
      }),
      <SchemaComponent
        key={2}
        schema={schemaJe}
        components={{
          DepartmentTable: DepartmentTablePpe,
        }}
        scope={{
          user,
          useDataSource,
          useAddDepartments,
          useDisabled,
        }}
      />,
    ],
  });
};
