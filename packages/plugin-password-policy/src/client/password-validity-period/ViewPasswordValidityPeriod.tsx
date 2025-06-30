import { SchemaComponent } from '@tachybase/client';

import { usePasswordPolicyValues } from './usePasswordPolicyValues';
import { useSavePasswordPolicyValues } from './useSavePasswordPolicyValues';
import { getSchemaPasswordValidityPeriod } from './ViewPasswordValidityPeriod.schema';

export const ViewPasswordValidityPeriod = () => {
  const schema = getSchemaPasswordValidityPeriod();
  return (
    <SchemaComponent
      schema={schema}
      scope={{
        usePasswordPolicyValues,
        useSavePasswordPolicyValues,
      }}
    />
  );
};
