import { RecursionField } from '@tachybase/schema';
import { SchemaComponentOptions, useCurrentRoles } from '@tachybase/client';
import React from 'react';
import { ExpiresSelect } from './ExpiresSelect';
import { configurationSchema } from './schema';

export const Configuration = () => {
  const currentRoles = useCurrentRoles();
  return (
    <SchemaComponentOptions scope={{ currentRoles }} components={{ ExpiresSelect }}>
      <RecursionField schema={configurationSchema} />
    </SchemaComponentOptions>
  );
};
