import React from 'react';

import { FlowContext } from '../../../../../FlowContext';

export function FlowContextProvider({ workflow = undefined, children, value }) {
  return <FlowContext.Provider value={{ workflow, ...value }}>{children}</FlowContext.Provider>;
}
