import React, { Fragment, useContext, useEffect, useMemo } from 'react';
import { SchemaComponent, useResourceActionContext } from '@tachybase/client';

import { jsx, jsxs } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { DepartmentsContext } from '../context/DepartmentsContext';
import { useBulkRemoveMembersAction } from '../hooks/useBulkRemoveMembersAction';
import { useMembersDataSource } from '../hooks/useMembersDataSource';
import { useRemoveMemberAction } from '../hooks/useRemoveMemberAction';
import { useShowTotal } from '../hooks/useShowTotal';
import { getSchemaHe } from '../schema/getSchemaHe';
import { schemaWe } from '../schema/schemaWe';
import { schemaZe } from '../schema/schemaZe';
import { useFilterActionPropsZ } from '../scopes/useFilterActionPropsZ';
import { AddMembers } from './AddMembers';
import { DepartmentFieldYe } from './DepartmentFieldYe';
import { IsOwnerFieldQe } from './IsOwnerFieldQe';
import { UserDepartmentsFieldOot } from './UserDepartmentsFieldOot';

export const ComponentIit = () => {
  const { t: tval } = useTranslation();
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
      <h2>{user ? tval('Search results') : tval(department?.title ?? 'All users')}</h2>
      <SchemaComponent
        scope={{
          useBulkRemoveMembersAction: useBulkRemoveMembersAction,
          useMembersDataSource: useMembersDataSource,
          t: tval,
          useShowTotal: useShowTotal,
          useFilterActionProps: useFilterActionPropsZ,
        }}
        components={{
          MemberActions: MemberActions,
          AddMembers: AddMembers,
          RowRemoveAction: RowRemoveAction,
          DepartmentField: DepartmentFieldYe,
          IsOwnerField: IsOwnerFieldQe,
          UserDepartmentsField: UserDepartmentsFieldOot,
        }}
        schema={schema}
      />
    </>
  );

  // return jsxs(Fragment, {
  //   children: [
  //     o
  //       ? jsx('h2', { children: e('Search results') })
  //       : jsx('h2', {
  //           children: e((t == null ? void 0 : t.title) || 'All users'),
  //         }),
  //     jsx(SchemaComponent, {
  //       scope: {
  //         useBulkRemoveMembersAction: useBulkRemoveMembersAction,
  //         useMembersDataSource: useMembersDataSource,
  //         t: e,
  //         useShowTotal: useShowTotal,
  //         useFilterActionProps: useFilterActionPropsZ,
  //       },
  //       components: {
  //         MemberActions: c,
  //         AddMembers: AddMembersNnt,
  //         RowRemoveAction: i,
  //         DepartmentField: DepartmentFieldYe,
  //         IsOwnerField: IsOwnerFieldQe,
  //         UserDepartmentsField: UserDepartmentsFieldOot,
  //       },
  //       schema: x,
  //     }),
  //   ],
  // });
};
