import React from 'react';

import { Alert } from 'antd';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';

export const AlertError = () => {
  const { responseValidationErrorMessage: errorMessage } = useContextResponseInfo();

  if (!errorMessage) {
    return null;
  }
  return (
    <>
      <Alert type="error" showIcon message={errorMessage} />
      <br />
    </>
  );
};
