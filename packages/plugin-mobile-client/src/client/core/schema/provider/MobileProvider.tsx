import React, { createContext } from 'react';

export const MobileContext = createContext<any>({ isMobile: false });

export const MobileProvider = ({ children }) => {
  return <MobileContext.Provider value={{ isMobile: true }}>{children}</MobileContext.Provider>;
};
