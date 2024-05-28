import React, { createContext } from 'react';

export const MobileContext = createContext<any>({ isMobile: false });

export const MobileProvider = (props) => {
  return <MobileContext.Provider value={{ isMobile: true }}> {props.children}</MobileContext.Provider>;
};
