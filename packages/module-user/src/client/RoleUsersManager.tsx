import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BlockProvider,
  ExtendCollectionsProvider,
  FixedBlockWrapper,
  getIdsWithChildren,
  RenderChildrenWithAssociationFilter,
  ResourceActionProvider,
  SchemaComponent,
  SchemaComponentOptions,
  TableBlockContext,
  useActionContext,
  useAPIClient,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useRequest,
  useResourceActionContext,
  useTableBlockContext,
  useTableBlockParams,
} from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/module-acl/client';
import { createForm, FormContext, useField, useFieldSchema } from '@tachybase/schema';

import { App } from 'antd';

// import { useFilterActionProps } from './hooks';
import { useUsersTranslation } from './locale';
import { getRoleUsersSchema, userCollection } from './schemas/users';

const useRemoveUser = () => {
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

const useBulkRemoveUsers = () => {
  const { t } = useUsersTranslation();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { service, field } = useTableBlockContext();
  // const { state, setState, refresh } = useResourceActionContext();
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

const useRoleUsersProps = (props) => {
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

const RoleUsersTableBlockProvider = (props) => {
  const { showIndex, dragSort, rowKey, fieldNames, collection, ...others } = props;
  const field: any = useField();
  const { role } = useContext(RolesManagerContext);
  const params = useTableBlockParams(props);
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
  const fieldSchema = useFieldSchema();
  const { treeTable } = fieldSchema?.['x-decorator-props'] || {};
  const [expandFlag, setExpandFlag] = useState(fieldNames ? true : false);
  // const allIncludesChildren = useMemo(() => {
  //   if (treeTable !== false) {
  //     const keys = getIdsWithChildren(service?.data?.data);
  //     return keys || [];
  //   }
  // }, [service?.loading]);
  let childrenColumnName = 'children';
  if (collection?.tree && treeTable !== false) {
    const f = collection.fields.find((f) => f.treeChildren);
    if (f) {
      childrenColumnName = f.name;
    }
    params['tree'] = true;
  }
  const form = useMemo(() => createForm(), [treeTable]);

  return (
    <SchemaComponentOptions scope={{ treeTable }}>
      <FormContext.Provider value={form}>
        <BlockProvider name={props.name || 'table'} {...props} params={params} runWhenParamsChanged>
          <FixedBlockWrapper>
            <TableBlockContext.Provider
              value={{
                ...others,
                field,
                service,
                params,
                showIndex,
                dragSort,
                rowKey,
                expandFlag,
                childrenColumnName,
                setExpandFlag: () => setExpandFlag(!expandFlag),
              }}
            >
              <RenderChildrenWithAssociationFilter {...props} />
            </TableBlockContext.Provider>
          </FixedBlockWrapper>
        </BlockProvider>
      </FormContext.Provider>
    </SchemaComponentOptions>
  );
};

export const RoleUsersManager: React.FC = () => {
  const { t } = useUsersTranslation();
  const { role } = useContext(RolesManagerContext);
  // const service = useRequest(
  //   {
  //     resource: 'roles.users',
  //     resourceOf: role?.name,
  //     action: 'list',
  //   },
  //   {
  //     ready: !!role,
  //   },
  // );
  // useEffect(() => {
  //   service.run();
  // }, [role]);

  // const selectedRoleUsers = useRef([]);
  // const handleSelectRoleUsers = (_: number[], rows: any[]) => {
  //   selectedRoleUsers.current = rows;
  // };

  const useAddRoleUsers = () => {
    const { role } = useContext(RolesManagerContext);
    const { message } = App.useApp();
    const api = useAPIClient();
    const { setVisible } = useActionContext();
    const { field } = useTableBlockContext();
    const { refresh } = useDataBlockRequest();
    // const field = useField();
    // const resource = useDataBlockResource;
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
        refresh();
      },
    };
  };

  const schema = useMemo(() => getRoleUsersSchema(), [role]);
  // const schema = getRoleUsersSchema();

  return (
    <ExtendCollectionsProvider collections={[userCollection]}>
      <SchemaComponent
        schema={schema}
        components={{ RoleUsersTableBlockProvider }}
        scope={{
          useBulkRemoveUsers,
          useRemoveUser,
          useAddRoleUsers,
          useRoleUsersProps,
          t,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
