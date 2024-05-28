import React from 'react';

import { CollectionProvider_deprecated, ResourceActionProvider, useDataSourceFromRAC } from '.';
import { SchemaComponentOptions } from '..';
import * as hooks from './action-hooks';
import { DataSourceProvider_deprecated, ds, SubFieldDataSourceProvider_deprecated } from './sub-table';

export const CollectionManagerSchemaComponentProvider = (props) => {
  return (
    <SchemaComponentOptions
      scope={{ cm: { ...hooks, useDataSourceFromRAC }, ds }}
      components={{
        SubFieldDataSourceProvider_deprecated,
        DataSourceProvider_deprecated,
        CollectionProvider_deprecated,
        ResourceActionProvider,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
