import { createContext, useContext } from 'react';

export const AntdSelectContext = createContext({});

export const useAntdSelectContext = () => {
  return useContext(AntdSelectContext);
};
