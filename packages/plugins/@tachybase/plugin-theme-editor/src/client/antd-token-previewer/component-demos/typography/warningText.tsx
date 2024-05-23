import React from 'react';

import { Typography } from 'antd';

import type { ComponentDemo } from '../../interface';

const { Text } = Typography;

const Demo = () => (
  <div>
    <Text type={'warning'}>Warning Title</Text>
  </div>
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning'],
  key: 'warning',
};

export default componentDemo;
