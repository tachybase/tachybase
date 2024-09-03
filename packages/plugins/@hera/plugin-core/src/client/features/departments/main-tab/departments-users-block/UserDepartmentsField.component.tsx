import React, { Fragment, useState } from 'react';
import {
  ActionContextProvider,
  useAPIClient,
  useRecord,
  useRequest,
  useResourceActionContext,
} from '@tachybase/client';
import { Field, useField, useForm } from '@tachybase/schema';

import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Tag } from 'antd';

import { useTranslation } from '../../../../locale';
import { getDepartmentStr } from '../../utils/getDepartmentStr';
import { ViewUnknownUserDepartment } from './UnknownUserDepartment.view';

export const UserDepartmentsField = () => {
  const { modal, message } = App.useApp();
  const API = useAPIClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const user = useRecord();
  const field = useField<Field>();
  const { refresh } = useResourceActionContext();

  const mapDepartment = (value = []) => {
    return value.map((item) => ({
      ...item,
      title: getDepartmentStr(item),
      isMain: item.departmentsUsers?.isMain,
      isOwner: item.departmentsUsers?.isOwner,
    }));
  };

  useRequest(
    () =>
      API.resource('users.departments', user.id)
        .list({
          appends: ['parent(recursively=true)'],
          pagination: false,
        })
        .then((result) => {
          const value = mapDepartment(result?.data?.data);
          field.setValue(value);
        }),
    { ready: user.id },
  );

  const useAddDepartments = () => {
    const api = useAPIClient();
    const form = useForm();
    const { departments } = form.values || {};
    return {
      async run() {
        await api.resource('users.departments', user.id).add({ values: departments.map((O) => O.id) });
        form.reset();
        field.setValue([
          ...field.value,
          ...departments.map((department, index) => ({
            ...department,
            isMain: index === 0 && field.value.length === 0,
            title: getDepartmentStr(department),
          })),
        ]);
        setVisible(false);
        refresh();
      },
    };
  };

  const showModalRemove = (department) => {
    modal.confirm({
      title: t('Remove department'),
      content: t('Are you sure you want to remove it?'),
      onOk: async () => {
        await API.resource('users.departments', user.id).remove({ values: [department.id] });
        message.success(t('Deleted successfully'));
        field.setValue(
          field.value
            .filter((dep) => dep.id !== department.id)
            .map((dep, index) => ({ ...dep, isMain: (department.isMain && index === 0) || dep.isMain })),
        );
        refresh();
      },
    });
  };

  const setMain = async (l) => {
    await API.resource('users').setMainDepartment({
      values: {
        userId: user.id,
        departmentId: l.id,
      },
    });
    message.success(t('Set successfully'));
    field.setValue(field.value.map((u) => ({ ...u, isMain: u.id === l.id })));
    refresh();
  };

  const setOwner = async (l) => {
    await API.resource('departments').setOwner({ values: { userId: user.id, departmentId: l.id } });
    message.success(t('Set successfully'));
    field.setValue(field.value.map((u) => ({ ...u, isOwner: u.id === l.id ? true : u.isOwner })));
    refresh();
  };

  const removeOwner = async (department) => {
    await API.resource('departments').removeOwner({ values: { userId: user.id, departmentId: department.id } });
    message.success(t('Set successfully'));
    field.setValue(field.value.map((dep) => ({ ...dep, isOwner: dep.id === department.id ? false : dep.isOwner })));
    refresh();
  };

  const C = (l, u) => {
    switch (l) {
      case 'setMain':
        setMain(u);
        break;
      case 'setOwner':
        setOwner(u);
        break;
      case 'removeOwner':
        removeOwner(u);
        break;
      case 'remove':
        showModalRemove(u);
    }
  };

  const useDisabled = () => ({ disabled: (l) => field.value.some((u) => u.id === l.id) });
  return (
    <ActionContextProvider value={{ visible: visible, setVisible: setVisible }}>
      <Fragment>
        {(field?.value || []).map((val) => (
          <Tag key={val.id} style={{ padding: '5px 8px', background: 'transparent', marginBottom: '5px' }}>
            <span style={{ marginRight: '5px' }}>{val.title}</span>
            {val.isMain ? (
              <Tag color={'processing'} bordered={false}>
                {t('Main')}
              </Tag>
            ) : (
              ''
            )}

            <Dropdown
              menu={{
                items: [
                  ...(val.isMain ? [] : [{ label: t('Set as main department'), key: 'setMain' }]),
                  { label: t('Remove'), key: 'remove' },
                ],
                onClick: ({ key }) => C(key, val),
              }}
            >
              <div style={{ float: 'right' }}>
                {' '}
                <MoreOutlined />
              </div>
            </Dropdown>
          </Tag>
        ))}
        <Button key={1} icon={<PlusOutlined />} onClick={() => setVisible(true)} />,
      </Fragment>
      <ViewUnknownUserDepartment user={user} useAddDepartments={useAddDepartments} useDisabled={useDisabled} />
    </ActionContextProvider>
  );
};
