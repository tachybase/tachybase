import { useMemo } from 'react';

import { isFunction } from 'lodash';

import { useApp } from './';

export const useGlobalVariable = (key: string) => {
  const app = useApp();

  const variable = useMemo(() => {
    return app.getGlobalVar(key);
  }, [app, key]);

  if (isFunction(variable)) {
    try {
      return variable();
    } catch (error) {
      console.error(`Error calling global variable function for key: ${key}`, error);
      return undefined;
    }
  }

  return variable;
};
