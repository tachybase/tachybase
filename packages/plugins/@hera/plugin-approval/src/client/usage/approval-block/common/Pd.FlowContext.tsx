import { FlowContext } from '@nocobase/plugin-workflow/client';
import React, { useContext } from 'react';

export function useFlowContext() {
  return useContext(FlowContext);
}

export function FlowContextProvider({ workflow = undefined, children, value }) {
  return <FlowContext.Provider value={{ workflow, ...value }}>{children}</FlowContext.Provider>;
}
