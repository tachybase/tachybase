import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorBoundaryFallBack } from './ErrorBoundary';

export const CustomField = (props) => {
  if (!props.component) return;
  return (
    <ErrorBoundary fallback={<ErrorBoundaryFallBack />}>
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
