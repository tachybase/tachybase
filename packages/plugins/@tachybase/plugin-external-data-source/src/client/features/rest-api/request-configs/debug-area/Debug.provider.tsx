import React, { useState } from 'react';
import { ActionContextProvider } from '@tachybase/client';

import { ProviderContextResponseInfo } from '../../contexts/ResponseInfo.context';

export const ProviderDebug = (props) => {
  const { visible, setVisible } = props;
  const [rawResponse, setRawResponse] = useState(null);
  const [debugResponse, setDebugResponse] = useState(null);
  const [responseValidationErrorMessage, setResponseValidationErrorMessage] = useState(null);

  return (
    <ActionContextProvider visible={visible} setVisible={setVisible}>
      <ProviderContextResponseInfo
        value={{
          rawResponse,
          debugResponse,
          responseValidationErrorMessage,
          setRawResponse,
          setDebugResponse,
          setResponseValidationErrorMessage,
        }}
      >
        {props.children}
      </ProviderContextResponseInfo>
    </ActionContextProvider>
  );
};
