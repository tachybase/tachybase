import React, { useEffect, useMemo } from 'react';
import { SchemaComponent, useResourceActionContext } from '@tachybase/client';

import { useDepartmentFilterActionProps } from '../../common/scopes/useDepartmentFilterActionProps';
import { useTranslation } from '../../locale';
import { useContextDepartments } from '../context/Department.context';
import { ViewAddMembers } from './AddMembers.view';
import { DepartmentField } from './DepartmentField.component';
import { getSchemaDepartmentsUsersBlock } from './DepartmentsUsersBlock.schema';
import { IsOwnerField } from './IsOwnerField.component';
import { ViewMemberActions } from './MemberActions.view';
import { ViewRowRemoveAction } from './RowRemoveAction.view';
import { useBulkRemoveMembersAction } from './scopes/useBulkRemoveMembersAction';
import { useMembersDataSource } from './scopes/useMembersDataSource';
import { useShowTotal } from './scopes/useShowTotal';
import { UserDepartmentsField } from './UserDepartmentsField.component';

// 部门右边-用户列表部分
export const ViewDepartmentsUsersBlock = () => {
  const { t } = useTranslation();
  const { department, user, setShowChildren, showChildren } = useContextDepartments();
  const { data, setState, refresh } = useResourceActionContext();

  const MemberActions = () => <ViewMemberActions department={department} />;

  const RowRemoveAction = () => <ViewRowRemoveAction department={department} />;

  const schema = useMemo(
    () => getSchemaDepartmentsUsersBlock(department, user, setShowChildren),
    [department?.id, user, setShowChildren],
  );

  useEffect(() => {
    setState?.({
      selectedRowKeys: [],
    });
  }, [data, setState]);

  useEffect(() => {
    refresh?.();
  }, [department?.id, user, showChildren]);

  return (
    <>
      <h2>{user ? t('Search results') : t(department?.title ?? 'All users')}</h2>
      <SchemaComponent
        schema={schema}
        components={{
          MemberActions,
          AddMembers: ViewAddMembers,
          RowRemoveAction,
          DepartmentField,
          IsOwnerField,
          UserDepartmentsField,
        }}
        scope={{
          useBulkRemoveMembersAction,
          useMembersDataSource,
          useShowTotal,
          useFilterActionProps: useDepartmentFilterActionProps,
        }}
      />
    </>
  );
};
