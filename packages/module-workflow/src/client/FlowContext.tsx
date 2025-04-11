import React, { useContext } from 'react';

export const FlowContext = React.createContext<any>({});
export const ProviderContextWorkflow = FlowContext.Provider;

export function useFlowContext() {
  return useContext(FlowContext);
}
