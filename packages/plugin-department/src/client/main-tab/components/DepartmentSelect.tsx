import React from 'react';

import { useContextDepartments } from '../context/Department.context';
import { useGetDepTree } from '../hooks/useGetDepTree';
import { InternalSuperiorDepartmentSelect } from './InternalSuperiorDepartmentSelect';

export const DepartmentSelect = () => {
  const depTree = useGetDepTree();
  const { departmentsResource } = useContextDepartments();
  const { service } = departmentsResource || {};
  const { data } = service || {};

  return <InternalSuperiorDepartmentSelect {...depTree} originData={data?.data} />;
};
