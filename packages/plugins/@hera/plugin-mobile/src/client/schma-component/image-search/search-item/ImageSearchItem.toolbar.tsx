import { SchemaToolbar } from '@nocobase/client';
import React from 'react';

export const ImageSearchItemToolbar = (props) => {
  return <SchemaToolbar draggable showBorder showBackground initializer={false} {...props} />;
};
