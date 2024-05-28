import React from 'react';

// NOTE: 传递的是内置表 workflowNotice 的数据
export const ContextWorkflowNotice = React.createContext<any>({});

export const ProviderContextWorkflowNotice = ContextWorkflowNotice.Provider;

export function useContexWorkflowNotice() {
  return React.useContext(ContextWorkflowNotice);
}
