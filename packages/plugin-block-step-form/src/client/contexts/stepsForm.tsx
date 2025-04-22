import React from 'react';

const ContextStepsForm = React.createContext<any>(null);

export const ProviderContextStepsForm = ContextStepsForm.Provider;

export function useContextStepsForm() {
  return React.useContext(ContextStepsForm);
}
