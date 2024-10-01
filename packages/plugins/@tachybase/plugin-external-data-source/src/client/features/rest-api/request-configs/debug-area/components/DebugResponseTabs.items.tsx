import React from 'react';

import { ViewDebugResponse } from './DebugResponse.view';

export const getItemsDebugResponse = (params) => {
  const { t } = params;
  return [
    {
      key: 'body',
      label: t('Body'),
      children: <ViewDebugResponse />,
    },
  ];
};
