import React from 'react';
import { useRecord } from '@tachybase/client';

export const DepartmentTitle = () => {
  const record = useRecord();
  const title = getTitle(record);

  return <>{title}</>;
};

// utils
function getTitle(record) {
  const { title, parent } = record;
  if (parent) {
    return getTitle(parent) + ' /' + title;
  } else {
    return title;
  }
}
