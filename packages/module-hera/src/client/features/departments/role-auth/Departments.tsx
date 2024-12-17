import React, { useContext, useMemo } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext, SchemaComponent, useRequest } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/module-acl/client';

import { ViewDepartmentTable } from '../common/DepartmentTable.view';
import { useDepartmentFilterActionProps } from '../common/scopes/useDepartmentFilterActionProps';
import { collectionDepartments } from '../main-tab/collections/departments.collection';
import { getSchemaDepartments } from './Departments.schema';
import { DepartmentTitle } from './DepartmentTitle.component';
import { useAddDepartments } from './scopes/useAddDepartments';
import { useBulkRemoveDepartments } from './scopes/useBulkRemoveDepartments';
import { useDataSource } from './scopes/useDataSource';
import { useDisabled } from './scopes/useDisabled';
import { useRemoveDepartment } from './scopes/useRemoveDepartment';

export const Departments = () => {
  const { role } = useContext(RolesManagerContext);
  const resourceData = useRequest(
    {
      resource: `roles/${role?.name}/departments`,
      action: 'list',
      params: { appends: ['parent', 'parent.parent(recursively=true)'] },
    },
    { ready: !!role, refreshDeps: [role] },
  );
  const schema = useMemo(() => getSchemaDepartments(), [role]);

  return (
    <ResourceActionContext.Provider value={resourceData}>
      <CollectionProvider_deprecated collection={collectionDepartments}>
        <SchemaComponent
          schema={schema}
          components={{
            DepartmentTable: ViewDepartmentTable,
            DepartmentTitle,
          }}
          scope={{
            useFilterActionProps: useDepartmentFilterActionProps,
            useRemoveDepartment,
            useBulkRemoveDepartments,
            useDataSource,
            useDisabled,
            useAddDepartments,
          }}
        ></SchemaComponent>
      </CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
