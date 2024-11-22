import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { useFormProviderProps } from '../hooks/useFormProviderProps';
import { getSchemaNodeConfig } from './NodeConfig.schema';

export const ViewNodeConfig = (props) => {
  const { instruction, data, detailText, workflow } = props;

  const schema = getSchemaNodeConfig({ instruction, data, detailText, workflow });
  return (
    <SchemaComponent
      schema={schema}
      components={instruction.components}
      scope={{
        ...instruction.scope,
        useFormProviderProps,
      }}
    />
  );
};
