import React, { useState } from 'react';
import { useRequest } from '@tachybase/client';

import { ProviderContextDepartments } from './context/Department.context';

export const ProviderDepartmentIndex = ({ children }) => {
  const [user, setUser] = useState(null);
  const [department, setDepartment] = useState(null);
  const usersRequest = useRequest(
    {
      resource: 'users',
      action: 'list',
      params: {
        appends: ['departments', 'departments.parent(recursively=true)'],
        filter: department
          ? {
              'departments.id': department.id,
            }
          : {},
        pageSize: 50,
      },
    },
    {
      manual: true,
      refreshDeps: [department],
    },
  );
  const departmentsRequest = useRequest({
    resource: 'departments',
    action: 'list',
    params: {
      pagination: false,
      filter: {
        parentId: null,
      },
    },
  });

  const ctxValue = {
    user,
    setUser,
    department,
    setDepartment,
    usersResource: {
      service: usersRequest,
    },
    departmentsResource: {
      service: departmentsRequest,
    },
  };

  return <ProviderContextDepartments value={ctxValue}>{children}</ProviderContextDepartments>;
};
