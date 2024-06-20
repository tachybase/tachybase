import React from 'react';
import { useRecord } from '@tachybase/client';

export const DepartmentTitle = () => {
  const record = useRecord();
  const title = (dep) => {
    const title = dep.title;
    const parent = dep.parent;
    return parent ? title(parent) + ' / ' + title : title;
  };
  return <>{title(record)}</>;
};
