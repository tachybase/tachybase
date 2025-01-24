import React from 'react';
import { ActionContextProvider, SchemaComponent } from '@tachybase/client';

const OptionsContainer = ({ options }) => {
  const test = {
    type: 'void',
    'x-component': 'FormV2',
    properties: options,
  };
  return (
    <ActionContextProvider>
      <SchemaComponent schema={test} />
    </ActionContextProvider>
  );
};

export default OptionsContainer;
