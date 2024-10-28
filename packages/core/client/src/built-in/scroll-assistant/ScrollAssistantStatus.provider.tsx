import React, { createContext, useContext, useState } from 'react';

const ScrollAssistantStatusContext = createContext<{
  enable: boolean;
  setEnable: any;
}>(null);

export const ScrollAssistantStatusProvider = ({ children }) => {
  const [enable, setEnable] = useState(false);
  return (
    <ScrollAssistantStatusContext.Provider
      value={{
        enable,
        setEnable,
      }}
    >
      {children}
    </ScrollAssistantStatusContext.Provider>
  );
};

export const useScrollAssistantStatus = () => {
  const { enable, setEnable } = useContext(ScrollAssistantStatusContext);
  return { enable, setEnable };
};
