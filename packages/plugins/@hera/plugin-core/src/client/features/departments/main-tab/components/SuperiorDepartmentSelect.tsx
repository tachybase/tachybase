import React, { useContext, useEffect } from 'react';
import { useRecord } from '@tachybase/client';

import { ContextDepartments } from '../context/Department.context';
import { useGetDepTree } from '../hooks/useGetDepTree';
import { InternalSuperiorDepartmentSelect } from './InternalSuperiorDepartmentSelect';

export const SuperiorDepartmentSelect = () => {
  const depTree = useGetDepTree();
  const { setTreeData, getChildrenIds } = depTree;
  const record = useRecord();
  const { departmentsResource } = useContext(ContextDepartments);
  const {
    service: { data },
  } = departmentsResource || {};

  useEffect(() => {
    if (!record.id) return;

    const ids = getChildrenIds(record.id);

    ids.push(record.id);

    setTreeData((x) => {
      const m = (g) =>
        g.map((d) => (ids.includes(d.id) && (d.disabled = true), d.children && (d.children = m(d.children)), d));

      return m(x);
    });
  }, [setTreeData, record.id, getChildrenIds]);

  return <InternalSuperiorDepartmentSelect {...{ ...depTree, originData: data?.data }} />;
};
