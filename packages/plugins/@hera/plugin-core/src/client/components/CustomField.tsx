import { SchemaComponent } from '@nocobase/client';
import React from 'react';

export const CustomField = (props) => {
  if (!props.component) return;
  return (
    <SchemaComponent
      schema={{
        type: 'string',
        name: props.component,
        'x-component': props.component,
        'x-component-props': props,
      }}
    />
  );
};
