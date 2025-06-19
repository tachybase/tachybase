import React from 'react';
import { SchemaComponent } from '@tachybase/client';

export const TypeContainer = (props) => {
  return <SchemaComponent schema={{ properties: props.options }} />;
};
