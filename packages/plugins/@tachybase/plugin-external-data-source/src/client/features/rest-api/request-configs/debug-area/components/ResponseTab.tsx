import React from 'react';

import { Card, Tabs, Tag } from 'antd';

import { useTranslation } from '../../../../../locale';
import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getItemsResponseTab } from './ResponseTab.item';

export const ResponseTab = () => {
  const { t } = useTranslation();
  const { rawResponse } = useContextResponseInfo();
  const { status } = rawResponse || {};

  const items = getItemsResponseTab({ t });

  if (!rawResponse) {
    return null;
  }

  const color = status.toString().startsWith('2') ? 'success' : 'error';
  const TitleComp = <Tag color={color}>{`HTTP Code:${status}`}</Tag>;
  return (
    <Card title={TitleComp}>
      <Tabs defaultActiveKey="body" items={items} />
    </Card>
  );
};
