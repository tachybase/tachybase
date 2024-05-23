import React from 'react';
import { SchemaComponentOptions, useCurrentRoles } from '@tachybase/client';
import { RecursionField } from '@tachybase/schema';

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
