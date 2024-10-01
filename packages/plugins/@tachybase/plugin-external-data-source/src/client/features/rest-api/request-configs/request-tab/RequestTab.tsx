import React from 'react';

import { Tabs } from 'antd';

import { useTranslation } from '../../../../locale';
import { getItemsRequestTab } from './RequestTab.items';

export const RequestTab = () => {
  const { t } = useTranslation();
  const items = getItemsRequestTab({
    t,
  });

  return <Tabs items={items} />;
};
