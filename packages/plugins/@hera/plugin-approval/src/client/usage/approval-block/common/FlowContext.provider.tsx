import React, { useContext } from 'react';
import { FlowContext } from '@tachybase/plugin-workflow/client';

export function useFlowContext() {
  return useContext(FlowContext);
}

export function FlowContextProvider({ workflow = undefined, children, value }) {
  return <FlowContext.Provider value={{ workflow, ...value }}>{children}</FlowContext.Provider>;
}
