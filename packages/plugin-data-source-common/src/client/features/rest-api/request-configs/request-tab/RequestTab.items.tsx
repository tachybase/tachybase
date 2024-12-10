import React from 'react';

import { ViewRequestBody } from './RequestBody.view';
import { ViewRequestHeaders } from './RequestHeaders.view';
import { ViewRequestParams } from './RequestParams.view';

export const getItemsRequestTab = (params: any) => {
  const { t } = params;

  return [
    {
      key: 'parameters',
      label: t('Parameters'),
      children: <ViewRequestParams />,
    },
    {
      key: 'body',
      label: t('Body'),
      children: <ViewRequestBody />,
    },
    {
      key: 'headers',
      label: t('Headers'),
      children: <ViewRequestHeaders />,
    },
  ];
};
