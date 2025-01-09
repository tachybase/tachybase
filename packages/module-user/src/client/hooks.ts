import React, { useContext } from 'react';
import {
  CollectionContext,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollectionRecordData,
  useFilterFieldOptions,
  useFilterFieldProps,
  useRequest,
  useTableBlockContext,
} from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/module-acl/client';

import { App } from 'antd';

import { useUsersTranslation } from './locale';
import { userCollection } from './schemas/users';

export const useFilterActionProps = () => {
  const collection = useContext(CollectionContext);
  const options = useFilterFieldOptions(collection.fields);
  const { service } = useTableBlockContext();
  return useFilterFieldProps({
    options,
    params: service.state?.params?.[0] || service.params,
    service,
  });
};

export const useRemoveUser = () => {
  const api = useAPIClient();
  const { role } = useContext(RolesManagerContext);
  const record = useCollectionRecordData();
  const { service } = useTableBlockContext();
  return {
    async onClick() {
      await api.resource('roles.users', role?.name).remove({
        values: [record['id']],
      });
      service?.refresh();
    },
  };
};

export const useBulkRemoveUsers = () => {
  const { t } = useUsersTranslation();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { service, field } = useTableBlockContext();
  const { role } = useContext(RolesManagerContext);

  return {
    async onClick() {
      const selected = field?.data?.selectedRowKeys;
      if (!selected?.length) {
        message.warning(t('Please select users'));
        return;
      }
      await api.resource('roles.users', role?.name).remove({
        values: selected,
      });
      field.data.selectedRowKeys = [];
      service?.refresh();
    },
  };
};

export const useAddRoleUsers = () => {
  const { t } = useUsersTranslation();
  const { role } = useContext(RolesManagerContext);
  const { message } = App.useApp();
  const api = useAPIClient();
  const { setVisible } = useActionContext();
  const { field } = useTableBlockContext();
  const { __parent } = useBlockRequestContext();

  return {
    async onClick() {
      const selected = field?.data?.selectedRowKeys;
      if (!selected?.length) {
        message.warning(t('Please select users'));
        return;
      }
      await api.resource('roles.users', role?.name).add({
        values: selected,
      });
      field.data.selectedRowKeys = [];
      setVisible(false);
      __parent?.props?.service.refresh();
    },
  };
};

export const useRoleUsersProps = (props) => {
  const { role } = useContext(RolesManagerContext);

  return {
    ...props,
    collection: userCollection,
    action: 'listExcludeRole',
    params: {
      roleName: role?.name,
    },
  };
};

export const useRoleUsersServiceProps = (props) => {
  const { role } = useContext(RolesManagerContext);
  const service = useRequest(
    {
      resource: 'roles.users',
      resourceOf: role?.name,
      action: 'list',
    },
    {
      ready: !!role,
    },
  );
  return {
    ...props,
    service,
    collection: userCollection,
    params: {
      pageSize: 50,
    },
  };
};
