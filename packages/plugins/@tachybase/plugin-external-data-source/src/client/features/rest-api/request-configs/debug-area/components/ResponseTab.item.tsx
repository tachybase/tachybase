import React from 'react';

import { ViewRequestHeaders } from './RequestHeaders.view';
import { ViewResponseBody } from './ResponseBody.view';
import { ViewResponseHeaders } from './ResponseHeaders.view';

export const getItemsResponseTab = (params) => {
  const { t } = params;
  return [
    {
      key: 'body',
      label: t('Body'),
      children: <ViewResponseBody />,
    },
    {
      key: 'responseHeaders',
      label: t('Response headers'),
      children: <ViewResponseHeaders />,
    },
    {
      key: 'requestHeaders',
      label: t('Request headers'),
      children: <ViewRequestHeaders />,
    },
  ];
};
