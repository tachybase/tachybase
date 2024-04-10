import React from 'react';
import { RecursionField } from '@nocobase/schema';
import { useTabSearchAction } from './TabSearchAction';

export const TabSearch = () => {
  const { fieldSchema, Designer, render, filterProperties } = useTabSearchAction();
  return (
    <>
      <Designer />
      <RecursionField schema={fieldSchema} onlyRenderProperties filterProperties={filterProperties} />
      <React.Fragment>{render()}</React.Fragment>
    </>
  );
};
