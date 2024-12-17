import React from 'react';

const ContextMessage = React.createContext(null);

export const ProviderContextMessage = ContextMessage.Provider;

export function useContextMessage() {
  return React.useContext(ContextMessage);
}
