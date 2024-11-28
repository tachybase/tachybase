import React, { useContext, useEffect, useMemo, useRef } from 'react';
import {
  AssociationProvider,
  CollectionProvider_deprecated,
  ExtendCollectionsProvider,
  ResourceActionContext,
  ResourceActionProvider,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useRecord,
  useRequest,
  useResourceActionContext,
} from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { App } from 'antd';

import { useFilterActionProps } from './hooks';
import { useUsersTranslation } from './locale';
import { getRoleUsersSchema, userCollection } from './schemas/users';

const useRemoveUser = () => {
  const api = useAPIClient();
  const { role } = useContext(RolesManagerContext);
  const record = useCollectionRecordData();
  const { refresh } = useDataBlockRequest();
  return {
    async run() {
      await api.resource('roles.users', role?.name).remove({
        values: [record['id']],
      });
      refresh();
    },
  };
};

const useBulkRemoveUsers = () => {
  const { t } = useUsersTranslation();
  const { message } = App.useApp();
  const api = useAPIClient();
  const resource = useDataBlockResource();

  return {
    async run() {},
  };
  // const { state, setState, refresh } = useResourceActionContext();
  // const { role } = useContext(RolesManagerContext);

  // return {
  //   async run() {
  //     const selected = state?.selectedRowKeys;
  //     if (!selected?.length) {
  //       message.warning(t('Please select users'));
  //       return;
  //     }
  //     await api.resource('roles.users', role?.name).remove({
  //       values: selected,
  //     });
  //     setState?.({ selectedRowKeys: [] });
  //     refresh();
  //   },
  // };
};

const RoleUsersProvider: React.FC = (props) => {
  const { role } = useContext(RolesManagerContext);
  return (
    <ResourceActionProvider
      collection={userCollection}
      request={{
        resource: `users`,
        action: 'listExcludeRole',
        params: {
          roleName: role?.name,
        },
      }}
    >
      {props.children}
    </ResourceActionProvider>
  );
};

export const RoleUsersManager: React.FC = () => {
  const { t } = useUsersTranslation();
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
  useEffect(() => {
    service.run();
  }, [role]);

  const selectedRoleUsers = useRef([]);
  const handleSelectRoleUsers = (_: number[], rows: any[]) => {
    selectedRoleUsers.current = rows;
  };

  const useAddRoleUsers = () => {
    const { role } = useContext(RolesManagerContext);
    const api = useAPIClient();
    const { setVisible } = useActionContext();
    const { refresh } = useResourceActionContext();
    return {
      async run() {
        await api.resource('roles.users', role?.name).add({
          values: selectedRoleUsers.current.map((user) => user.id),
        });
        selectedRoleUsers.current = [];
        setVisible(false);
        refresh();
      },
    };
  };

  const schema = useMemo(() => getRoleUsersSchema(), [role]);
  console.log('ssss:', role, service);

  return (
    <ExtendCollectionsProvider collections={[userCollection]}>
      <SchemaComponent
        schema={schema}
        components={{ RoleUsersProvider }}
        scope={{
          useBulkRemoveUsers,
          useRemoveUser,
          handleSelectRoleUsers,
          useAddRoleUsers,
          useFilterActionProps,
          t,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
