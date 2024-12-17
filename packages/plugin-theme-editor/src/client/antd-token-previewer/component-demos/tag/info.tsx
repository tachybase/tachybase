import React from 'react';

import { Tag } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Tag color="processing">Info</Tag>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo', 'colorInfoBg', 'colorInfoBorder'],
  key: 'info',
};

export default componentDemo;
