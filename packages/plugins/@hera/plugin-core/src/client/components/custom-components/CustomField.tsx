import { SchemaComponent } from '@nocobase/client';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export const CustomField = (props) => {
  if (!props.component) return;
  return (
    <ErrorBoundary>
      <SchemaComponent
        schema={{
          type: 'string',
          name: props.component,
          'x-component': props.component,
          'x-component-props': props,
        }}
      />
    </ErrorBoundary>
  );
};
