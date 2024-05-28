import { useContext, useEffect, useMemo } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext, SchemaComponent, useRequest } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { jsx } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { collectionDepartments } from '../collections/departments.collection';
import { useAddDepartmentsGgt } from '../hooks/useAddDepartmentsGgt';
import { useBulkRemoveDepartmentsYyt } from '../hooks/useBulkRemoveDepartmentsYyt';
import { useDataSourceFt } from '../hooks/useDataSourceFt';
import { useDisabledVvt } from '../hooks/useDisabledVvt';
import { useRemoveDepartmentXxt } from '../hooks/useRemoveDepartmentXxt';
import { y } from '../others/y';
import { getSchemaDdt } from '../schema/getSchemaDdt';
import { useFilterActionPropsZ } from '../scopes/useFilterActionPropsZ';
import { DepartmentTablePpe } from './DepartmentTablePpe';
import { DepartmentTitleHht } from './DepartmentTitleHht';

export const Departments = () => {
  const { t: e } = useTranslation(),
    { role: t } = useContext(RolesManagerContext),
    o = useRequest(
      {
        resource: `roles/${t == null ? void 0 : t.name}/departments`,
        action: 'list',
        params: { appends: ['parent', 'parent.parent(recursively=true)'] },
      },
      { ready: !!t },
    );
  useEffect(() => {
    o.run();
  }, [o, t]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const a = useMemo(() => getSchemaDdt(), [t]);
  return jsx(ResourceActionContext.Provider, {
    value: y({}, o),
    children: jsx(CollectionProvider_deprecated, {
      collection: collectionDepartments,
      children: jsx(SchemaComponent, {
        schema: a,
        components: {
          DepartmentTable: DepartmentTablePpe,
          DepartmentTitle: DepartmentTitleHht,
        },
        scope: {
          useFilterActionProps: useFilterActionPropsZ,
          t: e,
          useRemoveDepartment: useRemoveDepartmentXxt,
          useBulkRemoveDepartments: useBulkRemoveDepartmentsYyt,
          useDataSource: useDataSourceFt,
          useDisabled: useDisabledVvt,
          useAddDepartments: useAddDepartmentsGgt,
        },
      }),
    }),
  });
};
