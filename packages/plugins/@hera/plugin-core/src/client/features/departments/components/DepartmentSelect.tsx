import React, { useContext } from 'react';

import { DepartmentsContext } from '../context/DepartmentsContext';
import { useDepTree2 } from '../hooks/useDepTree2';
import { InternalSuperiorDepartmentSelect } from './InternalSuperiorDepartmentSelect';

export const DepartmentSelect = () => {
  const depTree = useDepTree2();
  const { departmentsResource } = useContext(DepartmentsContext);
  const {
    service: { data },
  } = departmentsResource || {};
  return <InternalSuperiorDepartmentSelect {...{ ...depTree, originData: data?.data }} />;
};
