import { SchemaComponent, useResourceActionContext } from '@tachybase/client';
import { useContext, useEffect, useMemo, Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from '../../../locale';
import { contextK } from '../context/contextK';
import { useFilterActionPropsZ } from '../scopes/useFilterActionPropsZ';
import { DepartmentFieldYe } from './DepartmentFieldYe';
import { IsOwnerFieldQe } from './IsOwnerFieldQe';
import { UserDepartmentsFieldOot } from './UserDepartmentsFieldOot';
import { AddMembersNnt } from './AddMembersNnt';
import { useShowTotal } from '../hooks/useShowTotal';
import { useMembersDataSource } from '../hooks/useMembersDataSource';
import { useBulkRemoveMembersAction } from '../hooks/useBulkRemoveMembersAction';
import { useRemoveMemberAction } from '../hooks/useRemoveMemberAction';
import { getSchemaHe } from '../schema/getSchemaHe';
import { schemaZe } from '../schema/schemaZe';
import { schemaWe } from '../schema/schemaWe';
import React from 'react';

export const ComponentIit = () => {
  const { t: tval } = useTranslation();
  const { department, user } = useContext(contextK);
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
          AddMembers: AddMembersNnt,
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
