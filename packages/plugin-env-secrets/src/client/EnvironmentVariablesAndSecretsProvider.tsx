import React, { createContext } from 'react';
import { useRequest } from '@tachybase/client';
import { observer } from '@tachybase/schema';

const EnvAndSecretsContext = createContext<any>({});

const InternalProvider = (props) => {
  const variablesRequest = useRequest<any>({
    url: 'environmentVariables?paginate=false',
  });
  return <EnvAndSecretsContext.Provider value={{ variablesRequest }}>{props.children}</EnvAndSecretsContext.Provider>;
};

const EnvironmentVariablesAndSecretsProvider = observer(
  (props) => {
    const isAdmin = location.pathname.startsWith('/_admin');
    if (!isAdmin) {
      return <>{props.children}</>;
    }
    return <InternalProvider {...props} />;
  },
  {
    displayName: 'EnvironmentVariablesAndSecretsProvider',
  },
);

export { EnvAndSecretsContext, EnvironmentVariablesAndSecretsProvider };
