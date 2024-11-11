import React from 'react';

import { useLocalStorageState } from 'ahooks';

import { SchemaComponentProvider } from '../schema-component/core';
import { ISchemaComponentProvider } from '../schema-component/types';

const getKeyByName = (name?: string) => {
  if (!name) {
    return 'tachybase_designable'.toUpperCase();
  }
  return `tachybase_${name}_designable`.toUpperCase();
};

const SchemaComponentProviderWithLocalStorageState = (props: ISchemaComponentProvider & { appName?: string }) => {
  const [designable, setDesignable] = useLocalStorageState(getKeyByName(props.appName), {
    defaultValue: props.designable ? true : false,
  });
  return (
    <SchemaComponentProvider
      {...props}
      designable={designable}
      onDesignableChange={(value) => {
        setDesignable(value);
      }}
    />
  );
};

export const AppSchemaComponentProvider = (props: ISchemaComponentProvider) => {
  if (typeof props.designable === 'boolean') {
    return <SchemaComponentProvider {...props} />;
  }
  return <SchemaComponentProviderWithLocalStorageState {...props} />;
};
