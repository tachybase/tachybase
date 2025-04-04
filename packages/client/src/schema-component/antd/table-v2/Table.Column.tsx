import React from 'react';
import { useField } from '@tachybase/schema';

export const TableColumn = (props) => {
  const field = useField();
  return <div role="button">{field.title}</div>;
};
