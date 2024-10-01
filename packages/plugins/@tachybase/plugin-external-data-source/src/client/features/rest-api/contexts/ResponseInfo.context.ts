import React from 'react';

interface IContextResponseInfo {
  rawResponse?: any;
  debugResponse?: any;
  responseValidationErrorMessage?: any;
  setRawResponse?: any;
  setDebugResponse?: any;
  setResponseValidationErrorMessage?: any;
}

const ContextResponseInfo = React.createContext<IContextResponseInfo>({});

export const ProviderContextResponseInfo = ContextResponseInfo.Provider;

export function useContextResponseInfo(): IContextResponseInfo {
  return React.useContext(ContextResponseInfo);
}
