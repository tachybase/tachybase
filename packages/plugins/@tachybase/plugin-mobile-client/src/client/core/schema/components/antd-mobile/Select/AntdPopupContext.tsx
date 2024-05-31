import { createContext, useContext } from 'react';

export const AntdPopupContext = createContext({});

export const useAntdPopupContext = () => {
  return useContext(AntdPopupContext);
};
