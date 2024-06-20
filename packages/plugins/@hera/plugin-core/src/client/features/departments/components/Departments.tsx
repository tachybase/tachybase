import React, { useContext, useMemo } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext, SchemaComponent, useRequest } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { useTranslation } from '../../../locale';
import { collectionDepartments } from '../collections/departments.collection';
import { useAddDepartments } from '../hooks/useAddDepartments';
import { useBulkRemoveDepartmentsYyt } from '../hooks/useBulkRemoveDepartmentsYyt';
import { useDataSource2 } from '../hooks/useDataSource2';
import { useDisabledVvt } from '../hooks/useDisabledVvt';
import { useRemoveDepartmentXxt } from '../hooks/useRemoveDepartmentXxt';
import { getSchemaDdt } from '../schema/getSchemaDdt';
import { useDepartmentFilterActionProps } from '../scopes/useDepartmentFilterActionProps';
import { DepartmentTable } from './DepartmentTable';
import { DepartmentTitle } from './DepartmentTitle';

export const Departments = () => {
  const { t } = useTranslation();
  const { role } = useContext(RolesManagerContext);
  const resource = useRequest(
    {
      resource: `roles/${role?.name}/departments`,
      action: 'list',
      params: { appends: ['parent', 'parent.parent(recursively=true)'] },
    },
    { ready: !!role, refreshDeps: [role] },
  );
  const schema = useMemo(() => getSchemaDdt(), [role]);
  return (
    <ResourceActionContext.Provider value={resource}>
      <CollectionProvider_deprecated collection={collectionDepartments}>
        <SchemaComponent
          schema={schema}
          components={{
            DepartmentTable: DepartmentTable,
            DepartmentTitle: DepartmentTitle,
          }}
          scope={{
            useFilterActionProps: useDepartmentFilterActionProps,
            t,
            useRemoveDepartment: useRemoveDepartmentXxt,
            useBulkRemoveDepartments: useBulkRemoveDepartmentsYyt,
            useDataSource: useDataSource2,
            useDisabled: useDisabledVvt,
            useAddDepartments,
          }}
        ></SchemaComponent>
      </CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
