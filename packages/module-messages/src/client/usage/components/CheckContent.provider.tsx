import React from 'react';

import { ProviderContextMessage } from '../contexts/Message';

export const ProviderCheckContent = (props) => {
  const { message } = props;
  return <ProviderContextMessage value={message}>{props.children}</ProviderContextMessage>;
};
