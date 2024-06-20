import React, { useContext, useEffect, useMemo } from 'react';
import { SchemaComponent, useResourceActionContext } from '@tachybase/client';

import { useTranslation } from '../../../locale';
import { DepartmentsContext } from '../context/DepartmentsContext';
import { useBulkRemoveMembersAction } from '../hooks/useBulkRemoveMembersAction';
import { useMembersDataSource } from '../hooks/useMembersDataSource';
import { useRemoveMemberAction } from '../hooks/useRemoveMemberAction';
import { useShowTotal } from '../hooks/useShowTotal';
import { getSchemaHe } from '../schema/getSchemaHe';
import { schemaWe } from '../schema/schemaWe';
import { schemaZe } from '../schema/schemaZe';
import { useDepartmentFilterActionProps } from '../scopes/useDepartmentFilterActionProps';
import { AddMembers } from './AddMembers';
import { DepartmentField } from './DepartmentField';
import { IsOwnerField } from './IsOwnerField';
import { UserDepartmentsField } from './UserDepartmentsField';

export const DepartmentsUsersBlock = () => {
  const { t } = useTranslation();
  const { department, user } = useContext(DepartmentsContext);
  const { data, setState } = useResourceActionContext();

  const MemberActions = () => (department ? <SchemaComponent schema={schemaZe} /> : null);
  const RowRemoveAction = () =>
    department ? (
      <SchemaComponent
        scope={{
          useRemoveMemberAction: useRemoveMemberAction,
        }}
        schema={schemaWe}
      />
    ) : null;

  const schema = useMemo(() => getSchemaHe(department, user), [department, user]);

  useEffect(() => {
    setState?.({
      selectedRowKeys: [],
    });
  }, [data, setState]);

  return (
    <>
      <h2>{user ? t('Search results') : t(department?.title ?? 'All users')}</h2>
      <SchemaComponent
        scope={{
          useBulkRemoveMembersAction,
          useMembersDataSource,
          t,
          useShowTotal,
          useFilterActionProps: useDepartmentFilterActionProps,
        }}
        components={{
          MemberActions,
          AddMembers,
          RowRemoveAction,
          DepartmentField,
          IsOwnerField,
          UserDepartmentsField,
        }}
        schema={schema}
      />
    </>
  );
};
