import React from 'react';

import { Tabs } from 'antd';

import { useTranslation } from '../../../../../locale';
import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getItemsDebugResponse } from './DebugResponseTabs.items';

export const DebugResponseTabs = () => {
  const { t } = useTranslation();
  const { debugResponse } = useContextResponseInfo();

  const items = getItemsDebugResponse({ t });

  if (!debugResponse) {
    return null;
  }

  return <Tabs defaultActiveKey="body" items={items} />;
};
