import React from 'react';
import { SchemaToolbar } from '@tachybase/client';

export const ImageSearchItemToolbar = (props) => {
  return <SchemaToolbar draggable showBorder showBackground initializer={false} {...props} />;
};
