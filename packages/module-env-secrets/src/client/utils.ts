import { useContext } from 'react';

import { EnvAndSecretsContext } from './EnvironmentVariablesAndSecretsProvider';
import { useT } from './locale';

export const useGetEnvironmentVariables = () => {
  const t = useT();
  const { variablesRequest } = useContext(EnvAndSecretsContext);
  const { data: variables, loading: variablesLoading } = variablesRequest || {};
  if (!variablesLoading && variables?.data?.length) {
    return {
      name: '$env',
      title: t('Variables and secrets'),
      value: '$env',
      label: t('Variables and secrets'),
      children: variables?.data
        .map((v) => {
          return { title: v.name, name: v.name, value: v.name, label: v.name };
        })
        .filter(Boolean),
    };
  }

  return null;
};
