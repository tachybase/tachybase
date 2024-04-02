import { useField } from '@nocobase/schema';
import React from 'react';

export const TableColumn = (props) => {
  const field = useField();
  return <div>{field.title}</div>;
};
