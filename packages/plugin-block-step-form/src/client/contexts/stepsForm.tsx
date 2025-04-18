import React from 'react';

const ContextStepsForm = React.createContext<any>({});

export const ProviderContextStepsForm = ContextStepsForm.Provider;

export function useContextStepsForm() {
  return React.useContext(ContextStepsForm);
}
