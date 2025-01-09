import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  BlockProvider,
  ExtendCollectionsProvider,
  FixedBlockWrapper,
  RenderChildrenWithAssociationFilter,
  SchemaComponent,
  SchemaComponentOptions,
  TableBlockContext,
  useTableBlockParams,
  withDynamicSchemaProps,
} from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/module-acl/client';
import { createForm, FormContext, useField, useFieldSchema } from '@tachybase/schema';

import {
  useAddRoleUsers,
  useBulkRemoveUsers,
  useFilterActionProps,
  useRemoveUser,
  useRoleUsersProps,
  useRoleUsersServiceProps,
} from './hooks';
import { useUsersTranslation } from './locale';
import { getRoleUsersSchema, userCollection } from './schemas/users';

export const RoleUsersTableBlockProvider = withDynamicSchemaProps((props) => {
  const { showIndex, dragSort, rowKey, fieldNames, collection, service, ...others } = props;
  const field: any = useField();
  const { role } = useContext(RolesManagerContext);
  const params = useTableBlockParams(props);
  useEffect(() => {
    service.run();
  }, [role]);
  const fieldSchema = useFieldSchema();
  const { treeTable } = fieldSchema?.['x-decorator-props'] || {};
  const [expandFlag, setExpandFlag] = useState(fieldNames ? true : false);

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
});

export const RoleUsersManager: React.FC = () => {
  const { t } = useUsersTranslation();
  const { role } = useContext(RolesManagerContext);
  const schema = useMemo(() => getRoleUsersSchema(), [role]);

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
          useFilterActionProps,
          useRoleUsersServiceProps,
          t,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
