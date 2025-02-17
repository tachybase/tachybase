import { useMemo } from 'react';
import { useCollection_deprecated, useCollectionFilterOptions, useCompile, useGlobalVariable } from '@tachybase/client';

import { useTranslation } from '../locale';

export const useCustomRequestVariableOptions = () => {
  const collection = useCollection_deprecated();
  const { t } = useTranslation();
  const fieldsOptions = useCollectionFilterOptions(collection);
  const userFieldOptions = useCollectionFilterOptions('users');
  const compile = useCompile();

  const [fields, userFields] = useMemo(() => {
    return [compile(fieldsOptions), compile(userFieldOptions)];
  }, [fieldsOptions, userFieldOptions]);
  const environmentVariables = useGlobalVariable('$env');
  return useMemo(() => {
    return [
      environmentVariables,
      {
        name: 'currentRecord',
        title: t('Current record', { ns: 'core' }),
        children: [...fields],
      },
      {
        name: 'currentUser',
        title: t('Current user', { ns: 'core' }),
        children: userFields,
      },
      {
        name: 'currentTime',
        title: t('Current time', { ns: 'core' }),
        children: null,
      },
    ];
  }, [fields, userFields]);
};
