import { SchemaComponent } from '@tachybase/client';

import { authMainAppManagerSchema } from './AuthMainAppManager.schema';
import { useAuthMainAppValues } from './useAuthMainAppValues';
import { useSaveAuthMainAppValues } from './useSaveAuthMainAppValues';

export const AuthMainAppManager = () => {
  return (
    <SchemaComponent
      schema={authMainAppManagerSchema}
      scope={{
        useAuthMainAppValues,
        useSaveAuthMainAppValues,
      }}
    />
  );
};
