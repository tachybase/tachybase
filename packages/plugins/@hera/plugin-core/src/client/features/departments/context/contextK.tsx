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

// XXX: 等待所有引用重置为以下两个函数后, 删除导出声明
export const contextK = React.createContext<contextType>({
  user: {},
  department: {},
});

export const ContextKProvider = contextK.Provider;

export function useContextK() {
  return useContext(contextK);
}
