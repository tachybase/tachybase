import React, { useState } from 'react';
import { useRequest } from '@tachybase/client';

import { DepartmentsContext } from '../context/DepartmentsContext';

export const DepartmentsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [department, setDepartment] = useState(null);
  const usersRequest = useRequest(
    {
      resource: 'users',
      action: 'list',
      params: {
        appends: ['departments', 'departments.parent(recursively=true)'],
        filter: department ? { 'departments.id': department.id } : {},
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
    params: { pagination: false, filter: { parentId: null } },
  });
  return (
    <DepartmentsContext.Provider
      value={{
        user,
        setUser,
        department,
        setDepartment,
        usersResource: { service: usersRequest },
        departmentsResource: { service: departmentsRequest },
      }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
};
