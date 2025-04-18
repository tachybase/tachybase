import React from 'react';

interface ContextMyComponentProps {
  id?: string;
  schemaId?: string;
}
export const ContextMyComponent = React.createContext<ContextMyComponentProps>({});

export const ProviderContextMyComponent = ContextMyComponent.Provider;

export function useContextMyComponent() {
  return React.useContext(ContextMyComponent);
}
