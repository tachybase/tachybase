import React, { useContext } from 'react';

import { Result } from 'ahooks/es/useRequest/src/types';

interface departmentType {
  id?: string | number;
  [key: string]: unknown;
}

interface contextType {
  user: object;
  setUser?: Function;
  department: departmentType;
  departmentsResource?: {
    service?: Result<any, any>;
  };
  setDepartment?: Function;
  usersResource?: {
    service?: Result<any, any>;
  };
}

export const ContextDepartments = React.createContext<contextType>({
  user: {},
  department: {},
});

export const ProviderContextDepartments = ContextDepartments.Provider;

export function useContextDepartments() {
  return useContext(ContextDepartments);
}
