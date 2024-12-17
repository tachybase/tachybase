import React from 'react';

import { Skeleton } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Skeleton active />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillContent', 'colorTextPlaceholder'],
  key: 'default',
};

export default componentDemo;
