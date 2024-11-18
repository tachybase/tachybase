import React from 'react';
import { FlowContext } from '@tachybase/module-workflow/client';

export function FlowContextProvider({ workflow = undefined, children, value }) {
  return <FlowContext.Provider value={{ workflow, ...value }}>{children}</FlowContext.Provider>;
}
