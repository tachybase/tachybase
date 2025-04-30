import { useMemo } from 'react';
import { useCurrentFormVariable, useCurrentUserVariable, useDatetimeVariable } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useFilterVariable } from './filter';

export const useVariableOptions = (props: any) => {
  const field = useField<any>();
  const { operator, schema } = field.data || {};
  const { currentUserSettings } = useCurrentUserVariable({
    collectionField: { uiSchema: schema },
    uiSchema: schema,
  });
  const { datetimeSettings } = useDatetimeVariable({ operator, schema });

  const { currentFormSettings } = useCurrentFormVariable({
    collectionName: props.rootCollection,
    collectionField: props.collectionField,
  });
  const filterVariable = useFilterVariable();

  const result = useMemo(
    () => [currentUserSettings, datetimeSettings, filterVariable, currentFormSettings].filter(Boolean),
    [datetimeSettings, currentUserSettings, filterVariable, currentFormSettings],
  );

  if (!operator || !schema) return [];

  return result;
};
