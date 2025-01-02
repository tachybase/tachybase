import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { getSchemaAddNewDepartment } from './AddNewDepartment.schema';

export const AddNewDepartment = () => {
  const schema = getSchemaAddNewDepartment();
  return <SchemaComponent schema={schema}></SchemaComponent>;
};
