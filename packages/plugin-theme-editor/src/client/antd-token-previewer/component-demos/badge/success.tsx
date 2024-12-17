import React from 'react';

import { Badge, Space } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => (
  <Space size="small">
    <Badge dot status={'success'} />
    Success
  </Space>
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'success',
};

export default componentDemo;
