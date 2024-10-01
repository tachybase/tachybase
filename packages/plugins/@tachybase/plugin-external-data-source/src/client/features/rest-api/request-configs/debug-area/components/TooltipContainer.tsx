import React from 'react';

import { Tooltip } from 'antd';

import { useTranslation } from '../../../../../locale';

export const TooltipContainer = (props) => {
  const { t } = useTranslation();
  const title = t('Extract field metadata from the response data');

  return <Tooltip title={title}>{props.children}</Tooltip>;
};
